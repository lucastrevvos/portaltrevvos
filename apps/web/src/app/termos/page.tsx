export const dynamic = "force-dynamic";

export const metadata = {
  title: "Termos de Uso — Trevvos",
  description:
    "Regras de uso do portal e dos aplicativos do ecossistema Trevvos.",
  alternates: { canonical: "/termos" },
};

const EMAIL = "contato@trevvos.com.br";

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
    <main className="mx-auto max-w-3xl px-4 py-12 prose prose-neutral">
      <h1 className="text-emerald-700">📜 Termos de Uso</h1>
      <p className="text-sm text-neutral-500">
        Última atualização: {formatDate()}
      </p>

      <p>
        Ao usar o portal e os apps do <strong>Trevvos</strong>, você concorda
        com estes Termos.
      </p>

      <h2 className="text-emerald-700">✅ 1. Uso aceitável</h2>
      <ul>
        <li>Não viole leis ou direitos de terceiros.</li>
        <li>Não faça spam, scraping abusivo ou invasão.</li>
        <li>Respeite a comunidade.</li>
      </ul>

      <h2 className="text-emerald-700">🔐 2. Conta e segurança</h2>
      <p>Você é responsável por suas credenciais e atividades.</p>

      <h2 className="text-emerald-700">📝 3. Conteúdo</h2>
      <ul>
        <li>
          <strong>Nosso</strong>: protegido por direitos autorais.
        </li>
        <li>
          <strong>Seu</strong>: você mantém direitos; nos concede licença.
        </li>
      </ul>

      <h2 className="text-emerald-700">📱 4. Apps</h2>
      <p>São ferramentas informativas; uso é por sua conta e risco.</p>

      <h2 className="text-emerald-700">⚠️ 5. Limitação</h2>
      <p>Sem responsabilidade por danos indiretos ou lucros cessantes.</p>

      <h2 className="text-emerald-700">🔄 6. Modificações</h2>
      <p>Podemos alterar políticas, Termos e funcionalidades.</p>

      <h2 className="text-emerald-700">🚪 7. Encerramento</h2>
      <p>Contas que violarem os Termos podem ser suspensas.</p>

      <h2 className="text-emerald-700">⚖️ 8. Legislação</h2>
      <p>Aplicam-se leis brasileiras. Foro: São Paulo/SP.</p>

      <h2 className="text-emerald-700">📩 9. Contato</h2>
      <p>
        Dúvidas?{" "}
        <a
          href={`mailto:${EMAIL}`}
          className="text-emerald-600 hover:underline"
        >
          {EMAIL}
        </a>
      </p>

      <hr />
    </main>
  );
}
