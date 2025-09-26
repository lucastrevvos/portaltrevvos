import Link from "next/link";
import { fetchMe } from "../../lib/post-utils";

export default async function Header({
  categories = [] as { key: string; label: string }[],
}) {
  const me = await fetchMe();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/trevvos/logo.png"
                alt="Trevvos"
                className="h-9 w-auto  rounded"
              />
            </Link>
            <Link href="/" className="font-semibold tracking-tight">
              Trevvos
            </Link>
            <nav className="hidden md:flex items-center gap-6 ml-8 text-sm text-neutral-600">
              <Link className="hover:text-neutral-900" href="/">
                Início
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.key}
                  className="hover:text-neutral-900"
                  href={`/categoria/${c.key}`}
                >
                  {c.label}
                </Link>
              ))}
              <Link className="hover:text-neutral-900" href="/sobre">
                Sobre
              </Link>
              <Link className="hover:text-neutral-900" href="/contato">
                Contato
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <form action="/buscar" method="get" className="flex gap-2">
                <input
                  name="q"
                  placeholder="Buscar..."
                  className="h-9 w-56 rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button className="h-10 shrink-0 rounded-xl bg-emerald-600 px-4 text-sm font-medium text-white hover:bg-emerald-700">
                  Buscar
                </button>
              </form>
            </div>
            {!me ? (
              <a
                href="/login"
                className="h-9 rounded-xl border border-neutral-200 px-3 text-sm hover:bg-neutral-100"
              >
                Login
              </a>
            ) : (
              <form action="/auth/logout" method="post">
                <button
                  type="submit"
                  className="h-9 rounded-xl border border-neutral-200 px-3 text-sm hover:bg-neutral-100"
                >
                  Sair
                </button>
              </form>
            )}

            {me && (
              <a
                href="/new-post"
                className="h-9 rounded-xl bg-emerald-600 px-3 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Novo Post
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
