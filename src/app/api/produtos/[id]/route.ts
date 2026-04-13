import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { produtos, negocios } from '@/lib/db/schema';
import { getUserIdFromRequest } from '@/lib/auth/jwt';
import { eq, and } from 'drizzle-orm';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = await getUserIdFromRequest();
  if (!userId) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const negocio = db.select().from(negocios).where(eq(negocios.userId, userId)).get();
  if (!negocio) {
    return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });
  }

  db.delete(produtos)
    .where(and(eq(produtos.id, params.id), eq(produtos.negocioId, negocio.id)))
    .run();

  return NextResponse.json({ message: 'Produto removido' });
}
