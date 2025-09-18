import type { PostWithRelations } from "@trevvos/types";
import { apiFetch } from "../lib/api";
import { getCategoryName, slugify } from "../lib/post-utils";
import { PostHero } from "../components/site/PostHero";
import { Trending } from "../components/site/Trending";
import { NewsletterCard } from "../components/site/NewsLetterCard";
import { Sidebar } from "../components/site/Sidebar";

export const dynamic = "force-dynamic";

export default async function TrevvosHome() {
  const posts = await apiFetch<PostWithRelations[]>(
    `/posts?status=PUBLISHED&take=20`
  );
  const hasPosts = posts?.length > 0;
  const [hero, ...rest] = hasPosts ? posts : [];
  const categories = [
    ...new Set(posts.map(getCategoryName).filter(Boolean)),
  ].map((c) => ({ key: slugify(String(c)), label: String(c) }));

  return (
    <div className="min-h-screen">
      {hero && (
        <section className="border-b border-neutral-200 bg-gradient-to-b from-white to-neutral-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12 grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <PostHero post={hero} />
            </div>
            <div className="lg:col-span-4 grid gap-4">
              <Trending posts={rest} />
              <NewsletterCard />
            </div>
          </div>
        </section>
      )}

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12 grid gap-8 lg:grid-cols-12">
        <section className="lg:col-span-8 grid gap-6 sm:grid-cols-2">
          {rest.map((p: any) => (
            <PostHero key={p.id} post={p} />
          ))}
        </section>
        <Sidebar categories={categories}>
          <NewsletterCard />
        </Sidebar>
      </main>
    </div>
  );
}
