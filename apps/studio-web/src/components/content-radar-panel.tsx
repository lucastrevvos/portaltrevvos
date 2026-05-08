"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import {
  CONTENT_FORMAT_OPTIONS,
  CONTENT_OBJECTIVE_OPTIONS,
  ContentFormat,
  ContentObjective,
  ContentRadarSuggestion,
  ContentRadarSuggestionsResponse,
  StudioApiError,
  createContentRequest,
  generateContentRadarSuggestions,
} from "../lib/studio-api";
import {
  CheckboxField,
  FormField,
  FormMessage,
  SelectInput,
  TextInput,
  TextareaInput,
} from "./form-fields";
import { EmptyState, SurfaceCard, cn } from "./studio-ui";

type RadarFormValues = {
  count: number;
  format: ContentFormat | "";
  objective: ContentObjective | "";
  additional_context: string;
  avoid_repeating_recent_themes: boolean;
};

function buildBriefing(suggestion: ContentRadarSuggestion) {
  const extraInstructions = suggestion.extra_instructions.trim();
  if (!extraInstructions) {
    return suggestion.briefing;
  }
  return `${suggestion.briefing}\n\nInstruções extras para IA:\n${extraInstructions}`;
}

function suggestionTone(riskLevel: ContentRadarSuggestion["risk_level"]) {
  if (riskLevel === "high") {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }
  if (riskLevel === "medium") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }
  return "border-emerald-200 bg-emerald-50 text-emerald-700";
}

export function ContentRadarPanel({
  tenantId,
  tenantName,
  hasOnboarding,
  hasBrandKit,
}: {
  tenantId: string;
  tenantName: string;
  hasOnboarding: boolean;
  hasBrandKit: boolean;
}) {
  const router = useRouter();
  const [values, setValues] = useState<RadarFormValues>({
    count: 6,
    format: "carousel",
    objective: "authority",
    additional_context: "",
    avoid_repeating_recent_themes: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [creatingRequestIndex, setCreatingRequestIndex] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<ContentRadarSuggestionsResponse | null>(null);

  const canGenerate = hasOnboarding && !submitting;

  const brandKitWarning = useMemo(() => {
    if (hasBrandKit) {
      return null;
    }
    return "Sem brand kit cadastrado. O radar ainda funciona, mas as sugestoes podem ficar menos alinhadas visualmente.";
  }, [hasBrandKit]);

  async function handleGenerate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);

    try {
      const response = await generateContentRadarSuggestions(tenantId, {
        count: values.count,
        format: values.format || null,
        objective: values.objective || null,
        additional_context: values.additional_context,
        avoid_repeating_recent_themes: values.avoid_repeating_recent_themes,
      });
      setResult(response);
    } catch (reason) {
      setErrorMessage(
        reason instanceof StudioApiError
          ? reason.detail
          : reason instanceof Error
            ? reason.message
            : "Nao foi possivel gerar sugestoes agora. Verifique a configuracao da IA ou tente novamente.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCreateRequest(
    suggestion: ContentRadarSuggestion,
    index: number,
  ) {
    setCreatingRequestIndex(index);
    setErrorMessage(null);
    try {
      const contentRequest = await createContentRequest(tenantId, {
        title: suggestion.title,
        format: suggestion.format,
        objective: suggestion.objective,
        cta: suggestion.cta || null,
        theme: suggestion.theme,
        briefing: buildBriefing(suggestion),
      });
      router.push(
        `/app/tenants/${tenantId}/requests/${contentRequest.id}?success=${encodeURIComponent(
          "Pedido criado a partir da sugestao do Radar de Conteudo.",
        )}`,
      );
    } catch (reason) {
      setErrorMessage(
        reason instanceof StudioApiError
          ? reason.detail
          : reason instanceof Error
            ? reason.message
            : "Nao foi possivel criar o pedido a partir da sugestao.",
      );
    } finally {
      setCreatingRequestIndex(null);
    }
  }

  return (
    <div className="space-y-6">
      <SurfaceCard>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
              Radar de Conteúdo
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[color:var(--foreground)]">
              Sugestões estratégicas para {tenantName}
            </h2>
            <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
              O Studio usa o perfil do cliente para sugerir temas prontos para virar
              ContentRequest. Nesta versão, não há pesquisa web nem trends reais.
            </p>
          </div>
          {!hasOnboarding ? (
            <FormMessage tone="error">
              Preencha o onboarding antes de usar o Radar de Conteúdo.
            </FormMessage>
          ) : null}
        </div>

        {brandKitWarning ? (
          <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {brandKitWarning}
          </p>
        ) : null}

        <form onSubmit={handleGenerate} className="mt-6 space-y-5">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <FormField label="Quantidade">
              <TextInput
                type="number"
                min={1}
                max={12}
                value={values.count}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    count: Number(event.target.value || 6),
                  }))
                }
              />
            </FormField>

            <FormField label="Formato">
              <SelectInput
                value={values.format}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    format: event.target.value as RadarFormValues["format"],
                  }))
                }
              >
                <option value="">Qualquer formato</option>
                {CONTENT_FORMAT_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </SelectInput>
            </FormField>

            <FormField label="Objetivo">
              <SelectInput
                value={values.objective}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    objective: event.target.value as RadarFormValues["objective"],
                  }))
                }
              >
                <option value="">Qualquer objetivo</option>
                {CONTENT_OBJECTIVE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </SelectInput>
            </FormField>

            <div className="flex items-end">
              <CheckboxField
                label="Evitar temas recentes"
                checked={values.avoid_repeating_recent_themes}
                onChange={(checked) =>
                  setValues((current) => ({
                    ...current,
                    avoid_repeating_recent_themes: checked,
                  }))
                }
              />
            </div>
          </div>

          <FormField
            label="Contexto adicional"
            hint="Explique a meta, dor ou recorte que quer explorar."
          >
            <TextareaInput
              value={values.additional_context}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  additional_context: event.target.value,
                }))
              }
              placeholder="Ex.: Quero ideias para motoristas que não sabem calcular lucro real."
            />
          </FormField>

          {errorMessage ? <FormMessage tone="error">{errorMessage}</FormMessage> : null}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!canGenerate}
              className="rounded-full bg-[color:var(--foreground)] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Gerando sugestões..." : "Gerar sugestões"}
            </button>
          </div>
        </form>
      </SurfaceCard>

      {result ? (
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
            Resultados
          </p>
          <div className="grid gap-4 lg:grid-cols-2">
            {result.suggestions.map((suggestion, index) => (
              <SurfaceCard key={`${suggestion.title}-${index}`} className="h-full">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-[color:var(--foreground)]">
                      {suggestion.title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                      {suggestion.theme}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-semibold",
                      suggestionTone(suggestion.risk_level),
                    )}
                  >
                    {suggestion.risk_level}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <p className="text-sm">
                    <span className="font-semibold">Formato:</span> {suggestion.format}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Objetivo:</span>{" "}
                    {suggestion.objective}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">CTA:</span> {suggestion.cta}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Dificuldade:</span>{" "}
                    {suggestion.estimated_difficulty}
                  </p>
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-[color:var(--muted)]">
                      Briefing
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">
                      {suggestion.briefing}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-[color:var(--muted)]">
                      Rationale
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">
                      {suggestion.rationale}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-[color:var(--muted)]">
                      Instruções extras
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">
                      {suggestion.extra_instructions}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-[color:var(--muted)]">
                    {suggestion.content_angle}
                  </p>
                  <button
                    type="button"
                    disabled={creatingRequestIndex !== null}
                    onClick={() => handleCreateRequest(suggestion, index)}
                    className="rounded-full border border-[color:var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[color:var(--foreground)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {creatingRequestIndex === index
                      ? "Criando pedido..."
                      : "Criar pedido com esta sugestão"}
                  </button>
                </div>
              </SurfaceCard>
            ))}
          </div>
        </div>
      ) : (
        <EmptyState
          title="Nenhuma sugestão gerada ainda"
          description="Defina os filtros acima e gere o primeiro lote de ideias para este tenant."
        />
      )}
    </div>
  );
}
