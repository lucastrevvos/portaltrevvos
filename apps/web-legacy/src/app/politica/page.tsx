export const dynamic = "force-dynamic";

export const metadata = {
  title: "Política de Privacidade — Trevvos",
  description:
    "Como coletamos, usamos e protegemos seus dados no ecossistema Trevvos.",
  alternates: { canonical: "/politica" },
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

export default function PoliticaPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-emerald-700">
          Política de Privacidade
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Última atualização: {formatDate()}
        </p>
      </header>

      <section className="space-y-8 text-neutral-700 leading-relaxed">
        <p>
          Esta Política descreve como o ecossistema <strong>Trevvos</strong>{" "}
          coleta, utiliza e protege suas informações ao acessar nosso portal e
          aplicativos.
        </p>

        <div>
          <h2 className="text-xl font-semibold text-emerald-700">
            1. Dados que coletamos
          </h2>
          <ul className="mt-2 list-disc list-inside space-y-1 text-sm">
            <li>
              <strong>Conta</strong>: nome e e-mail fornecidos no cadastro.
            </li>
            <li>
              <strong>Conteúdo</strong>: textos e imagens enviados por você.
            </li>
            <li>
              <strong>Técnicos</strong>: endereço IP, navegador e dispositivo
              utilizado.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-emerald-700">
            2. Como utilizamos os dados
          </h2>
          <ul className="mt-2 list-disc list-inside space-y-1 text-sm">
            <li>Gerenciar autenticação e sessões de usuários.</li>
            <li>Entregar e personalizar conteúdo.</li>
            <li>Enviar comunicações (quando o usuário opta por recebê-las).</li>
            <li>Garantir segurança e cumprir obrigações legais.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-emerald-700">3. Cookies</h2>
          <p className="mt-2 text-sm">
            Utilizamos apenas cookies estritamente necessários, como tokens de
            acesso, para autenticação e segurança.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-emerald-700">
            4. Base legal
          </h2>
          <p className="mt-2 text-sm">
            O tratamento de dados se baseia em execução de contrato, legítimo
            interesse e consentimento, conforme aplicável.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-emerald-700">
            5. Retenção e segurança
          </h2>
          <p className="mt-2 text-sm">
            Os dados são armazenados apenas pelo tempo necessário para atender
            às finalidades desta Política, com medidas de segurança adequadas
            para proteção contra acesso não autorizado.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-emerald-700">
            6. Seus direitos
          </h2>
          <ul className="mt-2 list-disc list-inside space-y-1 text-sm">
            <li>Acessar, corrigir ou excluir seus dados.</li>
            <li>Revogar consentimento previamente concedido.</li>
            <li>Solicitar portabilidade dos dados.</li>
          </ul>
          <p className="mt-2 text-sm">
            Para exercer seus direitos, entre em contato em{" "}
            <a
              href={`mailto:${EMAIL}`}
              className="text-emerald-600 hover:underline"
            >
              {EMAIL}
            </a>
            .
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-emerald-700">
            7. Compartilhamento de dados
          </h2>
          <p className="mt-2 text-sm">
            Compartilhamos informações apenas com provedores de serviços
            essenciais, mediante contratos que assegurem confidencialidade e
            proteção dos dados.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-emerald-700">
            8. Crianças e adolescentes
          </h2>
          <p className="mt-2 text-sm">
            O conteúdo do Trevvos é de caráter geral e não é direcionado
            especificamente a menores de 18 anos. Em caso de uso por menores,
            solicitamos que o contato seja feito com o responsável legal.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-emerald-700">
            9. Alterações nesta Política
          </h2>
          <p className="mt-2 text-sm">
            Esta Política pode ser revisada periodicamente. Alterações entram em
            vigor a partir da publicação no portal, sempre com a data de
            atualização indicada no topo.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-emerald-700">
            10. Contato
          </h2>
          <p className="mt-2 text-sm">
            Em caso de dúvidas ou solicitações, escreva para{" "}
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
