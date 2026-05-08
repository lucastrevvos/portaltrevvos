"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  ContentDraft,
  ContentDraftPayload,
  ContentFormat,
  StudioApiError,
  createContentDraft,
  updateContentDraft,
} from "../lib/studio-api";
import {
  FormField,
  FormMessage,
  TextInput,
  TextareaInput,
} from "./form-fields";

type DraftErrors = {
  title?: string;
  slides?: string;
  slideTitles: Record<number, string>;
};

function buildSlides(count: number) {
  return Array.from({ length: count }, (_, index) => ({
    slide_number: index + 1,
    title: "",
    body: null as string | null,
    visual_notes: null as string | null,
  }));
}

function buildInitialValues(existing: ContentDraft | null, format: ContentFormat) {
  return {
    title: existing?.title ?? "",
    caption: existing?.caption ?? null,
    fixed_comment: existing?.fixed_comment ?? null,
    stories_suggestion: existing?.stories_suggestion ?? null,
    slides:
      existing?.slides.map((slide) => ({
        slide_number: slide.slide_number,
        title: slide.title,
        body: slide.body,
        visual_notes: slide.visual_notes,
      })) ??
      (format === "carousel" ? buildSlides(5) : []),
  } satisfies ContentDraftPayload;
}

export function ContentDraftForm({
  tenantId,
  requestId,
  format,
  existing,
}: {
  tenantId: string;
  requestId: string;
  format: ContentFormat;
  existing: ContentDraft | null;
}) {
  const router = useRouter();
  const [values, setValues] = useState<ContentDraftPayload>(
    buildInitialValues(existing, format),
  );
  const [errors, setErrors] = useState<DraftErrors>({ slideTitles: {} });
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isCarousel = format === "carousel";
  const isApproved = existing?.status === "approved";

  function setValue<Key extends keyof ContentDraftPayload>(
    key: Key,
    value: ContentDraftPayload[Key],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function setSlideValue(
    index: number,
    field: keyof ContentDraftPayload["slides"][number],
    value: string | number | null,
  ) {
    setValues((current) => ({
      ...current,
      slides: current.slides.map((slide, slideIndex) =>
        slideIndex === index ? { ...slide, [field]: value } : slide,
      ),
    }));
  }

  function addSlide() {
    setValues((current) => ({
      ...current,
      slides: [
        ...current.slides,
        {
          slide_number: current.slides.length + 1,
          title: "",
          body: null,
          visual_notes: null,
        },
      ],
    }));
  }

  function removeSlide(index: number) {
    setValues((current) => ({
      ...current,
      slides: current.slides
        .filter((_, slideIndex) => slideIndex !== index)
        .map((slide, slideIndex) => ({
          ...slide,
          slide_number: slideIndex + 1,
        })),
    }));
  }

  function validate() {
    const nextErrors: DraftErrors = { slideTitles: {} };
    if (!values.title.trim()) {
      nextErrors.title = "Informe o título do draft.";
    }
    if (isCarousel) {
      if (!values.slides.length) {
        nextErrors.slides = "Carrossel precisa ter pelo menos um slide.";
      }
      values.slides.forEach((slide, index) => {
        if (!slide.title.trim()) {
          nextErrors.slideTitles[index] = "Informe o título do slide.";
        }
      });
    }
    setErrors(nextErrors);
    return !nextErrors.title && !nextErrors.slides && !Object.keys(nextErrors.slideTitles).length;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    if (isApproved) {
      return;
    }

    if (!validate()) {
      return;
    }

    setSubmitting(true);
    try {
      if (existing) {
        await updateContentDraft(tenantId, requestId, values);
      } else {
        await createContentDraft(tenantId, requestId, values);
      }
      router.push(
        `/app/tenants/${tenantId}/requests/${requestId}?success=${encodeURIComponent(
          existing
            ? "Draft atualizado com sucesso."
            : "Draft criado com sucesso.",
        )}`,
      );
    } catch (reason) {
      setErrorMessage(
        reason instanceof StudioApiError
          ? reason.detail
          : reason instanceof Error
            ? reason.message
            : "Não foi possível salvar o draft.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {isApproved ? (
        <FormMessage tone="error">
          Draft aprovado. Edição/versionamento será implementado futuramente.
        </FormMessage>
      ) : null}

      <div className="grid gap-5">
        <FormField label="Título" required error={errors.title}>
          <TextInput
            value={values.title}
            invalid={Boolean(errors.title)}
            onChange={(event) => setValue("title", event.target.value)}
            disabled={isApproved}
          />
        </FormField>

        <FormField label="Legenda">
          <TextareaInput
            value={values.caption ?? ""}
            onChange={(event) => setValue("caption", event.target.value || null)}
            disabled={isApproved}
          />
        </FormField>

        <FormField label="Comentário fixado">
          <TextareaInput
            value={values.fixed_comment ?? ""}
            onChange={(event) =>
              setValue("fixed_comment", event.target.value || null)
            }
            disabled={isApproved}
          />
        </FormField>

        <FormField label="Sugestão de stories">
          <TextareaInput
            value={values.stories_suggestion ?? ""}
            onChange={(event) =>
              setValue("stories_suggestion", event.target.value || null)
            }
            disabled={isApproved}
          />
        </FormField>
      </div>

      {isCarousel ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-[color:var(--foreground)]">
                Slides
              </h2>
              <p className="text-sm text-[color:var(--muted)]">
                MVP simples para criar, remover e reordenar pelo número do slide.
              </p>
            </div>
            {!isApproved ? (
              <button
                type="button"
                onClick={addSlide}
                className="rounded-full border border-[color:var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[color:var(--foreground)] transition hover:-translate-y-0.5"
              >
                Adicionar slide
              </button>
            ) : null}
          </div>

          {errors.slides ? <FormMessage tone="error">{errors.slides}</FormMessage> : null}

          <div className="space-y-4">
            {values.slides.map((slide, index) => (
              <div
                key={`${slide.slide_number}-${index}`}
                className="rounded-[1.5rem] border border-[color:var(--border)] bg-white p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold text-[color:var(--foreground)]">
                    Slide {index + 1}
                  </p>
                  {!isApproved && values.slides.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => removeSlide(index)}
                      className="text-sm font-semibold text-rose-700"
                    >
                      Remover
                    </button>
                  ) : null}
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-[120px_1fr]">
                  <FormField label="Número">
                    <TextInput
                      type="number"
                      min={1}
                      value={slide.slide_number}
                      onChange={(event) =>
                        setSlideValue(
                          index,
                          "slide_number",
                          Number(event.target.value) || index + 1,
                        )
                      }
                      disabled={isApproved}
                    />
                  </FormField>

                  <FormField
                    label="Título do slide"
                    required
                    error={errors.slideTitles[index]}
                  >
                    <TextInput
                      value={slide.title}
                      invalid={Boolean(errors.slideTitles[index])}
                      onChange={(event) =>
                        setSlideValue(index, "title", event.target.value)
                      }
                      disabled={isApproved}
                    />
                  </FormField>
                </div>

                <div className="mt-4 grid gap-4">
                  <FormField label="Body">
                    <TextareaInput
                      value={slide.body ?? ""}
                      onChange={(event) =>
                        setSlideValue(index, "body", event.target.value || null)
                      }
                      disabled={isApproved}
                    />
                  </FormField>

                  <FormField label="Notas visuais">
                    <TextareaInput
                      value={slide.visual_notes ?? ""}
                      onChange={(event) =>
                        setSlideValue(
                          index,
                          "visual_notes",
                          event.target.value || null,
                        )
                      }
                      disabled={isApproved}
                    />
                  </FormField>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {errorMessage ? <FormMessage tone="error">{errorMessage}</FormMessage> : null}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting || isApproved}
          className="rounded-full bg-[color:var(--foreground)] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting
            ? "Salvando..."
            : existing
              ? "Atualizar draft"
              : "Criar draft textual"}
        </button>
      </div>
    </form>
  );
}
