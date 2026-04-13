import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, negocios } from '@/lib/db/schema';
import { cadastroSchema } from '@/lib/validations';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = cadastroSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { nome, email, senha } = parsed.data;

    // Check if email already exists
    const existing = db.select().from(users).where(eq(users.email, email)).get();
    if (existing) {
      return NextResponse.json(
        { error: 'E-mail já cadastrado' },
        { status: 409 }
      );
    }

    // Hash password
    const senhaHash = await bcrypt.hash(senha, 12);

    // Create user
    const [newUser] = db.insert(users).values({ nome, email, senhaHash }).returning();

    // Create empty business config
    db.insert(negocios).values({ userId: newUser.id, ramo: '' }).run();

    return NextResponse.json(
      { message: 'Conta criada com sucesso' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Cadastro error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
