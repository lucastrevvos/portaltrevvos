import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

const highlights = [
  "Onboarding guiado para posicionamento e tom de marca.",
  "Fluxo de aprovacao textual antes da producao visual.",
  "Operacao pronta para creditos, multi-tenant e automacoes futuras.",
];

export default function LandingPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 sm:px-10 lg:px-12">
        <header className="flex items-center justify-between py-4">
          <div className="rounded-full border border-[color:var(--border)] bg-white/65 px-4 py-2 text-sm font-medium text-[color:var(--ink-soft)] shadow-[0_12px_40px_rgba(24,24,27,0.06)] backdrop-blur">
            Trevvos Studio
          </div>
          <Link
            href="/app"
            className="rounded-full border border-[color:var(--border)] bg-[color:var(--card-strong)] px-5 py-2 text-sm font-semibold text-[color:var(--foreground)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(24,24,27,0.08)]"
          >
            Entrar no Studio
          </Link>
        </header>

        <section className="grid flex-1 items-center gap-16 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--card)] px-4 py-2 text-sm text-[color:var(--ink-soft)] shadow-[0_14px_44px_rgba(24,24,27,0.06)] backdrop-blur">
              <Sparkles className="h-4 w-4 text-[color:var(--accent)]" />
              Concierge MVP para operacao estrategica com IA
            </div>
            <h1 className="max-w-4xl font-[family-name:var(--font-display)] text-5xl leading-tight text-balance sm:text-6xl lg:text-7xl">
              Trevvos Studio
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[color:var(--muted)] sm:text-xl">
              Conteudo estrategico com IA para profissionais que precisam
              aparecer com autoridade.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/app"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--foreground)] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black"
              >
                Entrar no Studio
                <ArrowRight className="h-4 w-4" />
              </Link>
              <div className="inline-flex items-center rounded-full border border-[color:var(--border)] bg-[color:var(--card)] px-5 py-3 text-sm text-[color:var(--ink-soft)] backdrop-blur">
                Estrutura pronta para onboarding, pedidos e creditos.
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[color:var(--accent-soft)]/50 blur-3xl" />
            <div className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--card-strong)] p-6 shadow-[0_30px_80px_rgba(24,24,27,0.12)] backdrop-blur">
              <div className="rounded-[1.5rem] border border-[color:var(--border)] bg-[#1d1d1f] p-5 text-white">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/60">
                  <span>Workflow</span>
                  <span>Concierge MVP</span>
                </div>
                <div className="mt-8 grid gap-4">
                  {[
                    "Onboarding estrategico",
                    "Pedido de conteudo",
                    "Aprovacao de texto",
                    "Prompt visual operacional",
                    "Entrega final com upload",
                  ].map((step, index) => (
                    <div
                      key={step}
                      className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <p className="text-sm text-white/85">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                {highlights.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-[color:var(--border)] bg-white/70 px-4 py-4 text-sm leading-6 text-[color:var(--ink-soft)]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
