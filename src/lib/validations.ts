import { z } from 'zod';

export const cadastroSchema = z.object({
  nome: z.string().min(2, 'Nome muito curto').max(100),
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(8, 'Senha deve ter ao menos 8 caracteres'),
});

export const loginSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(1),
});

export const negocioSchema = z.object({
  ramo: z.string().min(2).max(100).optional(),
  apiKey: z.string().min(10).optional(),
});

export const produtoSchema = z.object({
  nome: z.string().min(1).max(200),
  descricao: z.string().max(500).optional(),
  tipo: z.enum(['low_ticket', 'high_ticket']),
});

export const analisarSchema = z.object({
  interesse: z.string().min(10, 'Descreva melhor o interesse do cliente').max(2000),
});
