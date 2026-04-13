import { FileText, Anchor, HelpCircle, CheckCircle2, Copy, TrendingUp } from "lucide-react";

export default function AnalisePage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 pb-32 w-full overflow-y-auto">
      {/* Editorial Header */}
      <div className="mb-12">
        <span className="text-primary font-sora font-bold tracking-widest text-xs uppercase">ANÁLISE INTELIGENTE</span>
        <h2 className="font-sora text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mt-2 mb-4">Fluxo Estratégico de Conversa</h2>
        <p className="text-muted-foreground max-w-2xl text-lg font-sans leading-relaxed">
          Decodificamos a negociação atual. Abaixo estão os blocos contextuais projetados para levar o acordo a um fechamento bem-sucedido.
        </p>
      </div>

      {/* The Focus Stream */}
      <div className="space-y-8">
        {/* BLUE: Reading/Context */}
        <section className="group relative bg-surface-low rounded-xl p-8 transition-all hover:bg-muted/40 duration-300 border-l-[6px] border-primary">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <FileText className="text-primary w-5 h-5" />
              <span className="font-sora font-bold text-primary text-sm">LEITURA / CONTEXTO</span>
            </div>
            <button className="bg-surface-highest text-foreground p-2 rounded-full hover:scale-105 transition-transform flex items-center gap-2 px-4 text-xs font-sora font-bold">
              <Copy className="w-4 h-4" /> COPIAR
            </button>
          </div>
          <h3 className="font-sora text-2xl font-bold mb-3">Alinhamento Fundamental</h3>
          <p className="font-sans text-muted-foreground leading-relaxed text-lg italic">
            {`"Com base em nossa conversa anterior sobre os desafios de escalabilidade em suas operações regionais na APAC, está claro que o principal gargalo não é apenas a capacidade, mas a sincronização de dados em tempo real entre seus sistemas legados isolados."`}
          </p>
        </section>

        {/* PURPLE: Anchoring/Value */}
        <section className="group relative bg-surface-low rounded-xl p-8 transition-all hover:bg-muted/40 duration-300 border-l-[6px] border-secondary">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <Anchor className="text-secondary w-5 h-5" />
              <span className="font-sora font-bold text-secondary text-sm">ANCORAGEM / VALOR</span>
            </div>
            <button className="bg-surface-highest text-foreground p-2 rounded-full hover:scale-105 transition-transform flex items-center gap-2 px-4 text-xs font-sora font-bold">
              <Copy className="w-4 h-4" /> COPIAR
            </button>
          </div>
          <h3 className="font-sora text-2xl font-bold mb-3">O Prêmio de Eficiência</h3>
          <p className="font-sans text-muted-foreground leading-relaxed text-lg">
            Ao implementar a estrutura VendaIA Pro, você não está apenas adquirindo um software; você está garantindo uma <span className="text-secondary font-bold">redução de 34% nos erros de entrada manual de dados</span> e recuperando aproximadamente 120 horas-homem por mês.
          </p>
        </section>

        {/* AMBER: Questions/Objections */}
        <section className="group relative bg-surface-low rounded-xl p-8 transition-all hover:bg-muted/40 duration-300 border-l-[6px] border-amber-500">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="text-amber-500 w-5 h-5" />
              <span className="font-sora font-bold text-amber-500 text-sm">DÚVIDA / ATRIÇÃO</span>
            </div>
            <button className="bg-surface-highest text-foreground p-2 rounded-full hover:scale-105 transition-transform flex items-center gap-2 px-4 text-xs font-sora font-bold">
              <Copy className="w-4 h-4" /> COPIAR
            </button>
          </div>
          <h3 className="font-sora text-2xl font-bold mb-3">Abordando Cronogramas de Implementação</h3>
          <p className="font-sans text-muted-foreground leading-relaxed text-lg">
            {`"Eu entendo sua preocupação com o lançamento do terceiro trimestre. Se priorizássemos o módulo de sincronização em vez do painel de análise, isso aliviaria as preocupações imediatas de largura de banda da sua equipe durante a fase de transição?"`}
          </p>
        </section>

        {/* GREEN: Offer/Closing */}
        <section className="group relative bg-surface-low rounded-xl p-8 transition-all hover:bg-muted/40 duration-300 border-l-[6px] border-tertiary">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-tertiary w-5 h-5" />
              <span className="font-sora font-bold text-tertiary text-sm">OFERTA / CONVERSÃO</span>
            </div>
            <button className="bg-surface-highest text-foreground p-2 rounded-full hover:scale-105 transition-transform flex items-center gap-2 px-4 text-xs font-sora font-bold">
              <Copy className="w-4 h-4" /> COPIAR
            </button>
          </div>
          <h3 className="font-sora text-2xl font-bold mb-3">A Proposta de Via Rápida</h3>
          <div className="p-6 bg-tertiary/10 rounded-lg mb-4">
            <p className="font-sans text-tertiary leading-relaxed text-lg font-bold">
              {`"Se assinarmos o Contrato de Prestação de Serviços até sexta-feira, posso incluir o pacote de Migração Assistida sem custo adicional, garantindo que sua equipe esteja totalmente operacional até o início do próximo trimestre."`}
            </p>
          </div>
        </section>
      </div>

      {/* Asymmetric Insight Grid */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-primary p-10 rounded-3xl text-primary-foreground relative overflow-hidden">
          <div className="relative z-10">
            <h4 className="font-sora text-3xl font-bold mb-4">Sentimento da Conversa: Altamente Positivo</h4>
            <p className="font-sans text-primary-foreground/80 text-lg">
              O cliente potencial está usando &ldquo;Quando&rdquo; em vez de &ldquo;Se&rdquo;. Recomendação: Transição para o bloco de fechamento verde nos próximos 5 minutos de diálogo.
            </p>
          </div>
          <div className="absolute right-4 bottom-4 opacity-10">
            <TrendingUp className="w-48 h-48" />
          </div>
        </div>
        <div className="bg-surface-highest p-10 rounded-3xl flex flex-col justify-center">
          <span className="font-sora text-5xl font-extrabold text-primary mb-2">92%</span>
          <p className="font-sora font-bold text-foreground tracking-tight">Probabilidade de Fechamento</p>
          <p className="text-sm text-muted-foreground mt-2 font-sans">Maior correspondência histórica para este setor da indústria.</p>
        </div>
      </div>
    </div>
  );
}
