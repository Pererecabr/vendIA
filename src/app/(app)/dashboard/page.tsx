"use client";

import { Sparkles, CheckCircle2, Send, Lightbulb, HelpCircle, Anchor, FileText, Copy, Loader2, ArrowUp, ShoppingBag, BarChart3, RotateCcw } from "lucide-react";
import { useState, FormEvent, useRef, useEffect } from "react";

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

type ChatMessage = {
  role: 'user' | 'model';
  parts: { text: string }[];
};

export default function DashboardPage() {
  const [interesse, setInteresse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analise, setAnalise] = useState<Analise | null>(null);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [copied, setCopied] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (analise && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [analise]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!interesse.trim() || loading) return;

    const currentMessage = interesse;
    setInteresse("");
    setLoading(true);
    setError("");

    // Se já existe uma análise, estamos refinando
    const isRefining = !!analise;
    
    try {
      const res = await fetch("/api/analisar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          interesse: currentMessage,
          history: isRefining ? history : []
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erro ao analisar");
        return;
      }

      setAnalise(data.analise);
      
      // Update history for next turns
      const newHistory: ChatMessage[] = [
        ...history,
        { role: 'user', parts: [{ text: currentMessage }] },
        { role: 'model', parts: [{ text: JSON.stringify(data.analise) }] }
      ];
      setHistory(newHistory);

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

  function resetChat() {
    setAnalise(null);
    setHistory([]);
    setInteresse("");
    setError("");
  }

  return (
    <div className="flex flex-col h-full relative" ref={scrollRef}>
      <section className="flex-1 overflow-y-auto px-4 md:px-12 py-8 space-y-8 pb-40">
        {!analise && !loading && (
          <div className="flex flex-col items-center text-center max-w-lg mx-auto mt-12 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-6 rotate-3">
              <Sparkles className="text-primary w-10 h-10" />
            </div>
            <h3 className="font-sora text-3xl font-bold mb-4">Como posso ajudar na sua venda hoje?</h3>
            <p className="text-muted-foreground text-lg font-sans leading-relaxed">
              Descreva o que o cliente disse ou pediu, e eu preparo toda a estratégia de abordagem, ancoragem e a mensagem ideal.
            </p>
          </div>
        )}

        {error && (
          <div className="max-w-2xl mx-auto p-4 bg-destructive/10 text-destructive rounded-xl text-sm font-sans font-medium">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center max-w-lg mx-auto my-16 gap-6 animate-pulse">
            <div className="relative">
              <Loader2 className="w-16 h-16 text-primary animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-primary/20 rounded-full animate-ping"></div>
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="font-sora font-bold text-2xl text-primary">Processando estratégia...</p>
              <p className="text-muted-foreground font-sans italic">&quot;Consultando produtos e refinando o tom da proposta&quot;</p>
            </div>
          </div>
        )}

        {analise && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 space-y-8">
            <div className="flex items-center justify-between mb-8 border-b border-outline-variant/10 pb-6">
              <div>
                <span className="text-primary font-sora font-bold tracking-widest text-xs uppercase">ANÁLISE ESTRATÉGICA</span>
                <h2 className="font-sora text-3xl font-extrabold tracking-tight text-foreground mt-1">Plano de Abordagem</h2>
              </div>
              <button 
                onClick={resetChat}
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-xs font-bold font-sora uppercase tracking-wider"
              >
                <RotateCcw className="w-4 h-4" /> Nova Análise
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {/* Contexto */}
              <section className="bg-surface-low rounded-2xl p-6 md:p-8 border border-outline-variant/5 shadow-sm group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="text-primary w-4 h-4" />
                  </div>
                  <span className="font-sora font-bold text-primary text-xs uppercase tracking-wider">Leitura do Lead</span>
                </div>
                <p className="font-sans text-muted-foreground leading-relaxed text-lg">{analise.leituraInteresse}</p>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Diagnóstico */}
                <section className="bg-surface-low rounded-2xl p-6 md:p-8 border border-outline-variant/5 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                        <Anchor className="text-secondary w-4 h-4" />
                      </div>
                      <span className="font-sora font-bold text-secondary text-xs uppercase tracking-wider">Diagnóstico</span>
                    </div>
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter ${
                      analise.diagnostico.classificacao === 'High Ticket' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'
                    }`}>
                      {analise.diagnostico.classificacao}
                    </span>
                  </div>
                  <p className="font-sans text-muted-foreground text-base leading-relaxed mb-6">{analise.diagnostico.justificativa}</p>
                  <div className="flex flex-wrap gap-2">
                    {analise.diagnostico.descobrir.map((item, i) => (
                      <div key={i} className="bg-surface-highest px-3 py-1.5 rounded-lg text-xs font-bold text-foreground flex items-center gap-2">
                        <div className="w-1 h-1 bg-secondary rounded-full"></div>
                        {item}
                      </div>
                    ))}
                  </div>
                </section>

                {/* Qualificação */}
                <section className="bg-surface-low rounded-2xl p-6 md:p-8 border border-outline-variant/5 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <HelpCircle className="text-amber-500 w-4 h-4" />
                    </div>
                    <span className="font-sora font-bold text-amber-500 text-xs uppercase tracking-wider">Qualificação</span>
                  </div>
                  <div className="space-y-4">
                    {analise.perguntasQualificacao.map((q, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-surface-highest/50 rounded-xl hover:bg-surface-highest transition-colors">
                        <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                        <p className="font-sans text-sm font-medium leading-snug">{q}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Oferta Principal */}
              <section className="bg-surface-low rounded-2xl p-6 md:p-8 border border-outline-variant/5 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-tertiary/10 flex items-center justify-center">
                    <CheckCircle2 className="text-tertiary w-4 h-4" />
                  </div>
                  <span className="font-sora font-bold text-tertiary text-xs uppercase tracking-wider">Oferta Principal</span>
                </div>
                <h3 className="font-sora text-2xl font-bold mb-4">{analise.ofertaPrincipal.oQueOferece}</h3>
                <p className="font-sans text-muted-foreground leading-relaxed mb-6">{analise.ofertaPrincipal.porQueFazSentido}</p>
                <div className="p-5 bg-tertiary/5 border border-tertiary/10 rounded-2xl italic font-serif text-lg text-tertiary">
                  &quot;{analise.ofertaPrincipal.comoApresentar}&quot;
                </div>
              </section>

              {/* Cross-Sell & Ancoragem Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cross-Sell */}
                <section className="bg-surface-low rounded-2xl p-6 md:p-8 border border-outline-variant/5 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <ShoppingBag className="text-primary w-4 h-4" />
                    </div>
                    <span className="font-sora font-bold text-primary text-xs uppercase tracking-wider">Combos & Upgrades</span>
                  </div>
                  <div className="space-y-4">
                    {analise.crossSell.map((cs, i) => (
                      <div key={i} className="p-4 bg-surface-highest rounded-xl border border-outline-variant/5">
                        <h4 className="font-sora font-bold text-primary mb-1">{cs.item}</h4>
                        <p className="text-xs text-muted-foreground font-sans leading-relaxed">{cs.racional}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Ancoragem */}
                <section className="bg-surface-low rounded-2xl p-6 md:p-8 border border-outline-variant/5 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <BarChart3 className="text-secondary w-4 h-4" />
                    </div>
                    <span className="font-sora font-bold text-secondary text-xs uppercase tracking-wider">Níveis de Investimento</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center p-3 bg-surface-highest rounded-xl">
                      <span className="block text-[8px] uppercase font-bold text-muted-foreground mb-1">BOM</span>
                      <span className="text-[10px] font-bold leading-tight line-clamp-2">{analise.ancoragem.opcao1.bom}</span>
                    </div>
                    <div className="text-center p-3 bg-secondary/10 rounded-xl border border-secondary/20 scale-105">
                      <span className="block text-[8px] uppercase font-bold text-secondary mb-1">ÓTIMO</span>
                      <span className="text-[10px] font-bold leading-tight line-clamp-2">{analise.ancoragem.opcao1.otimo}</span>
                    </div>
                    <div className="text-center p-3 bg-surface-highest rounded-xl">
                      <span className="block text-[8px] uppercase font-bold text-muted-foreground mb-1">PREMIUM</span>
                      <span className="text-[10px] font-bold leading-tight line-clamp-2">{analise.ancoragem.opcao1.premium}</span>
                    </div>
                  </div>
                  <div className="bg-surface-highest p-4 rounded-xl flex justify-between gap-4">
                    <div className="flex-1">
                      <span className="block text-[8px] uppercase font-bold text-muted-foreground mb-1">CUSTO-BENEFÍCIO</span>
                      <span className="text-[10px] font-medium leading-tight">{analise.ancoragem.opcao2.custoBeneficio}</span>
                    </div>
                    <div className="w-px bg-outline-variant/20 h-full"></div>
                    <div className="flex-1 text-right">
                      <span className="block text-[8px] uppercase font-bold text-muted-foreground mb-1">PERFORMANCE</span>
                      <span className="text-[10px] font-medium leading-tight">{analise.ancoragem.opcao2.performance}</span>
                    </div>
                  </div>
                </section>
              </div>

              {/* Mensagem Perfeita */}
              <section className="bg-primary rounded-[2.5rem] p-8 md:p-12 text-primary-foreground relative overflow-hidden shadow-2xl shadow-primary/20">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <Send className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-sora font-bold text-base block">Mensagem Estruturada</span>
                        <span className="text-white/60 text-xs font-sans">Pronta para WhatsApp / Instagram</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => copyText(analise.mensagemPronta, 'msg')}
                      className="bg-white text-primary px-6 py-3 rounded-full text-sm font-sora font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-lg"
                    >
                      <Copy className="w-4 h-4" /> {copied === 'msg' ? 'Copiado!' : 'Copiar'}
                    </button>
                  </div>
                  <p className="font-sans leading-relaxed text-xl whitespace-pre-wrap selection:bg-white selection:text-primary">
                    {analise.mensagemPronta}
                  </p>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>
              </section>

              {/* Hint Context */}
              <div className="text-center py-6 text-muted-foreground text-sm font-sans flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Precisa de algum ajuste? Digite abaixo para refinar a proposta.
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Floating Chat Box */}
      <footer className="absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-surface via-surface/95 to-transparent pt-12">
        <div className="max-w-4xl mx-auto">
          <form 
            onSubmit={handleSubmit} 
            className="group flex items-center gap-4 bg-surface-low rounded-[2rem] px-8 py-4 shadow-2xl shadow-black/5 ring-1 ring-black/5 focus-within:ring-primary/40 focus-within:bg-card transition-all duration-300"
          >
            <input
              className="flex-1 bg-transparent border-none focus:ring-0 text-foreground placeholder:text-muted-foreground/50 font-sans text-lg py-2"
              placeholder={analise ? "Diga como refinar essa sugestão..." : "O que o cliente disse ou pediu?"}
              type="text"
              value={interesse}
              onChange={(e) => setInteresse(e.target.value)}
              disabled={loading}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit(e)}
            />
            <button
              type="submit"
              disabled={loading || !interesse.trim()}
              className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all disabled:opacity-30 disabled:grayscale hover:shadow-primary/40"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <ArrowUp className="w-6 h-6" />}
            </button>
          </form>
          <p className="text-center mt-3 text-[10px] text-muted-foreground/60 font-sans uppercase tracking-[0.2em]">
            VendaIA Engine • Gemini 1.5 Flash Precision
          </p>
        </div>
      </footer>
    </div>
  );
}
