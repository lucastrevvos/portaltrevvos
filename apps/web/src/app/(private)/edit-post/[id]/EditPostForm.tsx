// apps/web/src/app/(private)/edit-post/[id]/EditPostForm.tsx
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { PostEditSchema, type PostEditInput } from "./schema";
import type { Category, Tag, PostStatus } from "@trevvos/types";
import { ApiError, apiFetch } from "apps/web/src/lib/api";
import { MarkdownView } from "apps/web/src/components/MarkdownView";

// ✅ usar as variáveis públicas no client
const API = process.env.NEXT_PUBLIC_API_URL!;
const APP = process.env.NEXT_PUBLIC_APP_SLUG || "portal";

type Props = {
  postId: string;
  initialValues: {
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    categoryIds: string[];
    tagIds: string[];
    status: PostStatus;
    coverImage?: string;
  };
  categories: Category[];
  tags: Tag[];
  accessToken?: string;
};

export default function EditPostForm({
  postId,
  initialValues,
  categories,
  tags,
  accessToken,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    setValue,
    watch,
    reset,
  } = useForm<PostEditInput>({
    resolver: zodResolver(PostEditSchema),
    defaultValues: {
      ...initialValues,
      intent: "save",
    },
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [tab, setTab] = useState<"edit" | "preview">("edit");

  const status = watch("status");
  const contentValue = watch("content") || "";
  const coverImage = watch("coverImage") || "";

  useEffect(() => {
    reset({ ...initialValues, intent: "save" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  // ⬇️ helper para upload multipart (sem apiFetch pois ele seta JSON)
  async function uploadCover(file: File) {
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch(`${API}/uploads`, {
      method: "POST",
      headers: {
        "x-app-slug": APP,
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: fd,
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `Falha no upload (${res.status})`);
    }
    const data = (await res.json()) as { url: string };
    return data.url;
  }

  const onSubmit = async (values: PostEditInput) => {
    setFormError(null);
    setSuccess(null);

    const parsed = PostEditSchema.parse(values);
    let nextStatus: PostStatus = parsed.status;
    if (parsed.intent === "publish") nextStatus = "PUBLISHED";
    if (parsed.intent === "unpublish") nextStatus = "DRAFT";

    try {
      await apiFetch(`/posts/${postId}`, {
        method: "PUT",
        accessToken,
        body: {
          slug: parsed.slug,
          title: parsed.title,
          excerpt: parsed.excerpt,
          content: parsed.content,
          categoryIds: parsed.categoryIds,
          tagIds: parsed.tagIds,
          status: nextStatus,
          coverImage: parsed.coverImage, // ⬅️ garantir que enviamos a capa
        },
      });

      setSuccess("Post atualizado com sucesso!");
      setValue("status", nextStatus);
    } catch (e) {
      const err = e as ApiError;
      if (
        err.code === "P2002" &&
        Array.isArray(err.fields) &&
        err.fields.length
      ) {
        for (const name of err.fields) {
          if (name === "slug")
            setError("slug", { message: "Este slug já está em uso." });
          else setFormError(`Campo único já em uso: ${name}`);
        }
        setFormError((prev) => prev ?? "Corrija os campos destacados.");
        return;
      }
      setFormError(err.message || "Não foi possível atualizar.");
    }
  };

  const submit = handleSubmit(onSubmit);

  async function onDelete() {
    if (!confirm("Tem certeza que deseja excluir este post?")) return;
    try {
      await apiFetch(`/posts/${postId}`, {
        method: "DELETE",
        accessToken,
      });
      window.location.href = "/";
    } catch (e) {
      const err = e as ApiError;
      setFormError(err.message || "Falha ao excluir.");
    }
  }

  return (
    <form
      method="post"
      onSubmit={(e) => {
        e.preventDefault();
        void submit(e);
      }}
      className="grid gap-4"
      noValidate
    >
      {/* alerts */}
      {success && (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {success}
        </div>
      )}
      {formError && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {formError}
        </div>
      )}

      {/* slug */}
      <div>
        <label className="mb-1 block text-sm font-medium">Slug</label>
        <input
          {...register("slug")}
          required
          minLength={3}
          maxLength={120}
          pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
          title="Use apenas minúsculas, números e hífens (kebab-case)"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
        />
        {errors.slug && (
          <p className="mt-1 text-xs text-red-600">{errors.slug.message}</p>
        )}
      </div>

      {/* título */}
      <div>
        <label className="mb-1 block text-sm font-medium">Título</label>
        <input
          {...register("title")}
          required
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* capa (upload + preview) */}
      <div>
        <label className="mb-1 block text-sm font-medium">Capa</label>

        {coverImage && (
          <div className="mb-2">
            {/* preview */}
            <img
              src={coverImage}
              alt="Capa"
              className="h-36 w-full max-w-md rounded border border-slate-200 object-cover"
            />
          </div>
        )}

        <div className="flex items-center gap-3">
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              try {
                const url = await uploadCover(file);
                setValue("coverImage", url, { shouldDirty: true });
                setSuccess("Imagem enviada!");
              } catch (err: any) {
                setFormError(err.message || "Falha ao enviar imagem.");
              }
            }}
            className="rounded border border-slate-300 py-2 px-3 text-sm outline-none focus:border-slate-500"
          />
          {/* permitir setar/remover manualmente */}
          <input
            {...register("coverImage")}
            placeholder="/uploads/arquivo.png ou https://..."
            className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
          />
          {coverImage && (
            <button
              type="button"
              onClick={() => setValue("coverImage", "", { shouldDirty: true })}
              className="bg-red-300 rounded border border-red-300 text-red-500 px-3 py-2 text-sm hover:bg-slate-50"
            >
              Remover
            </button>
          )}
        </div>

        {errors.coverImage && (
          <p className="mt-1 text-xs text-red-600">
            {errors.coverImage.message as string}
          </p>
        )}
      </div>

      {/* resumo */}
      <div>
        <label className="mb-1 block text-sm font-medium">Resumo</label>
        <textarea
          {...register("excerpt")}
          rows={3}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
        />
        {errors.excerpt && (
          <p className="mt-1 text-xs text-red-600">{errors.excerpt.message}</p>
        )}
      </div>

      {/* editor/preview markdown */}
      <div className="mb-2 flex gap-2 text-sm">
        <button
          type="button"
          onClick={() => setTab("edit")}
          className={
            tab === "edit" ? "font-semibold underline" : "text-slate-500"
          }
        >
          Editar
        </button>
        <button
          type="button"
          onClick={() => setTab("preview")}
          className={
            tab === "preview" ? "font-semibold underline" : "text-slate-500"
          }
        >
          Preview
        </button>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Conteúdo</label>
        {tab === "edit" ? (
          <textarea
            {...register("content")}
            rows={10}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            placeholder="Markdown (aceita HTML básico, sanitizado)"
          />
        ) : (
          <div className="rounded-md border border-slate-200 bg-white p-4">
            <MarkdownView markdown={contentValue} />
          </div>
        )}
        {errors.content && (
          <p className="mt-1 text-xs text-red-600">{errors.content.message}</p>
        )}
      </div>

      {/* categorias */}
      <fieldset className="rounded-md border border-slate-200 p-3">
        <legend className="px-1 text-sm font-medium">Categorias</legend>
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
            {(errors.categoryIds.message as string) || ""}
          </p>
        )}
      </fieldset>

      {/* tags */}
      <fieldset className="rounded-md border border-slate-200 p-3">
        <legend className="px-1 text-sm font-medium">Tags</legend>
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
            {(errors.tagIds.message as string) || ""}
          </p>
        )}
      </fieldset>

      {/* status + ações */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-600">
          Status atual: <strong>{status}</strong>
        </span>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          onClick={() => setValue("intent", "save")}
          disabled={isSubmitting}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {isSubmitting ? "Salvando..." : "Salvar alterações"}
        </button>

        {status === "DRAFT" ? (
          <button
            type="submit"
            onClick={() => setValue("intent", "publish")}
            disabled={isSubmitting}
            className="rounded-md border border-emerald-300 px-4 py-2 text-sm text-emerald-700 hover:bg-emerald-50 disabled:opacity-60"
          >
            {isSubmitting ? "Publicando..." : "Publicar"}
          </button>
        ) : (
          <button
            type="submit"
            onClick={() => setValue("intent", "unpublish")}
            disabled={isSubmitting}
            className="rounded-md border border-amber-300 px-4 py-2 text-sm text-amber-700 hover:bg-amber-50 disabled:opacity-60"
          >
            {isSubmitting ? "Alterando..." : "Despublicar"}
          </button>
        )}

        <button
          type="button"
          onClick={onDelete}
          className="rounded-md border border-red-300 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
        >
          Excluir
        </button>
      </div>
    </form>
  );
}
