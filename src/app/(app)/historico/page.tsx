"use client";

import Link from "next/link";
import { Clock, ExternalLink, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

type AnaliseItem = {
  id: string;
  interesse: string;
  criadoEm: string;
};

export default function HistoricoPage() {
  const [analises, setAnalises] = useState<AnaliseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchHistorico();
  }, []);

  async function fetchHistorico() {
    try {
      const res = await fetch("/api/historico");
      const data = await res.json();
      setAnalises(data.analises || []);
      setTotal(data.total || 0);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 pb-32 w-full overflow-y-auto">
      <header className="mb-12">
        <h2 className="font-sora text-4xl font-extrabold tracking-tight text-foreground mb-2">Histórico</h2>
        <p className="text-muted-foreground text-lg font-sans">
          {total > 0 ? `${total} análise${total > 1 ? "s" : ""} realizada${total > 1 ? "s" : ""}` : "Nenhuma análise realizada ainda."}
        </p>
      </header>

      {analises.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground font-sans text-lg mb-4">Ainda não há análises no seu histórico.</p>
          <Link href="/dashboard" className="bg-primary text-primary-foreground font-sora font-bold px-6 py-3 rounded-full inline-flex items-center gap-2 hover:bg-primary/90 transition-colors">
            Fazer primeira análise
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {analises.map((item) => (
            <Link key={item.id} href={`/analise/${item.id}`} className="block group">
              <div className="bg-surface-low p-6 rounded-xl transition-all hover:bg-muted/40 duration-300 hover:shadow-[0_24px_48px_-12px_rgba(19,27,46,0.06)]">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-foreground text-base leading-relaxed line-clamp-2 mb-2">
                      {item.interesse}
                    </p>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-xs font-sans">{formatDate(item.criadoEm)}</span>
                    </div>
                  </div>
                  <div className="p-2 text-muted-foreground group-hover:text-primary transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
