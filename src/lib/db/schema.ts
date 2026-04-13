import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Usuários
export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  nome: text('nome').notNull(),
  email: text('email').notNull().unique(),
  senhaHash: text('senha_hash').notNull(),
  criadoEm: text('criado_em').default(sql`(datetime('now'))`).notNull(),
});

// Configuração do negócio por usuário
export const negocios = sqliteTable('negocios', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  ramo: text('ramo').notNull().default(''),
  apiKeyEnc: text('api_key_enc'), // Chave Gemini criptografada
  criadoEm: text('criado_em').default(sql`(datetime('now'))`).notNull(),
  atualizadoEm: text('atualizado_em').default(sql`(datetime('now'))`).notNull(),
});

// Produtos (Low e High Ticket)
export const produtos = sqliteTable('produtos', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  negocioId: text('negocio_id').references(() => negocios.id, { onDelete: 'cascade' }).notNull(),
  nome: text('nome').notNull(),
  descricao: text('descricao'),
  tipo: text('tipo').notNull(), // 'low_ticket' | 'high_ticket'
  ativo: integer('ativo', { mode: 'boolean' }).default(true).notNull(),
  criadoEm: text('criado_em').default(sql`(datetime('now'))`).notNull(),
});

// Histórico de análises
export const analises = sqliteTable('analises', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  interesse: text('interesse').notNull(),
  resposta: text('resposta').notNull(), // JSON stringificado
  criadoEm: text('criado_em').default(sql`(datetime('now'))`).notNull(),
});
