# SPEC — Assistente de Vendas com IA
**Technical Specification Document**
Versão: 1.0 | Data: 2025 | Status: Draft

---

## 1. Arquitetura Geral

```
┌─────────────────────────────────────────────────────────┐
│                        FRONTEND                          │
│              Next.js 14 (App Router)                     │
│         TailwindCSS + shadcn/ui + Lucide Icons           │
└─────────────────────────┬───────────────────────────────┘
                          │ HTTP/REST (JSON)
┌─────────────────────────▼───────────────────────────────┐
│                        BACKEND                           │
│              Next.js API Routes (Route Handlers)         │
│              Autenticação: JWT (jose / jsonwebtoken)      │
│              Validação: Zod                              │
└──────────┬──────────────────────────┬───────────────────┘
           │                          │
┌──────────▼──────────┐   ┌──────────▼──────────────────┐
│     BANCO DE DADOS   │   │      GOOGLE AI STUDIO        │
│   PostgreSQL (Neon)  │   │   Gemini 1.5 Flash/Pro API   │
│   ORM: Drizzle ORM  │   │   (Chave BYOK por usuário)   │
└─────────────────────┘   └─────────────────────────────┘
```

### 1.1 Decisões Técnicas

| Decisão | Escolha | Justificativa |
|---------|---------|---------------|
| Framework | Next.js 14 (App Router) | Full-stack unificado, deploy simples na Vercel |
| Banco de dados | PostgreSQL via Neon | Serverless, free tier generoso, sem ops |
| ORM | Drizzle ORM | Type-safe, leve, excelente com Neon/PostgreSQL |
| Autenticação | JWT local (jose) | Sem dependência de serviço externo |
| Estilo | TailwindCSS + shadcn/ui | Produtividade + componentes acessíveis |
| IA | Google Gemini via SDK | Custo baixo, boa performance em PT-BR |
| Criptografia de API key | AES-256-GCM (Node crypto) | Segurança na camada de aplicação |
| Deploy | Vercel (recomendado) | Integração nativa com Next.js |

---

## 2. Estrutura de Pastas

```
/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── cadastro/
│   │       └── page.tsx
│   ├── (app)/
│   │   ├── layout.tsx              # Layout autenticado com sidebar
│   │   ├── dashboard/
│   │   │   └── page.tsx            # Tela principal do chat/assistente
│   │   ├── configuracoes/
│   │   │   └── page.tsx            # Config do negócio + API key
│   │   └── historico/
│   │       └── page.tsx            # Histórico de análises
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   ├── cadastro/route.ts
│   │   │   └── logout/route.ts
│   │   ├── configuracoes/
│   │   │   └── route.ts            # GET / PUT config do negócio
│   │   ├── produtos/
│   │   │   └── route.ts            # GET / POST / DELETE produtos
│   │   ├── analisar/
│   │   │   └── route.ts            # POST → chama Gemini, retorna análise
│   │   └── historico/
│   │       └── route.ts            # GET / DELETE histórico
│   ├── layout.tsx
│   └── page.tsx                    # Redirect para /dashboard ou /login
├── components/
│   ├── ui/                         # shadcn/ui components
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── CadastroForm.tsx
│   ├── configuracoes/
│   │   ├── NegocioForm.tsx
│   │   ├── ProdutoForm.tsx
│   │   └── ApiKeyForm.tsx
│   ├── assistente/
│   │   ├── InputInteresse.tsx      # Campo de entrada do interesse
│   │   ├── AnaliseCard.tsx         # Card de cada seção (A–G)
│   │   ├── SecaoLeitura.tsx
│   │   ├── SecaoDiagnostico.tsx
│   │   ├── SecaoPerguntas.tsx
│   │   ├── SecaoOfertaPrincipal.tsx
│   │   ├── SecaoCrossSell.tsx
│   │   ├── SecaoAncoragem.tsx
│   │   └── SecaoMensagem.tsx
│   └── shared/
│       ├── BotaoCopiar.tsx
│       ├── LoadingSpinner.tsx
│       └── Navbar.tsx
├── lib/
│   ├── db/
│   │   ├── schema.ts               # Drizzle schema
│   │   ├── index.ts                # Conexão com Neon
│   │   └── migrations/
│   ├── auth/
│   │   ├── jwt.ts                  # Sign / verify JWT
│   │   └── middleware.ts           # Proteção de rotas
│   ├── crypto.ts                   # Encrypt / decrypt API key
│   ├── gemini.ts                   # Client Gemini + montagem do prompt
│   └── validations.ts              # Schemas Zod
├── middleware.ts                   # Next.js middleware (proteção de rotas)
├── .env.local                      # Variáveis de ambiente
└── drizzle.config.ts
```

---

## 3. Banco de Dados — Schema (Drizzle ORM)

```typescript
// lib/db/schema.ts

import { pgTable, text, timestamp, uuid, boolean } from 'drizzle-orm/pg-core';

// Usuários
export const users = pgTable('users', {
  id:           uuid('id').defaultRandom().primaryKey(),
  nome:         text('nome').notNull(),
  email:        text('email').notNull().unique(),
  senhaHash:    text('senha_hash').notNull(),
  criadoEm:    timestamp('criado_em').defaultNow().notNull(),
});

// Configuração do negócio por usuário
export const negocios = pgTable('negocios', {
  id:           uuid('id').defaultRandom().primaryKey(),
  userId:       uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  ramo:         text('ramo').notNull(),
  apiKeyEnc:    text('api_key_enc'),             // Chave Gemini criptografada
  criadoEm:    timestamp('criado_em').defaultNow().notNull(),
  atualizadoEm: timestamp('atualizado_em').defaultNow().notNull(),
});

// Produtos (Low e High Ticket)
export const produtos = pgTable('produtos', {
  id:           uuid('id').defaultRandom().primaryKey(),
  negocioId:    uuid('negocio_id').references(() => negocios.id, { onDelete: 'cascade' }).notNull(),
  nome:         text('nome').notNull(),
  descricao:    text('descricao'),
  tipo:         text('tipo').notNull(),           // 'low_ticket' | 'high_ticket'
  ativo:        boolean('ativo').default(true).notNull(),
  criadoEm:    timestamp('criado_em').defaultNow().notNull(),
});

// Histórico de análises
export const analises = pgTable('analises', {
  id:           uuid('id').defaultRandom().primaryKey(),
  userId:       uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  interesse:    text('interesse').notNull(),       // Input do vendedor
  resposta:     text('resposta').notNull(),        // Output da IA (JSON stringificado)
  criadoEm:    timestamp('criado_em').defaultNow().notNull(),
});
```

---

## 4. API Routes

### 4.1 Autenticação

#### `POST /api/auth/cadastro`
```typescript
// Request body
{ nome: string; email: string; senha: string }

// Response 201
{ message: "Conta criada com sucesso" }

// Erros
// 400 — validação Zod falhou
// 409 — e-mail já cadastrado
```

#### `POST /api/auth/login`
```typescript
// Request body
{ email: string; senha: string }

// Response 200 — seta cookie httpOnly com JWT
{ message: "Login realizado"; user: { id, nome, email } }

// Erros
// 401 — credenciais inválidas
```

#### `POST /api/auth/logout`
```typescript
// Response 200 — limpa cookie JWT
{ message: "Logout realizado" }
```

---

### 4.2 Configurações

#### `GET /api/configuracoes`
```typescript
// Response 200
{
  ramo: string;
  temApiKey: boolean;        // nunca retorna a key em si
  produtos: {
    id: string;
    nome: string;
    descricao: string | null;
    tipo: 'low_ticket' | 'high_ticket';
  }[]
}
```

#### `PUT /api/configuracoes`
```typescript
// Request body
{ ramo?: string; apiKey?: string }

// Response 200
{ message: "Configurações salvas" }
```

---

### 4.3 Produtos

#### `POST /api/produtos`
```typescript
// Request body
{ nome: string; descricao?: string; tipo: 'low_ticket' | 'high_ticket' }

// Response 201
{ id: string; nome: string; descricao: string | null; tipo: string }
```

#### `DELETE /api/produtos/[id]`
```typescript
// Response 200
{ message: "Produto removido" }
```

---

### 4.4 Análise de Vendas (Core)

#### `POST /api/analisar`
```typescript
// Request body
{ interesse: string }         // Texto livre com o interesse do cliente

// Fluxo interno:
// 1. Buscar config do usuário (ramo, produtos, api key descriptografada)
// 2. Montar system prompt com ramo + produtos
// 3. Chamar Gemini com system + user message
// 4. Parsear resposta JSON estruturada
// 5. Salvar no histórico
// 6. Retornar análise

// Response 200
{
  id: string;
  analise: {
    leituraInteresse: string;
    diagnostico: {
      classificacao: 'High Ticket' | 'Misto' | 'Low Ticket';
      justificativa: string;
      descobrir: string[];
    };
    perguntasQualificacao: string[];
    ofertaPrincipal: {
      oQueOferece: string;
      porQueFazSentido: string;
      comoApresentar: string;
    };
    crossSell: {
      item: string;
      racional: string;
    }[];
    ancoragem: {
      opcao1: { bom: string; otimo: string; premium: string };
      opcao2: { custobeneficio: string; performance: string };
    };
    mensagemPronta: string;
  }
}

// Erros
// 400 — interesse vazio
// 402 — API key não configurada
// 502 — erro na chamada ao Gemini
```

---

### 4.5 Histórico

#### `GET /api/historico`
```typescript
// Query params: ?page=1&limit=20

// Response 200
{
  analises: {
    id: string;
    interesse: string;
    criadoEm: string;
  }[];
  total: number;
}
```

#### `GET /api/historico/[id]`
```typescript
// Response 200 — retorna a análise completa salva
```

---

## 5. Construção do Prompt — `lib/gemini.ts`

```typescript
export function buildSystemPrompt(config: {
  ramo: string;
  lowTicket: { nome: string; descricao?: string }[];
  highTicket: { nome: string; descricao?: string }[];
}): string {
  return `
Você é um assistente de vendas especializado no ramo: **${config.ramo}**.

PRODUTOS LOW TICKET (cross-sell / entrada):
${config.lowTicket.map(p => `- ${p.nome}${p.descricao ? ': ' + p.descricao : ''}`).join('\n')}

PRODUTOS HIGH TICKET (upsell / oferta principal premium):
${config.highTicket.map(p => `- ${p.nome}${p.descricao ? ': ' + p.descricao : ''}`).join('\n')}

Seu objetivo: mapear oportunidades de venda a partir do interesse do cliente, construir ofertas coerentes e persuasivas, aumentando o ticket sem forçar, sugerir upsell e cross-sell com lógica, e gerar mensagens prontas para WhatsApp/Instagram.

REGRAS DE OURO:
- Nunca seja insistente. Priorize lógica e ajuda real.
- Não empurre High Ticket se o cliente claramente quer algo simples.
- Sempre avalie se cabe upsell.
- Seja específico em benefícios. Não invente marca/modelo se o cliente não solicitou.

Ao receber o interesse do cliente, responda APENAS com um JSON válido, sem markdown, sem texto fora do JSON, seguindo exatamente esta estrutura:

{
  "leituraInteresse": "string — resumo em 1-2 linhas do que o cliente quer e o que isso indica",
  "diagnostico": {
    "classificacao": "High Ticket | Misto | Low Ticket",
    "justificativa": "string — frases curtas explicando a classificação",
    "descobrir": ["string — item 1", "string — item 2"]
  },
  "perguntasQualificacao": ["pergunta 1", "pergunta 2", "até 5 perguntas"],
  "ofertaPrincipal": {
    "oQueOferece": "string",
    "porQueFazSentido": "string",
    "comoApresentar": "string — frase pronta"
  },
  "crossSell": [
    { "item": "string — nome do produto/serviço", "racional": "string — motivo prático" }
  ],
  "ancoragem": {
    "opcao1": { "bom": "string", "otimo": "string", "premium": "string" },
    "opcao2": { "custoBeneficio": "string", "performance": "string" }
  },
  "mensagemPronta": "string — mensagem completa para WhatsApp/Instagram, pronta para copiar e colar"
}

Feche SEMPRE o JSON com a observação no campo mensagemPronta: termine a mensagem com a frase 'Me diga qual faixa de orçamento e 1-2 usos principais para refinar minha sugestão para você 😊'
`;
}
```

---

## 6. Criptografia da API Key — `lib/crypto.ts`

```typescript
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const SECRET = process.env.ENCRYPTION_SECRET!; // 32 chars hex

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const key = Buffer.from(SECRET, 'hex');
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv.toString('hex'), tag.toString('hex'), encrypted.toString('hex')].join(':');
}

export function decrypt(payload: string): string {
  const [ivHex, tagHex, encryptedHex] = payload.split(':');
  const key = Buffer.from(SECRET, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, key, Buffer.from(ivHex, 'hex'));
  decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
  return decipher.update(Buffer.from(encryptedHex, 'hex')) + decipher.final('utf8');
}
```

---

## 7. Middleware de Autenticação

```typescript
// middleware.ts (Next.js root)
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const PUBLIC_ROUTES = ['/login', '/cadastro', '/api/auth/login', '/api/auth/cadastro'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_ROUTES.some(r => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

---

## 8. Variáveis de Ambiente

```env
# .env.local

# Banco de dados (Neon PostgreSQL)
DATABASE_URL="postgresql://user:pass@host.neon.tech/dbname?sslmode=require"

# JWT
JWT_SECRET="sua_string_secreta_com_pelo_menos_32_caracteres"

# Criptografia da API key do usuário (32 bytes em hex = 64 chars)
ENCRYPTION_SECRET="a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2"

# Ambiente
NODE_ENV="development"
```

---

## 9. Validações Zod

```typescript
// lib/validations.ts
import { z } from 'zod';

export const cadastroSchema = z.object({
  nome:  z.string().min(2, 'Nome muito curto').max(100),
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(8, 'Senha deve ter ao menos 8 caracteres'),
});

export const loginSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(1),
});

export const negocioSchema = z.object({
  ramo:   z.string().min(2).max(100).optional(),
  apiKey: z.string().min(10).optional(),
});

export const produtoSchema = z.object({
  nome:      z.string().min(1).max(200),
  descricao: z.string().max(500).optional(),
  tipo:      z.enum(['low_ticket', 'high_ticket']),
});

export const analisarSchema = z.object({
  interesse: z.string().min(10, 'Descreva melhor o interesse do cliente').max(2000),
});
```

---

## 10. Fluxo de Telas (UX Flow)

```
[/] → verifica cookie JWT
  ├── autenticado   → redirect /dashboard
  └── não autenticado → redirect /login

[/login] → formulário email/senha
  └── sucesso → /dashboard

[/cadastro] → formulário nome/email/senha
  └── sucesso → /configuracoes (onboarding)

[/configuracoes] (onboarding + config)
  ├── Aba 1: Negócio (ramo + API key)
  ├── Aba 2: Produtos Low Ticket (CRUD)
  └── Aba 3: Produtos High Ticket (CRUD)

[/dashboard] (tela principal)
  ├── Área de input: "Descreva o interesse do cliente"
  ├── Botão "Analisar"
  ├── Loading skeleton
  └── Cards das seções A–G com botão copiar

[/historico]
  ├── Lista de análises anteriores
  └── Click → exibe análise completa
```

---

## 11. Stack de Dependências

```json
{
  "dependencies": {
    "next": "^14",
    "react": "^18",
    "react-dom": "^18",
    "drizzle-orm": "^0.30",
    "@neondatabase/serverless": "^0.9",
    "bcryptjs": "^2.4",
    "jose": "^5",
    "zod": "^3",
    "@google/generative-ai": "^0.15",
    "tailwindcss": "^3",
    "class-variance-authority": "^0.7",
    "clsx": "^2",
    "lucide-react": "^0.400"
  },
  "devDependencies": {
    "drizzle-kit": "^0.20",
    "@types/bcryptjs": "^2.4",
    "typescript": "^5"
  }
}
```

---

## 12. Comandos de Setup

```bash
# 1. Clonar e instalar
git clone <repo>
cd sales-assistant
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env.local
# editar .env.local com suas credenciais

# 3. Gerar e rodar migrations
npx drizzle-kit generate
npx drizzle-kit migrate

# 4. Rodar em desenvolvimento
npm run dev

# 5. Build para produção
npm run build
npm start
```

---

*Documento gerado para uso como SPEC técnico em ferramentas de desenvolvimento assistido por IA.*
