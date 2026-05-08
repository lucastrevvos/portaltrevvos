import Link from "next/link";

import { DashboardShell } from "../../../../../../components/dashboard-shell";
import { ErrorState, PageShell } from "../../../../../../components/studio-ui";
import { VisualTemplateForm } from "../../../../../../components/visual-template-form";
import {
  StudioApiError,
  getTenant,
  getVisualTemplates,
} from "../../../../../../lib/studio-api";

export const dynamic = "force-dynamic";

export default async function EditVisualTemplatePage({
  params,
}: {
  params: { tenantId: string; templateId: string };
}) {
  const { tenantId, templateId } = params;

  try {
    const [tenant, templates] = await Promise.all([
      getTenant(tenantId),
      getVisualTemplates(tenantId),
    ]);
    const template = templates.find((item) => item.id === templateId) ?? null;

    if (!template) {
      throw new StudioApiError(404, "Visual template not found.");
    }

    return (
      <DashboardShell currentPath="/app/tenants">
        <PageShell
          eyebrow={`${tenant.name} · Template visual`}
          title="Editar template visual"
          description="Atualize layout, tema e dimensões do template selecionado."
          actions={
            <Link
              href={`/app/tenants/${tenantId}`}
              className="rounded-full border border-[color:var(--border)] bg-white/80 px-4 py-2 text-sm font-semibold text-[color:var(--foreground)]"
            >
              Voltar para o tenant
            </Link>
          }
        >
          <VisualTemplateForm tenantId={tenantId} existing={template} />
        </PageShell>
      </DashboardShell>
    );
  } catch (error) {
    return (
      <DashboardShell currentPath="/app/tenants">
        <PageShell eyebrow="Template visual" title="Editar template visual">
          <ErrorState
            title="Falha ao carregar template"
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
