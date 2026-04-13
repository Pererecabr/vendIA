import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { negocios, produtos, analises } from '@/lib/db/schema';
import { getUserIdFromRequest } from '@/lib/auth/jwt';
import { analisarSchema } from '@/lib/validations';
import { decrypt } from '@/lib/crypto';
import { buildSystemPrompt, analyzeInterest } from '@/lib/gemini';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  const userId = await getUserIdFromRequest();
  if (!userId) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = analisarSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  // 1. Buscar config do usuário
  const negocio = db.select().from(negocios).where(eq(negocios.userId, userId)).get();
  if (!negocio || !negocio.apiKeyEnc) {
    return NextResponse.json(
      { error: 'Configure sua API Key do Google AI Studio nas Configurações' },
      { status: 402 }
    );
  }

  // 2. Descriptografar API key
  let apiKey: string;
  try {
    apiKey = decrypt(negocio.apiKeyEnc);
  } catch {
    return NextResponse.json({ error: 'API Key inválida. Atualize nas Configurações' }, { status: 402 });
  }

  // 3. Buscar produtos
  const produtosList = db
    .select({ nome: produtos.nome, descricao: produtos.descricao, tipo: produtos.tipo })
    .from(produtos)
    .where(eq(produtos.negocioId, negocio.id))
    .all();

  // 4. Montar prompt
  const systemPrompt = buildSystemPrompt({
    ramo: negocio.ramo || 'Geral',
    lowTicket: produtosList.filter(p => p.tipo === 'low_ticket'),
    highTicket: produtosList.filter(p => p.tipo === 'high_ticket'),
  });

  // 5. Chamar Gemini
  let analise: Record<string, unknown>;
  try {
    analise = await analyzeInterest(apiKey, systemPrompt, parsed.data.interesse);
  } catch (error) {
    console.error('Gemini error:', error);
    return NextResponse.json(
      { error: 'Erro na chamada ao Gemini. Verifique sua API Key.' },
      { status: 502 }
    );
  }

  // 6. Salvar no histórico
  const [saved] = db.insert(analises).values({
    userId,
    interesse: parsed.data.interesse,
    resposta: JSON.stringify(analise),
  }).returning();

  return NextResponse.json({ id: saved.id, analise });
}
