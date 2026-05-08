"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  CONTENT_FORMAT_OPTIONS,
  CONTENT_OBJECTIVE_OPTIONS,
  ContentRequestPayload,
  StudioApiError,
  createContentRequest,
} from "../lib/studio-api";
import {
  FormField,
  FormMessage,
  SelectInput,
  TextInput,
  TextareaInput,
} from "./form-fields";

type RequestErrors = Partial<Record<keyof ContentRequestPayload, string>>;

export function ContentRequestForm({ tenantId }: { tenantId: string }) {
  const router = useRouter();
  const [values, setValues] = useState<ContentRequestPayload>({
    title: "",
    format: "carousel",
    objective: "authority",
    cta: null,
    theme: "",
    briefing: null,
  });
  const [errors, setErrors] = useState<RequestErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function setValue<Key extends keyof ContentRequestPayload>(
    key: Key,
    value: ContentRequestPayload[Key],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function validate() {
    const nextErrors: RequestErrors = {};
    if (!values.title.trim()) {
      nextErrors.title = "Informe o título do pedido.";
    }
    if (!values.theme.trim()) {
      nextErrors.theme = "Informe o tema.";
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
      const contentRequest = await createContentRequest(tenantId, values);
      router.push(
        `/app/tenants/${tenantId}/requests/${contentRequest.id}?success=${encodeURIComponent(
          "Pedido criado com sucesso.",
        )}`,
      );
    } catch (reason) {
      setErrorMessage(
        reason instanceof StudioApiError
          ? reason.detail
          : reason instanceof Error
            ? reason.message
            : "Não foi possível criar o pedido.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <FormField label="Título" required error={errors.title}>
          <TextInput
            value={values.title}
            invalid={Boolean(errors.title)}
            onChange={(event) => setValue("title", event.target.value)}
          />
        </FormField>

        <FormField label="Tema" required error={errors.theme}>
          <TextInput
            value={values.theme}
            invalid={Boolean(errors.theme)}
            onChange={(event) => setValue("theme", event.target.value)}
          />
        </FormField>

        <FormField label="Formato">
          <SelectInput
            value={values.format}
            onChange={(event) =>
              setValue("format", event.target.value as ContentRequestPayload["format"])
            }
          >
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
              setValue(
                "objective",
                event.target.value as ContentRequestPayload["objective"],
              )
            }
          >
            {CONTENT_OBJECTIVE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </SelectInput>
        </FormField>

        <FormField label="CTA">
          <TextInput
            value={values.cta ?? ""}
            onChange={(event) => setValue("cta", event.target.value || null)}
          />
        </FormField>
      </div>

      <FormField label="Briefing">
        <TextareaInput
          value={values.briefing ?? ""}
          onChange={(event) => setValue("briefing", event.target.value || null)}
        />
      </FormField>

      {errorMessage ? <FormMessage tone="error">{errorMessage}</FormMessage> : null}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-[color:var(--foreground)] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Criando..." : "Criar pedido"}
        </button>
      </div>
    </form>
  );
}
