// apps/web/src/app/page.tsx
import type { PostWithRelations } from "@trevvos/types";
import { apiFetch } from "../lib/api";
import {
  getCategoryName,
  slugify,
  getTagNames,
  type MaybePost,
} from "../lib/post-utils";
import { PostHero } from "../components/site/PostHero";
import { Trending } from "../components/site/Trending";
import { NewsletterCard } from "../components/site/NewsLetterCard";
import { Sidebar } from "../components/site/Sidebar";

export const dynamic = "force-dynamic";

// type guard pra strings não vazias
const onlyStr = (v: unknown): v is string =>
  typeof v === "string" && v.trim().length > 0;

export default async function TrevvosHome() {
  const posts = await apiFetch<PostWithRelations[]>(
    `/posts?status=PUBLISHED&take=20`
  );

  const hasPosts = posts?.length > 0;
  const [hero, ...rest] = hasPosts ? posts : [];

  // categorias únicas
  const categories: { key: string; label: string }[] = Array.from(
    new Set(
      posts
        .map((p) => getCategoryName(p as unknown as MaybePost))
        .filter(onlyStr)
    )
  ).map((c) => ({ key: slugify(c), label: c }));

  // tags únicas
  const rawTags = Array.from(
    new Set(posts.flatMap((p) => getTagNames(p as unknown as MaybePost)))
  );
  const tags: { key: string; label: string }[] = rawTags.map((t) => ({
    key: slugify(t),
    label: t,
  }));

  return (
    <div className="min-h-screen">
      {hero && (
        <section className="border-b border-neutral-200 bg-gradient-to-b from-white to-neutral-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12 grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <PostHero post={hero as unknown as MaybePost} />
            </div>
            <div className="lg:col-span-4 grid gap-4">
              <Trending posts={rest as unknown as MaybePost[]} />
              <NewsletterCard />
            </div>
          </div>
        </section>
      )}

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12 grid gap-8 lg:grid-cols-12">
        <section className="lg:col-span-8 grid gap-6 sm:grid-cols-2">
          {rest.map((p) => (
            <PostHero key={(p as any).id} post={p as unknown as MaybePost} />
          ))}
        </section>
        <Sidebar categories={categories} tags={tags} />
      </main>
    </div>
  );
}
