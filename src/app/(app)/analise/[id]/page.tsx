"use client";

import { FileText, Anchor, HelpCircle, CheckCircle2, Copy, TrendingUp, Send, Lightbulb, ArrowLeft, Loader2, ShoppingBag, BarChart3 } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

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

export default function AnaliseDetailPage() {
  const params = useParams();
  const [analise, setAnalise] = useState<Analise | null>(null);
  const [interesse, setInteresse] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    async function fetchAnalise() {
      try {
        const res = await fetch(`/api/historico/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setAnalise(data.analise);
          setInteresse(data.interesse);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchAnalise();
  }, [params.id]);

  async function copyText(text: string, label: string) {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!analise) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground font-sans">Análise não encontrada.</p>
        <Link href="/historico" className="text-primary font-sora font-bold hover:underline underline-offset-4 decoration-2">Voltar ao Histórico</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 pb-32 w-full overflow-y-auto">
      <Link href="/historico" className="inline-flex items-center gap-2 text-primary font-sora font-bold text-sm mb-8 hover:underline underline-offset-4 decoration-2">
        <ArrowLeft className="w-4 h-4" /> Voltar ao Histórico
      </Link>

      <div className="mb-12 border-b border-outline-variant/10 pb-8">
        <span className="text-primary font-sora font-bold tracking-widest text-xs uppercase">ANÁLISE SALVA</span>
        <h2 className="font-sora text-4xl font-extrabold tracking-tight text-foreground mt-2 mb-6">Plano de Abordagem Estratégico</h2>
        <div className="bg-surface-low rounded-2xl p-6 border border-outline-variant/5">
          <p className="text-muted-foreground font-sans text-lg leading-relaxed italic">&quot;{interesse}&quot;</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* BLUE: Contexto */}
        <section className="bg-surface-low rounded-2xl p-6 md:p-8 border border-outline-variant/5 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="text-primary w-4 h-4" />
              </div>
              <span className="font-sora font-bold text-primary text-xs uppercase tracking-wider">Leitura do Lead</span>
            </div>
            <button onClick={() => copyText(analise.leituraInteresse, "leitura")} className="bg-surface-highest text-foreground p-2 rounded-full hover:scale-105 transition-transform flex items-center gap-2 px-4 text-xs font-sora font-bold">
              <Copy className="w-3 h-3" /> {copied === "leitura" ? "COPIADO!" : "COPIAR"}
            </button>
          </div>
          <p className="font-sans text-muted-foreground leading-relaxed text-lg italic">{analise.leituraInteresse}</p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PURPLE: Diagnóstico */}
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
            <p className="font-sans text-muted-foreground leading-relaxed mb-6">{analise.diagnostico.justificativa}</p>
            <div className="flex flex-wrap gap-2">
              {analise.diagnostico.descobrir.map((item, i) => (
                <div key={i} className="bg-surface-highest px-3 py-1.5 rounded-lg text-xs font-bold text-foreground flex items-center gap-2">
                  <div className="w-1 h-1 bg-secondary rounded-full"></div>
                  {item}
                </div>
              ))}
            </div>
          </section>

          {/* AMBER: Perguntas */}
          <section className="bg-surface-low rounded-2xl p-6 md:p-8 border border-outline-variant/5 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <HelpCircle className="text-amber-500 w-4 h-4" />
              </div>
              <span className="font-sora font-bold text-amber-500 text-xs uppercase tracking-wider">Qualificação</span>
            </div>
            <div className="space-y-4">
              {analise.perguntasQualificacao.map((q, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-surface-highest/50 rounded-xl">
                  <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                  <p className="font-sans text-sm font-medium leading-snug">{q}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* GREEN: Oferta */}
        <section className="bg-surface-low rounded-2xl p-6 md:p-8 border border-outline-variant/5 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-tertiary/10 flex items-center justify-center">
              <CheckCircle2 className="text-tertiary w-4 h-4" />
            </div>
            <span className="font-sora font-bold text-tertiary text-xs uppercase tracking-wider">Oferta Principal</span>
          </div>
          <h3 className="font-sora text-3xl font-bold mb-4">{analise.ofertaPrincipal.oQueOferece}</h3>
          <p className="font-sans text-muted-foreground text-lg leading-relaxed mb-6">{analise.ofertaPrincipal.porQueFazSentido}</p>
          <div className="p-6 bg-tertiary/5 border border-tertiary/10 rounded-2xl italic font-serif text-xl text-tertiary">
            &quot;{analise.ofertaPrincipal.comoApresentar}&quot;
          </div>
        </section>

        {/* Cross-Sell & Ancoragem Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-surface-low rounded-2xl p-6 md:p-8 border border-outline-variant/5 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <ShoppingBag className="text-primary w-4 h-4" />
              </div>
              <span className="font-sora font-bold text-primary text-xs uppercase tracking-wider">Combos & Upgrades</span>
            </div>
            <div className="space-y-4">
              {analise.crossSell?.map((cs, i) => (
                <div key={i} className="p-4 bg-surface-highest rounded-xl border border-outline-variant/5">
                  <h4 className="font-sora font-bold text-primary mb-1">{cs.item}</h4>
                  <p className="text-xs text-muted-foreground font-sans leading-relaxed">{cs.racional}</p>
                </div>
              ))}
            </div>
          </section>

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
                <span className="text-[10px] font-bold leading-tight line-clamp-2">{analise.ancoragem?.opcao1?.bom}</span>
              </div>
              <div className="text-center p-3 bg-secondary/10 rounded-xl border border-secondary/20">
                <span className="block text-[8px] uppercase font-bold text-secondary mb-1">ÓTIMO</span>
                <span className="text-[10px] font-bold leading-tight line-clamp-2">{analise.ancoragem?.opcao1?.otimo}</span>
              </div>
              <div className="text-center p-3 bg-surface-highest rounded-xl">
                <span className="block text-[8px] uppercase font-bold text-muted-foreground mb-1">PREMIUM</span>
                <span className="text-[10px] font-bold leading-tight line-clamp-2">{analise.ancoragem?.opcao1?.premium}</span>
              </div>
            </div>
            <div className="bg-surface-highest p-4 rounded-xl flex justify-between gap-4">
              <div className="flex-1">
                <span className="block text-[8px] uppercase font-bold text-muted-foreground mb-1">CUSTO-BENEFÍCIO</span>
                <span className="text-[10px] font-medium leading-tight">{analise.ancoragem?.opcao2?.custoBeneficio}</span>
              </div>
              <div className="w-px bg-outline-variant/20"></div>
              <div className="flex-1 text-right">
                <span className="block text-[8px] uppercase font-bold text-muted-foreground mb-1">PERFORMANCE</span>
                <span className="text-[10px] font-medium leading-tight">{analise.ancoragem?.opcao2?.performance}</span>
              </div>
            </div>
          </section>
        </div>

        {/* Mensagem Estruturada */}
        <section className="bg-primary rounded-[2.5rem] p-8 md:p-12 text-primary-foreground relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-sora font-bold text-xl block">Mensagem Pronta</span>
                  <span className="text-white/60 text-sm font-sans">WhatsApp / Social Media</span>
                </div>
              </div>
              <button onClick={() => copyText(analise.mensagemPronta, "msg")} className="bg-white text-primary px-8 py-3 rounded-full text-sm font-sora font-bold hover:scale-105 transition-transform flex items-center gap-2">
                <Copy className="w-4 h-4" /> {copied === "msg" ? "Copiado!" : "Copiar"}
              </button>
            </div>
            <p className="font-sans leading-relaxed text-2xl whitespace-pre-wrap">{analise.mensagemPronta}</p>
          </div>
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-40 -mt-40 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full -ml-40 -mb-40 blur-3xl"></div>
          <div className="absolute right-8 bottom-8 opacity-10">
            <TrendingUp className="w-48 h-48" />
          </div>
        </section>
      </div>
    </div>
  );
}
