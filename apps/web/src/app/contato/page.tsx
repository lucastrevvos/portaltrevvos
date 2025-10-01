// apps/web/src/app/contato/page.tsx
export const dynamic = "force-dynamic";

const EMAIL = "contato@trevvos.com.br";
const WHATS = "5511945043408";

export default function ContatoPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Contato</h1>

      <p className="mt-4 text-neutral-700 leading-relaxed">
        Quer falar com a gente? Seja para tirar dúvidas, propor parcerias ou
        simplesmente dar um alô — estamos abertos a ouvir. Resposta humana, sem
        bot.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={`mailto:contato@trevvos.com.br`}
          className="rounded-xl border border-neutral-200 px-4 py-2 hover:bg-neutral-50"
        >
          Mandar email
        </a>
        <a
          href={`https://wa.me/5511945043408`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
        >
          Falar no WhatsApp
        </a>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Atendimento</h2>
          <p className="mt-2 text-sm text-neutral-600">
            De segunda a sexta, das 9h às 18h. Fora desses horários a gente
            tenta responder assim que possível.
          </p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Sugestões e ideias</h2>
          <p className="mt-2 text-sm text-neutral-600">
            Se tem um tema que gostaria de ver no portal ou uma funcionalidade
            nova para os apps, compartilhe com a gente. O ecossistema Trevvos
            cresce junto com a comunidade.
          </p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm sm:col-span-2">
          <h2 className="text-lg font-semibold">Formulário</h2>
          <p className="mt-2 text-sm text-neutral-600">
            Em breve você vai poder mandar sua mensagem direto por aqui.
            Enquanto isso, use email ou WhatsApp — são os jeitos mais rápidos de
            falar com a gente.
          </p>
        </div>
      </div>

      <p className="mt-10 text-neutral-700 leading-relaxed">
        Não importa o canal: queremos que a comunicação seja simples, prática e
        transparente. <strong>Fale com a Trevvos</strong>, estamos do outro lado
        da tela.
      </p>
    </main>
  );
}
