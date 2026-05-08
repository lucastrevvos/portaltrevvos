import Link from "next/link";
import {
  ExternalLink,
  FileStack,
  ImageIcon,
  Layers3,
  RefreshCcw,
} from "lucide-react";

import { DraftWorkflowActions } from "../../../../../../components/draft-workflow-actions";
import { RequestActions } from "../../../../../../components/request-actions";
import { DashboardShell } from "../../../../../../components/dashboard-shell";
import {
  EmptyState,
  ErrorState,
  KeyValue,
  PageShell,
  REQUEST_FLOW,
  StatusBadge,
  SuccessState,
  SurfaceCard,
  cn,
  formatStatus,
} from "../../../../../../components/studio-ui";
import {
  StudioApiError,
  getAssetUrl,
  getContentDraft,
  getContentRequest,
  getCreativeAssets,
  getRenderSpecs,
  getTenant,
  getVisualTemplates,
} from "../../../../../../lib/studio-api";

export const dynamic = "force-dynamic";

function summarize(value: string | null, length = 120) {
  if (!value) {
    return "Sem conteúdo";
  }
  return value.length > length ? `${value.slice(0, length).trim()}...` : value;
}

export default async function RequestDetailPage({
  params,
  searchParams,
}: {
  params: { tenantId: string; requestId: string };
  searchParams?: { success?: string };
}) {
  const { tenantId, requestId } = params;

  try {
    const [tenant, contentRequest, draft, renderSpecs, assets, templates] =
      await Promise.all([
        getTenant(tenantId),
        getContentRequest(tenantId, requestId),
        getContentDraft(tenantId, requestId),
        getRenderSpecs(tenantId, requestId),
        getCreativeAssets(tenantId, requestId),
        getVisualTemplates(tenantId),
      ]);

    const orderedSlides = [...(draft?.slides ?? [])].sort(
      (left, right) => left.slide_number - right.slide_number,
    );
    const orderedSpecs = [...renderSpecs].sort(
      (left, right) => (left.slide_number ?? 999) - (right.slide_number ?? 999),
    );
    const hasReadyRenderSpecs = orderedSpecs.some((spec) => spec.status === "ready");
    const canEditDraft = draft && draft.status !== "approved";

    return (
      <DashboardShell currentPath="/app/tenants">
        <PageShell
          eyebrow={`${tenant.name} · Pedido`}
          title={contentRequest.title}
          description="Leitura operacional completa do request: texto, aprovação, template visual, render specs e assets PNG."
          actions={
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/app/tenants/${tenantId}/requests/${requestId}/draft`}
                className="rounded-full border border-[color:var(--border)] bg-white/80 px-4 py-2 text-sm font-semibold text-[color:var(--foreground)]"
              >
                {draft ? "Editar draft" : "Criar draft textual"}
              </Link>
              <Link
                href={`/app/tenants/${tenantId}`}
                className="rounded-full border border-[color:var(--border)] bg-white/80 px-4 py-2 text-sm font-semibold text-[color:var(--foreground)]"
              >
                Voltar para o tenant
              </Link>
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

          <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
            <SurfaceCard>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
                    Cabeçalho do pedido
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold">{contentRequest.theme}</h2>
                </div>
                <StatusBadge value={contentRequest.status} />
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <KeyValue label="Formato" value={contentRequest.format} />
                <KeyValue label="Objetivo" value={contentRequest.objective} />
                <KeyValue label="CTA" value={contentRequest.cta || "Não informado"} />
                <KeyValue
                  label="Template visual atual"
                  value={
                    templates.find(
                      (template) => template.id === contentRequest.visual_template_id,
                    )?.name || "Nenhum selecionado"
                  }
                />
                <KeyValue
                  label="Briefing"
                  value={contentRequest.briefing || "Não informado"}
                />
              </div>
            </SurfaceCard>

            <SurfaceCard>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[color:var(--foreground)] text-white">
                  <RefreshCcw className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
                    Fluxo visual
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold">
                    Etapa atual do request
                  </h2>
                </div>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-1">
                {REQUEST_FLOW.map((step, index) => {
                  const currentIndex = REQUEST_FLOW.indexOf(contentRequest.status);
                  const state =
                    step === contentRequest.status
                      ? "current"
                      : index < currentIndex
                        ? "done"
                        : "upcoming";

                  return (
                    <div
                      key={step}
                      className={cn(
                        "flex items-center gap-4 rounded-2xl border px-4 py-4",
                        state === "current" &&
                          "border-[color:var(--foreground)] bg-[color:var(--foreground)] text-white",
                        state === "done" &&
                          "border-emerald-200 bg-emerald-50 text-emerald-700",
                        state === "upcoming" &&
                          "border-[color:var(--border)] bg-white/80 text-[color:var(--ink-soft)]",
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold",
                          state === "current" && "bg-white/15",
                          state === "done" && "bg-emerald-100",
                          state === "upcoming" && "bg-[color:var(--background)]",
                        )}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{formatStatus(step)}</p>
                        <p
                          className={cn(
                            "mt-1 text-xs uppercase tracking-[0.14em]",
                            state === "current"
                              ? "text-white/70"
                              : "text-[color:var(--muted)]",
                          )}
                        >
                          {step}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </SurfaceCard>
          </div>

          <div className="mt-8 grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
            <DraftWorkflowActions
              tenantId={tenantId}
              requestId={requestId}
              requestStatus={contentRequest.status}
              hasDraft={Boolean(draft)}
            />
            <RequestActions
              tenantId={tenantId}
              requestId={requestId}
              requestStatus={contentRequest.status}
              templates={templates}
              initialTemplateId={contentRequest.visual_template_id}
              hasReadyRenderSpecs={hasReadyRenderSpecs}
            />
          </div>

          <div className="mt-8 grid gap-4 xl:grid-cols-[1fr_1fr]">
            <SurfaceCard>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[color:var(--foreground)] text-white">
                    <FileStack className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
                      Draft textual
                    </p>
                    <h2 className="mt-1 text-2xl font-semibold">
                      Texto aprovado e slides
                    </h2>
                  </div>
                </div>
                <Link
                  href={`/app/tenants/${tenantId}/requests/${requestId}/draft`}
                  className="text-sm font-semibold text-[color:var(--foreground)]"
                >
                  {draft ? "Editar draft" : "Criar draft"}
                </Link>
              </div>

              {draft ? (
                <div className="mt-6 space-y-5">
                  <div className="flex items-center gap-3">
                    <StatusBadge value={draft.status} />
                    {!canEditDraft ? (
                      <span className="text-sm text-[color:var(--muted)]">
                        Draft aprovado. Edição/versionamento será implementado futuramente.
                      </span>
                    ) : null}
                  </div>
                  <KeyValue label="Título" value={draft.title} />
                  <KeyValue label="Legenda" value={draft.caption || "Não informada"} />
                  <KeyValue
                    label="Comentário fixado"
                    value={draft.fixed_comment || "Não informado"}
                  />
                  <KeyValue
                    label="Sugestões de stories"
                    value={draft.stories_suggestion || "Não informadas"}
                  />

                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
                      Slides
                    </p>
                    <div className="mt-3 space-y-3">
                      {orderedSlides.length ? (
                        orderedSlides.map((slide) => (
                          <div
                            key={slide.id}
                            className="rounded-2xl border border-[color:var(--border)] bg-white/90 p-4"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-sm font-semibold">
                                Slide {slide.slide_number}
                              </p>
                            </div>
                            <p className="mt-2 text-base font-semibold text-[color:var(--foreground)]">
                              {slide.title}
                            </p>
                            <p className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">
                              {slide.body || "Sem body"}
                            </p>
                            {slide.visual_notes ? (
                              <p className="mt-3 rounded-xl bg-[color:var(--background)] px-3 py-2 text-sm text-[color:var(--muted)]">
                                {slide.visual_notes}
                              </p>
                            ) : null}
                          </div>
                        ))
                      ) : (
                        <EmptyState
                          title="Sem slides"
                          description="Este draft ainda não tem slides cadastrados."
                        />
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <EmptyState
                  title="Draft não encontrado"
                  description="Crie o draft textual para iniciar a operação do pedido."
                />
              )}
            </SurfaceCard>

            <SurfaceCard>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[color:var(--foreground)] text-white">
                  <Layers3 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
                    Render specs
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold">
                    Prompts visuais operacionais
                  </h2>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {orderedSpecs.length ? (
                  orderedSpecs.map((spec) => (
                    <div
                      key={spec.id}
                      className="rounded-2xl border border-[color:var(--border)] bg-white/90 p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold">
                            {spec.slide_number
                              ? `Slide ${spec.slide_number}/${spec.total_slides}`
                              : spec.render_type}
                          </p>
                          <p className="mt-1 text-sm text-[color:var(--muted)]">
                            {spec.width}×{spec.height}
                          </p>
                        </div>
                        <StatusBadge value={spec.status} />
                      </div>
                      <p className="mt-3 text-base font-semibold">{spec.title}</p>
                      <p className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">
                        {summarize(spec.body)}
                      </p>
                    </div>
                  ))
                ) : (
                  <EmptyState
                    title="Sem render specs"
                    description="Selecione um template e gere render specs quando o texto estiver aprovado."
                  />
                )}
              </div>
            </SurfaceCard>
          </div>

          <div className="mt-8">
            <SurfaceCard>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[color:var(--foreground)] text-white">
                  <ImageIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
                    Creative assets
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold">
                    Preview dos PNGs gerados
                  </h2>
                </div>
              </div>

              <div className="mt-6">
                {assets.length ? (
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {assets.map((asset) => {
                      const assetUrl = getAssetUrl(asset.url);
                      return (
                        <div
                          key={asset.id}
                          className="overflow-hidden rounded-[1.5rem] border border-[color:var(--border)] bg-white shadow-[0_14px_36px_rgba(24,24,27,0.08)]"
                        >
                          <a href={assetUrl} target="_blank" rel="noreferrer">
                            <img
                              src={assetUrl}
                              alt={asset.file_name}
                              className="aspect-square w-full object-cover"
                            />
                          </a>
                          <div className="space-y-3 p-4">
                            <div className="flex items-center justify-between gap-3">
                              <StatusBadge value={asset.status} />
                              <a
                                href={assetUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--foreground)]"
                              >
                                Abrir
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </div>
                            <div>
                              <p className="text-sm font-semibold break-all">
                                {asset.file_name}
                              </p>
                              <p className="mt-1 text-sm text-[color:var(--muted)]">
                                {asset.width}×{asset.height}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <EmptyState
                    title="Nenhum asset gerado"
                    description="Quando a renderização for executada, os PNGs aparecerão aqui com preview e link direto."
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
        ? "Pedido não encontrado para este tenant."
        : error instanceof Error
          ? error.message
          : "Não foi possível carregar este pedido.";

    return (
      <DashboardShell currentPath="/app/tenants">
        <PageShell
          eyebrow="Pedido"
          title="Detalhe do pedido"
          description="Não foi possível carregar os dados do request."
        >
          <ErrorState title="Falha ao consultar pedido" description={description} />
        </PageShell>
      </DashboardShell>
    );
  }
}
