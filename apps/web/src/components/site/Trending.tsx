import { getSlug } from "../../lib/post-utils";

export function Trending({ posts = [] as any[] }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold">Trending agora</h3>
      <ul className="mt-3 space-y-3 text-sm">
        {posts.slice(0, 4).map((p, i) => (
          <li key={p?.id ?? i} className="flex gap-3">
            <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-neutral-100 text-center text-[11px] leading-5 font-semibold text-neutral-500">
              {i + 1}
            </span>
            <a
              className="line-clamp-2 hover:text-emerald-700"
              href={`/post/${getSlug(p)}`}
            >
              {p?.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
