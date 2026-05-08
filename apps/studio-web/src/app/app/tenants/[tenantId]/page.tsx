import Link from "next/link";
import { ArrowRight, Palette, Shapes, UserRoundSearch } from "lucide-react";

import { DashboardShell } from "../../../../components/dashboard-shell";
import {
  EmptyState,
  ErrorState,
  KeyValue,
  PageShell,
  StatusBadge,
  SuccessState,
  SurfaceCard,
} from "../../../../components/studio-ui";
import {
  StudioApiError,
  getContentRequests,
  getTenant,
  getTenantBrandKit,
  getTenantOnboarding,
  getVisualTemplates,
} from "../../../../lib/studio-api";

export const dynamic = "force-dynamic";

export default async function TenantDetailPage({
  params,
  searchParams,
}: {
  params: { tenantId: string };
  searchParams?: { success?: string };
}) {
  const { tenantId } = params;

  try {
    const [tenant, onboarding, brandKit, requests, templates] = await Promise.all([
      getTenant(tenantId),
      getTenantOnboarding(tenantId),
      getTenantBrandKit(tenantId),
      getContentRequests(tenantId),
      getVisualTemplates(tenantId),
    ]);

    return (
      <DashboardShell currentPath="/app/tenants">
        <PageShell
          eyebrow="Tenant"
          title={tenant.name}
          description="Contexto da marca, onboarding, brand kit, templates e pedidos operados pelo Studio."
          actions={
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/app/tenants/${tenant.id}/requests/new`}
                className="rounded-full bg-[color:var(--foreground)] px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5"
              >
                Novo pedido
              </Link>
              <div className="rounded-full border border-[color:var(--border)] bg-white/80 px-4 py-2 text-sm font-semibold text-[color:var(--foreground)]">
                {tenant.slug}
              </div>
            </div>
          }
        >
          {searchParams?.success ? (
            <div className="mb-8">
              <SuccessState
                title="Operação concluída"
                description={searchParams.success}
              />
            </div>
          ) : null}

          <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
            <SurfaceCard>
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
                  Dados básicos
                </p>
                <Link
                  href={`/app/tenants/${tenant.id}/requests/new`}
                  className="text-sm font-semibold text-[color:var(--foreground)]"
                >
                  Novo pedido
                </Link>
              </div>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <KeyValue label="Nome" value={tenant.name} />
                <KeyValue
                  label="Razão social"
                  value={tenant.business_name || "Não informada"}
                />
                <KeyValue label="Slug" value={tenant.slug} />
                <KeyValue label="Nicho" value={tenant.niche} />
              </div>
            </SurfaceCard>

            <div className="grid gap-4">
              <SurfaceCard>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[color:var(--foreground)] text-white">
                      <UserRoundSearch className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
                        Onboarding estratégico
                      </p>
                      <h2 className="mt-1 text-xl font-semibold">
                        {onboarding
                          ? onboarding.professional_name
                          : "Ainda não cadastrado"}
                      </h2>
                    </div>
                  </div>
                  <Link
                    href={`/app/tenants/${tenant.id}/onboarding`}
                    className="text-sm font-semibold text-[color:var(--foreground)]"
                  >
                    {onboarding ? "Editar onboarding" : "Preencher onboarding"}
                  </Link>
                </div>

                {onboarding ? (
                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <KeyValue label="Cidade" value={onboarding.city || "Não informada"} />
                    <KeyValue label="Modo de atendimento" value={onboarding.service_mode} />
                    <KeyValue
                      label="Instagram"
                      value={onboarding.instagram_handle || "Não informado"}
                    />
                    <KeyValue
                      label="CTA principal"
                      value={onboarding.main_cta || "Não informado"}
                    />
                  </div>
                ) : (
                  <p className="mt-4 text-sm leading-6 text-[color:var(--muted)]">
                    Preencha o onboarding para registrar posicionamento, público e
                    tom de marca.
                  </p>
                )}
              </SurfaceCard>

              <SurfaceCard>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[color:var(--foreground)] text-white">
                      <Palette className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
                        Brand kit
                      </p>
                      <h2 className="mt-1 text-xl font-semibold">
                        {brandKit ? "Identidade visual ativa" : "Ainda não cadastrado"}
                      </h2>
                    </div>
                  </div>
                  <Link
                    href={`/app/tenants/${tenant.id}/brand-kit`}
                    className="text-sm font-semibold text-[color:var(--foreground)]"
                  >
                    {brandKit ? "Editar brand kit" : "Criar brand kit"}
                  </Link>
                </div>

                {brandKit ? (
                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <KeyValue
                      label="Cores"
                      value={
                        <div className="flex flex-wrap items-center gap-3">
                          {[
                            brandKit.primary_color,
                            brandKit.secondary_color,
                            brandKit.accent_color,
                          ]
                            .filter(Boolean)
                            .map((color) => (
                              <span
                                key={color}
                                className="flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-white px-3 py-1 text-xs font-semibold"
                              >
                                <span
                                  className="h-3 w-3 rounded-full border border-black/5"
                                  style={{ backgroundColor: color ?? "#fff" }}
                                />
                                {color}
                              </span>
                            ))}
                        </div>
                      }
                    />
                    <KeyValue
                      label="Uso de foto"
                      value={brandKit.photo_usage_preference}
                    />
                    <KeyValue
                      label="Visual"
                      value={brandKit.visual_style || "Não informado"}
                    />
                    <KeyValue
                      label="Layout"
                      value={brandKit.layout_preference || "Não informado"}
                    />
                  </div>
                ) : (
                  <p className="mt-4 text-sm leading-6 text-[color:var(--muted)]">
                    Cadastre um brand kit para informar cores, estilo e regras
                    visuais.
                  </p>
                )}
              </SurfaceCard>
            </div>
          </div>

          <div className="mt-8 grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
            <SurfaceCard>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[color:var(--foreground)] text-white">
                    <Shapes className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
                      Templates visuais
                    </p>
                    <h2 className="mt-1 text-xl font-semibold">
                      Biblioteca do tenant
                    </h2>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/app/tenants/${tenant.id}/visual-templates/new`}
                    className="text-sm font-semibold text-[color:var(--foreground)]"
                  >
                    Novo template visual
                  </Link>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {templates.length ? (
                  templates.map((template) => (
                    <div
                      key={template.id}
                      className="rounded-2xl border border-[color:var(--border)] bg-white/90 p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold">{template.name}</p>
                          <p className="mt-1 text-sm text-[color:var(--muted)]">
                            {template.category} · {template.width}×{template.height}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <StatusBadge value={template.is_active ? "ready" : "discarded"} />
                          {template.tenant_id ? (
                            <Link
                              href={`/app/tenants/${tenant.id}/visual-templates/${template.id}`}
                              className="text-sm font-semibold text-[color:var(--foreground)]"
                            >
                              Editar
                            </Link>
                          ) : null}
                        </div>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-[color:var(--ink-soft)]">
                        {template.description || template.layout_rules}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {[
                          template.css_theme.background,
                          template.css_theme.primary,
                          template.css_theme.secondary,
                          template.css_theme.accent,
                        ]
                          .filter(Boolean)
                          .map((color) => (
                            <span
                              key={String(color)}
                              className="flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--background)] px-3 py-1 text-xs font-semibold"
                            >
                              <span
                                className="h-3 w-3 rounded-full border border-black/5"
                                style={{ backgroundColor: String(color) }}
                              />
                              {String(color)}
                            </span>
                          ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState
                    title="Nenhum template visual cadastrado."
                    description="Crie ao menos um template para gerar render specs pela interface."
                  />
                )}
              </div>
            </SurfaceCard>

            <SurfaceCard>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
                    Content requests
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold">Pedidos deste tenant</h2>
                </div>
                <Link
                  href={`/app/tenants/${tenant.id}/requests/new`}
                  className="rounded-full border border-[color:var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[color:var(--foreground)]"
                >
                  Novo pedido
                </Link>
              </div>

              <div className="mt-6 space-y-3">
                {requests.length ? (
                  requests.map((request) => (
                    <Link
                      key={request.id}
                      href={`/app/tenants/${tenant.id}/requests/${request.id}`}
                      className="flex flex-col gap-3 rounded-2xl border border-[color:var(--border)] bg-white/90 px-4 py-4 transition hover:-translate-y-0.5 md:flex-row md:items-center md:justify-between"
                    >
                      <div>
                        <p className="text-sm font-semibold">{request.title}</p>
                        <p className="mt-1 text-sm text-[color:var(--muted)]">
                          {request.theme}
                        </p>
                        <p className="mt-2 text-xs uppercase tracking-[0.14em] text-[color:var(--muted)]">
                          {request.format} · {request.objective}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge value={request.status} />
                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--foreground)]">
                          Abrir pedido
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <EmptyState
                    title="Nenhum pedido cadastrado"
                    description="Crie o primeiro content request para operar o fluxo deste tenant."
                  />
                )}
              </div>
            </SurfaceCard>
          </div>
        </PageShell>
      </DashboardShell>
    );
  } catch (error) {
    const description =
      error instanceof StudioApiError && error.status === 404
        ? "Tenant não encontrado no Studio API."
        : error instanceof Error
          ? error.message
          : "Não foi possível carregar os dados do tenant.";

    return (
      <DashboardShell currentPath="/app/tenants">
        <PageShell
          eyebrow="Tenant"
          title="Detalhe do tenant"
          description="Não foi possível carregar este cliente."
        >
          <ErrorState title="Falha ao consultar tenant" description={description} />
        </PageShell>
      </DashboardShell>
    );
  }
}
