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
    <main className="mx-auto max-w-6xl px-4 py-10 space-y-10">
      {/* HERO – TO-DO LIST TREVVOS */}
      <section className="grid items-center gap-10 md:grid-cols-2">
        {/* Texto + CTAs */}
        <div className="space-y-4">
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            🍀 Primeiro app oficial Trevvos
          </span>

          <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
            To-do List Trevvos
          </h1>

          <p className="text-sm text-neutral-600 md:text-base">
            Um app minimalista de tarefas, rápido e direto, feito para você
            organizar o dia com leveza. Sem distrações, sem complicação — apenas
            o essencial: anotar, concluir e seguir em frente.
          </p>

          <ul className="space-y-1 text-sm text-neutral-700">
            <li>• Interface simples e bonita</li>
            <li>• Adição e reordenação rápida de tarefas</li>
            <li>• Tudo salvo localmente, direto no seu aparelho</li>
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
              Assistir vídeo de demonstração
            </a>
          </div>
        </div>

        {/* Mockup do app */}
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

      {/* LISTA DE APPS (cards) */}
      <section className="space-y-4">
        <header>
          <h2 className="text-xl font-semibold">Ecossistema Trevvos</h2>
          <p className="text-sm text-neutral-600">
            O ecossistema Trevvos está crescendo — começamos simples, mas
            estamos construindo algo grande, um app por vez.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4">
          {/* KM One */}
          <BetaAppCard
            name="KM One (motoristas de app)"
            summary="A ferramenta para motoristas de aplicativo controlarem ganhos, km rodado e metas diárias com clareza."
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
