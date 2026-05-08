"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  OnboardingPayload,
  OnboardingProfile,
  SERVICE_MODE_OPTIONS,
  StudioApiError,
  createOnboarding,
  updateOnboarding,
} from "../lib/studio-api";
import {
  FormField,
  FormMessage,
  SelectInput,
  TextInput,
  TextareaInput,
} from "./form-fields";

type OnboardingErrors = Partial<Record<keyof OnboardingPayload, string>>;

function buildInitialValues(existing: OnboardingProfile | null): OnboardingPayload {
  return {
    professional_name: existing?.professional_name ?? "",
    instagram_handle: existing?.instagram_handle ?? null,
    website_url: existing?.website_url ?? null,
    whatsapp_number: existing?.whatsapp_number ?? null,
    city: existing?.city ?? null,
    service_mode: existing?.service_mode ?? "online",
    target_audience: existing?.target_audience ?? "",
    audience_pain_points: existing?.audience_pain_points ?? "",
    main_services: existing?.main_services ?? "",
    desired_positioning: existing?.desired_positioning ?? "",
    tone_of_voice: existing?.tone_of_voice ?? "",
    avoid_communication: existing?.avoid_communication ?? null,
    brand_phrase: existing?.brand_phrase ?? null,
    main_cta: existing?.main_cta ?? null,
  };
}

export function OnboardingForm({
  tenantId,
  existing,
}: {
  tenantId: string;
  existing: OnboardingProfile | null;
}) {
  const router = useRouter();
  const [values, setValues] = useState<OnboardingPayload>(buildInitialValues(existing));
  const [errors, setErrors] = useState<OnboardingErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function setValue<Key extends keyof OnboardingPayload>(
    key: Key,
    value: OnboardingPayload[Key],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function validate() {
    const nextErrors: OnboardingErrors = {};
    const requiredKeys: Array<keyof OnboardingPayload> = [
      "professional_name",
      "target_audience",
      "audience_pain_points",
      "main_services",
      "desired_positioning",
      "tone_of_voice",
    ];
    for (const key of requiredKeys) {
      const value = values[key];
      if (typeof value === "string" && !value.trim()) {
        nextErrors[key] = "Campo obrigatório.";
      }
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
      if (existing) {
        await updateOnboarding(tenantId, values);
      } else {
        await createOnboarding(tenantId, values);
      }
      router.push(
        `/app/tenants/${tenantId}?success=${encodeURIComponent(
          existing
            ? "Onboarding atualizado com sucesso."
            : "Onboarding criado com sucesso.",
        )}`,
      );
    } catch (reason) {
      setErrorMessage(
        reason instanceof StudioApiError
          ? reason.detail
          : reason instanceof Error
            ? reason.message
            : "Não foi possível salvar o onboarding.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <FormField label="Nome profissional" required error={errors.professional_name}>
          <TextInput
            value={values.professional_name}
            invalid={Boolean(errors.professional_name)}
            onChange={(event) => setValue("professional_name", event.target.value)}
          />
        </FormField>

        <FormField label="Instagram">
          <TextInput
            value={values.instagram_handle ?? ""}
            onChange={(event) => setValue("instagram_handle", event.target.value || null)}
            placeholder="@perfil"
          />
        </FormField>

        <FormField label="Website">
          <TextInput
            type="url"
            value={values.website_url ?? ""}
            onChange={(event) => setValue("website_url", event.target.value || null)}
            placeholder="https://..."
          />
        </FormField>

        <FormField label="WhatsApp">
          <TextInput
            value={values.whatsapp_number ?? ""}
            onChange={(event) => setValue("whatsapp_number", event.target.value || null)}
          />
        </FormField>

        <FormField label="Cidade">
          <TextInput
            value={values.city ?? ""}
            onChange={(event) => setValue("city", event.target.value || null)}
          />
        </FormField>

        <FormField label="Modo de atendimento">
          <SelectInput
            value={values.service_mode}
            onChange={(event) =>
              setValue("service_mode", event.target.value as OnboardingPayload["service_mode"])
            }
          >
            {SERVICE_MODE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </SelectInput>
        </FormField>
      </div>

      <div className="grid gap-5">
        <FormField label="Público-alvo" required error={errors.target_audience}>
          <TextareaInput
            value={values.target_audience}
            invalid={Boolean(errors.target_audience)}
            onChange={(event) => setValue("target_audience", event.target.value)}
          />
        </FormField>

        <FormField
          label="Dores do público"
          required
          error={errors.audience_pain_points}
        >
          <TextareaInput
            value={values.audience_pain_points}
            invalid={Boolean(errors.audience_pain_points)}
            onChange={(event) => setValue("audience_pain_points", event.target.value)}
          />
        </FormField>

        <FormField label="Serviços principais" required error={errors.main_services}>
          <TextareaInput
            value={values.main_services}
            invalid={Boolean(errors.main_services)}
            onChange={(event) => setValue("main_services", event.target.value)}
          />
        </FormField>

        <FormField
          label="Posicionamento desejado"
          required
          error={errors.desired_positioning}
        >
          <TextareaInput
            value={values.desired_positioning}
            invalid={Boolean(errors.desired_positioning)}
            onChange={(event) => setValue("desired_positioning", event.target.value)}
          />
        </FormField>

        <FormField label="Tom de voz" required error={errors.tone_of_voice}>
          <TextareaInput
            value={values.tone_of_voice}
            invalid={Boolean(errors.tone_of_voice)}
            onChange={(event) => setValue("tone_of_voice", event.target.value)}
          />
        </FormField>

        <FormField label="Evitar na comunicação">
          <TextareaInput
            value={values.avoid_communication ?? ""}
            onChange={(event) =>
              setValue("avoid_communication", event.target.value || null)
            }
          />
        </FormField>

        <div className="grid gap-5 md:grid-cols-2">
          <FormField label="Frase de marca">
            <TextInput
              value={values.brand_phrase ?? ""}
              onChange={(event) => setValue("brand_phrase", event.target.value || null)}
            />
          </FormField>

          <FormField label="CTA principal">
            <TextInput
              value={values.main_cta ?? ""}
              onChange={(event) => setValue("main_cta", event.target.value || null)}
            />
          </FormField>
        </div>
      </div>

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
              ? "Atualizar onboarding"
              : "Criar onboarding"}
        </button>
      </div>
    </form>
  );
}
