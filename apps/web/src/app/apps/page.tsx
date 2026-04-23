import Image from "next/image";
import { BetaAppCard } from "../../components/site/BetaAppCard";

export default function AppsPage() {
  const WHATS =
    process.env.NEXT_PUBLIC_WHATSAPP_TESTS_URL ||
    "https://chat.whatsapp.com/K1cepLtEEoY6pScVRTNvg9";

  const TODO_PROD =
    process.env.NEXT_PUBLIC_TODO_GOOGLEPLAY_PROD_URL ||
    "https://play.google.com/store/apps/details?id=com.lucasamaral.todolistrevvos";

  const TODO_VIDEO_URL =
    process.env.NEXT_PUBLIC_TODO_YOUTUBE_URL ||
    "https://www.youtube.com/shorts/0wluel6Rm6w";

  return (
    <main className="mx-auto max-w-6xl space-y-10 px-4 py-10">
      <section className="rounded-[2rem] border border-emerald-100 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_45%),linear-gradient(180deg,_#f7fffb_0%,_#ffffff_100%)] p-6 shadow-sm md:p-8">
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-end">
          <div className="space-y-4">
            <span className="inline-flex items-center rounded-full border border-emerald-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">
              Trevvos Soluções em IA
            </span>

            <h1 className="max-w-3xl text-3xl font-semibold leading-tight md:text-5xl">
              Produtos e experiências em IA aplicados ao mundo real.
            </h1>

            <p className="max-w-2xl text-sm text-neutral-700 md:text-base">
              Nossa linha de produtos está sendo construída em duas frentes
              complementares: <strong>IA aplicada</strong>, para resolver
              problemas reais de operação, produtividade e decisão, e{" "}
              <strong>produtos com IA no centro</strong>, criados para nascer,
              aprender e evoluir com inteligência embarcada.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-1">
            <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Frente 01
              </div>
              <div className="mt-2 text-lg font-semibold text-neutral-900">
                IA aplicada
              </div>
              <p className="mt-1 text-sm text-neutral-600">
                Soluções voltadas para produtividade, análise, automação e
                execução com impacto prático.
              </p>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Frente 02
              </div>
              <div className="mt-2 text-lg font-semibold text-neutral-900">
                Produtos com IA
              </div>
              <p className="mt-1 text-sm text-neutral-600">
                Apps, pilotos e produtos proprietários em validação contínua e
                evolução real.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid items-center gap-10 md:grid-cols-2">
        <div className="space-y-4">
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            Produto já publicado
          </span>

          <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
            To-do List Trevvos
          </h2>

          <p className="text-sm text-neutral-600 md:text-base">
            Um produto já publicado dentro do ecossistema Trevvos. O To-do List
            nasce com uma proposta direta: organizar tarefas com leveza,
            clareza e baixa fricção, reforçando nossa visão de software útil,
            enxuto e pronto para uso real.
          </p>

          <ul className="space-y-1 text-sm text-neutral-700">
            <li>• Experiência simples e objetiva</li>
            <li>• Criação e reorganização rápida de tarefas</li>
            <li>• Produto leve, claro e fácil de adotar</li>
          </ul>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href={TODO_PROD}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700"
            >
              Baixar na Google Play
            </a>

            <a
              href={TODO_VIDEO_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-lg border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
            >
              Assistir demonstração
            </a>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="relative max-w-[260px]">
            <div className="absolute inset-0 scale-110 rounded-3xl bg-emerald-200/40 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-md">
              <Image
                src="/trevvos/todolist-screen.jpeg"
                alt="Tela do app To-do List Trevvos"
                width={400}
                height={800}
                className="h-auto w-full object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <header>
          <h2 className="text-xl font-semibold">Linha de produtos e pilotos</h2>
          <p className="text-sm text-neutral-600">
            O ecossistema Trevvos está em expansão. Aqui reunimos produtos já
            publicados, pilotos em validação e novas apostas que refletem nossa
            visão de IA aplicada, software útil e evolução contínua.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4">
          <BetaAppCard
            name="KM One (motoristas de app)"
            summary="Plataforma em validação para ajudar motoristas a acompanhar ganhos, km rodado, metas e desempenho com mais inteligência operacional. Um piloto estratégico da nossa frente de IA aplicada."
            status="BETA FECHADO"
            primaryCta={{
              label: "Entrar no Canal (WhatsApp)",
              href: WHATS,
            }}
            secondaryCta={{
              label: "Landing do KM One",
              href: "https://kmone.trevvos.com.br",
            }}
          />
        </div>
      </section>
    </main>
  );
}