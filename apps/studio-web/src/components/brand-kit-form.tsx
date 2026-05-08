"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  BrandKit,
  BrandKitPayload,
  PHOTO_USAGE_OPTIONS,
  StudioApiError,
  createBrandKit,
  updateBrandKit,
} from "../lib/studio-api";
import {
  FormField,
  FormMessage,
  SelectInput,
  TextInput,
  TextareaInput,
} from "./form-fields";

function buildInitialValues(existing: BrandKit | null): BrandKitPayload {
  return {
    logo_url: existing?.logo_url ?? null,
    primary_color: existing?.primary_color ?? "#0F172A",
    secondary_color: existing?.secondary_color ?? "#F3EDE2",
    accent_color: existing?.accent_color ?? "#C75C2A",
    font_preferences: existing?.font_preferences ?? null,
    visual_style: existing?.visual_style ?? null,
    photo_usage_preference: existing?.photo_usage_preference ?? "unknown",
    layout_preference: existing?.layout_preference ?? null,
  };
}

export function BrandKitForm({
  tenantId,
  existing,
}: {
  tenantId: string;
  existing: BrandKit | null;
}) {
  const router = useRouter();
  const [values, setValues] = useState<BrandKitPayload>(buildInitialValues(existing));
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function setValue<Key extends keyof BrandKitPayload>(
    key: Key,
    value: BrandKitPayload[Key],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);

    try {
      if (existing) {
        await updateBrandKit(tenantId, values);
      } else {
        await createBrandKit(tenantId, values);
      }
      router.push(
        `/app/tenants/${tenantId}?success=${encodeURIComponent(
          existing
            ? "Brand kit atualizado com sucesso."
            : "Brand kit criado com sucesso.",
        )}`,
      );
    } catch (reason) {
      setErrorMessage(
        reason instanceof StudioApiError
          ? reason.detail
          : reason instanceof Error
            ? reason.message
            : "Não foi possível salvar o brand kit.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <FormField label="Logo URL">
          <TextInput
            type="url"
            value={values.logo_url ?? ""}
            onChange={(event) => setValue("logo_url", event.target.value || null)}
            placeholder="https://..."
          />
        </FormField>

        <FormField label="Uso de foto">
          <SelectInput
            value={values.photo_usage_preference}
            onChange={(event) =>
              setValue(
                "photo_usage_preference",
                event.target.value as BrandKitPayload["photo_usage_preference"],
              )
            }
          >
            {PHOTO_USAGE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </SelectInput>
        </FormField>

        <FormField label="Cor primária">
          <div className="mt-2 flex gap-3">
            <input
              type="color"
              value={values.primary_color ?? "#0F172A"}
              onChange={(event) => setValue("primary_color", event.target.value)}
              className="h-12 w-16 rounded-2xl border border-[color:var(--border)] bg-white"
            />
            <TextInput
              className="mt-0"
              value={values.primary_color ?? ""}
              onChange={(event) => setValue("primary_color", event.target.value || null)}
            />
          </div>
        </FormField>

        <FormField label="Cor secundária">
          <div className="mt-2 flex gap-3">
            <input
              type="color"
              value={values.secondary_color ?? "#F3EDE2"}
              onChange={(event) => setValue("secondary_color", event.target.value)}
              className="h-12 w-16 rounded-2xl border border-[color:var(--border)] bg-white"
            />
            <TextInput
              className="mt-0"
              value={values.secondary_color ?? ""}
              onChange={(event) =>
                setValue("secondary_color", event.target.value || null)
              }
            />
          </div>
        </FormField>

        <FormField label="Cor de destaque">
          <div className="mt-2 flex gap-3">
            <input
              type="color"
              value={values.accent_color ?? "#C75C2A"}
              onChange={(event) => setValue("accent_color", event.target.value)}
              className="h-12 w-16 rounded-2xl border border-[color:var(--border)] bg-white"
            />
            <TextInput
              className="mt-0"
              value={values.accent_color ?? ""}
              onChange={(event) => setValue("accent_color", event.target.value || null)}
            />
          </div>
        </FormField>

        <FormField label="Preferências de fonte">
          <TextInput
            value={values.font_preferences ?? ""}
            onChange={(event) =>
              setValue("font_preferences", event.target.value || null)
            }
          />
        </FormField>
      </div>

      <FormField label="Estilo visual">
        <TextareaInput
          value={values.visual_style ?? ""}
          onChange={(event) => setValue("visual_style", event.target.value || null)}
        />
      </FormField>

      <FormField label="Preferência de layout">
        <TextareaInput
          value={values.layout_preference ?? ""}
          onChange={(event) =>
            setValue("layout_preference", event.target.value || null)
          }
        />
      </FormField>

      {errorMessage ? <FormMessage tone="error">{errorMessage}</FormMessage> : null}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-[color:var(--foreground)] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting
            ? "Salvando..."
            : existing
              ? "Atualizar brand kit"
              : "Criar brand kit"}
        </button>
      </div>
    </form>
  );
}
