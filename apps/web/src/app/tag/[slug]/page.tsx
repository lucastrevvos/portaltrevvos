// =====================================================
// apps/web/src/app/tag/[slug]/page.tsx
// =====================================================
import type { Metadata } from "next";
import type { Tag, PostWithRelations } from "@trevvos/types";
import { apiFetch } from "apps/web/src/lib/api";
import { PostCard } from "apps/web/src/components/PostCard";

export const dynamic = "force-dynamic";

type Params = { slug: string };
type Search = { page?: string; take?: string };

async function fetchTag(slug: string): Promise<Tag | undefined> {
  try {
    // se o backend resolve /tags/{slug}
    return await apiFetch<Tag>(`/tags/${encodeURIComponent(slug)}`);
  } catch {
    try {
      // fallback por query
      const list = await apiFetch<Tag[]>(
        `/tags?slug=${encodeURIComponent(slug)}&take=1`
      );
      return Array.isArray(list) && list[0] ? list[0] : undefined;
    } catch {
      return undefined;
    }
  }
}

async function fetchPostsByTag({
  tagId,
  slug,
  skip,
  take,
}: {
  tagId?: string;
  slug: string;
  skip: number;
  take: number;
}): Promise<PostWithRelations[]> {
  try {
    if (tagId) {
      return await apiFetch<PostWithRelations[]>(
        `/posts?tagId=${encodeURIComponent(
          tagId
        )}&status=PUBLISHED&skip=${skip}&take=${take}`
      );
    }
  } catch {}
  // fallback: se o backend aceitar ?tag=slug
  try {
    return await apiFetch<PostWithRelations[]>(
      `/posts?tag=${encodeURIComponent(
        slug
      )}&status=PUBLISHED&skip=${skip}&take=${take}`
    );
  } catch {
    return [];
  }
}

// --- Metadata ---
export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tag = await fetchTag(slug);
  const title = tag?.name ? `#${tag.name} — Trevvos` : "Tag — Trevvos";
  const description = tag?.name
    ? `Artigos marcados com #${tag.name}`
    : "Artigos por tag";
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary", title, description },
  };
}

// --- Page ---
export default async function TagPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams?: Promise<Search>;
}) {
  const { slug } = await params;
  const sp = (await searchParams) ?? {};
  const page = Math.max(1, Number(sp.page ?? 1));
  const take = Math.min(24, Math.max(6, Number(sp.take ?? 12)));
  const skip = (page - 1) * take;

  const tag = await fetchTag(slug);
  const posts = await fetchPostsByTag({
    tagId: tag?.id ? String(tag.id) : undefined,
    slug,
    skip,
    take,
  });
  const hasMore = posts.length === take;

  if (!tag && posts.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-2xl font-bold">Tag não encontrada</h1>
        <p className="mt-2 text-neutral-600">
          Volte para a{" "}
          <a className="underline" href="/">
            home
          </a>{" "}
          ou escolha outra tag.
        </p>
      </main>
    );
  }

  const tagName = tag?.name ?? slug;

  return (
    <div className="min-h-screen">
      {/* Hero da Tag */}
      <section className="border-b border-neutral-200 bg-gradient-to-b from-white to-neutral-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-neutral-500">
                <a href="/" className="hover:text-neutral-800">
                  Início
                </a>
                <span className="mx-1">/</span>
                <span className="text-emerald-700">Tag</span>
              </div>
              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                #{tagName}
              </h1>
            </div>

            {/* --- ADS: header da tag --- */}
            {/* <div className="hidden md:flex h-24 w-64 items-center justify-center rounded-xl bg-neutral-100 text-neutral-500">Ad Space</div> */}
          </div>
        </div>
      </section>

      {/* Grid + Sidebar simples (se quiser) */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {posts.length === 0 ? (
          <p className="text-neutral-600">
            Nenhum post com essa tag por enquanto.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>

            {/* Carregar mais */}
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

            {/* --- ADS: base da listagem --- */}
            {/* <div className="mt-8 h-32 w-full rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-500">Ad Space</div> */}
          </>
        )}
      </main>
    </div>
  );
}
