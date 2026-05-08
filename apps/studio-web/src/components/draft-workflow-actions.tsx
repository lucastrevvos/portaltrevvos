"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  StudioApiError,
  approveContentDraft,
  submitContentDraft,
} from "../lib/studio-api";
import { FormMessage } from "./form-fields";

export function DraftWorkflowActions({
  tenantId,
  requestId,
  requestStatus,
  hasDraft,
}: {
  tenantId: string;
  requestId: string;
  requestStatus: string;
  hasDraft: boolean;
}) {
  const router = useRouter();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<"submit" | "approve" | null>(null);
  const [isPending, startTransition] = useTransition();

  const canSubmit =
    hasDraft &&
    (requestStatus === "draft" || requestStatus === "text_revision_requested");
  const canApprove = requestStatus === "awaiting_text_approval";

  function resolveError(reason: unknown) {
    if (reason instanceof StudioApiError) {
      return reason.detail;
    }
    if (reason instanceof Error) {
      return reason.message;
    }
    return "Não foi possível atualizar o workflow textual.";
  }

  function run(
    action: "submit" | "approve",
    work: () => Promise<void>,
    successMessage: string,
  ) {
    setActiveAction(action);
    setError(null);
    setFeedback(null);
    startTransition(async () => {
      try {
        await work();
        setFeedback(successMessage);
        router.refresh();
      } catch (reason) {
        setError(resolveError(reason));
      } finally {
        setActiveAction(null);
      }
    });
  }

  return (
    <div className="rounded-[1.75rem] border border-[color:var(--border)] bg-white/80 p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
            Workflow textual
          </p>
          <h2 className="mt-2 text-xl font-semibold text-[color:var(--foreground)]">
            Submissão e aprovação pela interface
          </h2>
          <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
            Use esta área para enviar o draft para aprovação e liberar a etapa visual.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={!canSubmit || isPending}
            onClick={() =>
              run(
                "submit",
                async () => {
                  await submitContentDraft(tenantId, requestId, {
                    actor_type: "admin",
                    actor_name: "Admin Studio",
                    comment: "Rascunho textual submetido pela interface.",
                  });
                },
                "Texto submetido para aprovação.",
              )
            }
            className="rounded-full bg-[color:var(--foreground)] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {isPending && activeAction === "submit"
              ? "Submetendo..."
              : "Submeter texto para aprovação"}
          </button>

          <button
            type="button"
            disabled={!canApprove || isPending}
            onClick={() =>
              run(
                "approve",
                async () => {
                  await approveContentDraft(tenantId, requestId, {
                    actor_type: "client",
                    actor_name: "Cliente Studio",
                    comment: "Texto aprovado pela interface.",
                  });
                },
                "Texto aprovado com sucesso.",
              )
            }
            className="rounded-full border border-[color:var(--border)] bg-white px-5 py-3 text-sm font-semibold text-[color:var(--foreground)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {isPending && activeAction === "approve"
              ? "Aprovando..."
              : "Aprovar texto"}
          </button>
        </div>
      </div>

      {feedback ? <div className="mt-4"><FormMessage tone="success">{feedback}</FormMessage></div> : null}
      {error ? <div className="mt-4"><FormMessage tone="error">{error}</FormMessage></div> : null}
    </div>
  );
}
