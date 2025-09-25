export const dynamic = "force-dynamic";

export const metadata = {
  title: "Política de Privacidade — Trevvos",
  description:
    "Como coletamos, usamos e protegemos seus dados no ecossistema Trevvos.",
  alternates: { canonical: "/politica" },
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

export default function PoliticaPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 prose prose-neutral">
      <h1 className="text-emerald-700">🔒 Política de Privacidade</h1>
      <p className="text-sm text-neutral-500">
        Última atualização: {formatDate()}
      </p>

      <p>
        Esta política descreve como o ecossistema <strong>Trevvos</strong>{" "}
        coleta, usa e protege suas informações ao acessar nosso portal e apps.
      </p>

      <h2 className="text-emerald-700">📊 1. Dados que coletamos</h2>
      <ul>
        <li>
          <strong>Conta</strong>: nome, e-mail.
        </li>
        <li>
          <strong>Conteúdo</strong>: textos/imagens enviados.
        </li>
        <li>
          <strong>Técnicos</strong>: IP, navegador, device.
        </li>
      </ul>

      <h2 className="text-emerald-700">⚙️ 2. Como usamos</h2>
      <ul>
        <li>Autenticação e sessão.</li>
        <li>Entrega de conteúdo.</li>
        <li>Newsletter (se assinada).</li>
        <li>Segurança e conformidade legal.</li>
      </ul>

      <h2 className="text-emerald-700">🍪 3. Cookies</h2>
      <p>
        Usamos cookies <em>estritamente necessários</em> (ex.:{" "}
        <code>accessToken</code>) para login e segurança.
      </p>

      <h2 className="text-emerald-700">⚖️ 4. Base legal</h2>
      <p>Execução de contrato, legítimo interesse e consentimento.</p>

      <h2 className="text-emerald-700">🛡️ 5. Retenção e segurança</h2>
      <p>Guardamos dados só pelo tempo necessário, com medidas de proteção.</p>

      <h2 className="text-emerald-700">🙋 6. Seus direitos</h2>
      <ul>
        <li>Acessar, corrigir, excluir.</li>
        <li>Revogar consentimento.</li>
        <li>Portabilidade.</li>
      </ul>
      <p>
        Exercício de direitos:{" "}
        <a
          href={`mailto:${EMAIL}`}
          className="text-emerald-600 hover:underline"
        >
          {EMAIL}
        </a>
      </p>

      <h2 className="text-emerald-700">🤝 7. Compartilhamento</h2>
      <p>Somente com provedores essenciais e sob contrato.</p>

      <h2 className="text-emerald-700">👶 8. Crianças</h2>
      <p>Conteúdo é geral; contato com responsável em caso de menores.</p>

      <h2 className="text-emerald-700">🔄 9. Mudanças</h2>
      <p>Podemos atualizar este documento; veja a data no topo.</p>

      <h2 className="text-emerald-700">📩 10. Contato</h2>
      <p>
        Fale com a gente:{" "}
        <a
          href={`mailto:${EMAIL}`}
          className="text-emerald-600 hover:underline"
        >
          {EMAIL}
        </a>
      </p>
    </main>
  );
}
