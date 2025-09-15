import type { Category, PostWithRelations } from "@trevvos/types";
import { PostCard } from "apps/web/src/components/PostCard";

import { apiFetch } from "apps/web/src/lib/api";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // ✅ tipa o retorno
  const cat = await apiFetch<Category>(`/categories/${slug}`);

  // ✅ tipa o array de posts
  const posts = await apiFetch<PostWithRelations[]>(
    `/posts?categoryId=${encodeURIComponent(cat.id)}&status=PUBLISHED`
  );

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Categoria: {cat.name}</h1>

      {posts.length === 0 ? (
        <p className="text-slate-600">Nenhum post publicado nesta categoria.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      )}
    </main>
  );
}
