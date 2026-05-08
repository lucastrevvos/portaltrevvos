import Link from "next/link";

import { ContentDraftForm } from "../../../../../../../components/content-draft-form";
import { DashboardShell } from "../../../../../../../components/dashboard-shell";
import { ErrorState, PageShell } from "../../../../../../../components/studio-ui";
import {
  StudioApiError,
  getContentDraft,
  getContentRequest,
  getTenant,
} from "../../../../../../../lib/studio-api";

export const dynamic = "force-dynamic";

export default async function DraftEditorPage({
  params,
}: {
  params: { tenantId: string; requestId: string };
}) {
  const { tenantId, requestId } = params;

  try {
    const [tenant, request, draft] = await Promise.all([
      getTenant(tenantId),
      getContentRequest(tenantId, requestId),
      getContentDraft(tenantId, requestId),
    ]);

    return (
      <DashboardShell currentPath="/app/tenants">
        <PageShell
          eyebrow={`${tenant.name} · Draft textual`}
          title={draft ? "Editar draft textual" : "Criar draft textual"}
          description="Escreva o rascunho aprovado pelo cliente e estruture os slides do carrossel quando necessário."
          actions={
            <Link
              href={`/app/tenants/${tenantId}/requests/${requestId}`}
              className="rounded-full border border-[color:var(--border)] bg-white/80 px-4 py-2 text-sm font-semibold text-[color:var(--foreground)]"
            >
              Voltar para o pedido
            </Link>
          }
        >
          <ContentDraftForm
            tenantId={tenantId}
            requestId={requestId}
            format={request.format}
            existing={draft}
          />
        </PageShell>
      </DashboardShell>
    );
  } catch (error) {
    return (
      <DashboardShell currentPath="/app/tenants">
        <PageShell eyebrow="Draft textual" title="Draft textual">
          <ErrorState
            title="Falha ao carregar editor de draft"
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
