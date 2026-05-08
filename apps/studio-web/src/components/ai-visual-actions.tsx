"use client";

import { useMemo, useState, useTransition } from "react";
import { Loader2, Sparkles, WandSparkles } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  BrandAsset,
  CreativeAsset,
  StudioApiError,
  generateVisualBackgrounds,
  getAssetUrl,
  renderContentRequestWithMode,
} from "../lib/studio-api";
import { EmptyState, SurfaceCard } from "./studio-ui";
import {
  FormField,
  FormMessage,
  SelectInput,
} from "./form-fields";

function resolveError(reason: unknown) {
  if (reason instanceof StudioApiError) {
    return reason.detail;
  }
  if (reason instanceof Error) {
    return reason.message;
  }
  return "Nao foi possivel concluir a operacao.";
}

export function AIVisualActions({
  tenantId,
  requestId,
  requestStatus,
  hasReadyRenderSpecs,
  readySlideNumbers,
  brandAssets,
  backgroundAssets,
}: {
  tenantId: string;
  requestId: string;
  requestStatus: string;
  hasReadyRenderSpecs: boolean;
  readySlideNumbers: number[];
  brandAssets: BrandAsset[];
  backgroundAssets: CreativeAsset[];
}) {
  const router = useRouter();
  const [styleMode, setStyleMode] = useState<"brand_aligned" | "editorial">(
    "brand_aligned",
  );
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<"generate" | "render" | null>(
    null,
  );
  const [isPending, startTransition] = useTransition();

  const hasLogo = useMemo(
    () => brandAssets.some((asset) => asset.asset_type === "logo" && asset.is_primary),
    [brandAssets],
  );
  const referenceCount = useMemo(
    () => brandAssets.filter((asset) => asset.asset_type !== "logo").length,
    [brandAssets],
  );
  const canGenerate =
    requestStatus === "visual_prompt_ready" && hasReadyRenderSpecs && readySlideNumbers.length > 0;
  const canRender = requestStatus === "visual_prompt_ready" && backgroundAssets.length > 0;

  function run(action: "generate" | "render", work: () => Promise<void>) {
    setActiveAction(action);
    setFeedback(null);
    setError(null);
    startTransition(async () => {
      try {
        await work();
        setFeedback(
          action === "generate"
            ? "Fundos gerados com sucesso."
            : "Render com IA visual iniciado com sucesso.",
        );
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
            IA Visual
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-[color:var(--foreground)]">
            Fundos gerados por IA, texto aplicado pelo renderer
          </h2>
          <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
            O logo real do cliente continua vindo do upload da marca. A IA gera
            somente o fundo e a atmosfera visual.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm text-[color:var(--muted)]">
          <span className="rounded-full border border-[color:var(--border)] bg-white px-3 py-1">
            Logo principal: {hasLogo ? "encontrado" : "ausente"}
          </span>
          <span className="rounded-full border border-[color:var(--border)] bg-white px-3 py-1">
            Referencias: {referenceCount}
          </span>
        </div>
      </div>

      {!hasLogo ? (
        <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Nenhum logo principal encontrado. O post sera renderizado sem
          logotipo.
        </p>
      ) : null}
      {!referenceCount ? (
        <p className="mt-3 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-700">
          Sem referencias visuais da marca, o resultado pode ficar menos alinhado.
        </p>
      ) : null}

      <div className="mt-6 grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-4 rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--background)] p-4">
          <FormField
            label="Modo visual"
            hint="brand_aligned gera composições mais editoriais. editorial permite maior liberdade visual."
          >
            <SelectInput
              value={styleMode}
              onChange={(event) =>
                setStyleMode(event.target.value as "brand_aligned" | "editorial")
              }
            >
              <option value="brand_aligned">Brand aligned</option>
              <option value="editorial">Editorial</option>
            </SelectInput>
          </FormField>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={!canGenerate || isPending}
              onClick={() =>
                run("generate", async () => {
                  await generateVisualBackgrounds(tenantId, requestId, {
                    overwrite: backgroundAssets.length > 0,
                    style_mode: styleMode,
                    slides: readySlideNumbers,
                  });
                })
              }
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--foreground)] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45"
            >
              {isPending && activeAction === "generate" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {backgroundAssets.length > 0 ? "Regerar fundos" : "Gerar fundos com IA"}
            </button>

            <button
              type="button"
              disabled={!canRender || isPending}
              onClick={() =>
                run("render", async () => {
                  await renderContentRequestWithMode(tenantId, requestId, "ai_visual");
                })
              }
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[color:var(--border)] bg-white px-5 py-3 text-sm font-semibold text-[color:var(--foreground)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45"
            >
              {isPending && activeAction === "render" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <WandSparkles className="h-4 w-4" />
              )}
              Renderizar com IA visual
            </button>
          </div>

          {feedback ? <FormMessage tone="success">{feedback}</FormMessage> : null}
          {error ? <FormMessage tone="error">{error}</FormMessage> : null}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
              Fundos gerados
            </p>
            <span className="text-sm text-[color:var(--muted)]">
              {backgroundAssets.length} arquivo(s)
            </span>
          </div>

          {backgroundAssets.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {backgroundAssets.map((asset) => (
                <article
                  key={asset.id}
                  className="overflow-hidden rounded-[1.5rem] border border-[color:var(--border)] bg-white shadow-[0_12px_28px_rgba(24,24,27,0.06)]"
                >
                  <a href={getAssetUrl(asset.url)} target="_blank" rel="noreferrer">
                    <img
                      src={getAssetUrl(asset.url)}
                      alt={asset.file_name}
                      className="aspect-square w-full object-cover"
                    />
                  </a>
                  <div className="p-4">
                    <p className="text-sm font-semibold text-[color:var(--foreground)]">
                      Fundo de IA
                    </p>
                    <p className="mt-1 text-sm text-[color:var(--muted)] break-all">
                      {asset.file_name}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Nenhum fundo gerado"
              description="Quando houver backgrounds de IA persistidos, eles aparecem aqui por slide."
            />
          )}
        </div>
      </div>
    </SurfaceCard>
  );
}
