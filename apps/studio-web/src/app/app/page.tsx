import Link from "next/link";
import { ArrowRight, Building2, FolderKanban, Layers3 } from "lucide-react";

import { DashboardShell } from "../../components/dashboard-shell";
import {
  EmptyState,
  ErrorState,
  MetricCard,
  PageShell,
  StatusBadge,
  SurfaceCard,
  formatDate,
} from "../../components/studio-ui";
import { ContentRequest, getContentRequests, getTenants } from "../../lib/studio-api";

export const dynamic = "force-dynamic";

async function loadDashboardData() {
  const tenants = await getTenants();
  const requestGroups = await Promise.all(
    tenants.map(async (tenant) => ({
      tenant,
      requests: await getContentRequests(tenant.id),
    })),
  );

  const requests = requestGroups.flatMap((item) => item.requests);
  return {
    tenants,
    requests,
    recentItems: requestGroups
      .flatMap(({ tenant, requests }) =>
        requests.map((request) => ({
          tenant,
          request,
        })),
      )
      .sort(
        (left, right) =>
          new Date(right.request.updated_at).getTime() -
          new Date(left.request.updated_at).getTime(),
      )
      .slice(0, 6),
  };
}

function countRequests(requests: ContentRequest[], statuses: string[]) {
  return requests.filter((request) => statuses.includes(request.status)).length;
}

export default async function StudioDashboardPage() {
  try {
    const { tenants, requests, recentItems } = await loadDashboardData();

    return (
      <DashboardShell currentPath="/app">
        <PageShell
          eyebrow="Concierge MVP"
          title="Dashboard de preview visual"
          description="Visão operacional do fluxo validado no backend: tenants, pedidos, texto aprovado, render specs e assets PNG já gerados."
          actions={
            <Link
              href="/app/tenants"
              className="rounded-full border border-[color:var(--border)] bg-white/80 px-4 py-2 text-sm font-semibold text-[color:var(--foreground)] transition hover:-translate-y-0.5"
            >
              Abrir tenants
            </Link>
          }
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Tenants"
              value={tenants.length}
              hint="Clientes disponíveis no ambiente atual."
            />
            <MetricCard
              label="Pedidos"
              value={requests.length}
              hint="Requests já cadastrados no Studio."
            />
            <MetricCard
              label="Aguardando texto"
              value={countRequests(requests, [
                "awaiting_text_approval",
                "text_revision_requested",
              ])}
              hint="Pedidos ainda no trecho textual do fluxo."
            />
            <MetricCard
              label="Com render pronto"
              value={countRequests(requests, [
                "in_manual_production",
                "awaiting_final_approval",
                "delivered",
              ])}
              hint="Pedidos que já avançaram para assets visuais."
            />
          </div>

          <div className="mt-8 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <SurfaceCard>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
                    Atividade recente
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold">
                    Requests com atualização mais recente
                  </h2>
                </div>
                <FolderKanban className="h-5 w-5 text-[color:var(--muted)]" />
              </div>

              <div className="mt-6 space-y-3">
                {recentItems.length ? (
                  recentItems.map(({ tenant, request }) => (
                    <Link
                      key={request.id}
                      href={`/app/tenants/${tenant.id}/requests/${request.id}`}
                      className="flex flex-col gap-3 rounded-2xl border border-[color:var(--border)] bg-white/90 px-4 py-4 transition hover:-translate-y-0.5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="text-sm font-semibold text-[color:var(--foreground)]">
                          {request.title}
                        </p>
                        <p className="mt-1 text-sm text-[color:var(--muted)]">
                          {tenant.name} · {request.theme}
                        </p>
                        <p className="mt-2 text-xs uppercase tracking-[0.14em] text-[color:var(--muted)]">
                          Atualizado em {formatDate(request.updated_at)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge value={request.status} />
                        <ArrowRight className="h-4 w-4 text-[color:var(--muted)]" />
                      </div>
                    </Link>
                  ))
                ) : (
                  <EmptyState
                    title="Nenhum pedido encontrado"
                    description="Crie ou importe requests no Studio API para popular o dashboard."
                  />
                )}
              </div>
            </SurfaceCard>

            <SurfaceCard>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
                    Tenants carregados
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold">Panorama rápido</h2>
                </div>
                <Building2 className="h-5 w-5 text-[color:var(--muted)]" />
              </div>

              <div className="mt-6 space-y-3">
                {tenants.length ? (
                  tenants.slice(0, 5).map((tenant) => (
                    <Link
                      key={tenant.id}
                      href={`/app/tenants/${tenant.id}`}
                      className="flex items-center justify-between rounded-2xl border border-[color:var(--border)] bg-white/90 px-4 py-4 transition hover:-translate-y-0.5"
                    >
                      <div>
                        <p className="text-sm font-semibold">{tenant.name}</p>
                        <p className="mt-1 text-sm text-[color:var(--muted)]">
                          {tenant.slug} · {tenant.niche}
                        </p>
                      </div>
                      <Layers3 className="h-4 w-4 text-[color:var(--muted)]" />
                    </Link>
                  ))
                ) : (
                  <EmptyState
                    title="Sem tenants cadastrados"
                    description="A lista aparecerá aqui quando o backend tiver tenants disponíveis."
                  />
                )}
              </div>
            </SurfaceCard>
          </div>
        </PageShell>
      </DashboardShell>
    );
  } catch (error) {
    return (
      <DashboardShell currentPath="/app">
        <PageShell
          eyebrow="Concierge MVP"
          title="Dashboard de preview visual"
          description="Não foi possível carregar a visão geral do Studio."
        >
          <ErrorState
            title="Falha ao consultar o Studio API"
            description={
              error instanceof Error
                ? error.message
                : "Verifique NEXT_PUBLIC_STUDIO_API_URL e confirme se o backend está rodando."
            }
          />
        </PageShell>
      </DashboardShell>
    );
  }
}
