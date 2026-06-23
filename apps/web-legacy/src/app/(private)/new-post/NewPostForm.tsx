"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PostFormSchema,
  type PostFormInput,
  type PostFormOutput,
} from "./schema";
import { useState } from "react";

import type { Category, Tag } from "@trevvos/types";
import { apiFetch, ApiHttpError } from "apps/web/src/lib/api";

export default function NewPostForm({
  categories,
  tags,
  accessToken,
}: {
  categories: Category[];
  tags: Tag[];
  accessToken?: string;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
    setValue,
  } = useForm<PostFormInput>({
    resolver: zodResolver(PostFormSchema),
    defaultValues: {
      slug: "",
      title: "",
      excerpt: "",
      content: "",
      categoryIds: [],
      tagIds: [],
      intent: "save",
    },
  });

  const [formError, setFormError] = useState<string | null>(null);

  const onSubmit = async (values: PostFormInput) => {
    setFormError(null);

    // Garante saída tipada (arrays sempre presentes)
    const parsed: PostFormOutput = PostFormSchema.parse(values);

    try {
      await apiFetch("/posts", {
        method: "POST",
        accessToken,
        body: {
          slug: parsed.slug,
          title: parsed.title,
          excerpt: parsed.excerpt,
          content: parsed.content,
          categoryIds: parsed.categoryIds,
          tagIds: parsed.tagIds,
          status: parsed.intent === "publish" ? "PUBLISHED" : "DRAFT",
        },
      });
      reset();
    } catch (e) {
      const err = e as ApiHttpError;
      if (err.code === "P2002" && err.fields?.length) {
        for (const f of err.fields) {
          if (f === "slug") {
            setError("slug", { message: "Este slug já está em uso." });
          }
        }
        setFormError("Corrija os campos destacados.");
        return;
      }
      setFormError(err.message || "Não foi possível salvar.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
      {/* SLUG */}
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Slug
        </label>
        <input
          {...register("slug")}
          required
          minLength={3}
          maxLength={120}
          pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
          title="Use apenas minúsculas, números e hífens (kebab-case)"
          placeholder="meu-post-exemplo"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
        />
        {errors.slug && (
          <p className="mt-1 text-xs text-red-600">{errors.slug.message}</p>
        )}
      </div>

      {/* TITLE */}
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Título
        </label>
        <input
          {...register("title")}
          required
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* EXCERPT */}
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Resumo
        </label>
        <textarea
          {...register("excerpt")}
          rows={3}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
        />
        {errors.excerpt && (
          <p className="mt-1 text-xs text-red-600">{errors.excerpt.message}</p>
        )}
      </div>

      {/* CONTENT */}
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Conteúdo (Markdown ou HTML básico)
        </label>
        <textarea
          {...register("content")}
          rows={10}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
          placeholder="Digite o conteúdo do post"
        />
        {errors.content && (
          <p className="mt-1 text-xs text-red-600">{errors.content.message}</p>
        )}
      </div>

      {/* CATEGORIES */}
      <fieldset className="rounded-md border border-slate-200 p-3">
        <legend className="px-1 text-sm font-medium text-slate-700">
          Categorias
        </legend>
        <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-3">
          {categories.map((c) => (
            <label key={c.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                value={c.id}
                {...register("categoryIds")}
                className="h-4 w-4"
              />
              <span>{c.name}</span>
            </label>
          ))}
        </div>
        {errors.categoryIds && (
          <p className="mt-1 text-xs text-red-600">
            {(errors.categoryIds.message as any) || ""}
          </p>
        )}
      </fieldset>

      {/* TAGS */}
      <fieldset className="rounded-md border border-slate-200 p-3">
        <legend className="px-1 text-sm font-medium text-slate-700">
          Tags
        </legend>
        <div className="mt-2 flex flex-wrap gap-3">
          {tags.map((t) => (
            <label
              key={t.id}
              className="inline-flex items-center gap-2 text-sm"
            >
              <input
                type="checkbox"
                value={t.id}
                {...register("tagIds")}
                className="h-4 w-4"
              />
              <span>#{t.name}</span>
            </label>
          ))}
        </div>
        {errors.tagIds && (
          <p className="mt-1 text-xs text-red-600">
            {(errors.tagIds.message as any) || ""}
          </p>
        )}
      </fieldset>

      {/* ERRO GLOBAL */}
      {formError && <p className="text-red-600 text-sm">{formError}</p>}

      {/* AÇÕES */}
      <div className="flex gap-2">
        <button
          type="submit"
          onClick={() => setValue("intent", "save")}
          disabled={isSubmitting}
          className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {isSubmitting ? "Salvando..." : "Salvar rascunho"}
        </button>
        <button
          type="submit"
          onClick={() => setValue("intent", "publish")}
          disabled={isSubmitting}
          className="rounded border border-emerald-300 px-4 py-2 text-sm text-emerald-700 hover:bg-emerald-50 disabled:opacity-60"
        >
          {isSubmitting ? "Publicando..." : "Publicar"}
        </button>
      </div>
    </form>
  );
}
