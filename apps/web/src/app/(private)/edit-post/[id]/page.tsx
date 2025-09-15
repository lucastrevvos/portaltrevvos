import EditPostForm from "./EditPostForm";
import type { PostWithRelations, Category, Tag } from "@trevvos/types";
import { apiFetch } from "apps/web/src/lib/api";
import { cookies } from "next/headers";

type PageProps = { params: { id: string } };

export default async function EditPostPage({ params }: PageProps) {
  const { id } = await params;

  const [post, categories, tags] = await Promise.all([
    apiFetch<PostWithRelations>(`/posts/${id}`),
    apiFetch<Category[]>(`/categories`),
    apiFetch<Tag[]>(`/tags`),
  ]);

  // => arrays de IDs (como string)
  const initialCategoryIds = (post.categories ?? [])
    .map((pc) => pc.categoryId ?? pc.category?.id)
    .filter(Boolean)
    .map(String);

  const initialTagIds = (post.tags ?? [])
    .map((pt) => pt.tagId ?? pt.tag?.id)
    .filter(Boolean)
    .map(String);

  const token = (await cookies()).get("accessToken")?.value;

  const initialValues = {
    slug: post.slug ?? "",
    title: post.title ?? "",
    excerpt: post.excerpt ?? "",
    content: post.content ?? "",
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
        accessToken={token}
      />
    </main>
  );
}
