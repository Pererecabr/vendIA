"use client";

import { Gauge, Gem, Key, Eye, EyeOff, Info, Plus, X, Loader2, Save } from "lucide-react";
import { useState, useEffect, FormEvent } from "react";

type Produto = {
  id: string;
  nome: string;
  descricao: string | null;
  tipo: string;
};

export default function ConfiguracoesPage() {
  const [ramo, setRamo] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [temApiKey, setTemApiKey] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [tipoFoco, setTipoFoco] = useState<"low_ticket" | "high_ticket">("low_ticket");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  
  // New product form
  const [novoProdutoNome, setNovoProdutoNome] = useState("");
  const [novoProdutoDesc, setNovoProdutoDesc] = useState("");
  const [novoProdutoTipo, setNovoProdutoTipo] = useState<"low_ticket" | "high_ticket">("low_ticket");
  const [addingProduto, setAddingProduto] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  async function fetchConfig() {
    try {
      const res = await fetch("/api/configuracoes");
      const data = await res.json();
      setRamo(data.ramo || "");
      setTemApiKey(data.temApiKey);
      setProdutos(data.produtos || []);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveConfig(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const body: Record<string, string> = {};
    if (ramo) body.ramo = ramo;
    if (apiKey) body.apiKey = apiKey;

    const res = await fetch("/api/configuracoes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setMessage("Configurações salvas!");
      setApiKey("");
      setTemApiKey(true);
    } else {
      const data = await res.json();
      setMessage(data.error || "Erro ao salvar");
    }
    setSaving(false);
  }

  async function handleAddProduto() {
    if (!novoProdutoNome.trim()) return;
    setAddingProduto(true);

    const res = await fetch("/api/produtos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: novoProdutoNome,
        descricao: novoProdutoDesc || undefined,
        tipo: novoProdutoTipo,
      }),
    });

    if (res.ok) {
      const produto = await res.json();
      setProdutos([...produtos, produto]);
      setNovoProdutoNome("");
      setNovoProdutoDesc("");
    }
    setAddingProduto(false);
  }

  async function handleDeleteProduto(id: string) {
    await fetch(`/api/produtos/${id}`, { method: "DELETE" });
    setProdutos(produtos.filter((p) => p.id !== id));
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
        <h2 className="font-sora text-4xl font-extrabold tracking-tight text-foreground mb-2">Configurações</h2>
        <p className="text-muted-foreground text-lg">Configure o motor de IA e as preferências de ticket de vendas.</p>
      </header>

      {message && (
        <div className={`mb-6 p-4 rounded-xl text-sm font-sans font-medium ${message.includes("Erro") ? "bg-destructive/10 text-destructive" : "bg-tertiary/10 text-tertiary"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSaveConfig} className="space-y-8">
        {/* Strategy Focus */}
        <section className="bg-surface-low p-8 rounded-xl relative overflow-hidden shadow-sm">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary/80"></div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="font-sora text-xl font-bold text-foreground mb-1">Ramo do Negócio</h3>
              <p className="text-muted-foreground text-sm font-sans">Descreva o ramo da sua empresa para a IA personalizar as análises.</p>
            </div>
          </div>
          <div className="mt-6">
            <input
              className="w-full bg-card border-none rounded-xl py-4 px-4 focus:ring-2 focus:ring-primary transition-all text-foreground placeholder:text-muted-foreground/60 font-sans"
              placeholder="Ex: Pet shop premium, Imóveis de luxo, Suplementos esportivos..."
              value={ramo}
              onChange={(e) => setRamo(e.target.value)}
            />
          </div>
        </section>

        {/* API Key */}
        <section className="bg-surface-low p-8 rounded-xl relative overflow-hidden shadow-sm">
          <div className="absolute top-0 left-0 w-1 h-full bg-tertiary"></div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-surface-highest flex items-center justify-center">
                <Key className="text-tertiary w-5 h-5" />
              </div>
              <div>
                <h3 className="font-sora text-xl font-bold text-foreground">Motor de IA</h3>
                <p className="text-muted-foreground text-sm font-sans">Google AI Studio API Key</p>
              </div>
            </div>
            {temApiKey && (
              <div className="flex items-center gap-2 px-3 py-1 bg-tertiary/10 rounded-full">
                <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                <span className="text-[10px] font-bold text-tertiary uppercase tracking-wider">Ativo</span>
              </div>
            )}
          </div>

          <div className="relative">
            <input
              className="w-full bg-surface-highest border-none rounded-lg px-4 py-4 text-foreground font-mono text-sm focus:ring-2 focus:ring-primary transition-all pr-12"
              type={showKey ? "text" : "password"}
              placeholder={temApiKey ? "••••••••••••• (já configurada)" : "Cole sua API key aqui"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <button type="button" onClick={() => setShowKey(!showKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:bg-primary/10 p-2 rounded-md transition-colors">
              {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="mt-4 flex justify-between items-center font-sans">
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Info className="w-4 h-4" />
              Pegue sua chave em aistudio.google.com/apikey
            </span>
          </div>
        </section>

        {/* Save Button */}
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-sora font-bold py-4 rounded-full shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Salvar Configurações</>}
        </button>
      </form>

      {/* Products Section */}
      <div className="mt-12 space-y-8">
        <div>
          <h3 className="font-sora text-2xl font-bold text-foreground mb-2">Produtos</h3>
          <p className="text-muted-foreground font-sans">Cadastre seus produtos para a IA sugerir ofertas personalizadas.</p>
        </div>

        {/* Toggle Tipo */}
        <div className="flex bg-surface-highest p-1.5 rounded-full shadow-inner w-fit">
          <button type="button" onClick={() => setTipoFoco("low_ticket")} className={`px-6 py-2.5 rounded-full text-sm font-bold font-sora transition-all duration-300 ${tipoFoco === "low_ticket" ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:bg-surface-low/50"}`}>
            Low Ticket
          </button>
          <button type="button" onClick={() => setTipoFoco("high_ticket")} className={`px-6 py-2.5 rounded-full text-sm font-bold font-sora transition-all duration-300 ${tipoFoco === "high_ticket" ? "bg-secondary text-primary-foreground shadow-lg" : "text-muted-foreground hover:bg-surface-low/50"}`}>
            High Ticket
          </button>
        </div>

        {/* Product List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {produtos.filter(p => p.tipo === tipoFoco).map((produto) => (
            <div key={produto.id} className="bg-surface-low p-5 rounded-lg border border-outline-variant/10 flex justify-between items-start group">
              <div>
                {tipoFoco === "low_ticket" ? <Gauge className="text-primary w-5 h-5 mb-2" /> : <Gem className="text-secondary w-5 h-5 mb-2" />}
                <h4 className={`font-sora font-semibold ${tipoFoco === "low_ticket" ? "text-primary" : "text-secondary"}`}>{produto.nome}</h4>
                {produto.descricao && <p className="text-xs text-muted-foreground mt-1 leading-relaxed font-sans">{produto.descricao}</p>}
              </div>
              <button onClick={() => handleDeleteProduto(produto.id)} className="opacity-0 group-hover:opacity-100 text-destructive p-1 hover:bg-destructive/10 rounded-full transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Product Form */}
        <div className="bg-surface-low p-6 rounded-xl border border-dashed border-outline-variant/30">
          <h4 className="font-sora font-bold text-foreground mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5" /> Adicionar {tipoFoco === "low_ticket" ? "Low Ticket" : "High Ticket"}
          </h4>
          <div className="flex flex-col gap-3">
            <input
              className="w-full bg-card border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary transition-all text-foreground placeholder:text-muted-foreground/60 font-sans"
              placeholder="Nome do produto"
              value={novoProdutoNome}
              onChange={(e) => setNovoProdutoNome(e.target.value)}
            />
            <input
              className="w-full bg-card border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary transition-all text-foreground placeholder:text-muted-foreground/60 font-sans"
              placeholder="Descrição (opcional)"
              value={novoProdutoDesc}
              onChange={(e) => setNovoProdutoDesc(e.target.value)}
            />
            <button
              type="button"
              onClick={() => { setNovoProdutoTipo(tipoFoco); handleAddProduto(); }}
              disabled={addingProduto || !novoProdutoNome.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-sora font-bold py-3 rounded-full transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {addingProduto ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4" /> Adicionar</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
