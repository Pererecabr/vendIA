import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { analises } from '@/lib/db/schema';
import { getUserIdFromRequest } from '@/lib/auth/jwt';
import { eq, and } from 'drizzle-orm';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = await getUserIdFromRequest();
  if (!userId) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const item = db
    .select()
    .from(analises)
    .where(and(eq(analises.id, params.id), eq(analises.userId, userId)))
    .get();

  if (!item) {
    return NextResponse.json({ error: 'Análise não encontrada' }, { status: 404 });
  }

  return NextResponse.json({
    id: item.id,
    interesse: item.interesse,
    analise: JSON.parse(item.resposta),
    criadoEm: item.criadoEm,
  });
}
