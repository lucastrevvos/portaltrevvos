// apps/web/src/app/(private)/edit-post/[id]/page.tsx

import EditPostForm from "./EditPostForm";
import type { PostWithRelations, Category, Tag } from "@trevvos/types";
import { apiFetch } from "apps/web/src/lib/api";
import { cookies } from "next/headers";
// 👇 importa (se quiser fallback mais esperto)
import { getCoverUrl } from "apps/web/src/lib/post-utils";

type PageProps = { params: { id: string } };

export default async function EditPostPage({ params }: PageProps) {
  const { id } = await params;

  const [post, categories, tags] = await Promise.all([
    apiFetch<PostWithRelations>(`/posts/${id}`),
    apiFetch<Category[]>(`/categories`),
    apiFetch<Tag[]>(`/tags`),
  ]);

  const initialCategoryIds = (post.categories ?? [])
    .map((pc) => pc.categoryId ?? pc.category?.id)
    .filter(Boolean)
    .map(String);

  const initialTagIds = (post.tags ?? [])
    .map((pt) => pt.tagId ?? pt.tag?.id)
    .filter(Boolean)
    .map(String);

  const token = (await cookies()).get("accessToken")?.value;

  // 👇 escolhe só a primeira (se houver)
  const initialCategoryId = initialCategoryIds[0] ?? "";

  const initialValues = {
    slug: post.slug ?? "",
    title: post.title ?? "",
    excerpt: post.excerpt ?? "",
    content: post.content ?? "",
    categoryIds: initialCategoryId ? [initialCategoryId] : [], // 👈 apenas 1
    tagIds: initialTagIds,
    status: (post.status as "DRAFT" | "PUBLISHED") ?? "DRAFT",
    intent: "save" as const,
    // 👇 PRE-POPULA CAPA (prioriza post.coverImage; cai pro helper se teu backend usa outro campo)
    coverImage: (post as any).coverImage ?? getCoverUrl(post) ?? "",
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Editar Post</h1>
      <EditPostForm
        postId={id}
        initialValues={initialValues}
        categories={categories}
        tags={tags}
        accessToken={token}
      />
    </main>
  );
}
