import Link from "next/link";

import { BrandKitForm } from "../../../../../components/brand-kit-form";
import { DashboardShell } from "../../../../../components/dashboard-shell";
import { ErrorState, PageShell } from "../../../../../components/studio-ui";
import {
  StudioApiError,
  getTenant,
  getTenantBrandKit,
} from "../../../../../lib/studio-api";

export const dynamic = "force-dynamic";

export default async function TenantBrandKitPage({
  params,
}: {
  params: { tenantId: string };
}) {
  const { tenantId } = params;

  try {
    const [tenant, brandKit] = await Promise.all([
      getTenant(tenantId),
      getTenantBrandKit(tenantId),
    ]);

    return (
      <DashboardShell currentPath="/app/tenants">
        <PageShell
          eyebrow={`${tenant.name} · Brand kit`}
          title={brandKit ? "Editar brand kit" : "Criar brand kit"}
          description="Defina cores, estilo e referências visuais para guiar a etapa de render."
          actions={
            <Link
              href={`/app/tenants/${tenantId}`}
              className="rounded-full border border-[color:var(--border)] bg-white/80 px-4 py-2 text-sm font-semibold text-[color:var(--foreground)]"
            >
              Voltar para o tenant
            </Link>
          }
        >
          <BrandKitForm tenantId={tenantId} existing={brandKit} />
        </PageShell>
      </DashboardShell>
    );
  } catch (error) {
    return (
      <DashboardShell currentPath="/app/tenants">
        <PageShell eyebrow="Brand kit" title="Brand kit">
          <ErrorState
            title="Falha ao carregar brand kit"
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
