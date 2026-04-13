"use client";

import Link from "next/link";
import { Rocket, Home, History, Settings, LogOut, Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/dashboard", label: "Início", icon: Home },
    { href: "/historico", label: "Histórico", icon: History },
    { href: "/configuracoes", label: "Configurações", icon: Settings },
  ];

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <div className="bg-surface font-sans text-foreground overflow-hidden">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/40 z-[55] md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Desktop/Mobile Navigation Drawer */}
      <aside className={`fixed inset-y-0 left-0 z-[60] flex flex-col p-6 h-full w-72 bg-surface shadow-2xl rounded-r-3xl transition-transform duration-300 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <div className="flex items-center justify-between mb-10 px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-sora font-bold text-primary">VendaIA</h1>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Intelligent Canvas</p>
            </div>
          </div>
          <button className="md:hidden text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 font-sora font-semibold ${
                  active
                    ? "text-primary bg-primary/10 translate-x-1"
                    : "text-muted-foreground hover:bg-surface-low"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-outline-variant/15">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3 rounded-lg transition-colors duration-200 font-sora font-semibold text-muted-foreground hover:bg-destructive/10 hover:text-destructive w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-72 flex flex-col h-screen relative bg-surface">
        {/* Top App Bar */}
        <header className="w-full top-0 sticky z-50 flex items-center justify-between px-6 h-16 bg-surface">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 text-muted-foreground" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="font-sora font-bold tracking-tight text-xl text-primary">
              {navItems.find(n => pathname.startsWith(n.href))?.label || "VendaIA"}
            </h2>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
