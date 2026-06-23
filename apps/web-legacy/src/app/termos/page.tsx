export const dynamic = "force-dynamic";

export const metadata = {
  title: "Termos de Uso — Trevvos",
  description:
    "Regras de uso do portal e dos aplicativos do ecossistema Trevvos.",
  alternates: { canonical: "/termos" },
};

const EMAIL = "ceo@trevvos.com.br";

function formatDate(d = new Date()) {
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(d);
  } catch {
    return "—";
  }
}

export default function TermosPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-emerald-700">
          Termos de Uso
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Última atualização: {formatDate()}
        </p>
      </header>

      <section className="space-y-8 text-neutral-700 leading-relaxed">
        <p>
          Ao acessar ou utilizar o portal e os aplicativos do{" "}
          <strong>Trevvos</strong>, você declara estar de acordo com os termos e
          condições estabelecidos neste documento.
        </p>

        <div>
          <h2 className="text-xl font-semibold text-emerald-700">
            1. Uso aceitável
          </h2>
          <ul className="mt-2 list-disc list-inside space-y-1 text-sm">
            <li>Não viole leis ou direitos de terceiros.</li>
            <li>
              Não utilize os serviços para spam, scraping abusivo ou invasão.
            </li>
            <li>Respeite os demais usuários e a comunidade.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-emerald-700">
            2. Conta e segurança
          </h2>
          <p className="mt-2 text-sm">
            O usuário é responsável por manter a confidencialidade de suas
            credenciais e por todas as atividades realizadas em sua conta.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-emerald-700">
            3. Conteúdo
          </h2>
          <ul className="mt-2 list-disc list-inside space-y-1 text-sm">
            <li>
              <strong>Conteúdo do Trevvos</strong>: protegido por direitos
              autorais e outras legislações aplicáveis.
            </li>
            <li>
              <strong>Conteúdo do usuário</strong>: os direitos permanecem com o
              autor, mas ao publicar concede licença de uso ao Trevvos para
              exibição e distribuição.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-emerald-700">4. Apps</h2>
          <p className="mt-2 text-sm">
            Os aplicativos disponibilizados são ferramentas informativas e de
            apoio. O uso é de responsabilidade exclusiva do usuário.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-emerald-700">
            5. Limitação de responsabilidade
          </h2>
          <p className="mt-2 text-sm">
            O Trevvos não se responsabiliza por danos indiretos, perda de dados
            ou lucros cessantes decorrentes do uso dos serviços.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-emerald-700">
            6. Alterações
          </h2>
          <p className="mt-2 text-sm">
            Estes Termos podem ser modificados a qualquer momento. As mudanças
            passam a valer a partir da publicação no portal.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-emerald-700">
            7. Encerramento
          </h2>
          <p className="mt-2 text-sm">
            O Trevvos se reserva o direito de suspender ou encerrar contas que
            violem estes Termos.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-emerald-700">
            8. Legislação aplicável
          </h2>
          <p className="mt-2 text-sm">
            Estes Termos são regidos pelas leis brasileiras. O foro eleito para
            resolução de conflitos é o da comarca de São Paulo/SP.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-emerald-700">9. Contato</h2>
          <p className="mt-2 text-sm">
            Em caso de dúvidas, entre em contato pelo e-mail{" "}
            <a
              href={`mailto:${EMAIL}`}
              className="text-emerald-600 hover:underline"
            >
              {EMAIL}
            </a>
            .
          </p>
        </div>
      </section>

      <hr className="mt-12 border-neutral-200" />
    </main>
  );
}
