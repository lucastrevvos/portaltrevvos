import Link from "next/link";
import { Car, PiggyBank, Volleyball } from "lucide-react";
import { NewsletterCard } from "./NewsLetterCard";

export function Sidebar({
  categories = [] as { key: string; label: string }[],
  tags = [] as { key: string; label: string }[],
  children,
}: {
  categories?: { key: string; label: string }[];
  tags?: { key: string; label: string }[];
  children?: React.ReactNode;
}) {
  return (
    <aside className="space-y-6 lg:col-span-4">
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold">Linhas de solução</h3>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-lg bg-blue-100">
              <Car className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <Link href="https://kmone.trevvos.com.br">
                <div className="font-medium">IA aplicada a operação</div>
                <div className="text-neutral-600">
                  Ferramentas para rotina, decisão e ganho de produtividade
                </div>
              </Link>
            </div>
          </li>

          <li className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-lg bg-green-100">
              <PiggyBank className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <div className="font-medium">Produtos de IA</div>
              <div className="text-neutral-600">
                Apps e experiências construidos com IA no centro
              </div>
            </div>
          </li>

          <li className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-lg bg-orange-100">
              <Volleyball className="h-4 w-4 text-orange-600" />
            </div>
            <div>
              <div className="font-medium">Conteúdo editorial</div>
              <div className="text-neutral-600">
                Posts que conectam estratégia, tecnologia e aplicação prática
              </div>
            </div>
          </li>
        </ul>
      </div>

      <NewsletterCard />

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
    </aside>
  );
}
