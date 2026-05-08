import Link from "next/link";

import { BrandAssetsManager } from "../../../../../components/brand-assets-manager";
import { DashboardShell } from "../../../../../components/dashboard-shell";
import {
  ErrorState,
  KeyValue,
  PageShell,
  SurfaceCard,
} from "../../../../../components/studio-ui";
import {
  StudioApiError,
  getBrandAssets,
  getTenant,
} from "../../../../../lib/studio-api";

export const dynamic = "force-dynamic";

export default async function TenantAssetsPage({
  params,
}: {
  params: { tenantId: string };
}) {
  const { tenantId } = params;

  try {
    const [tenant, assets] = await Promise.all([
      getTenant(tenantId),
      getBrandAssets(tenantId),
    ]);

    const logoCount = assets.filter(
      (asset) => asset.asset_type === "logo" && asset.is_primary,
    ).length;
    const photoCount = assets.filter(
      (asset) => asset.asset_type === "profile_photo" && asset.is_primary,
    ).length;

    return (
      <DashboardShell currentPath="/app/tenants">
        <PageShell
          eyebrow="Tenant"
          title={`${tenant.name} · Brand assets`}
          description="Envie e gerencie logo, foto principal e referencias visuais do cliente."
          actions={
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/app/tenants/${tenantId}`}
                className="rounded-full border border-[color:var(--border)] bg-white/80 px-4 py-2 text-sm font-semibold text-[color:var(--foreground)]"
              >
                Voltar para o tenant
              </Link>
            </div>
          }
        >
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <SurfaceCard>
              <KeyValue label="Logo principal" value={logoCount ? "Encontrado" : "Ausente"} />
            </SurfaceCard>
            <SurfaceCard>
              <KeyValue
                label="Foto principal"
                value={photoCount ? "Encontrada" : "Ausente"}
              />
            </SurfaceCard>
            <SurfaceCard>
              <KeyValue label="Total de assets" value={String(assets.length)} />
            </SurfaceCard>
          </div>

          <BrandAssetsManager tenantId={tenantId} assets={assets} />
        </PageShell>
      </DashboardShell>
    );
  } catch (error) {
    const description =
      error instanceof StudioApiError && error.status === 404
        ? "Tenant nao encontrado no Studio API."
        : error instanceof Error
          ? error.message
          : "Nao foi possivel carregar os assets da marca.";

    return (
      <DashboardShell currentPath="/app/tenants">
        <PageShell
          eyebrow="Tenant"
          title="Brand assets"
          description="Nao foi possivel carregar a biblioteca de assets."
        >
          <ErrorState title="Falha ao consultar brand assets" description={description} />
        </PageShell>
      </DashboardShell>
    );
  }
}
