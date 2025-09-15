import { apiFetch } from "apps/web/src/lib/api";
import NewPostForm from "./NewPostForm";
import type { Category, Tag } from "@trevvos/types";
import { getAccessToken } from "apps/web/src/lib/auth";

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  const [categories, tags, token] = await Promise.all([
    apiFetch<Category[]>("/categories"),
    apiFetch<Tag[]>("/tags"),
    getAccessToken(),
  ]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Novo Post</h1>
      <NewPostForm categories={categories} tags={tags} accessToken={token} />
    </main>
  );
}
