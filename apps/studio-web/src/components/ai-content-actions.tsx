"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { Loader2, ShieldCheck, Sparkles } from "lucide-react";

import {
  DraftQualityCheck,
  StudioApiError,
  checkAIDraftQuality,
  generateAIDraft,
} from "../lib/studio-api";
import {
  EmptyState,
  StatusBadge,
  SurfaceCard,
  cn,
} from "./studio-ui";
import {
  FormField,
  FormMessage,
  TextInput,
  TextareaInput,
} from "./form-fields";

function qualityTone(riskLevel: DraftQualityCheck["risk_level"]) {
  if (riskLevel === "high") {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }
  if (riskLevel === "medium") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }
  return "border-emerald-200 bg-emerald-50 text-emerald-700";
}

function resolveError(reason: unknown) {
  if (reason instanceof StudioApiError) {
    return reason.detail;
  }
  if (reason instanceof Error) {
    return reason.message;
  }
  return "Nao foi possivel concluir a operacao de IA.";
}

export function AIContentActions({
  tenantId,
  requestId,
  requestFormat,
  hasDraft,
  draftStatus,
  initialSlideCount,
}: {
  tenantId: string;
  requestId: string;
  requestFormat: string;
  hasDraft: boolean;
  draftStatus: string | null;
  initialSlideCount: number;
}) {
  const router = useRouter();
  const [slideCount, setSlideCount] = useState(
    String(initialSlideCount || (requestFormat === "carousel" ? 5 : 1)),
  );
  const [extraInstructions, setExtraInstructions] = useState("");
  const [qualityResult, setQualityResult] = useState<DraftQualityCheck | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<"generate" | "quality" | null>(
    null,
  );
  const [isPending, startTransition] = useTransition();

  const parsedSlideCount = useMemo(() => {
    const value = Number(slideCount);
    if (!Number.isInteger(value)) {
      return null;
    }
    return value;
  }, [slideCount]);

  const draftApproved = draftStatus === "approved";
  const canGenerate =
    !draftApproved &&
    (requestFormat !== "carousel" ||
      (parsedSlideCount !== null && parsedSlideCount >= 1 && parsedSlideCount <= 12));
  const canCheckQuality = hasDraft;

  function run(
    action: "generate" | "quality",
    work: () => Promise<void>,
    successMessage?: string,
  ) {
    setActiveAction(action);
    setError(null);
    setFeedback(null);
    startTransition(async () => {
      try {
        await work();
        if (successMessage) {
          setFeedback(successMessage);
        }
        router.refresh();
      } catch (reason) {
        setError(resolveError(reason));
      } finally {
        setActiveAction(null);
      }
    });
  }

  return (
    <SurfaceCard>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
            IA de Conteudo
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-[color:var(--foreground)]">
            Geracao textual assistida para o pedido
          </h2>
          <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
            Gere um draft editavel com base no onboarding e no briefing. O
            resultado nao e aprovado automaticamente e deve ser revisado antes
            da submissao.
          </p>
        </div>
        {draftStatus ? <StatusBadge value={draftStatus} /> : null}
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-4">
          {requestFormat === "carousel" ? (
            <FormField
              label="Quantidade de slides"
              hint="A IA deve retornar exatamente esta quantidade para carrossel."
              error={
                canGenerate || draftApproved
                  ? null
                  : "Informe um numero inteiro entre 1 e 12."
              }
            >
              <TextInput
                type="number"
                min={1}
                max={12}
                value={slideCount}
                onChange={(event) => setSlideCount(event.target.value)}
                disabled={draftApproved || isPending}
                invalid={!canGenerate && !draftApproved}
              />
            </FormField>
          ) : null}

          <FormField
            label="Instrucoes extras"
            hint="Opcional. Exemplo: manter tom tecnico, premium e cientifico."
          >
            <TextareaInput
              rows={5}
              value={extraInstructions}
              onChange={(event) => setExtraInstructions(event.target.value)}
              disabled={draftApproved || isPending}
              placeholder="Adicione contexto operacional para orientar a IA."
            />
          </FormField>
        </div>

        <div className="space-y-4 rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--background)] p-4">
          {hasDraft && !draftApproved ? (
            <p className="text-sm leading-6 text-[color:var(--muted)]">
              Ja existe um draft em aberto. Ao continuar, a IA vai sobrescrever o
              rascunho atual e manter o pedido editavel.
            </p>
          ) : null}

          {draftApproved ? (
            <EmptyState
              title="Draft aprovado"
              description="Draft aprovado nao pode ser sobrescrito nesta versao. Versionamento sera implementado futuramente."
            />
          ) : (
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                disabled={!canGenerate || isPending}
                onClick={() =>
                  run(
                    "generate",
                    async () => {
                      const result = await generateAIDraft(tenantId, requestId, {
                        slide_count:
                          requestFormat === "carousel" ? parsedSlideCount ?? 5 : 1,
                        overwrite: hasDraft,
                        extra_instructions: extraInstructions,
                      });
                      setQualityResult(result.quality_check);
                    },
                    hasDraft
                      ? "Draft sobrescrito com IA. Revise antes de submeter."
                      : "Draft gerado com IA. Revise antes de submeter.",
                  )
                }
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--foreground)] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45"
              >
                {isPending && activeAction === "generate" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {hasDraft ? "Sobrescrever com IA" : "Gerar draft com IA"}
              </button>

              <button
                type="button"
                disabled={!canCheckQuality || isPending}
                onClick={() =>
                  run(
                    "quality",
                    async () => {
                      const result = await checkAIDraftQuality(tenantId, requestId);
                      setQualityResult(result);
                    },
                    "Quality check concluido.",
                  )
                }
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[color:var(--border)] bg-white px-5 py-3 text-sm font-semibold text-[color:var(--foreground)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45"
              >
                {isPending && activeAction === "quality" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ShieldCheck className="h-4 w-4" />
                )}
                Verificar qualidade do draft
              </button>
            </div>
          )}

          {feedback ? <FormMessage tone="success">{feedback}</FormMessage> : null}
          {error ? <FormMessage tone="error">{error}</FormMessage> : null}
        </div>
      </div>

      <div className="mt-6">
        {qualityResult ? (
          <div className="grid gap-4 xl:grid-cols-[0.72fr_1.28fr]">
            <div
              className={cn(
                "rounded-[1.5rem] border px-4 py-4",
                qualityTone(qualityResult.risk_level),
              )}
            >
              <p className="text-xs uppercase tracking-[0.16em]">Quality check</p>
              <p className="mt-3 text-2xl font-semibold">
                {qualityResult.approved ? "Aprovado" : "Revisao recomendada"}
              </p>
              <p className="mt-2 text-sm leading-6">
                Nivel de risco: <strong>{qualityResult.risk_level}</strong>
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {Object.entries(qualityResult.score).map(([key, value]) => (
                <div
                  key={key}
                  className="rounded-[1.25rem] border border-[color:var(--border)] bg-white px-4 py-4"
                >
                  <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
                    {key.replaceAll("_", " ")}
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-[color:var(--foreground)]">
                    {value}/10
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <EmptyState
            title="Sem quality check"
            description="Depois de gerar ou revisar o draft, rode a verificacao para inspecionar risco, clareza e aderencia ao nicho."
          />
        )}
      </div>

      {qualityResult && (qualityResult.warnings.length || qualityResult.suggested_changes.length) ? (
        <div className="mt-4 grid gap-4 xl:grid-cols-2">
          <div className="rounded-[1.5rem] border border-[color:var(--border)] bg-white px-4 py-4">
            <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
              Alertas
            </p>
            {qualityResult.warnings.length ? (
              <ul className="mt-3 space-y-2 text-sm leading-6 text-[color:var(--ink-soft)]">
                {qualityResult.warnings.map((warning) => (
                  <li key={warning}>- {warning}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-[color:var(--muted)]">
                Nenhum alerta relevante encontrado.
              </p>
            )}
          </div>

          <div className="rounded-[1.5rem] border border-[color:var(--border)] bg-white px-4 py-4">
            <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
              Ajustes sugeridos
            </p>
            {qualityResult.suggested_changes.length ? (
              <ul className="mt-3 space-y-2 text-sm leading-6 text-[color:var(--ink-soft)]">
                {qualityResult.suggested_changes.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-[color:var(--muted)]">
                Sem ajustes prioritarios nesta rodada.
              </p>
            )}
          </div>
        </div>
      ) : null}
    </SurfaceCard>
  );
}
