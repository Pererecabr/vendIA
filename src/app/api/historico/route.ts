import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { analises } from '@/lib/db/schema';
import { getUserIdFromRequest } from '@/lib/auth/jwt';
import { eq, desc, count } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const userId = await getUserIdFromRequest();
  if (!userId) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = (page - 1) * limit;

  const items = db
    .select({
      id: analises.id,
      interesse: analises.interesse,
      criadoEm: analises.criadoEm,
    })
    .from(analises)
    .where(eq(analises.userId, userId))
    .orderBy(desc(analises.criadoEm))
    .limit(limit)
    .offset(offset)
    .all();

  const [{ total: totalCount }] = db
    .select({ total: count() })
    .from(analises)
    .where(eq(analises.userId, userId))
    .all();

  return NextResponse.json({ analises: items, total: totalCount });
}
