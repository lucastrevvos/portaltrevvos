"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  StudioApiError,
  VISUAL_TEMPLATE_CATEGORY_OPTIONS,
  VisualTemplatePayload,
  createVisualTemplate,
  defaultTechnicalEditorialTemplate,
} from "../lib/studio-api";
import {
  CheckboxField,
  FormField,
  FormMessage,
  SelectInput,
  TextInput,
  TextareaInput,
} from "./form-fields";

type TemplateErrors = Partial<Record<keyof VisualTemplatePayload, string>>;

export function VisualTemplateForm({ tenantId }: { tenantId: string }) {
  const router = useRouter();
  const [values, setValues] = useState<VisualTemplatePayload>(
    defaultTechnicalEditorialTemplate(),
  );
  const [errors, setErrors] = useState<TemplateErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function setValue<Key extends keyof VisualTemplatePayload>(
    key: Key,
    value: VisualTemplatePayload[Key],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function setThemeValue<Key extends keyof VisualTemplatePayload["css_theme"]>(
    key: Key,
    value: VisualTemplatePayload["css_theme"][Key],
  ) {
    setValues((current) => ({
      ...current,
      css_theme: {
        ...current.css_theme,
        [key]: value,
      },
    }));
  }

  function validate() {
    const nextErrors: TemplateErrors = {};
    if (!values.name.trim()) {
      nextErrors.name = "Informe o nome do template.";
    }
    if (!values.layout_rules.trim()) {
      nextErrors.layout_rules = "Informe as regras de layout.";
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
      await createVisualTemplate(tenantId, values);
      router.push(
        `/app/tenants/${tenantId}?success=${encodeURIComponent(
          "Template visual criado com sucesso.",
        )}`,
      );
    } catch (reason) {
      setErrorMessage(
        reason instanceof StudioApiError
          ? reason.detail
          : reason instanceof Error
            ? reason.message
            : "Não foi possível criar o template visual.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setValues(defaultTechnicalEditorialTemplate())}
          className="rounded-full border border-[color:var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[color:var(--foreground)] transition hover:-translate-y-0.5"
        >
          Criar template Técnico Editorial padrão
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <FormField label="Nome" required error={errors.name}>
          <TextInput
            value={values.name}
            invalid={Boolean(errors.name)}
            onChange={(event) => setValue("name", event.target.value)}
          />
        </FormField>

        <FormField label="Categoria">
          <SelectInput
            value={values.category}
            onChange={(event) =>
              setValue(
                "category",
                event.target.value as VisualTemplatePayload["category"],
              )
            }
          >
            {VISUAL_TEMPLATE_CATEGORY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </SelectInput>
        </FormField>

        <FormField label="Descrição">
          <TextInput
            value={values.description ?? ""}
            onChange={(event) => setValue("description", event.target.value || null)}
          />
        </FormField>

        <FormField label="Aspect ratio padrão">
          <TextInput
            value={values.default_aspect_ratio}
            onChange={(event) =>
              setValue("default_aspect_ratio", event.target.value)
            }
          />
        </FormField>
      </div>

      <FormField label="Regras de layout" required error={errors.layout_rules}>
        <TextareaInput
          value={values.layout_rules}
          invalid={Boolean(errors.layout_rules)}
          onChange={(event) => setValue("layout_rules", event.target.value)}
        />
      </FormField>

      <div className="grid gap-5 md:grid-cols-2">
        <FormField label="Background">
          <TextInput
            value={String(values.css_theme.background ?? "")}
            onChange={(event) => setThemeValue("background", event.target.value)}
          />
        </FormField>
        <FormField label="Primary">
          <TextInput
            value={String(values.css_theme.primary ?? "")}
            onChange={(event) => setThemeValue("primary", event.target.value)}
          />
        </FormField>
        <FormField label="Secondary">
          <TextInput
            value={String(values.css_theme.secondary ?? "")}
            onChange={(event) => setThemeValue("secondary", event.target.value)}
          />
        </FormField>
        <FormField label="Accent">
          <TextInput
            value={String(values.css_theme.accent ?? "")}
            onChange={(event) => setThemeValue("accent", event.target.value)}
          />
        </FormField>
        <FormField label="Title font">
          <TextInput
            value={String(values.css_theme.titleFont ?? "")}
            onChange={(event) => setThemeValue("titleFont", event.target.value)}
          />
        </FormField>
        <FormField label="Body font">
          <TextInput
            value={String(values.css_theme.bodyFont ?? "")}
            onChange={(event) => setThemeValue("bodyFont", event.target.value)}
          />
        </FormField>
        <FormField label="Largura">
          <TextInput
            type="number"
            value={values.width}
            onChange={(event) => setValue("width", Number(event.target.value) || 0)}
          />
        </FormField>
        <FormField label="Altura">
          <TextInput
            type="number"
            value={values.height}
            onChange={(event) => setValue("height", Number(event.target.value) || 0)}
          />
        </FormField>
      </div>

      <CheckboxField
        label="Template ativo"
        checked={values.is_active}
        onChange={(checked) => setValue("is_active", checked)}
      />

      {errorMessage ? <FormMessage tone="error">{errorMessage}</FormMessage> : null}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-[color:var(--foreground)] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Criando..." : "Criar template visual"}
        </button>
      </div>
    </form>
  );
}
