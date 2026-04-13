# PRD — Assistente de Vendas com IA
**Product Requirements Document**
Versão: 1.0 | Data: 2025 | Status: Draft

---

## 1. Visão Geral do Produto

### 1.1 Nome do Produto
**VendaIA** — Assistente Consultivo de Vendas com Inteligência Artificial

### 1.2 Descrição
O VendaIA é uma aplicação web que atua como um agente consultivo de vendas, auxiliando vendedores a identificar oportunidades, quebrar objeções, estruturar ofertas persuasivas e sugerir estratégias de upsell e cross-sell com base no interesse do cliente. O assistente é alimentado pela API do Google AI Studio (Gemini), com chave fornecida pelo próprio usuário (modelo BYOK — Bring Your Own Key).

### 1.3 Problema que Resolve
Vendedores, especialmente de pequenos e médios negócios, frequentemente perdem oportunidades de venda por:
- Não identificar o perfil de ticket do lead (high/low/misto)
- Não fazer as perguntas certas de qualificação
- Não sugerir produtos complementares no momento certo
- Não ter argumentos prontos e persuasivos para apresentar ao cliente
- Gastar tempo elaborando mensagens de abordagem para WhatsApp/Instagram

### 1.4 Solução Proposta
Um assistente conversacional configurável por ramo de negócio, que recebe o interesse do cliente e retorna imediatamente um diagnóstico estruturado com seções padronizadas: leitura do interesse, diagnóstico de oportunidade, perguntas de qualificação, oferta principal, cross-sell inteligente e estratégia de ancoragem de valor.

---

## 2. Objetivos e Métricas de Sucesso

### 2.1 Objetivos do Produto
- **OBJ-01:** Reduzir o tempo de elaboração de abordagem de vendas de minutos para segundos
- **OBJ-02:** Aumentar o ticket médio por venda via sugestões contextuais de upsell/cross-sell
- **OBJ-03:** Padronizar a qualidade das abordagens de vendas mesmo para vendedores inexperientes
- **OBJ-04:** Gerar mensagens prontas para uso imediato no WhatsApp/Instagram

### 2.2 KPIs de Sucesso (pós-lançamento)
- Taxa de adoção: % de vendedores que usam diariamente após o onboarding
- Sessões por usuário/dia
- Satisfação (NPS ou CSAT interno)
- Tempo médio por análise gerada

---

## 3. Usuários-Alvo

### 3.1 Persona Principal — "O Vendedor Ativo"
- **Perfil:** Vendedor de pequeno/médio varejo, loja física ou e-commerce, autônomo ou em equipe
- **Ramos:** Eletrônicos, moda, cosméticos, suplementos, serviços, decoração, pet, alimentação etc.
- **Nível técnico:** Básico a intermediário — usa WhatsApp Business e Instagram diariamente
- **Dor principal:** Perder vendas por não saber o que oferecer além do produto que o cliente pediu
- **Motivação:** Aumentar comissão / faturamento sem aumentar o volume de atendimentos

### 3.2 Persona Secundária — "O Gestor de Equipe"
- **Perfil:** Dono de loja, gerente comercial ou coordenador de vendas
- **Dor principal:** Padronizar a abordagem da equipe e reduzir dependência do conhecimento individual
- **Motivação:** Ter uma ferramenta que treine e apoie a equipe em tempo real

---

## 4. Funcionalidades do Produto

### 4.1 Módulo de Autenticação
| ID | Funcionalidade | Prioridade |
|----|----------------|------------|
| F-01 | Cadastro de conta com nome, e-mail e senha | Alta |
| F-02 | Login com e-mail e senha (autenticação local com JWT) | Alta |
| F-03 | Recuperação de senha por e-mail | Média |
| F-04 | Logout e invalidação de sessão | Alta |
| F-05 | Proteção de rotas autenticadas | Alta |

### 4.2 Módulo de Configuração do Negócio (Onboarding)
| ID | Funcionalidade | Prioridade |
|----|----------------|------------|
| F-06 | Configuração do ramo de atuação (ex: eletrônicos, moda, serviços) | Alta |
| F-07 | Cadastro de produtos/serviços de Low Ticket com nome e descrição | Alta |
| F-08 | Cadastro de produtos/serviços de High Ticket com nome e descrição | Alta |
| F-09 | Edição e exclusão de produtos cadastrados | Alta |
| F-10 | Configuração da chave de API do Google AI Studio (Gemini) | Alta |
| F-11 | Teste de conexão da chave de API antes de salvar | Média |

### 4.3 Módulo do Assistente de Vendas (Chat Principal)
| ID | Funcionalidade | Prioridade |
|----|----------------|------------|
| F-12 | Campo de entrada para descrever o interesse do cliente | Alta |
| F-13 | Upload ou colagem de texto de orçamento recebido pelo cliente | Média |
| F-14 | Geração da análise estruturada pela IA com as 6 seções obrigatórias | Alta |
| F-15 | Exibição formatada de cada seção (A a F) com visual distinto | Alta |
| F-16 | Botão "Copiar" por seção (especialmente mensagens prontas) | Alta |
| F-17 | Refinamento iterativo — envio de respostas adicionais para refinar a análise | Alta |
| F-18 | Indicador de carregamento durante geração da resposta | Alta |
| F-19 | Botão "Nova Análise" para reiniciar o contexto | Média |

### 4.4 Módulo de Histórico
| ID | Funcionalidade | Prioridade |
|----|----------------|------------|
| F-20 | Salvamento automático de cada análise gerada | Média |
| F-21 | Listagem de histórico por data/hora | Média |
| F-22 | Visualização de análise anterior | Média |
| F-23 | Exclusão de análise do histórico | Baixa |

### 4.5 Módulo de Mensagens Prontas
| ID | Funcionalidade | Prioridade |
|----|----------------|------------|
| F-24 | Geração automática de mensagem pronta para WhatsApp | Alta |
| F-25 | Geração automática de mensagem pronta para Instagram | Média |
| F-26 | Botão de cópia com um clique | Alta |

---

## 5. Comportamento da IA — Prompt System

### 5.1 Prompt de Sistema (System Prompt)
A IA opera com um prompt de sistema fixo e não editável pelo usuário final, estruturado da seguinte forma:

**Papel e Objetivo:**
Você é um assistente de vendas especializado no ramo `{RAMO_DO_NEGOCIO}`. Seus produtos de Low Ticket são: `{LISTA_LOW_TICKET}`. Seus produtos de High Ticket são: `{LISTA_HIGH_TICKET}`. Seu objetivo é mapear oportunidades de venda a partir do interesse do cliente, construir ofertas coerentes e persuasivas, aumentando o ticket sem forçar, sugerir upsell e cross-sell com lógica e gerar mensagens prontas para copiar e colar no Instagram/WhatsApp.

**Input esperado:**
O interesse do cliente em linguagem natural, podendo incluir orçamentos recebidos.

**Estrutura obrigatória de resposta — sempre nesta ordem:**

**A) Leitura do Interesse (Resumo Rápido)**
Resumo em 1–2 linhas do que o cliente quer e o que isso indica.

**B) Diagnóstico da Oportunidade**
- Classificação do lead: High Ticket / Misto / Low Ticket
- Justificativa em frases curtas
- Lista do que precisa ser descoberto para aumentar a chance de fechar

**C) Perguntas de Qualificação (máximo 5)**
Até 5 perguntas objetivas no estilo WhatsApp para destravar a venda. Priorizar: orçamento, uso, preferência de marca/modelo, urgência.

**D) Oferta Principal Recomendada**
Um caminho principal:
- O que oferecer
- Por que faz sentido
- Como apresentar em uma frase

**E) Oferta Complementar — Cross-sell Inteligente**
De 2 a 4 itens complementares (somente se fizer sentido). Explicar a oferta de forma racional (melhorar desempenho, completar setup, estética etc.).

**F) Estratégia de Ancoragem (2 opções)**
- Opção 1: Bom / Ótimo / Premium (3 níveis)
- Opção 2: Custo-benefício vs. Performance
Sem usar preços exatos — se necessário, perguntar faixa de orçamento.

**G) Mensagem Pronta**
Uma mensagem no estilo WhatsApp/Instagram para o vendedor copiar e enviar ao cliente.

**Regras de Ouro:**
- Nunca ser insistente. Priorizar lógica e ajuda real.
- Não empurrar High Ticket se o cliente claramente quer algo simples.
- Sempre avaliar se cabe upsell.
- Ser específico em benefícios, sem inventar marca/modelo se o cliente não solicitou.
- Sempre fechar com: "Me diga qual faixa de orçamento e 1–2 usos principais para refinar a oferta."

### 5.2 Gatilhos de Oportunidade
A IA deve, ao receber o interesse do cliente, automaticamente verificar:
- Qual é a dor latente por trás do interesse
- Qual produto/serviço do catálogo cadastrado pode sanar esse problema
- Se o contexto indica urgência, aspiração ou necessidade básica

---

## 6. Requisitos Não Funcionais

### 6.1 Desempenho
- Resposta da IA em até 15 segundos para entradas de até 500 palavras
- Interface responsiva para uso em mobile (vendedores em campo)

### 6.2 Segurança
- Senhas armazenadas com hash bcrypt (custo mínimo 10)
- Chave de API do Google armazenada criptografada no banco (AES-256)
- Autenticação via JWT com expiração configurável (padrão: 7 dias)
- HTTPS obrigatório em produção

### 6.3 Usabilidade
- Onboarding concluído em menos de 5 minutos
- Interface em português do Brasil
- Feedback visual imediato em toda ação do usuário

### 6.4 Escalabilidade
- Arquitetura stateless no backend para permitir escala horizontal futura
- Banco de dados com suporte a múltiplos usuários e múltiplos negócios por conta

---

## 7. Fora do Escopo (v1.0)

- Integração direta com WhatsApp Business API
- Integração com CRM externo (Hubspot, Pipedrive etc.)
- Multi-tenant com workspaces compartilhados por equipe
- Relatórios e dashboards de vendas
- Treinamento personalizado de modelo de IA
- Aplicativo mobile nativo
- Suporte a múltiplos idiomas

---

## 8. Roadmap Sugerido

| Fase | Entregável | Prazo Estimado |
|------|-----------|----------------|
| MVP (v1.0) | Auth + Config + Chat + Histórico básico | 3–4 semanas |
| v1.1 | Mensagens prontas com cópia rápida + refinamento iterativo | +1 semana |
| v1.2 | Dashboard de histórico + busca | +1 semana |
| v2.0 | Multi-usuário por empresa / workspace compartilhado | A definir |
| v2.1 | Integração com CRM | A definir |

---

## 9. Critérios de Aceite do MVP

- [ ] Usuário consegue criar conta, fazer login e logout
- [ ] Usuário consegue configurar ramo, produtos low/high ticket e chave de API
- [ ] Usuário consegue inserir o interesse do cliente e receber análise estruturada com todas as 6 seções (A–G)
- [ ] Cada seção tem botão de cópia individual
- [ ] Análises são salvas automaticamente no histórico
- [ ] Interface funciona bem em telas de 375px (mobile) a 1440px (desktop)
- [ ] Chave de API é armazenada de forma segura (criptografada)
- [ ] Sistema funciona sem erros com chave de API válida do Google AI Studio

---

*Documento elaborado para uso como input em ferramentas de desenvolvimento assistido por IA (ex: Antigravity, Cursor, Windsurf).*
