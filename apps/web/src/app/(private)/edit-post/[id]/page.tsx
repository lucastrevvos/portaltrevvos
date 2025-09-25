// apps/web/src/app/(private)/edit-post/[id]/page.tsx
import type { Category, Tag, PostWithRelations } from "@trevvos/types";

import { redirect } from "next/navigation";
import EditPostForm from "./EditPostForm";
import { canDoIt, fetchMe } from "apps/web/src/lib/post-utils";
import { getAccessToken } from "apps/web/src/lib/auth";
import { apiFetch } from "apps/web/src/lib/api";

type PageProps = { params: { id: string } };

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: PageProps) {
  const { id } = await params;

  // 1) Auth + permissão
  const me = await fetchMe();
  if (!me) redirect(`/login?next=/edit-post/${id}`);
  if (!canDoIt(me)) redirect("/"); // ou manda pra uma 403

  // 2) Token p/ chamadas autenticadas
  const token = await getAccessToken();

  // 3) Dados do form
  const [post, categories, tags] = await Promise.all([
    apiFetch<PostWithRelations>(
      `/posts/${id}`,
      token ? { accessToken: token } : {}
    ),
    apiFetch<Category[]>("/categories", token ? { accessToken: token } : {}),
    apiFetch<Tag[]>("/tags", token ? { accessToken: token } : {}),
  ]);

  // valores iniciais (incluindo coverImage, se tiver)
  const initialCategoryIds = (post.categories ?? [])
    .map((pc) => pc.categoryId ?? pc.category?.id)
    .filter(Boolean)
    .map(String);

  const initialTagIds = (post.tags ?? [])
    .map((pt) => pt.tagId ?? pt.tag?.id)
    .filter(Boolean)
    .map(String);

  const initialValues = {
    slug: post.slug ?? "",
    title: post.title ?? "",
    excerpt: post.excerpt ?? "",
    content: post.content ?? "",
    coverImage: (post as any).coverImage ?? "", // garante que entra setada
    categoryIds: initialCategoryIds,
    tagIds: initialTagIds,
    status: (post.status as "DRAFT" | "PUBLISHED") ?? "DRAFT",
    intent: "save" as const,
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Editar Post</h1>
      <EditPostForm
        postId={id}
        initialValues={initialValues}
        categories={categories}
        tags={tags}
        accessToken={token ?? ""}
      />
    </main>
  );
}
