"use client";

import { FileText, Anchor, HelpCircle, CheckCircle2, Copy, TrendingUp, Send, Lightbulb, ArrowLeft, Loader2 } from "lucide-react";
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
        <Link href="/historico" className="text-primary font-sora font-bold hover:underline">Voltar ao Histórico</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 pb-32 w-full overflow-y-auto">
      <Link href="/historico" className="inline-flex items-center gap-2 text-primary font-sora font-bold text-sm mb-8 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Voltar ao Histórico
      </Link>

      <div className="mb-8">
        <span className="text-primary font-sora font-bold tracking-widest text-xs uppercase">ANÁLISE INTELIGENTE</span>
        <h2 className="font-sora text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mt-2 mb-4">Fluxo Estratégico de Conversa</h2>
        <p className="text-muted-foreground font-sans bg-surface-low p-4 rounded-xl italic">{interesse}</p>
      </div>

      <div className="space-y-6">
        {/* BLUE: Reading */}
        <section className="bg-surface-low rounded-xl p-6 md:p-8 border-l-[6px] border-primary">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <FileText className="text-primary w-5 h-5" />
              <span className="font-sora font-bold text-primary text-sm">LEITURA / CONTEXTO</span>
            </div>
            <button onClick={() => copyText(analise.leituraInteresse, "leitura")} className="bg-surface-highest text-foreground p-2 rounded-full hover:scale-105 transition-transform flex items-center gap-2 px-4 text-xs font-sora font-bold">
              <Copy className="w-3 h-3" /> {copied === "leitura" ? "COPIADO!" : "COPIAR"}
            </button>
          </div>
          <p className="font-sans text-muted-foreground leading-relaxed italic">{analise.leituraInteresse}</p>
        </section>

        {/* PURPLE: Diagnóstico */}
        <section className="bg-surface-low rounded-xl p-6 md:p-8 border-l-[6px] border-secondary">
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

        {/* AMBER: Perguntas */}
        <section className="bg-surface-low rounded-xl p-6 md:p-8 border-l-[6px] border-amber-500">
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

        {/* GREEN: Oferta */}
        <section className="bg-surface-low rounded-xl p-6 md:p-8 border-l-[6px] border-tertiary">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="text-tertiary w-5 h-5" />
            <span className="font-sora font-bold text-tertiary text-sm">OFERTA PRINCIPAL</span>
          </div>
          <h3 className="font-sora text-xl font-bold mb-3">{analise.ofertaPrincipal.oQueOferece}</h3>
          <p className="font-sans text-muted-foreground leading-relaxed mb-4">{analise.ofertaPrincipal.porQueFazSentido}</p>
          <div className="p-4 bg-tertiary/10 rounded-lg">
            <p className="font-sans text-tertiary font-bold italic">{analise.ofertaPrincipal.comoApresentar}</p>
          </div>
        </section>

        {/* Mensagem Pronta */}
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
    </div>
  );
}
