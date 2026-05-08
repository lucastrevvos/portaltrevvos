import { DashboardShell } from "../../../../components/dashboard-shell";
import { PageShell } from "../../../../components/studio-ui";
import { TenantForm } from "../../../../components/tenant-form";

export const dynamic = "force-dynamic";

export default function NewTenantPage() {
  return (
    <DashboardShell currentPath="/app/tenants">
      <PageShell
        eyebrow="Tenants"
        title="Criar tenant"
        description="Cadastre um novo cliente para iniciar o fluxo operacional do Concierge MVP."
      >
        <TenantForm />
      </PageShell>
    </DashboardShell>
  );
}
