"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2, RefreshCw, Sparkles, WandSparkles } from "lucide-react";

import {
  StudioApiError,
  VisualTemplate,
  generateRenderSpecs,
  renderContentRequest,
} from "../lib/studio-api";

export function RequestActions({
  tenantId,
  requestId,
  requestStatus,
  templates,
  initialTemplateId,
  hasReadyRenderSpecs,
}: {
  tenantId: string;
  requestId: string;
  requestStatus: string;
  templates: VisualTemplate[];
  initialTemplateId: string | null;
  hasReadyRenderSpecs: boolean;
}) {
  const router = useRouter();
  const [selectedTemplateId, setSelectedTemplateId] = useState(
    initialTemplateId ?? templates[0]?.id ?? "",
  );
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [activeAction, setActiveAction] = useState<"specs" | "render" | null>(null);

  const canGenerateSpecs =
    requestStatus === "text_approved" && Boolean(selectedTemplateId);
  const canRender = requestStatus === "visual_prompt_ready" && hasReadyRenderSpecs;

  function resolveErrorMessage(reason: unknown) {
    if (reason instanceof StudioApiError) {
      return reason.detail;
    }
    if (reason instanceof Error) {
      return reason.message;
    }
    return "O Studio não conseguiu concluir a ação solicitada.";
  }

  function runAction(action: "specs" | "render", work: () => Promise<void>) {
    setActiveAction(action);
    setFeedback(null);
    setError(null);
    startTransition(async () => {
      try {
        await work();
        setFeedback(
          action === "specs"
            ? "Render specs geradas com sucesso."
            : "Renderização iniciada com sucesso.",
        );
        router.refresh();
      } catch (reason) {
        setError(resolveErrorMessage(reason));
      } finally {
        setActiveAction(null);
      }
    });
  }

  return (
    <div className="rounded-[1.75rem] border border-[color:var(--border)] bg-white/80 p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
            Ações do pedido
          </p>
          <h2 className="mt-2 text-xl font-semibold text-[color:var(--foreground)]">
            Operar o fluxo visual sem sair da tela
          </h2>
          <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
            Gere render specs quando o texto já estiver aprovado e dispare o render
            quando as specs estiverem prontas.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => router.refresh()}
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[color:var(--foreground)] transition hover:-translate-y-0.5"
          >
            <RefreshCw className="h-4 w-4" />
            Atualizar dados
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-end">
        <label className="block">
          <span className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
            Template visual
          </span>
          <select
            value={selectedTemplateId}
            onChange={(event) => setSelectedTemplateId(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--card-strong)] px-4 py-3 text-sm text-[color:var(--foreground)] outline-none"
            disabled={!templates.length || isPending}
          >
            {templates.length ? null : (
              <option value="">Nenhum template visual cadastrado</option>
            )}
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={() =>
            runAction("specs", async () => {
              await generateRenderSpecs(tenantId, requestId, selectedTemplateId);
            })
          }
          disabled={!canGenerateSpecs || isPending}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--foreground)] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45"
        >
          {isPending && activeAction === "specs" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          Gerar Render Specs
        </button>

        <button
          type="button"
          onClick={() =>
            runAction("render", async () => {
              await renderContentRequest(tenantId, requestId);
            })
          }
          disabled={!canRender || isPending}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-[color:var(--border)] bg-white px-5 py-3 text-sm font-semibold text-[color:var(--foreground)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45"
        >
          {isPending && activeAction === "render" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <WandSparkles className="h-4 w-4" />
          )}
          Renderizar imagens
        </button>
      </div>

      {!templates.length ? (
        <p className="mt-4 rounded-2xl border border-dashed border-[color:var(--border)] bg-[color:var(--background)] px-4 py-3 text-sm text-[color:var(--muted)]">
          Nenhum template visual cadastrado para este cliente.
        </p>
      ) : null}

      {feedback ? (
        <p className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {feedback}
        </p>
      ) : null}
      {error ? (
        <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
