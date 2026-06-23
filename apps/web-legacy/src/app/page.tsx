import Link from "next/link";
import type { PostWithRelations } from "@trevvos/types";
import { apiFetch } from "../lib/api";
import {
  getCategoryName,
  getTagNames,
  slugify,
  type MaybePost,
} from "../lib/post-utils";
import { LoadMoreFeed } from "../components/site/LoadMoreFeed";
import { PostHero } from "../components/site/PostHero";
import { Sidebar } from "../components/site/Sidebar";
import { TestChannelCard } from "../components/site/TestChannelCard";
import { Trending } from "../components/site/Trending";

export const dynamic = "force-dynamic";

const WHATSAPP_URL =
  process.env.NEXT_PUBLIC_WHATSAPP_TESTS_URL ||
  "https://chat.whatsapp.com/K1cepLtEEoY6pScVRTNvg9";

const PODCAST_SPOTIFY_URL =
  process.env.NEXT_PUBLIC_PODCAST_SPOTIFY_URL ||
  "https://open.spotify.com/show/7xvDpbP6wuoZi8coSgTFkY";

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
      <section className="border-b border-emerald-100 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(15,23,42,0.06),_transparent_28%),linear-gradient(180deg,_#f8fffb_0%,_#ffffff_100%)]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)] lg:items-end">
            <div className="space-y-5">
              <span className="inline-flex rounded-full border border-emerald-200 bg-white/85 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-900 shadow-sm">
                IA aplicada a produtos reais
              </span>
              <div className="space-y-4">
                <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl">
                  Transformamos inteligência artificial em produto, operação e resultado
                </h1>
                <p className="max-w-3xl text-base leading-7 text-neutral-700 sm:text-lg">
                  A Trevvos evoluiu. Agora unimos conteúdo, experimentação e desenvolvimento de soluções em IA para criar produtos mais inteligentes, úteis e conectados ao mundo real.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 text-sm text-neutral-700">
                <span className="rounded-full border border-neutral-200 bg-white px-4 py-2">
                  IA aplicada na prática
                </span>
                <span className="rounded-full border border-neutral-200 bg-white px-4 py-2">
                  Produtos com inteligência embarcada
                </span>
                <span className="rounded-full border border-neutral-200 bg-white px-4 py-2">
                  Conteúdo, testes e evolução real
                </span>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[1.75rem] border border-emerald-100 bg-white/90 p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  Linha editorial
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-neutral-950">
                  O que publicamos acompanha o que estamos construindo
                </h2>
                <p className="mt-3 text-sm leading-6 text-neutral-600">
                  Aqui, o conteúdo não existe só para informar. Ele acompanha nossos testes, produtos, aprendizados e decisões sobre IA, automação, operação e crescimento digital.
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href="/apps"
                    className="inline-flex items-center rounded-xl bg-neutral-950 px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
                  >
                    Conhecer apps e pilotos
                  </Link>
                  <Link
                    href="/sobre"
                    className="inline-flex items-center rounded-xl border border-neutral-200 px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                  >
                    Conhecer a Trevvos IA
                  </Link>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                    Atuação
                  </div>
                  <div className="mt-2 text-lg font-semibold text-neutral-900">
                    IA aplicada ao mundo real
                  </div>
                </div>
                <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                    Construção
                  </div>
                  <div className="mt-2 text-lg font-semibold text-neutral-900">
                    Produtos com inteligência embarcada
                  </div>
                </div>
                <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                    Base
                  </div>
                  <div className="mt-2 text-lg font-semibold text-neutral-900">
                    Conteúdo, validação e distribuição
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {hero && (
        <section className="border-b border-neutral-200 bg-gradient-to-b from-white to-neutral-50">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-12">
            <div className="space-y-6 lg:col-span-8">
              <PostHero post={hero as unknown as MaybePost} />

              <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                      Direção editorial
                    </p>
                    <h2 className="mt-1 text-xl font-semibold text-neutral-900">
                      Conteúdo que evolui junto com nossos produtos
                    </h2>
                  </div>

                  <span className="inline-flex items-center rounded-full bg-neutral-900 px-3 py-1 text-xs font-medium text-white">
                    IA
                  </span>
                </div>

                <p className="mt-3 max-w-2xl text-sm text-neutral-600">
                  Nosso conteúdo agora reflete exatamente a nova fase da Trevvos: IA aplicada, decisões de produto, testes reais, operação e os bastidores dos apps que estão saindo do papel.
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href="/apps"
                    className="inline-flex items-center rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
                  >
                    Explorar nossos apps
                  </Link>
                  <a
                    href={PODCAST_SPOTIFY_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-xl border border-neutral-200 px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                  >
                    Ouvir o podcast
                  </a>
                </div>
              </section>
            </div>

            <div className="grid gap-4 lg:col-span-4">
              <Trending posts={rest as unknown as MaybePost[]} />
              <aside className="space-y-6 md:col-span-1">
                <TestChannelCard whatsappUrl={WHATSAPP_URL} />
              </aside>
            </div>
          </div>
        </section>
      )}

      <main className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-12">
        <section className="lg:col-span-8">
          <LoadMoreFeed
            initialPosts={rest}
            take={TAKE}
            initialSkip={hero ? 1 : 0}
            queryBase="api/posts?status=PUBLISHED"
          />
        </section>
        <Sidebar categories={categories} tags={tags} />
      </main>
    </div>
  );
}
