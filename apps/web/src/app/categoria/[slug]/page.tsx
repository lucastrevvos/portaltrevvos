// =====================================================
// apps/web/src/app/categoria/[slug]/page.tsx
// Categoria com "Carregar mais" (SSR) + slots de Ads
// =====================================================
import type { Metadata } from "next";
import type { Category, PostWithRelations } from "@trevvos/types";
import { apiFetch } from "apps/web/src/lib/api";
import { PostCard } from "apps/web/src/components/PostCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

// helpers
async function fetchCategory(slug: string): Promise<Category | undefined> {
  try {
    return await apiFetch<Category>(`/categories/${encodeURIComponent(slug)}`);
  } catch {
    try {
      const list = await apiFetch<Category[]>(
        `/categories?slug=${encodeURIComponent(slug)}&take=1`
      );
      return Array.isArray(list) && list[0] ? list[0] : undefined;
    } catch {
      return undefined;
    }
  }
}
async function fetchPosts(categoryId: string, skip: number, take: number) {
  try {
    return await apiFetch<PostWithRelations[]>(
      `/posts?categoryId=${encodeURIComponent(
        categoryId
      )}&status=PUBLISHED&skip=${skip}&take=${take}`
    );
  } catch {
    return [];
  }
}
// unwrap (params/searchParams podem vir como Promise)
async function unwrap<T>(maybe: T | Promise<T>): Promise<T> {
  return (maybe as any)?.then ? await (maybe as any) : (maybe as T);
}

// --- Metadata ---
export async function generateMetadata(props: any): Promise<Metadata> {
  const { params } = props ?? {};
  const p = await unwrap(params);
  const slug: string = p?.slug;

  const cat = await fetchCategory(slug);
  const title = cat?.name
    ? `Categoria: ${cat.name} — Trevvos`
    : "Categoria — Trevvos";

  return {
    title,
    description: cat?.name
      ? `Artigos da categoria ${cat.name}`
      : "Artigos por categoria",
    openGraph: { title, type: "website" },
    twitter: { card: "summary", title },
  };
}

// --- Page ---
export default async function CategoryPage(props: any) {
  const { params, searchParams } = props ?? {};
  const p = await unwrap(params);
  const sp = (await unwrap(searchParams)) ?? {};

  const slug: string = p?.slug;
  const page = Math.max(1, Number(sp.page ?? 1));
  const take = Math.min(24, Math.max(6, Number(sp.take ?? 12)));
  const skip = (page - 1) * take;

  const cat = await fetchCategory(slug);
  if (!cat) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-2xl font-bold">Categoria não encontrada</h1>
        <p className="mt-2 text-neutral-600">
          Volte para a{" "}
          <Link className="underline" href="/">
            home
          </Link>{" "}
          ou escolha outra categoria.
        </p>
      </main>
    );
  }

  const posts = await fetchPosts(String(cat.id), skip, take);
  const hasMore = posts.length === take;

  return (
    <div className="min-h-screen">
      {/* Hero da Categoria */}
      <section className="border-b border-neutral-200 bg-gradient-to-b from-white to-neutral-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-neutral-500">
                <Link href="/" className="hover:text-neutral-800">
                  Início
                </Link>
                <span className="mx-1">/</span>
                <span className="text-emerald-700">Categoria</span>
              </div>
              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                {cat.name}
              </h1>
            </div>
            {/* <div className="hidden md:flex h-24 w-64 items-center justify-center rounded-xl bg-neutral-100 text-neutral-500">Ad Space</div> */}
          </div>
        </div>
      </section>

      {/* Grid + Sidebar */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12 grid gap-8 lg:grid-cols-12">
        <section className="lg:col-span-8">
          {posts.length === 0 ? (
            <p className="text-neutral-600">
              Nenhum post publicado nesta categoria.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {posts.map((p) => (
                  <PostCard key={p.id} post={p} />
                ))}
                {/* <div className="sm:col-span-2 h-32 w-full rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-500">Ad Space</div> */}
              </div>

              {hasMore && (
                <div className="mt-8 flex justify-center">
                  <a
                    href={`?page=${page + 1}&take=${take}`}
                    className="rounded-xl border border-neutral-200 px-4 py-2 text-sm hover:bg-neutral-50"
                  >
                    Carregar mais
                  </a>
                </div>
              )}
            </>
          )}
        </section>

        <aside className="lg:col-span-4 space-y-6">
          {/* <div className="h-60 w-full rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-500">Ad Space</div> */}
          {/* widgets extras */}
          {/* <div className="h-60 w-full rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-500">Ad Space</div> */}
        </aside>
      </main>
    </div>
  );
}
