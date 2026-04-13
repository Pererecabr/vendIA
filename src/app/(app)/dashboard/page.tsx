"use client";

import { Sparkles, CheckCircle2, Send, Lightbulb, HelpCircle, Anchor, FileText, Copy, Loader2, ArrowUp, TrendingUp } from "lucide-react";
import { useState, FormEvent } from "react";

type Analise = {
  leituraInteresse: string;
  diagnostico: {
    classificacao: string;
    justificativa: string;
    descobrir: string[];
  };
  perguntasQualificacao: string[];
  ofertaPrincipal: {
    oQueOferece: string;
    porQueFazSentido: string;
    comoApresentar: string;
  };
  crossSell: { item: string; racional: string }[];
  ancoragem: {
    opcao1: { bom: string; otimo: string; premium: string };
    opcao2: { custoBeneficio: string; performance: string };
  };
  mensagemPronta: string;
};

export default function DashboardPage() {
  const [interesse, setInteresse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analise, setAnalise] = useState<Analise | null>(null);
  const [copied, setCopied] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!interesse.trim() || interesse.length < 10) return;
    setLoading(true);
    setError("");
    setAnalise(null);

    try {
      const res = await fetch("/api/analisar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interesse }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erro ao analisar");
        return;
      }
      setAnalise(data.analise);
    } catch {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  async function copyText(text: string, label: string) {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  }

  return (
    <>
      <section className="flex-1 overflow-y-auto px-4 md:px-12 py-8 space-y-8 pb-32">
        {/* Welcome / Prompt */}
        {!analise && !loading && (
          <div className="flex flex-col items-center text-center max-w-lg mx-auto mt-12 mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="text-primary w-8 h-8" />
            </div>
            <h3 className="font-sora text-2xl font-bold mb-2">Assistente de Vendas</h3>
            <p className="text-muted-foreground text-sm font-sans">
              Descreva o interesse do cliente e receba uma análise completa: diagnóstico, oferta principal, cross-sell, ancoragem e mensagem pronta para WhatsApp.
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="max-w-2xl mx-auto p-4 bg-destructive/10 text-destructive rounded-xl text-sm font-sans font-medium">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center max-w-lg mx-auto my-16 gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="font-sora font-bold text-primary">Analisando interesse...</p>
            <p className="text-muted-foreground text-sm font-sans text-center">
              Nossa IA está montando a estratégia de vendas personalizada.
            </p>
          </div>
        )}

        {/* Analysis Result */}
        {analise && (
          <>
            {/* Header */}
            <div className="mb-8">
              <span className="text-primary font-sora font-bold tracking-widest text-xs uppercase">ANÁLISE INTELIGENTE</span>
              <h2 className="font-sora text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mt-2 mb-4">Fluxo Estratégico de Conversa</h2>
            </div>

            <div className="space-y-6">
              {/* BLUE: Reading */}
              <section className="bg-surface-low rounded-xl p-6 md:p-8 border-l-[6px] border-primary hover:bg-muted/40 transition-colors duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="text-primary w-5 h-5" />
                    <span className="font-sora font-bold text-primary text-sm">LEITURA / CONTEXTO</span>
                  </div>
                  <button onClick={() => copyText(analise.leituraInteresse, "leitura")} className="bg-surface-highest text-foreground p-2 rounded-full hover:scale-105 transition-transform flex items-center gap-2 px-4 text-xs font-sora font-bold">
                    <Copy className="w-3 h-3" /> {copied === "leitura" ? "COPIADO!" : "COPIAR"}
                  </button>
                </div>
                <h3 className="font-sora text-xl font-bold mb-3">Interesse do Cliente</h3>
                <p className="font-sans text-muted-foreground leading-relaxed italic">{analise.leituraInteresse}</p>
              </section>

              {/* Diagnóstico */}
              <section className="bg-surface-low rounded-xl p-6 md:p-8 border-l-[6px] border-secondary hover:bg-muted/40 transition-colors duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <Anchor className="text-secondary w-5 h-5" />
                  <span className="font-sora font-bold text-secondary text-sm">DIAGNÓSTICO</span>
                  <span className={`ml-auto text-xs font-bold px-3 py-1 rounded-full ${analise.diagnostico.classificacao === "High Ticket" ? "bg-secondary/10 text-secondary" : analise.diagnostico.classificacao === "Low Ticket" ? "bg-primary/10 text-primary" : "bg-amber-100 text-amber-700"}`}>
                    {analise.diagnostico.classificacao}
                  </span>
                </div>
                <p className="font-sans text-muted-foreground leading-relaxed mb-4">{analise.diagnostico.justificativa}</p>
                <div className="flex flex-wrap gap-2">
                  {analise.diagnostico.descobrir.map((item, i) => (
                    <span key={i} className="bg-secondary/10 text-secondary text-xs px-3 py-1 rounded-full font-sans font-medium">{item}</span>
                  ))}
                </div>
              </section>

              {/* Perguntas */}
              <section className="bg-surface-low rounded-xl p-6 md:p-8 border-l-[6px] border-amber-500 hover:bg-muted/40 transition-colors duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle className="text-amber-500 w-5 h-5" />
                  <span className="font-sora font-bold text-amber-500 text-sm">PERGUNTAS / QUALIFICAÇÃO</span>
                </div>
                <div className="space-y-3">
                  {analise.perguntasQualificacao.map((q, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                      <p className="font-sans text-foreground">{q}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Oferta Principal */}
              <section className="bg-surface-low rounded-xl p-6 md:p-8 border-l-[6px] border-tertiary hover:bg-muted/40 transition-colors duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="text-tertiary w-5 h-5" />
                    <span className="font-sora font-bold text-tertiary text-sm">OFERTA PRINCIPAL</span>
                  </div>
                </div>
                <h3 className="font-sora text-xl font-bold mb-3">{analise.ofertaPrincipal.oQueOferece}</h3>
                <p className="font-sans text-muted-foreground leading-relaxed mb-4">{analise.ofertaPrincipal.porQueFazSentido}</p>
                <div className="p-4 bg-tertiary/10 rounded-lg">
                  <p className="font-sans text-tertiary font-bold italic">{analise.ofertaPrincipal.comoApresentar}</p>
                </div>
              </section>

              {/* Mensagem Pronta — WhatsApp */}
              <section className="bg-primary rounded-2xl p-6 md:p-8 text-primary-foreground relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <Send className="w-5 h-5" />
                      <span className="font-sora font-bold text-sm">MENSAGEM PRONTA — WHATSAPP</span>
                    </div>
                    <button onClick={() => copyText(analise.mensagemPronta, "msg")} className="bg-white/20 text-white px-4 py-2 rounded-full text-xs font-sora font-bold hover:bg-white/30 transition-colors flex items-center gap-2">
                      <Copy className="w-3 h-3" /> {copied === "msg" ? "COPIADO!" : "COPIAR"}
                    </button>
                  </div>
                  <p className="font-sans leading-relaxed text-lg whitespace-pre-wrap">{analise.mensagemPronta}</p>
                </div>
                <div className="absolute right-4 bottom-4 opacity-10">
                  <TrendingUp className="w-32 h-32" />
                </div>
              </section>
            </div>
          </>
        )}
      </section>

      {/* Fixed Chat Input */}
      <footer className="absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-surface/80 backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex items-center gap-4 bg-surface-low rounded-full px-6 py-3 shadow-lg ring-1 ring-black/5">
          <input
            className="flex-1 bg-transparent border-none focus:ring-0 text-foreground placeholder:text-muted-foreground/60 font-sans py-2"
            placeholder="Descreva o interesse do cliente..."
            type="text"
            value={interesse}
            onChange={(e) => setInteresse(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || interesse.length < 10}
            className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-transform disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowUp className="w-5 h-5" />}
          </button>
        </form>
      </footer>
    </>
  );
}
