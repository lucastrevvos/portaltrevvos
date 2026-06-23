// =====================================================
// apps/web/src/app/buscar/page.tsx
// Busca SSR com paginação ?page & ?take
// =====================================================
import type { Metadata } from "next";
import type { PostWithRelations } from "@trevvos/types";
import { apiFetch } from "../../lib/api";
import { getCategoryName, slugify } from "../../lib/post-utils";
import { PostCard } from "../../components/PostCard";
import { Sidebar } from "../../components/site/Sidebar";
import { NewsletterCard } from "../../components/site/NewsLetterCard";

export const dynamic = "force-dynamic";

type Search = { q?: string; page?: string; take?: string };

export const metadata: Metadata = {
  title: "Buscar — Trevvos",
  description: "Procure artigos por título, conteúdo, categoria e tags.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const page = Math.max(1, Number(sp.page ?? 1));
  const take = Math.min(24, Math.max(6, Number(sp.take ?? 12)));
  const skip = (page - 1) * take;

  // Chama diretamente o teu /posts com q/skip/take
  const posts: PostWithRelations[] = q
    ? await apiFetch<PostWithRelations[]>(
        `/posts?status=PUBLISHED&q=${encodeURIComponent(
          q
        )}&skip=${skip}&take=${take}`
      )
    : [];

  const hasMore = q ? posts.length === take : false;

  // Sidebar simples com categorias observadas nos resultados
  const rawCats = [
    ...new Set(posts.map(getCategoryName).filter((x): x is string => !!x)),
  ];
  const categories = rawCats.map((c) => ({ key: slugify(c), label: c }));

  return (
    <div className="min-h-screen">
      {/* Resultados + Sidebar */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12 grid gap-8 lg:grid-cols-12">
        <section className="lg:col-span-8">
          {!q ? (
            <p className="text-neutral-600">
              Digite um termo e pressione “Buscar”.
            </p>
          ) : posts.length === 0 ? (
            <p className="text-neutral-600">
              Nada encontrado para <strong>“{q}”</strong>.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {posts.map((p) => (
                  <PostCard key={p.id} post={p} />
                ))}
              </div>

              {hasMore && (
                <div className="mt-8 flex justify-center">
                  <a
                    href={`?q=${encodeURIComponent(q)}&page=${
                      page + 1
                    }&take=${take}`}
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
        </section>

        <Sidebar categories={categories}>
          <NewsletterCard />
          {/* --- ADS: sidebar --- */}
          {/* <div className="h-60 w-full rounded-xl bg-neutral-100 text-neutral-500 flex items-center justify-center">Ad Space</div> */}
        </Sidebar>
      </main>
    </div>
  );
}
