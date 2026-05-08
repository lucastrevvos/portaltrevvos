import {
  ArrowUpRight,
  CreditCard,
  Lightbulb,
  PanelLeft,
  PenSquare,
  ScanSearch,
} from "lucide-react";

const cards = [
  {
    title: "Onboarding",
    description:
      "Estruture posicionamento, nicho, tom, ativos e referencias da marca.",
    icon: ScanSearch,
  },
  {
    title: "Ideias de conteudo",
    description:
      "Espaco preparado para pilares, backlog editorial e futuras sugestoes por IA.",
    icon: Lightbulb,
  },
  {
    title: "Pedidos",
    description:
      "Central de solicitacoes, aprovacao textual e acompanhamento de producao.",
    icon: PenSquare,
  },
  {
    title: "Creditos",
    description:
      "Arquitetura pronta para wallet, consumo por acao e recargas futuras.",
    icon: CreditCard,
  },
];

export default function StudioAppPage() {
  return (
    <main className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-7xl gap-4 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--card-strong)] p-6 shadow-[0_24px_64px_rgba(24,24,27,0.08)] backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[color:var(--foreground)] text-white">
              <PanelLeft className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
                Dashboard
              </p>
              <h1 className="font-[family-name:var(--font-display)] text-2xl">
                Trevvos Studio
              </h1>
            </div>
          </div>

          <nav className="mt-10 space-y-3">
            {["Visao geral", "Onboarding", "Pedidos", "Entregas", "Creditos"].map(
              (item, index) => (
                <div
                  key={item}
                  className={`rounded-2xl px-4 py-3 text-sm ${
                    index === 0
                      ? "bg-[color:var(--foreground)] text-white"
                      : "border border-[color:var(--border)] bg-white/60 text-[color:var(--ink-soft)]"
                  }`}
                >
                  {item}
                </div>
              ),
            )}
          </nav>

          <div className="mt-10 rounded-[1.75rem] bg-[#201a17] p-5 text-white">
            <p className="text-xs uppercase tracking-[0.16em] text-white/50">
              Status do MVP
            </p>
            <p className="mt-3 text-lg font-semibold">
              Operacao concierge com aprovacao em duas etapas.
            </p>
            <p className="mt-3 text-sm leading-6 text-white/70">
              O fluxo inicial separa texto e visual para manter qualidade,
              previsibilidade e espaco para automacao futura.
            </p>
          </div>
        </aside>

        <section className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--card-strong)] p-6 shadow-[0_24px_64px_rgba(24,24,27,0.08)] backdrop-blur sm:p-8">
          <header className="flex flex-col gap-4 border-b border-[color:var(--border)] pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.16em] text-[color:var(--muted)]">
                Area logada
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-4xl leading-tight">
                Base inicial do dashboard
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--muted)]">
                Placeholder funcional para validar navegacao, linguagem visual e
                organizacao dos modulos principais do Studio.
              </p>
            </div>

            <div className="rounded-full border border-[color:var(--border)] bg-white/70 px-4 py-2 text-sm text-[color:var(--ink-soft)]">
              Fase 1: Concierge MVP
            </div>
          </header>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {cards.map(({ title, description, icon: Icon }) => (
              <article
                key={title}
                className="group rounded-[1.75rem] border border-[color:var(--border)] bg-white/75 p-5 transition hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(24,24,27,0.08)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--foreground)] text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-[color:var(--muted)] transition group-hover:text-[color:var(--accent)]" />
                </div>
                <h3 className="mt-6 text-2xl font-semibold text-[color:var(--foreground)]">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
