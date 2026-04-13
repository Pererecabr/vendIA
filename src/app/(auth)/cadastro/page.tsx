"use client";

import { Mail, Lock, ArrowRight, User, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function CadastroPage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao criar conta");
        return;
      }

      // Auto-login after registration
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      if (loginRes.ok) {
        router.push("/configuracoes");
      } else {
        router.push("/login");
      }
    } catch {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-surface text-foreground flex min-h-screen items-center justify-center p-6">
      <div className="relative w-full max-w-md">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>

        <main className="relative bg-card rounded-3xl p-8 md:p-12 shadow-[0_24px_48px_-12px_rgba(19,27,46,0.08)] border border-outline-variant/15">
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-3xl font-sora font-extrabold tracking-tight text-primary mb-2">Criar Conta</h1>
            <p className="text-muted-foreground font-sans font-medium">
              Junte-se ao VendaIA e comece a transformar seus leads em vendas com IA.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-xl text-sm font-sans font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="block text-xs font-sora font-bold text-muted-foreground tracking-wider uppercase ml-1" htmlFor="nome">Nome Completo</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input className="w-full bg-surface-low border-none rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:bg-card transition-all duration-200 text-foreground placeholder:text-muted-foreground/60 font-sans" id="nome" placeholder="Seu nome" type="text" required value={nome} onChange={(e) => setNome(e.target.value)} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-sora font-bold text-muted-foreground tracking-wider uppercase ml-1" htmlFor="email">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input className="w-full bg-surface-low border-none rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:bg-card transition-all duration-200 text-foreground placeholder:text-muted-foreground/60 font-sans" id="email" placeholder="name@company.com" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-sora font-bold text-muted-foreground tracking-wider uppercase ml-1" htmlFor="password">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input className="w-full bg-surface-low border-none rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:bg-card transition-all duration-200 text-foreground placeholder:text-muted-foreground/60 font-sans" id="password" placeholder="Mínimo 8 caracteres" type="password" required minLength={8} value={senha} onChange={(e) => setSenha(e.target.value)} />
              </div>
            </div>

            <button disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-sora font-bold py-4 rounded-full shadow-lg shadow-primary/20 transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2 disabled:opacity-60" type="submit">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Criar Conta <ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-outline-variant/10 text-center">
            <p className="text-muted-foreground font-sans">
              Já tem uma conta? <Link className="text-primary font-sora font-bold ml-1 hover:underline decoration-2 underline-offset-4" href="/login">Fazer login</Link>
            </p>
          </div>
        </main>

        <footer className="mt-8 text-center">
          <div className="flex items-center justify-center gap-6 text-muted-foreground text-xs font-medium tracking-wide">
            <Link className="hover:text-foreground transition-colors" href="#">Política de Privacidade</Link>
            <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
            <Link className="hover:text-foreground transition-colors" href="#">Termos de Serviço</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
