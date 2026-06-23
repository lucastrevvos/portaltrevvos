export default function AuthorBox({ post }: { post: any }) {
  const name = post?.author?.name || post?.authorName || "Equipe Trevvos";
  const avatar =
    post?.author?.avatarUrl ||
    post?.authorAvatar ||
    post?.author?.image ||
    post?.author?.photo ||
    "";
  const bio =
    post?.author?.bio || post?.authorBio || post?.contentMeta?.authorBio || "";

  return (
    <section className="mt-10 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatar}
            alt={name}
            className="h-12 w-12 rounded-full object-cover"
          />
        ) : (
          <div className="h-12 w-12 rounded-full bg-emerald-600 text-white grid place-items-center font-bold">
            {String(name).slice(0, 1).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <div className="font-medium">{name}</div>
          {bio ? (
            <p className="mt-1 text-sm text-neutral-600">{bio}</p>
          ) : (
            <p className="mt-1 text-sm text-neutral-500">
              Autor no ecossistema Trevvos.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
