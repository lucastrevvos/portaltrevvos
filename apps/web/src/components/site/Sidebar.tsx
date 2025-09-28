import { Car, PiggyBank, Volleyball } from "lucide-react";

export function Sidebar({
  categories = [] as { key: string; label: string }[],
  tags = [] as { key: string; label: string }[],
  children,
}: {
  categories?: { key: string; label: string }[];
  tags?: { key: string; label: string }[];
  children?: React.ReactNode;
}) {
  console.log(tags);

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

      {tags.length > 0 && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold">Tags</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((t) => (
              <a
                href={`/tag/${t.key}`}
                key={t.key}
                className="rounded-full bg-neutral-100 px-3 py-1 text-sm hover:bg-neutral-200"
              >
                #{t.label}
              </a>
            ))}
          </div>
        </div>
      )}

      {children}
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold">Apps do ecossistema</h3>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <div className="mt-0.5 h-6 w-6 rounded-lg bg-blue-100 flex items-center justify-center">
              <Car className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <div className="font-medium">KM One</div>
              <div className="text-neutral-600">
                Controle absoluto das corridas e R$/km
              </div>
            </div>
          </li>

          <li className="flex items-start gap-3">
            <div className="mt-0.5 h-6 w-6 rounded-lg bg-green-100 flex items-center justify-center">
              <PiggyBank className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <div className="font-medium">ControlLar</div>
              <div className="text-neutral-600">
                Seu financeiro pessoal sem fricção
              </div>
            </div>
          </li>

          <li className="flex items-start gap-3">
            <div className="mt-0.5 h-6 w-6 rounded-lg bg-orange-100 flex items-center justify-center">
              <Volleyball className="h-4 w-4 text-orange-600" />
            </div>
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
