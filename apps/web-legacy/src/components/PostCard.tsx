import Link from "next/link";
import type { PostWithRelations } from "@trevvos/types";

export function PostCard({ post }: { post: PostWithRelations }) {
  const cover = post.coverImage?.startsWith("/uploads/")
    ? `${process.env.NEXT_PUBLIC_API_URL}${post.coverImage}`
    : post.coverImage || null;

  const categories = post.categories
    .map((pc) => pc.category)
    .filter((c): c is NonNullable<typeof c> => !!c);

  return (
    <article className="group overflow-hidden rounded-lg border border-slate-200 bg-white transition hover:shadow-sm">
      {cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={cover} alt="" className="aspect-[16/9] w-full object-cover" />
      )}
      <div className="p-4">
        <div className="mb-2 flex flex-wrap gap-2">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/categoria/${c.slug}`}
              className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700 hover:bg-slate-200"
            >
              {c.name}
            </Link>
          ))}
        </div>

        <h2 className="line-clamp-2 text-lg font-semibold tracking-tight text-slate-900 group-hover:underline">
          <Link href={`/post/${post.slug}`}>{post.title}</Link>
        </h2>

        {post.excerpt && (
          <p className="mt-2 line-clamp-3 text-sm text-slate-600">
            {post.excerpt}
          </p>
        )}
      </div>
    </article>
  );
}
