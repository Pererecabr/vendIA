import { GoogleGenerativeAI } from '@google/generative-ai';

export function buildSystemPrompt(config: {
  ramo: string;
  lowTicket: { nome: string; descricao?: string | null }[];
  highTicket: { nome: string; descricao?: string | null }[];
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

export async function analyzeInterest(
  apiKey: string,
  systemPrompt: string,
  interesse: string
): Promise<Record<string, unknown>> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: interesse }] }],
    systemInstruction: { role: 'system', parts: [{ text: systemPrompt }] },
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 4096,
      responseMimeType: 'application/json',
    },
  });

  const text = result.response.text();
  
  // Parse and validate JSON
  try {
    return JSON.parse(text);
  } catch {
    // Try to extract JSON from response if model wrapped it
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Resposta da IA não é JSON válido');
  }
}
