import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { loginSchema } from '@/lib/validations';
import { signToken, setAuthCookie } from '@/lib/auth/jwt';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dados inválidos' },
        { status: 400 }
      );
    }

    const { email, senha } = parsed.data;

    // Find user
    const user = db.select().from(users).where(eq(users.email, email)).get();
    if (!user) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    // Verify password
    const valid = await bcrypt.compare(senha, user.senhaHash);
    if (!valid) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    // Create JWT and set cookie
    const token = await signToken(user.id);
    await setAuthCookie(token);

    return NextResponse.json({
      message: 'Login realizado',
      user: { id: user.id, nome: user.nome, email: user.email },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
