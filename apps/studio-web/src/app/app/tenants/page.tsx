import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { DashboardShell } from "../../../components/dashboard-shell";
import {
  EmptyState,
  ErrorState,
  PageShell,
  SurfaceCard,
} from "../../../components/studio-ui";
import { getTenants } from "../../../lib/studio-api";

export const dynamic = "force-dynamic";

export default async function TenantsPage() {
  try {
    const tenants = await getTenants();

    return (
      <DashboardShell currentPath="/app/tenants">
        <PageShell
          eyebrow="Clientes"
          title="Tenants"
          description="Lista operacional dos clientes já disponíveis no Studio para navegar pelos pedidos e renders."
          actions={
            <Link
              href="/app/tenants/new"
              className="rounded-full bg-[color:var(--foreground)] px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5"
            >
              Criar tenant
            </Link>
          }
        >
          {tenants.length ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {tenants.map((tenant) => (
                <SurfaceCard
                  key={tenant.id}
                  className="flex flex-col justify-between gap-6 transition hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(24,24,27,0.08)]"
                >
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
                      {tenant.niche}
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold">{tenant.name}</h2>
                    <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                      {tenant.business_name || "Sem razão social cadastrada"}
                    </p>
                    <p className="mt-4 rounded-full border border-[color:var(--border)] bg-[color:var(--background)] px-3 py-1 text-xs font-semibold text-[color:var(--ink-soft)]">
                      {tenant.slug}
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <Link
                      href={`/app/tenants/${tenant.id}`}
                      className="inline-flex items-center gap-2 rounded-full bg-[color:var(--foreground)] px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                    >
                      Abrir
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </SurfaceCard>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Nenhum tenant encontrado"
              description="Cadastre tenants no Studio API para começar a usar o dashboard."
            />
          )}
        </PageShell>
      </DashboardShell>
    );
  } catch (error) {
    return (
      <DashboardShell currentPath="/app/tenants">
        <PageShell
          eyebrow="Clientes"
          title="Tenants"
          description="Não foi possível carregar a lista de tenants."
        >
          <ErrorState
            title="Falha ao consultar tenants"
            description={
              error instanceof Error
                ? error.message
                : "Verifique a conexão com o Studio API."
            }
          />
        </PageShell>
      </DashboardShell>
    );
  }
}
