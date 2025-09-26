// apps/web/src/components/site/PostHero.tsx
import {
  getCoverUrl,
  getCategoryName,
  getSlug,
  formatDate,
  getAuthor,
  MaybePost,
} from "../../lib/post-utils";

export function PostHero({ post }: { post: MaybePost }) {
  const cover = getCoverUrl(post);

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      {cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={cover}
          alt={post?.title ?? ""}
          className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      )}

      <div className="p-6">
        {getCategoryName(post) && (
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            {getCategoryName(post)}
          </span>
        )}
        <a href={`/post/${getSlug(post)}`} className="block">
          <h1 className="mt-3 text-2xl font-bold leading-tight tracking-tight">
            {post?.title}
          </h1>
        </a>
        {post?.excerpt && (
          <p className="mt-2 line-clamp-2 text-sm text-neutral-600">
            {post.excerpt}
          </p>
        )}
        <div className="mt-4 flex items-center justify-between text-xs text-neutral-500">
          <span>{getAuthor(post)}</span>
          <span>• {formatDate(post?.publishedAt ?? post?.createdAt)}</span>
        </div>
      </div>
    </article>
  );
}
