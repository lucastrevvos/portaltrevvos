import Link from "next/link";

import { ContentRequestForm } from "../../../../../../components/content-request-form";
import { DashboardShell } from "../../../../../../components/dashboard-shell";
import { ErrorState, PageShell } from "../../../../../../components/studio-ui";
import { StudioApiError, getTenant } from "../../../../../../lib/studio-api";

export const dynamic = "force-dynamic";

export default async function NewContentRequestPage({
  params,
}: {
  params: { tenantId: string };
}) {
  const { tenantId } = params;

  try {
    const tenant = await getTenant(tenantId);

    return (
      <DashboardShell currentPath="/app/tenants">
        <PageShell
          eyebrow={`${tenant.name} · Novo pedido`}
          title="Criar content request"
          description="Abra um novo pedido para operar o fluxo textual e visual do cliente."
          actions={
            <Link
              href={`/app/tenants/${tenantId}`}
              className="rounded-full border border-[color:var(--border)] bg-white/80 px-4 py-2 text-sm font-semibold text-[color:var(--foreground)]"
            >
              Voltar para o tenant
            </Link>
          }
        >
          <ContentRequestForm tenantId={tenantId} />
        </PageShell>
      </DashboardShell>
    );
  } catch (error) {
    return (
      <DashboardShell currentPath="/app/tenants">
        <PageShell eyebrow="Pedidos" title="Criar content request">
          <ErrorState
            title="Falha ao carregar tenant"
            description={
              error instanceof StudioApiError
                ? error.detail
                : error instanceof Error
                  ? error.message
                  : "Não foi possível carregar esta tela."
            }
          />
        </PageShell>
      </DashboardShell>
    );
  }
}
