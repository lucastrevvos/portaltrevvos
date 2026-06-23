export const dynamic = "force-dynamic";

export default function SobrePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">
        Sobre a Trevvos Soluções em IA
      </h1>

      <p className="mt-4 leading-relaxed text-neutral-700">
        A <strong>Trevvos</strong> entra em uma nova fase como{" "}
        <strong>Trevvos Soluções em IA</strong>. Seguimos com nossa frente
        editorial, agora com um posicionamento mais claro: transformar
        conhecimento sobre inteligência artificial em conteúdo útil, produto e
        soluções aplicadas ao mundo real.
      </p>

      <p className="mt-4 leading-relaxed text-neutral-700">
        O site continua sendo um espaço de posts, mas com uma direção mais
        definida. Nosso conteúdo agora orbita IA aplicada, automação, produto,
        operação, negócio e tudo o que sustenta a construção de experiências e
        apps mais inteligentes.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">O que publicamos</h2>
          <p className="mt-2 text-sm text-neutral-600">
            Publicamos conteúdos sobre IA com foco prático: implementação,
            casos de uso, análise de ferramentas, operação, produtividade e os
            impactos reais da tecnologia no dia a dia de pessoas e negócios.
          </p>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Como construímos</h2>
          <p className="mt-2 text-sm text-neutral-600">
            Atuamos em duas frentes complementares:{" "}
            <strong>IA aplicada</strong>, com soluções voltadas a problemas
            concretos, e <strong>produtos com IA</strong>, com apps e
            experiências digitais que nascem com inteligência no centro.
          </p>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm sm:col-span-2">
          <h2 className="text-lg font-semibold">Nossa visão</h2>
          <p className="mt-2 text-sm text-neutral-600">
            Acreditamos que conteúdo e produto devem caminhar juntos. O
            conteúdo organiza o pensamento, compartilha contexto e acelera
            aprendizados. O produto leva isso para a prática. E a IA amplia a
            capacidade de criar, testar, evoluir e escalar os dois.
          </p>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm sm:col-span-2">
          <h2 className="text-lg font-semibold">Nossos valores</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-neutral-600">
            <li>
              <strong>Utilidade</strong>: IA só faz sentido quando gera valor de
              verdade.
            </li>
            <li>
              <strong>Clareza</strong>: comunicamos com objetividade, sem teatro
              e sem jargão desnecessário.
            </li>
            <li>
              <strong>Execução</strong>: preferimos lançar, medir, aprender e
              evoluir.
            </li>
            <li>
              <strong>Coerência</strong>: o que publicamos conversa com o que
              construímos.
            </li>
          </ul>
        </div>
      </div>

      <p className="mt-10 leading-relaxed text-neutral-700">
        A Trevvos Soluções em IA é um espaço vivo de conteúdo, produtos e
        experimentação contínua. Um ecossistema em evolução, guiado por
        tecnologia aplicada, visão de produto e valor real.
      </p>
    </main>
  );
}