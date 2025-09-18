export default function Header({
  categories = [] as { key: string; label: string }[],
}) {
  return (
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
            <a href="/" className="font-semibold tracking-tight">
              Trevvos
            </a>
            <nav className="hidden md:flex items-center gap-6 ml-8 text-sm text-neutral-600">
              <a className="hover:text-neutral-900" href="/">
                Início
              </a>
              {categories.map((c) => (
                <a
                  key={c.key}
                  className="hover:text-neutral-900"
                  href={`/categoria/${c.key}`}
                >
                  {c.label}
                </a>
              ))}
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
  );
}
