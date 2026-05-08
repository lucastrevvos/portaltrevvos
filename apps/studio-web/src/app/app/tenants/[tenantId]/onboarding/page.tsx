import Link from "next/link";

import { DashboardShell } from "../../../../../components/dashboard-shell";
import { OnboardingForm } from "../../../../../components/onboarding-form";
import {
  ErrorState,
  PageShell,
} from "../../../../../components/studio-ui";
import {
  StudioApiError,
  getTenant,
  getTenantOnboarding,
} from "../../../../../lib/studio-api";

export const dynamic = "force-dynamic";

export default async function TenantOnboardingPage({
  params,
}: {
  params: { tenantId: string };
}) {
  const { tenantId } = params;

  try {
    const [tenant, onboarding] = await Promise.all([
      getTenant(tenantId),
      getTenantOnboarding(tenantId),
    ]);

    return (
      <DashboardShell currentPath="/app/tenants">
        <PageShell
          eyebrow={`${tenant.name} · Onboarding`}
          title={onboarding ? "Editar onboarding" : "Preencher onboarding"}
          description="Capture posicionamento, público e tom de marca para orientar os próximos pedidos."
          actions={
            <Link
              href={`/app/tenants/${tenantId}`}
              className="rounded-full border border-[color:var(--border)] bg-white/80 px-4 py-2 text-sm font-semibold text-[color:var(--foreground)]"
            >
              Voltar para o tenant
            </Link>
          }
        >
          <OnboardingForm tenantId={tenantId} existing={onboarding} />
        </PageShell>
      </DashboardShell>
    );
  } catch (error) {
    return (
      <DashboardShell currentPath="/app/tenants">
        <PageShell eyebrow="Onboarding" title="Onboarding estratégico">
          <ErrorState
            title="Falha ao carregar onboarding"
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
