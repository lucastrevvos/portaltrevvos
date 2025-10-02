import Link from "next/link";
import { fetchMe } from "../../lib/auth.server";
import { Menu, Search } from "lucide-react";

export default async function Header({
  categories = [] as { key: string; label: string }[],
}) {
  const me = await fetchMe();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* ESQUERDA: Logo + Marca */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/trevvos/logo.png"
                alt="Trevvos"
                className="h-9 w-auto rounded"
              />
            </Link>
            <Link href="/" className="font-semibold tracking-tight">
              Trevvos
            </Link>

            {/* NAV DESKTOP */}
            <nav className="ml-8 hidden items-center gap-6 text-sm text-neutral-600 md:flex">
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

          {/* DIREITA: Ações */}
          <div className="flex items-center gap-3">
            {/* BUSCA: ícone no mobile, form completo no desktop */}
            <div className="flex items-center gap-2">
              {/* Desktop search */}
              <form
                action="/buscar"
                method="get"
                className="hidden items-center gap-2 md:flex"
              >
                <input
                  name="q"
                  placeholder="Buscar..."
                  className="h-10 w-56 rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button className="h-10 shrink-0 cursor-pointer rounded-xl bg-emerald-600 px-4 text-sm font-medium text-white hover:bg-emerald-700">
                  Buscar
                </button>
              </form>

              {/* Mobile search (sempre visível) */}
              <Link
                href="/buscar"
                aria-label="Ir para busca"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 md:hidden"
              >
                <Search className="h-5 w-5 text-neutral-700" />
              </Link>
            </div>

            {/* AUTH: sempre visível (mobile e desktop) */}
            {!me ? (
              <a
                href="/login"
                className="flex h-10 items-center rounded-xl border border-neutral-200 px-3 text-sm hover:bg-neutral-100"
              >
                Login
              </a>
            ) : (
              <form action="/auth/logout" method="post">
                <button
                  type="submit"
                  className="flex h-10 cursor-pointer items-center rounded-xl border border-neutral-200 px-3 text-sm hover:bg-neutral-100"
                >
                  Sair
                </button>
              </form>
            )}

            {me && (
              <a
                href="/new-post"
                className="flex h-10 items-center rounded-xl bg-emerald-600 px-3 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Novo Post
              </a>
            )}

            {/* BOTÃO DESTACADO: Nossos Apps */}
            <a
              href="/apps"
              className="flex h-10 items-center rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 text-sm font-semibold text-white shadow hover:from-emerald-700 hover:to-emerald-600"
            >
              🚀 Nossos Apps
            </a>

            {/* MENU MOBILE */}
            <details className="relative md:hidden">
              <summary
                className="list-none flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 hover:bg-neutral-100 cursor-pointer"
                aria-label="Abrir menu"
              >
                <Menu className="h-5 w-5 text-neutral-700" />
              </summary>

              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-neutral-200 bg-white p-3 shadow-lg">
                <nav className="flex flex-col gap-2 text-sm text-neutral-700">
                  <Link
                    className="rounded-md px-2 py-2 hover:bg-neutral-50"
                    href="/"
                  >
                    Início
                  </Link>
                  {categories.map((c) => (
                    <Link
                      key={c.key}
                      className="rounded-md px-2 py-2 hover:bg-neutral-50"
                      href={`/categoria/${c.key}`}
                    >
                      {c.label}
                    </Link>
                  ))}
                  <Link
                    className="rounded-md px-2 py-2 hover:bg-neutral-50"
                    href="/sobre"
                  >
                    Sobre
                  </Link>
                  <Link
                    className="rounded-md px-2 py-2 hover:bg-neutral-50"
                    href="/contato"
                  >
                    Contato
                  </Link>

                  {/* Busca inline opcional dentro do menu */}
                  <form
                    action="/buscar"
                    method="get"
                    className="mt-2 flex gap-2"
                  >
                    <input
                      name="q"
                      placeholder="Buscar..."
                      className="h-9 flex-1 rounded-lg border border-neutral-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button className="h-9 shrink-0 cursor-pointer rounded-lg bg-emerald-600 px-3 text-sm font-medium text-white hover:bg-emerald-700">
                      OK
                    </button>
                  </form>
                </nav>
              </div>
            </details>
          </div>
        </div>
      </div>
    </header>
  );
}
