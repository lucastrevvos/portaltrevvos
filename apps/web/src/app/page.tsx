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
import { Sidebar } from "../components/site/Sidebar";
import { LoadMoreFeed } from "../components/site/LoadMoreFeed";
import { TestChannelCard } from "../components/site/TestChannelCard";

export const dynamic = "force-dynamic";

const WHATSAPP_URL =
  process.env.NEXT_PUBLIC_WHATSAPP_TESTS_URL ||
  "https://chat.whatsapp.com/K1cepLtEEoY6pScVRTNvg9";

const PODCAST_SPOTIFY_URL =
  process.env.NEXT_PUBLIC_PODCAST_SPOTIFY_URL ||
  "https://open.spotify.com/show/7xvDpbP6wuoZi8coSgTFkY";

const PODCAST_PAGE_HREF = "/podcast";

const onlyStr = (v: unknown): v is string =>
  typeof v === "string" && v.trim().length > 0;

const TAKE = 17;

export default async function TrevvosHome() {
  const posts = await apiFetch<PostWithRelations[]>(
    `/posts?status=PUBLISHED&take=${TAKE}&skip=0`,
  );

  const hasPosts = posts?.length > 0;
  const [hero, ...rest] = hasPosts ? posts : [];

  const categories: { key: string; label: string }[] = Array.from(
    new Set(
      posts
        .map((p) => getCategoryName(p as unknown as MaybePost))
        .filter(onlyStr),
    ),
  ).map((c) => ({ key: slugify(c), label: c }));

  const rawTags = Array.from(
    new Set(posts.flatMap((p) => getTagNames(p as unknown as MaybePost))),
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
            <div className="lg:col-span-8 space-y-6">
              <PostHero post={hero as unknown as MaybePost} />

              {/* 🎙️ BLOCO DO PODCAST */}
              <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium tracking-wide text-neutral-500 upercase">
                      Podcast
                    </p>
                    <h2 className="mt-1 text-xl font-semibold text-neutral-900">
                      Trevvos Podcast 🎧
                    </h2>
                  </div>

                  <span className="inline-flex items-center rounded-full bg-neutral-900 px-3 py-1 text-sx font-medium text-white">
                    Novo
                  </span>
                </div>

                <p className="mt-3 ma-w-2xl text-sm text-neutral-600">
                  Conversas sobre tecnologia, IA e vida real. Do código ao caos,
                  sem enrolação e sem guru de palco.
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href={PODCAST_SPOTIFY_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex-items-center rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
                  >
                    Ouvir no Spotify
                  </a>
                </div>
              </section>
            </div>

            <div className="lg:col-span-4 grid gap-4">
              <Trending posts={rest as unknown as MaybePost[]} />
              <aside className="md:col-span-1 space-y-6">
                <TestChannelCard whatsappUrl={WHATSAPP_URL} />
              </aside>
            </div>
          </div>
        </section>
      )}

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12 grid gap-8 lg:grid-cols-12">
        <section className="lg:col-span-8">
          <LoadMoreFeed
            initialPosts={rest}
            take={TAKE}
            initialSkip={hero ? 1 : 0}
            queryBase={`api/posts?status=PUBLISHED`}
            // paramName="offset" // use se sua API for offset
          />
        </section>
        <Sidebar categories={categories} tags={tags} />
      </main>
    </div>
  );
}
