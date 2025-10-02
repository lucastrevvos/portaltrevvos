import { BetaAppCard } from "../../components/site/BetaAppCard";

export default function AppsPage() {
  const WHATS =
    process.env.NEXT_PUBLIC_WHATSAPP_TESTS_URL ||
    "https://chat.whatsapp.com/K1cepLtEEoY6pScVRTNvg9";
  const TODO_BETA =
    process.env.NEXT_PUBLIC_TODO_GOOGLEPLAY_BETA_URL ||
    "https://play.google.com/store/apps/details?id=com.lucasamaral.todolistrevvos";

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <section className="space-y-4">
        <header>
          <h1 className="text-2xl font-semibold">Nossos Apps</h1>
          <p className="text-sm text-neutral-600">
            Participe dos testes e ajude a moldar o que vai para produção.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4">
          <BetaAppCard
            name="ToDo List Trevvos"
            summary="App minimalista de tarefas. Para participar do BETA FECHADO, é necessário entrar primeiro no Canal de Testes (WhatsApp). Lá pediremos o e-mail da sua conta Google Play para liberar o acesso."
            status="BETA FECHADO"
            primaryCta={{
              label: "Participar do BETA (Google Play)",
              href: TODO_BETA,
            }}
            secondaryCta={{ label: "Canal de Testes (WhatsApp)", href: WHATS }}
          />

          <BetaAppCard
            name="KM One (motoristas de app)"
            summary="Controle de ganhos, km e metas diárias para Uber/99. Entre no Canal Oficial para receber convites de teste."
            status="BETA FECHADO"
            primaryCta={{ label: "Entrar no Canal (WhatsApp)", href: WHATS }}
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
