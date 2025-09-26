import type { Category, Tag, PostWithRelations } from "@trevvos/types";
import { redirect } from "next/navigation";
import EditPostForm from "./EditPostForm";
import { canDoIt, fetchMe } from "apps/web/src/lib/post-utils";
import { getAccessToken } from "apps/web/src/lib/auth";
import { apiFetch } from "apps/web/src/lib/api";

export const dynamic = "force-dynamic";

// ⚠️ Aceita qualquer coisa pra satisfazer o checker do Next
export default async function EditPostPage(props: any) {
  // Se props.params for Promise, await; se for objeto, resolve direto.
  const params = props?.params?.then ? await props.params : props.params;
  const { id } = (params ?? {}) as { id: string };

  const me = await fetchMe();
  if (!me) redirect(`/login?next=/edit-post/${id}`);
  if (!canDoIt(me)) redirect("/");

  const token = await getAccessToken();

  const [post, categories, tags] = await Promise.all([
    apiFetch<PostWithRelations>(
      `/posts/${id}`,
      token ? { accessToken: token } : {}
    ),
    apiFetch<Category[]>("/categories", token ? { accessToken: token } : {}),
    apiFetch<Tag[]>("/tags", token ? { accessToken: token } : {}),
  ]);

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
    coverImage: (post as any).coverImage ?? "",
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
