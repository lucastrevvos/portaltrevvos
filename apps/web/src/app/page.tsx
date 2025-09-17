// Substitui o componente do mock, mas mantendo o layout/estilo
// Agora busca seus posts reais e pluga nos lugares certos

import type { PostWithRelations } from "@trevvos/types";
import { apiFetch } from "../lib/api";

function slugify(input?: string) {
  return input?.toLowerCase().trim().replaceAll(" ", "-");
}

function getCategoryName(p: PostWithRelations): string | undefined {
  // Modelos comuns:
  // a) p.category: { name, slug }
  // b) p.category: { category: { name, slug } }  // join PostCategory -> Category
  // c) p.categories: [{ name/slug }] OU [{ category: { name/slug } }]
  // d) p.category: string
  const anyp: any = p as any;

  // p.category direto
  if (anyp?.category) {
    if (typeof anyp.category === "string") return anyp.category as string;
    if (typeof anyp.category.name === "string")
      return anyp.category.name as string;
    if (
      anyp.category.category &&
      typeof anyp.category.category.name === "string"
    ) {
      return anyp.category.category.name as string;
    }
  }

  // p.categories array
  if (Array.isArray(anyp?.categories) && anyp.categories.length) {
    const c0 = anyp.categories[0];
    if (typeof c0 === "string") return c0 as string;
    if (typeof c0?.name === "string") return c0.name as string;
    if (c0?.category && typeof c0.category.name === "string")
      return c0.category.name as string;
  }

  return undefined;
}

function getCategorySlug(p: PostWithRelations): string | undefined {
  const anyp: any = p as any;

  if (anyp?.category) {
    if (typeof anyp.category === "string") return slugify(anyp.category);
    if (typeof anyp.category.slug === "string")
      return anyp.category.slug as string;
    if (
      anyp.category.category &&
      typeof anyp.category.category.slug === "string"
    ) {
      return anyp.category.category.slug as string;
    }
  }

  if (Array.isArray(anyp?.categories) && anyp.categories.length) {
    const c0 = anyp.categories[0];
    if (typeof c0 === "string") return slugify(c0);
    if (typeof c0?.slug === "string") return c0.slug as string;
    if (c0?.category && typeof c0.category.slug === "string")
      return c0.category.slug as string;
  }

  const name = getCategoryName(p);
  return name ? slugify(name) : undefined;
}

function getCoverUrl(p: PostWithRelations): string | undefined {
  // @ts-ignore
  if (typeof p.cover === "string") return p.cover as string;
  // @ts-ignore
  if (p.cover?.url) return p.cover.url as string;
  // @ts-ignore
  if (p.images?.[0]?.url) return p.images[0].url as string;
  return undefined;
}

function getSlug(p: PostWithRelations): string | number | undefined {
  // @ts-ignore
  return p.slug ?? p.id;
}

function getAuthor(p: PostWithRelations): string {
  // @ts-ignore
  return p.author?.name ?? p.authorName ?? "Equipe Trevvos";
}

function getDate(p: PostWithRelations): string {
  // @ts-ignore
  const d = p.publishedAt ?? p.createdAt;
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
    .format(date)
    .replace(".", "");
}

export const dynamic = "force-dynamic";

export default async function TrevvosHomeReal() {
  // Busca real de posts
  const posts = await apiFetch<PostWithRelations[]>(
    `/posts?skip=0&take=12&status=PUBLISHED`
  );
  const hasPosts = posts && posts.length > 0;
  const [hero, ...rest] = hasPosts ? posts : ([] as PostWithRelations[]);

  // Deriva categorias do conteúdo (enquanto não houver endpoint dedicado)
  const categories = Array.from(
    new Set(posts.map(getCategoryName).filter(Boolean) as string[])
  ).slice(0, 6);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <a
                href="/"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold"
              >
                T
              </a>
              <span className="font-semibold tracking-tight">Trevvos</span>
              <nav className="hidden md:flex items-center gap-6 ml-8 text-sm text-neutral-600">
                <a className="hover:text-neutral-900" href="/">
                  Início
                </a>
                <a
                  className="hover:text-neutral-900"
                  href="/categoria/tecnologia"
                >
                  Tecnologia
                </a>
                <a
                  className="hover:text-neutral-900"
                  href="/categoria/financas"
                >
                  Finanças
                </a>
                <a className="hover:text-neutral-900" href="/categoria/saude">
                  Saúde
                </a>
              </nav>
            </div>
            <div className="flex items-center gap-2">
              <input
                placeholder="Buscar..."
                className="hidden sm:block h-9 w-56 rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <a
                href="/login"
                className="h-9 rounded-xl border border-neutral-200 px-3 text-sm hover:bg-neutral-100"
              >
                Login
              </a>
              <a
                href="/cadastro"
                className="h-9 rounded-xl bg-emerald-600 px-3 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Cadastrar
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-neutral-200 bg-gradient-to-b from-white to-neutral-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12 grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <article className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
              {hasPosts && getCoverUrl(hero) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={getCoverUrl(hero)!}
                  alt={(hero as any).title ?? "Capa"}
                  className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="h-72 w-full bg-neutral-100" />
              )}
              <div className="p-6">
                {hasPosts && (
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                    {getCategoryName(hero) ?? "destaque"}
                  </span>
                )}
                <h1 className="mt-3 text-2xl font-bold leading-tight tracking-tight">
                  {hasPosts ? (hero as any).title : "Nenhum post publicado"}
                </h1>
                {hasPosts && (
                  <p className="mt-2 line-clamp-2 text-sm text-neutral-600">
                    {(hero as any).excerpt ?? ""}
                  </p>
                )}
                <div className="mt-4 flex items-center justify-between text-xs text-neutral-500">
                  <span>{hasPosts ? getAuthor(hero) : ""}</span>
                  {hasPosts && (
                    <span>
                      • {getDate(hero)}
                      {/* • tempo de leitura opcional */}
                    </span>
                  )}
                </div>
              </div>
            </article>
          </div>

          <div className="lg:col-span-4 grid gap-4">
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold">Trending agora</h3>
              <ul className="mt-3 space-y-3 text-sm">
                {(rest || []).slice(0, 4).map((p, i) => (
                  <li key={(p as any).id} className="flex gap-3">
                    <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-neutral-100 text-center text-[11px] leading-5 font-semibold text-neutral-500">
                      {i + 1}
                    </span>
                    <a
                      className="line-clamp-2 hover:text-emerald-700"
                      href={`/post/${getSlug(p)}`}
                    >
                      {(p as any).title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-gradient-to-br from-emerald-600 to-emerald-700 p-5 text-white shadow-sm">
              <h3 className="text-sm font-semibold">Assine a newsletter</h3>
              <p className="mt-1 text-sm/5 text-emerald-50">
                Receba 1 email semanal com notícias e apps novos.
              </p>
              <form
                action="/newsletter"
                method="post"
                className="mt-3 flex gap-2"
              >
                <input
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="h-9 w-full rounded-xl border border-white/20 bg-white/10 px-3 text-sm placeholder:text-emerald-100 outline-none focus:bg-white/20"
                />
                <button className="h-9 shrink-0 rounded-xl bg-white px-3 text-sm font-medium text-emerald-700 hover:bg-emerald-50">
                  Assinar
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12 grid gap-8 lg:grid-cols-12">
        {/* Grid de posts */}
        <section className="lg:col-span-8 grid gap-6 sm:grid-cols-2">
          {(hasPosts ? posts : []).map((p) => (
            <article
              key={(p as any).id}
              className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="relative">
                {getCoverUrl(p) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={getCoverUrl(p)!}
                    alt={(p as any).title}
                    className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="h-44 w-full bg-neutral-100" />
                )}
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-1 text-[11px] font-medium text-neutral-800">
                  {getCategoryName(p) ?? "geral"}
                </span>
              </div>
              <div className="p-5">
                <a href={`/post/${getSlug(p)}`} className="block">
                  <h2 className="line-clamp-2 text-lg font-semibold tracking-tight group-hover:text-emerald-700">
                    {(p as any).title}
                  </h2>
                </a>
                {(p as any).excerpt && (
                  <p className="mt-2 line-clamp-2 text-sm text-neutral-600">
                    {(p as any).excerpt}
                  </p>
                )}
                <div className="mt-4 flex items-center justify-between text-xs text-neutral-500">
                  <span>{getAuthor(p)}</span>
                  <span>• {getDate(p)}</span>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold">Categorias</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map((label) => (
                <a
                  key={label}
                  href={`/categoria/${slugify(label)}`}
                  className="rounded-full border border-neutral-200 px-3 py-1 text-sm hover:border-emerald-300 hover:text-emerald-700"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold">Apps do ecossistema</h3>
            <ul className="mt-3 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <div className="mt-0.5 h-6 w-6 rounded-lg bg-neutral-100" />
                <div>
                  <div className="font-medium">KM One</div>
                  <div className="text-neutral-600">
                    Controle absoluto das corridas e R$/km
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-0.5 h-6 w-6 rounded-lg bg-neutral-100" />
                <div>
                  <div className="font-medium">ControlLar</div>
                  <div className="text-neutral-600">
                    Seu financeiro pessoal sem fricção
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-0.5 h-6 w-6 rounded-lg bg-neutral-100" />
                <div>
                  <div className="font-medium">SportsConnect</div>
                  <div className="text-neutral-600">
                    Junte a galera pro jogo certo
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold">Tags</h3>
            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              {[
                "react",
                "nestjs",
                "web3",
                "ux",
                "finanças pessoais",
                "nutrição",
              ].map((t) => (
                <a
                  key={t}
                  href={`/tag/${slugify(t)}`}
                  className="rounded-full bg-neutral-100 px-3 py-1 hover:bg-neutral-200"
                >
                  #{t}
                </a>
              ))}
            </div>
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold">
              T
            </div>
            <p className="text-sm text-neutral-600">
              © {new Date().getFullYear()} Trevvos. Conteúdo + Apps que fazem
              sentido.
            </p>
          </div>
          <nav className="text-sm text-neutral-600 flex gap-4">
            <a href="/politica" className="hover:text-neutral-900">
              Política
            </a>
            <a href="/termos" className="hover:text-neutral-900">
              Termos
            </a>
            <a href="/contato" className="hover:text-neutral-900">
              Contato
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
