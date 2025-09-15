// apps/web/src/app/page.tsx

import type { PostWithRelations } from "@trevvos/types";
import { apiFetch } from "../lib/api";
import { PostCard } from "../components/PostCard";

export const dynamic = "force-dynamic";

type Search = { page?: string; take?: string };

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? 1));
  const take = Math.min(50, Math.max(1, Number(sp.take ?? 10)));
  const skip = (page - 1) * take;

  // ✅ Tipar o retorno
  const posts = await apiFetch<PostWithRelations[]>(
    `/posts?skip=${skip}&take=${take}&status=PUBLISHED`
  );

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <section className="grid gap-8 lg:grid-cols-[1fr,18rem]">
        <div className="space-y-6">
          {posts.length === 0 ? (
            <p className="text-slate-600">Nenhum post publicado.</p>
          ) : (
            posts.map((p) => <PostCard key={p.id} post={p} />)
          )}
        </div>

        {/* Se tiver seu Sidebar tipado, pode importar aqui */}
        {/* <Sidebar /> */}
      </section>

      {/* Paginação simples */}
      <div className="mt-8 flex gap-2">
        {page > 1 && (
          <a
            href={`/?page=${page - 1}&take=${take}`}
            className="rounded border px-3 py-1 text-sm"
          >
            Página anterior
          </a>
        )}
        <a
          href={`/?page=${page + 1}&take=${take}`}
          className="rounded border px-3 py-1 text-sm"
        >
          Próxima página
        </a>
      </div>
    </main>
  );
}
