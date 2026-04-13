import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { db } from '@/lib/db';
import { negocios, produtos } from '@/lib/db/schema';
import { getUserIdFromRequest } from '@/lib/auth/jwt';
import { produtoSchema } from '@/lib/validations';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  const userId = await getUserIdFromRequest();
  if (!userId) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = produtoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const negocio = db.select().from(negocios).where(eq(negocios.userId, userId)).get();
  if (!negocio) {
    return NextResponse.json({ error: 'Configure seu negócio primeiro' }, { status: 404 });
  }

  const novoProduto = db.insert(produtos).values({
    negocioId: negocio.id,
    nome: parsed.data.nome,
    descricao: parsed.data.descricao || null,
    tipo: parsed.data.tipo,
  }).returning().get();

  if (!novoProduto) throw new Error('Falha ao criar produto');

  return NextResponse.json(
    { id: novoProduto.id, nome: novoProduto.nome, descricao: novoProduto.descricao, tipo: novoProduto.tipo },
    { status: 201 }
  );
}
