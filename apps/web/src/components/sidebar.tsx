// apps/web/src/components/Sidebar.tsx
import Link from "next/link";
import { apiFetch } from "../lib/api";
import type { Category, Tag } from "@trevvos/types";

export async function Sidebar() {
  const [cats, tags] = await Promise.all([
    apiFetch<Category[]>("/categories"),
    apiFetch<Tag[]>("/tags"),
  ]);

  return (
    <aside className="w-full shrink-0 lg:w-72">
      <div className="rounded-lg border border-slate-200 p-4">
        <h3 className="mb-2 text-sm font-semibold">Categorias</h3>
        <ul className="space-y-1">
          {cats.map((c) => (
            <li key={c.id}>
              <Link href={`/categoria/${c.slug}`}>{c.name}</Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 rounded-lg border border-slate-200 p-4">
        <h3 className="mb-2 text-sm font-semibold">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <Link
              key={t.id}
              href={`/tag/${t.slug}`}
              className="rounded bg-slate-100 px-2 py-1 text-xs hover:bg-slate-200"
            >
              #{t.name}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
