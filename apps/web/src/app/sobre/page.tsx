export const dynamic = "force-dynamic";

export default function SobrePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Sobre a Trevvos</h1>

      <p className="mt-4 text-neutral-700 leading-relaxed">
        A <strong>Trevvos</strong> nasceu como um estúdio de produto e conteúdo
        digital. Nosso propósito é simples: transformar conhecimento em
        ferramentas úteis, e ferramentas em experiências que melhoram o dia a
        dia das pessoas.
      </p>

      <p className="mt-4 text-neutral-700 leading-relaxed">
        Começamos escrevendo sobre tecnologia, finanças e saúde, sempre com viés
        prático e zero enrolação. Aos poucos, esse conteúdo se tornou um terreno
        fértil para criar aplicativos próprios — soluções reais para problemas
        que identificamos na vida cotidiana.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">O que publicamos</h2>
          <p className="mt-2 text-sm text-neutral-600">
            Notícias, análises e artigos que ajudam você a entender e aplicar o
            que importa em tecnologia, finanças pessoais e saúde. Conteúdo
            direto, sem ruído.
          </p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Nosso ecossistema</h2>
          <p className="mt-2 text-sm text-neutral-600">
            <strong>KM One</strong>, para motoristas de app controlarem ganhos e
            despesas; <strong>ControlLar</strong>, um gestor de finanças
            pessoais; e <strong>SportsConnect</strong>, que conecta pessoas
            através do esporte. Produtos que crescem lado a lado com o portal.
          </p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm sm:col-span-2">
          <h2 className="text-lg font-semibold">Nossa visão</h2>
          <p className="mt-2 text-sm text-neutral-600">
            Acreditamos que conteúdo e tecnologia se complementam. O conteúdo
            educa, inspira e direciona. A tecnologia executa, simplifica e
            amplia o impacto. Unindo os dois, queremos criar soluções acessíveis
            e sustentáveis que empoderem pessoas no Brasil e no mundo.
          </p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm sm:col-span-2">
          <h2 className="text-lg font-semibold">Nossos valores</h2>
          <ul className="mt-2 list-disc list-inside text-sm text-neutral-600 space-y-1">
            <li>
              <strong>Praticidade</strong>: o que fazemos precisa ser útil.
            </li>
            <li>
              <strong>Transparência</strong>: falamos sem rodeios.
            </li>
            <li>
              <strong>Inovação</strong>: exploramos novas ideias sem medo.
            </li>
            <li>
              <strong>Comunidade</strong>: crescemos junto com quem usa e apoia
              nossos projetos.
            </li>
          </ul>
        </div>
      </div>

      <p className="mt-10 text-neutral-700 leading-relaxed">
        A Trevvos é, acima de tudo, um espaço vivo. Um portal de conteúdos e
        aplicativos que se transformam com o tempo — assim como as pessoas que
        fazem parte dele.
      </p>
    </main>
  );
}
