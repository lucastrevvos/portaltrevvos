// apps/web/src/app/post/[slug]/page.tsx
export const dynamic = "force-dynamic";

import Link from "next/link";
import { cookies } from "next/headers";

import type { PostWithRelations, Category, Tag, AppRole } from "@trevvos/types";
import { apiFetch } from "apps/web/src/lib/api";

type Props = { params: { slug: string } };

type MeResponse = {
  globalRole: { id: string; role: "ADMIN" | "EDITOR" | "USER" };
  appsList: { slug: string; name: string; role: AppRole }[];
};

export default async function PostPage({ params }: Props) {
  const { slug } = await params;

  // 1) Buscar post
  const list = await apiFetch<PostWithRelations[]>(
    `/posts?slug=${encodeURIComponent(slug)}`
  );
  const post = Array.isArray(list)
    ? list[0]
    : (list as unknown as PostWithRelations);

  if (!post) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-xl font-semibold">Post não encontrado</h1>
      </main>
    );
  }

  // 2) Token + /auth/me (pode falhar silenciosamente)
  const token = (await cookies()).get("accessToken")?.value;
  let canEdit = false;

  if (token) {
    try {
      const me = await apiFetch<MeResponse>("/auth/me", { accessToken: token });
      console.log("me", me);

      const appSlug = process.env.NEXT_PUBLIC_APP_SLUG || "portal";
      const appRole = me?.appsList?.find((a: any) => a.slug === appSlug)?.role;

      const isAdminGlobal = me.globalRole.role === "ADMIN";
      const canByApp = appRole
        ? ["OWNER", "ADMIN", "EDITOR"].includes(appRole)
        : false;

      // autor pode editar o próprio rascunho
      const postAuthorId = (post as any).authorId ?? post.author?.id;
      const isAuthor = !!postAuthorId && me.globalRole.id === postAuthorId;

      canEdit = isAdminGlobal || canByApp || isAuthor;
    } catch (err) {
      console.log("erro", err);
    }
  }

  // 3) Normalizar categorias/tags (sem any, com type guard)
  const categories: Category[] = (post.categories ?? [])
    .map((pc) => pc.category)
    .filter((c): c is Category => Boolean(c));

  const tags: Tag[] = (post.tags ?? [])
    .map((pt) => pt.tag)
    .filter((t): t is Tag => Boolean(t));

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <header className="mb-4 flex items-start justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
        {canEdit && (
          <Link
            href={`/edit-post/${post.id}`}
            className="rounded border border-slate-300 px-3 py-1 text-sm hover:bg-slate-50"
          >
            Editar
          </Link>
        )}
      </header>

      <div className="mb-6 flex flex-wrap items-center gap-3 text-sm">
        {categories.map((c) => (
          <a
            key={c.id}
            href={`/categoria/${c.slug}`}
            className="rounded bg-slate-100 px-2 py-1 hover:bg-slate-200"
          >
            {c.name}
          </a>
        ))}

        {tags.map((t) => (
          <a
            key={t.id}
            href={`/tag/${t.slug}`}
            className="rounded border bg-slate-200 px-2 py-1 text-slate-700 hover:bg-slate-50"
          >
            #{t.name}
          </a>
        ))}
      </div>

      {post.coverImage && (
        <img
          src={post.coverImage}
          alt=""
          className="mb-6 w-full rounded-lg border border-slate-200"
        />
      )}

      <article className="prose prose-slate max-w-none">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </main>
  );
}
