export function Footer() {
  return (
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
  );
}
