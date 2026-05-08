"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { createTenant, StudioApiError, TenantPayload } from "../lib/studio-api";
import { FormField, FormMessage, TextInput } from "./form-fields";

type TenantFormErrors = Partial<Record<keyof TenantPayload, string>>;

function normalizeSlug(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function TenantForm() {
  const router = useRouter();
  const [values, setValues] = useState<TenantPayload>({
    name: "",
    slug: "",
    business_name: null,
    niche: "",
  });
  const [errors, setErrors] = useState<TenantFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canAutofillSlug = useMemo(() => !values.slug.trim(), [values.slug]);

  function setValue<Key extends keyof TenantPayload>(key: Key, value: TenantPayload[Key]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function validate() {
    const nextErrors: TenantFormErrors = {};
    if (!values.name.trim()) {
      nextErrors.name = "Informe o nome do tenant.";
    }
    if (!values.slug.trim()) {
      nextErrors.slug = "Informe o slug.";
    }
    if (!values.niche.trim()) {
      nextErrors.niche = "Informe o nicho.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    if (!validate()) {
      return;
    }

    setSubmitting(true);
    try {
      const tenant = await createTenant({
        ...values,
        slug: normalizeSlug(values.slug),
      });
      router.push(
        `/app/tenants/${tenant.id}?success=${encodeURIComponent(
          "Tenant criado com sucesso.",
        )}`,
      );
    } catch (reason) {
      setErrorMessage(
        reason instanceof StudioApiError
          ? reason.detail
          : reason instanceof Error
            ? reason.message
            : "Não foi possível criar o tenant.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <FormField label="Nome" required error={errors.name}>
          <TextInput
            value={values.name}
            invalid={Boolean(errors.name)}
            onChange={(event) => {
              const nextName = event.target.value;
              setValue("name", nextName);
              if (canAutofillSlug) {
                setValue("slug", normalizeSlug(nextName));
              }
            }}
            placeholder="Ex.: Clínica Horizonte"
          />
        </FormField>

        <FormField
          label="Slug"
          required
          error={errors.slug}
          hint="Usado na URL do tenant. Letras minúsculas e hífens."
        >
          <TextInput
            value={values.slug}
            invalid={Boolean(errors.slug)}
            onChange={(event) => setValue("slug", normalizeSlug(event.target.value))}
            placeholder="clinica-horizonte"
          />
        </FormField>

        <FormField label="Razão social" error={errors.business_name}>
          <TextInput
            value={values.business_name ?? ""}
            onChange={(event) => setValue("business_name", event.target.value || null)}
            placeholder="Ex.: Clínica Horizonte Saúde Integrada"
          />
        </FormField>

        <FormField label="Nicho" required error={errors.niche}>
          <TextInput
            value={values.niche}
            invalid={Boolean(errors.niche)}
            onChange={(event) => setValue("niche", event.target.value)}
            placeholder="nutrition, dermatology, education..."
          />
        </FormField>
      </div>

      {errorMessage ? <FormMessage tone="error">{errorMessage}</FormMessage> : null}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-[color:var(--foreground)] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Criando..." : "Criar tenant"}
        </button>
      </div>
    </form>
  );
}
