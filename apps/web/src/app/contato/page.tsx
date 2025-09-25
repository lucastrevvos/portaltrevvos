// apps/web/src/app/contato/page.tsx
export const dynamic = "force-dynamic";

const EMAIL = "contato@trevvos.com.br";
const WHATS = "5511945043408";

export default function ContatoPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Contato</h1>
      <p className="mt-4 text-neutral-700">
        Fala com a gente por email ou WhatsApp. Resposta humana, sem bot.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={`mailto:${EMAIL}`}
          className="rounded-xl border border-neutral-200 px-4 py-2 hover:bg-neutral-50"
        >
          Mandar email
        </a>
        <a
          href={`https://wa.me/${WHATS}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
        >
          Falar no WhatsApp
        </a>
      </div>

      <p className="mt-6 text-sm text-neutral-500">
        Preferir formulário? A gente libera em breve.
      </p>
    </main>
  );
}
