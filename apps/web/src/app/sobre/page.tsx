export const dynamic = "force-dynamic";

export default function SobrePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Sobre a Trevvos</h1>
      <p className="mt-4 text-neutral-700">
        Somos um estúdio de produto + conteúdo. Escrevemos o que usamos e
        lançamos apps que resolvem problemas do dia a dia.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <h2 className="text-lg font-semibold">O que publicamos</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Tecnologia, finanças pessoais e saúde — com viés prático, zero
            enrolação.
          </p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <h2 className="text-lg font-semibold">Ecossistema</h2>
          <p className="mt-1 text-sm text-neutral-600">
            KM One, ControlLar e SportsConnect — apps nascendo de conteúdo vivo.
          </p>
        </div>
      </div>
    </main>
  );
}
