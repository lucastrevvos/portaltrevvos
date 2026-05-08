"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Loader2, Trash2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  BRAND_ASSET_TYPE_OPTIONS,
  BrandAsset,
  BrandAssetType,
  StudioApiError,
  createBrandAsset,
  deleteBrandAsset,
  getAssetUrl,
  updateBrandAsset,
} from "../lib/studio-api";
import { formatBrandAssetType, SurfaceCard } from "./studio-ui";
import {
  CheckboxField,
  FormField,
  FormMessage,
  SelectInput,
  TextInput,
} from "./form-fields";

type AssetDraftState = {
  label: string;
  type: BrandAssetType;
  isPrimary: boolean;
};

function buildDraftState(assets: BrandAsset[]) {
  return assets.reduce<Record<string, AssetDraftState>>((acc, asset) => {
    acc[asset.id] = {
      label: asset.label ?? "",
      type: asset.asset_type,
      isPrimary: asset.is_primary,
    };
    return acc;
  }, {});
}

function resolveError(reason: unknown) {
  if (reason instanceof StudioApiError) {
    return reason.detail;
  }
  if (reason instanceof Error) {
    return reason.message;
  }
  return "Nao foi possivel concluir a operacao.";
}

export function BrandAssetsManager({
  tenantId,
  assets,
}: {
  tenantId: string;
  assets: BrandAsset[];
}) {
  const router = useRouter();
  const [filter, setFilter] = useState<BrandAssetType | "all">("all");
  const [uploadType, setUploadType] = useState<BrandAssetType>("logo");
  const [uploadLabel, setUploadLabel] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPrimary, setUploadPrimary] = useState(true);
  const [drafts, setDrafts] = useState<Record<string, AssetDraftState>>(
    () => buildDraftState(assets),
  );
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [activeAction, setActiveAction] = useState<string | null>(null);

  useEffect(() => {
    setDrafts(buildDraftState(assets));
  }, [assets]);

  const visibleAssets = useMemo(
    () =>
      filter === "all" ? assets : assets.filter((asset) => asset.asset_type === filter),
    [assets, filter],
  );

  const counters = useMemo(
    () =>
      assets.reduce(
        (acc, asset) => {
          acc.total += 1;
          acc[asset.asset_type] = (acc[asset.asset_type] ?? 0) + 1;
          return acc;
        },
        {
          total: 0,
          logo: 0,
          profile_photo: 0,
          brand_reference: 0,
          post_reference: 0,
          product_photo: 0,
          general_asset: 0,
        } as Record<string, number>,
      ),
    [assets],
  );

  function handleAsync(action: string, work: () => Promise<void>) {
    setActiveAction(action);
    setFeedback(null);
    setError(null);
    startTransition(async () => {
      try {
        await work();
        router.refresh();
      } catch (reason) {
        setError(resolveError(reason));
      } finally {
        setActiveAction(null);
      }
    });
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
      <SurfaceCard>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
              Upload de assets
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[color:var(--foreground)]">
              Brand assets do tenant
            </h2>
            <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
              Envie logo, foto principal e referencias visuais. O logo principal
              sera usado no renderer quando estiver marcado como principal.
            </p>
          </div>
          <div className="rounded-2xl border border-[color:var(--border)] bg-white px-4 py-3 text-sm text-[color:var(--muted)]">
            <p>Total: {counters.total}</p>
            <p className="mt-1">Logo principal: {counters.logo}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          <FormField
            label="Arquivo"
            hint="PNG, JPG, WEBP ou outro asset visual do cliente."
            required
          >
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setUploadFile(event.target.files?.[0] ?? null)}
              className="mt-2 block w-full text-sm text-[color:var(--muted)] file:mr-4 file:rounded-full file:border-0 file:bg-[color:var(--foreground)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
            />
          </FormField>

          <FormField label="Tipo do asset" required>
            <SelectInput
              value={uploadType}
              onChange={(event) => setUploadType(event.target.value as BrandAssetType)}
            >
              {BRAND_ASSET_TYPE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {formatBrandAssetType(option)}
                </option>
              ))}
            </SelectInput>
          </FormField>

          <FormField label="Label" hint="Opcional. Nome amigavel para organizar o acervo.">
            <TextInput
              value={uploadLabel}
              onChange={(event) => setUploadLabel(event.target.value)}
              placeholder="Logo principal"
            />
          </FormField>

          <CheckboxField
            label="Marcar como principal"
            checked={uploadPrimary}
            onChange={setUploadPrimary}
          />

          <button
            type="button"
            disabled={!uploadFile || isPending}
            onClick={() => {
              if (!uploadFile) {
                return;
              }
              handleAsync("upload", async () => {
                await createBrandAsset(tenantId, {
                  file: uploadFile,
                  type: uploadType,
                  label: uploadLabel,
                  is_primary: uploadPrimary,
                });
                setUploadFile(null);
                setUploadLabel("");
                setUploadType("logo");
                setUploadPrimary(true);
                setFeedback("Asset enviado com sucesso.");
              });
            }}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--foreground)] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {isPending && activeAction === "upload" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            Enviar asset
          </button>
        </div>

        {feedback ? <FormMessage tone="success">{feedback}</FormMessage> : null}
        {error ? <FormMessage tone="error">{error}</FormMessage> : null}
      </SurfaceCard>

      <SurfaceCard>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
              Biblioteca
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[color:var(--foreground)]">
              Itens cadastrados
            </h2>
          </div>
          <SelectInput
            value={filter}
            onChange={(event) => setFilter(event.target.value as BrandAssetType | "all")}
            className="max-w-xs"
          >
            <option value="all">Todos os tipos</option>
            {BRAND_ASSET_TYPE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {formatBrandAssetType(option)}
              </option>
            ))}
          </SelectInput>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {visibleAssets.length ? (
            visibleAssets.map((asset) => {
              const draft = drafts[asset.id] ?? {
                label: asset.label ?? "",
                type: asset.asset_type,
                isPrimary: asset.is_primary,
              };

              return (
                <article
                  key={asset.id}
                  className="overflow-hidden rounded-[1.5rem] border border-[color:var(--border)] bg-white shadow-[0_12px_28px_rgba(24,24,27,0.06)]"
                >
                  <a href={getAssetUrl(asset.public_url)} target="_blank" rel="noreferrer">
                    <img
                      src={getAssetUrl(asset.public_url)}
                      alt={asset.label || asset.file_name}
                      className="aspect-square w-full object-cover"
                    />
                  </a>
                  <div className="space-y-4 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-[color:var(--foreground)]">
                          {draft.label || asset.label || asset.file_name}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[color:var(--muted)]">
                          {formatBrandAssetType(asset.asset_type)}
                        </p>
                      </div>
                      <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--background)] px-3 py-1 text-xs font-semibold text-[color:var(--foreground)]">
                        {asset.is_primary ? "Principal" : "Secundario"}
                      </span>
                    </div>

                    <div className="grid gap-3">
                      <TextInput
                        value={draft.label}
                        onChange={(event) =>
                          setDrafts((current) => ({
                            ...current,
                            [asset.id]: {
                              ...draft,
                              label: event.target.value,
                            },
                          }))
                        }
                        placeholder="Label do asset"
                      />

                      <SelectInput
                        value={draft.type}
                        onChange={(event) =>
                          setDrafts((current) => ({
                            ...current,
                            [asset.id]: {
                              ...draft,
                              type: event.target.value as BrandAssetType,
                            },
                          }))
                        }
                      >
                        {BRAND_ASSET_TYPE_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {formatBrandAssetType(option)}
                          </option>
                        ))}
                      </SelectInput>

                      <CheckboxField
                        label="Principal"
                        checked={draft.isPrimary}
                        onChange={(checked) =>
                          setDrafts((current) => ({
                            ...current,
                            [asset.id]: {
                              ...draft,
                              isPrimary: checked,
                            },
                          }))
                        }
                      />
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() =>
                          handleAsync(`update-${asset.id}`, async () => {
                            await updateBrandAsset(tenantId, asset.id, {
                              label: draft.label,
                              asset_type: draft.type,
                              is_primary: draft.isPrimary,
                            });
                            setFeedback("Asset atualizado com sucesso.");
                          })
                        }
                        className="inline-flex items-center gap-2 rounded-full bg-[color:var(--foreground)] px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45"
                      >
                        Salvar
                      </button>
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => {
                          const confirmed = window.confirm(
                            "Excluir este brand asset? Esta ação nao pode ser desfeita.",
                          );
                          if (!confirmed) {
                            return;
                          }
                          handleAsync(`delete-${asset.id}`, async () => {
                            await deleteBrandAsset(tenantId, asset.id);
                            setFeedback("Asset removido com sucesso.");
                          });
                        }}
                        className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45"
                      >
                        <Trash2 className="h-4 w-4" />
                        Excluir
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-[color:var(--border)] bg-white/50 p-6 text-sm text-[color:var(--muted)]">
              Nenhum asset encontrado para este filtro.
            </div>
          )}
        </div>
      </SurfaceCard>
    </div>
  );
}
