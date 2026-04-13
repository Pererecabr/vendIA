import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { db } from '@/lib/db';
import { negocios, produtos, analises } from '@/lib/db/schema';
import { getUserIdFromRequest } from '@/lib/auth/jwt';
import { decrypt } from '@/lib/crypto';
import { buildSystemPrompt, analyzeInterest } from '@/lib/gemini';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const requestSchema = z.object({
  interesse: z.string().min(2),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    parts: z.array(z.object({ text: z.string() }))
  })).optional()
});

export async function POST(request: NextRequest) {
  const userId = await getUserIdFromRequest();
  if (!userId) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
    }

    const { interesse, history } = parsed.data;

    const negocio = db.select().from(negocios).where(eq(negocios.userId, userId)).get();
    if (!negocio || !negocio.apiKeyEnc) {
      return NextResponse.json({ error: 'Configure sua API Key nas Configurações' }, { status: 402 });
    }

    const apiKey = decrypt(negocio.apiKeyEnc);
    const produtosList = db.select().from(produtos).where(eq(produtos.negocioId, negocio.id)).all();

    const systemPrompt = buildSystemPrompt({
      ramo: negocio.ramo || 'Geral',
      lowTicket: produtosList.filter(p => p.tipo === 'low_ticket'),
      highTicket: produtosList.filter(p => p.tipo === 'high_ticket'),
    });

    const analise = await analyzeInterest(apiKey, systemPrompt, interesse, history || []);

    // Se não for refinamento (ou seja, primeira mensagem), salvar no histórico
    if (!history || history.length === 0) {
      db.insert(analises).values({
        userId,
        interesse,
        resposta: JSON.stringify(analise),
      }).run();
    }

    return NextResponse.json({ analise });
  } catch (error) {
    console.error('API Analisar error:', error);
    return NextResponse.json({ error: 'Erro ao processar análise' }, { status: 500 });
  }
}
