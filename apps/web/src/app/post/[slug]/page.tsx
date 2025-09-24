// =====================================================
// apps/web/src/app/post/[slug]/page.tsx (com botão Editar se logado)
// =====================================================
import type { Me, PostWithRelations } from "@trevvos/types";
import { apiFetch } from "../../../lib/api";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import {
  getCoverUrl,
  getCategoryName,
  getCategorySlug,
  getAuthor,
  formatDate,
  canDoIt,
  fetchMe,
} from "../../../lib/post-utils";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

type Params = { slug: string };

// --- Data fetchers ---
async function fetchPost(slug: string): Promise<PostWithRelations | undefined> {
  try {
    return await apiFetch<PostWithRelations>(
      `/posts/${encodeURIComponent(slug)}`
    );
  } catch {}
  try {
    const list = await apiFetch<PostWithRelations[]>(
      `/posts?slug=${encodeURIComponent(slug)}&status=PUBLISHED&take=1`
    );
    if (Array.isArray(list) && list[0]) return list[0];
  } catch {}
  try {
    return await apiFetch<PostWithRelations>(
      `/posts/by-slug/${encodeURIComponent(slug)}`
    );
  } catch {}
  return undefined;
}

async function fetchRelated(
  p: PostWithRelations
): Promise<PostWithRelations[]> {
  const cat = getCategorySlug(p);
  if (!cat) return [];
  try {
    const rel = await apiFetch<PostWithRelations[]>(
      `/posts?category=${encodeURIComponent(cat)}&status=PUBLISHED&take=6`
    );
    return (rel || [])
      .filter(
        (x: any) =>
          (x?.slug ?? x?.id) !== (p as any)?.slug && x?.id !== (p as any)?.id
      )
      .slice(0, 6);
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
  const post = await fetchPost(slug);
  const title = (post as any)?.title ?? "Post";
  const description = (post as any)?.excerpt ?? (post as any)?.subtitle ?? "";
  const cover = getCoverUrl(post);

  const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const og = `${SITE}/og?title=${encodeURIComponent(
    title
  )}&subtitle=${encodeURIComponent(description)}&cover=${encodeURIComponent(
    cover ?? ""
  )}`;

  return {
    title: `${title} — Trevvos`,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: og }],
      type: "article",
    },
    twitter: {
      card: cover ? "summary_large_image" : "summary",
      title,
      description,
      images: [og],
    },
  };
}

// --- Page ---
export default async function PostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await fetchPost(slug);
  const me = await fetchMe(); // 👈 checa login no server

  if (!post) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-2xl font-bold">Post não encontrado</h1>
        <p className="mt-2 text-neutral-600">
          Tenta voltar para a{" "}
          <a className="underline" href="/">
            home
          </a>
          .
        </p>
      </main>
    );
  }

  const cover = getCoverUrl(post);
  const categoryName = getCategoryName(post);
  const categorySlug = getCategorySlug(post);

  // URL de edição: configure NEXT_PUBLIC_EDIT_BASE (ex.: "/admin/posts" ou "/studio/structure/posts")
  const editBase = process.env.NEXT_PUBLIC_EDIT_BASE ?? "/edit-post";
  const editHref = `${editBase}/${(post as any).id ?? (post as any).slug}`;

  const related = await fetchRelated(post);

  return (
    <div className="min-h-screen">
      {/* Hero do Post */}
      <section className="border-b border-neutral-200 bg-gradient-to-b from-white to-neutral-50">
        <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {categorySlug && (
            <div className="mb-3 text-xs">
              <a href="/" className="text-neutral-500 hover:text-neutral-800">
                Início
              </a>
              <span className="mx-1">/</span>
              <a
                href={`/categoria/${categorySlug}`}
                className="text-emerald-700 hover:underline"
              >
                {categoryName}
              </a>
            </div>
          )}

          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                {(post as any).title}
              </h1>
              {(post as any).excerpt && (
                <p className="mt-3 text-neutral-600">{(post as any).excerpt}</p>
              )}
              <div className="mt-4 flex items-center gap-3 text-xs text-neutral-500">
                <span>{getAuthor(post)}</span>
                <span>
                  •{" "}
                  {formatDate(
                    (post as any).publishedAt ?? (post as any).createdAt
                  )}
                </span>
                {(post as any).read && <span>• {(post as any).read}</span>}
              </div>
            </div>

            {me && canDoIt(me) && (
              <a
                href={editHref}
                className="shrink-0 rounded-xl border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Editar post
              </a>
            )}
          </div>

          {cover && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cover}
              alt={(post as any).title}
              className="mt-6 h-80 w-full rounded-2xl object-cover"
            />
          )}
        </article>
      </section>

      {/* Conteúdo + Sidebar */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12 grid gap-8 lg:grid-cols-12">
        <article className="prose prose-neutral max-w-none lg:col-span-8">
          {(post as any).contentHtml ? (
            <div
              dangerouslySetInnerHTML={{ __html: (post as any).contentHtml }}
            />
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                img: (props) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    {...props}
                    className={`mt-6 w-full rounded-2xl object-contain ${
                      props.className ?? ""
                    }`}
                  />
                ),
                a: (props) => (
                  <a {...props} target="_blank" rel="noopener noreferrer" />
                ),
              }}
            >
              {(post as any).content ?? ""}
            </ReactMarkdown>
          )}

          {/* --- ADS: final do conteúdo --- */}
          {/* <div className="my-8 h-40 w-full rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-500">Ad Space</div> */}
        </article>

        {/* Sidebar: relacionados */}
        <aside className="lg:col-span-4 space-y-6">
          {/* --- ADS: topo sidebar post --- */}
          {/* <div className="h-60 w-full rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-500">Ad Space</div> */}

          {related.length > 0 && (
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold">Leia também</h3>
              <ul className="mt-3 space-y-3 text-sm">
                {related.slice(0, 6).map((p) => (
                  <li key={(p as any).id} className="flex gap-3">
                    {getCoverUrl(p) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={getCoverUrl(p)!}
                        alt={(p as any).title}
                        className="h-12 w-16 rounded object-cover"
                      />
                    ) : (
                      <div className="h-12 w-16 rounded bg-neutral-100" />
                    )}
                    <a
                      className="line-clamp-2 hover:text-emerald-700"
                      href={`/post/${(p as any).slug ?? (p as any).id}`}
                    >
                      {(p as any).title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* --- ADS: base sidebar post --- */}
          {/* <div className="h-60 w-full rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-500">Ad Space</div> */}
        </aside>
      </main>
    </div>
  );
}
