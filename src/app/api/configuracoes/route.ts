import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { negocios, produtos } from '@/lib/db/schema';
import { getUserIdFromRequest } from '@/lib/auth/jwt';
import { negocioSchema } from '@/lib/validations';
import { encrypt } from '@/lib/crypto';
import { eq } from 'drizzle-orm';

export async function GET() {
  const userId = await getUserIdFromRequest();
  if (!userId) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const negocio = db.select().from(negocios).where(eq(negocios.userId, userId)).get();
  if (!negocio) {
    return NextResponse.json({ error: 'Configuração não encontrada' }, { status: 404 });
  }

  const produtosList = db.select({
    id: produtos.id,
    nome: produtos.nome,
    descricao: produtos.descricao,
    tipo: produtos.tipo,
  }).from(produtos).where(eq(produtos.negocioId, negocio.id)).all();

  return NextResponse.json({
    ramo: negocio.ramo,
    temApiKey: Boolean(negocio.apiKeyEnc),
    produtos: produtosList,
  });
}

export async function PUT(request: NextRequest) {
  const userId = await getUserIdFromRequest();
  if (!userId) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = negocioSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  const negocio = db.select().from(negocios).where(eq(negocios.userId, userId)).get();
  if (!negocio) {
    return NextResponse.json({ error: 'Configuração não encontrada' }, { status: 404 });
  }

  const updates: Record<string, unknown> = { atualizadoEm: new Date().toISOString() };
  if (parsed.data.ramo !== undefined) updates.ramo = parsed.data.ramo;
  if (parsed.data.apiKey !== undefined) updates.apiKeyEnc = encrypt(parsed.data.apiKey);

  db.update(negocios).set(updates).where(eq(negocios.id, negocio.id)).run();

  return NextResponse.json({ message: 'Configurações salvas' });
}
