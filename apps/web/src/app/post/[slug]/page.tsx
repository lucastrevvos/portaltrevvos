// apps/web/src/app/post/[slug]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

import type { PostWithRelations } from "@trevvos/types";
import { apiFetch } from "apps/web/src/lib/api";
import {
  canDoIt,
  fetchMe,
  formatDate,
  getAuthor,
  getCategoryName,
  getCategorySlug,
  getCoverUrl,
} from "apps/web/src/lib/post-utils";
import { fetchSiblings } from "apps/web/src/lib/siblings";
import { readingTime } from "apps/web/src/lib/reading-time";
import { articleJsonLd } from "apps/web/src/lib/jsonld";
import MarkdownView from "apps/web/src/components/MarkdownView";
import ShareBar from "apps/web/src/components/site/ShareBar";
import AuthorBox from "apps/web/src/components/site/AuthorBox";
import { Sidebar } from "apps/web/src/components/site/Sidebar";

export const dynamic = "force-dynamic";

type Params = { slug: string };

// -------------------------
// Tipos utilitários
// -------------------------
type CategoryLite = { id: string | number; name: string; slug: string };
type SidebarItem = { key: string; label: string };

// -------------------------
// Fetchers
// -------------------------
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

async function fetchCategoriesForSidebar(): Promise<SidebarItem[]> {
  try {
    const list = await apiFetch<CategoryLite[]>(
      `/categories?status=ACTIVE&take=100`
    );
    return (list ?? []).map((c) => ({
      key: String(c.slug ?? c.id),
      label: c.name,
    }));
  } catch {
    return [];
  }
}

// -------------------------
// Metadata
// -------------------------
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
    openGraph: { title, description, images: [{ url: og }], type: "article" },
    twitter: { card: "summary_large_image", title, description, images: [og] },
  };
}

// -------------------------
// Page
// -------------------------
export default async function PostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await fetchPost(slug);

  if (!post) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-2xl font-bold">Post não encontrado</h1>
        <p className="mt-2 text-neutral-600">
          Tenta voltar para a{" "}
          <Link className="underline" href="/">
            home
          </Link>
          .
        </p>
      </main>
    );
  }

  const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const url = `${SITE}/post/${(post as any).slug ?? (post as any).id}`;

  const cover = getCoverUrl(post);
  const categoryName = getCategoryName(post);
  const categorySlug = getCategorySlug(post);

  const [me, related, siblings, sidebarCategories] = await Promise.all([
    fetchMe(),
    fetchRelated(post),
    fetchSiblings(post),
    fetchCategoriesForSidebar(),
  ]);

  const rawContent = String(
    (post as any).content ?? (post as any).contentHtml ?? ""
  );
  const readTime = (post as any).read || readingTime(rawContent);

  const editBase = process.env.NEXT_PUBLIC_EDIT_BASE ?? "/edit-post";
  const editHref = `${editBase}/${(post as any).id ?? (post as any).slug}`;

  // JSON-LD
  const jsonLd = articleJsonLd({
    url,
    title: (post as any).title ?? "Post",
    description: (post as any).excerpt ?? "",
    image: cover,
    datePublished: (post as any).publishedAt,
    dateModified: (post as any).updatedAt,
    authorName: (post as any).author?.name ?? "Equipe Trevvos",
    siteName: "Trevvos",
  });

  return (
    <div className="min-h-screen">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />

      {/* Hero do Post */}
      <section className="border-b border-neutral-200 bg-gradient-to-b from-white to-neutral-50">
        <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {categorySlug && (
            <div className="mb-3 text-xs">
              <Link
                href="/"
                className="text-neutral-500 hover:text-neutral-800"
              >
                Início
              </Link>
              <span className="mx-1">/</span>
              <Link
                href={`/categoria/${categorySlug}`}
                className="text-emerald-700 hover:underline"
              >
                {categoryName}
              </Link>
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
                {readTime && <span>• {readTime}</span>}
              </div>
            </div>

            {me && canDoIt(me) && (
              <Link
                href={editHref}
                className="shrink-0 rounded-xl border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Editar post
              </Link>
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
          <MarkdownView markdown={rawContent} showToc />

          {/* Share */}
          <ShareBar url={url} title={(post as any).title ?? "Trevvos"} />

          <AuthorBox post={post} />

          {/* Prev/Next */}
          {(siblings.prev || siblings.next) && (
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {siblings.prev && (
                <Link
                  href={`/post/${
                    (siblings.prev as any).slug ?? (siblings.prev as any).id
                  }`}
                  className="rounded-xl border border-neutral-200 p-4 hover:bg-neutral-50"
                >
                  <div className="text-xs text-neutral-500">Anterior</div>
                  <div className="mt-1 line-clamp-2 font-medium">
                    {(siblings.prev as any).title}
                  </div>
                </Link>
              )}
              {siblings.next && (
                <Link
                  href={`/post/${
                    (siblings.next as any).slug ?? (siblings.next as any).id
                  }`}
                  className="rounded-xl border border-neutral-200 p-4 hover:bg-neutral-50 text-right sm:text-left"
                >
                  <div className="text-xs text-neutral-500">Próximo</div>
                  <div className="mt-1 line-clamp-2 font-medium">
                    {(siblings.next as any).title}
                  </div>
                </Link>
              )}
            </div>
          )}

          {/* --- ADS: final do conteúdo --- */}
          {/* <div className="my-8 h-40 w-full rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-500">Ad Space</div> */}
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          <Sidebar categories={sidebarCategories} />

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
                    <Link
                      className="line-clamp-2 hover:text-emerald-700"
                      href={`/post/${(p as any).slug ?? (p as any).id}`}
                    >
                      {(p as any).title}
                    </Link>
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
