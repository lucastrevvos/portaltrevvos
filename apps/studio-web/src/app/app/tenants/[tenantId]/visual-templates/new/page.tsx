import Link from "next/link";

import { DashboardShell } from "../../../../../../components/dashboard-shell";
import { ErrorState, PageShell } from "../../../../../../components/studio-ui";
import { VisualTemplateForm } from "../../../../../../components/visual-template-form";
import { StudioApiError, getTenant } from "../../../../../../lib/studio-api";

export const dynamic = "force-dynamic";

export default async function NewVisualTemplatePage({
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
          eyebrow={`${tenant.name} · Template visual`}
          title="Criar template visual"
          description="Cadastre um template para habilitar a geração de render specs e renders pelo Studio."
          actions={
            <Link
              href={`/app/tenants/${tenantId}`}
              className="rounded-full border border-[color:var(--border)] bg-white/80 px-4 py-2 text-sm font-semibold text-[color:var(--foreground)]"
            >
              Voltar para o tenant
            </Link>
          }
        >
          <VisualTemplateForm tenantId={tenantId} />
        </PageShell>
      </DashboardShell>
    );
  } catch (error) {
    return (
      <DashboardShell currentPath="/app/tenants">
        <PageShell eyebrow="Template visual" title="Criar template visual">
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
