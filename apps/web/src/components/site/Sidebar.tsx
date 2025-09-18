export function Sidebar({
  categories = [] as { key: string; label: string }[],
  children,
}: {
  categories?: { key: string; label: string }[];
  children?: React.ReactNode;
}) {
  return (
    <aside className="lg:col-span-4 space-y-6">
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold">Categorias</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {categories.map((c) => (
            <a
              key={c.key}
              href={`/categoria/${c.key}`}
              className="rounded-full border border-neutral-200 px-3 py-1 text-sm hover:border-emerald-300 hover:text-emerald-700"
            >
              {c.label}
            </a>
          ))}
        </div>
      </div>
      {children}
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
    </aside>
  );
}
