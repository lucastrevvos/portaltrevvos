import Link from "next/link";
import { Sparkles } from "lucide-react";

import { ContentRadarPanel } from "../../../../../components/content-radar-panel";
import { DashboardShell } from "../../../../../components/dashboard-shell";
import { ErrorState, PageShell, SurfaceCard } from "../../../../../components/studio-ui";
import {
  StudioApiError,
  getTenant,
  getTenantBrandKit,
  getTenantOnboarding,
} from "../../../../../lib/studio-api";

export const dynamic = "force-dynamic";

export default async function ContentRadarPage({
  params,
}: {
  params: { tenantId: string };
}) {
  const { tenantId } = params;

  try {
    const [tenant, onboarding, brandKit] = await Promise.all([
      getTenant(tenantId),
      getTenantOnboarding(tenantId),
      getTenantBrandKit(tenantId),
    ]);

    return (
      <DashboardShell currentPath="/app/tenants">
        <PageShell
          eyebrow={`${tenant.name} · Radar`}
          title="Radar de Conteúdo"
          description="Sugestões estratégicas de posts prontas para virar content request."
          actions={
            <Link
              href={`/app/tenants/${tenant.id}`}
              className="rounded-full border border-[color:var(--border)] bg-white/80 px-4 py-2 text-sm font-semibold text-[color:var(--foreground)]"
            >
              Voltar para o tenant
            </Link>
          }
        >
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <SurfaceCard>
              <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
                Tenant
              </p>
              <p className="mt-2 text-lg font-semibold">{tenant.name}</p>
              <p className="mt-2 text-sm text-[color:var(--muted)]">{tenant.niche}</p>
            </SurfaceCard>
            <SurfaceCard>
              <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
                Onboarding
              </p>
              <p className="mt-2 text-lg font-semibold">
                {onboarding ? onboarding.professional_name : "Pendente"}
              </p>
              <p className="mt-2 text-sm text-[color:var(--muted)]">
                {onboarding
                  ? "Perfil pronto para alimentar o radar."
                  : "Preencha o onboarding antes de gerar sugestões."}
              </p>
            </SurfaceCard>
            <SurfaceCard>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[color:var(--foreground)] text-white">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
                    Brand kit
                  </p>
                  <p className="mt-1 text-lg font-semibold">
                    {brandKit ? "Cadastrado" : "Ausente"}
                  </p>
                </div>
              </div>
            </SurfaceCard>
          </div>

          <ContentRadarPanel
            tenantId={tenantId}
            tenantName={tenant.name}
            hasOnboarding={Boolean(onboarding)}
            hasBrandKit={Boolean(brandKit)}
          />
        </PageShell>
      </DashboardShell>
    );
  } catch (error) {
    return (
      <DashboardShell currentPath="/app/tenants">
        <PageShell eyebrow="Radar" title="Radar de Conteúdo">
          <ErrorState
            title="Falha ao carregar Radar"
            description={
              error instanceof StudioApiError
                ? error.detail
                : error instanceof Error
                  ? error.message
                  : "Nao foi possivel carregar esta tela."
            }
          />
        </PageShell>
      </DashboardShell>
    );
  }
}
