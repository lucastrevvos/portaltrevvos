export default function LoadingPost() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="h-8 w-2/3 animate-pulse rounded bg-neutral-200" />
      <div className="mt-3 h-5 w-1/2 animate-pulse rounded bg-neutral-200" />
      <div className="mt-6 h-80 w-full animate-pulse rounded-2xl bg-neutral-200" />
      <div className="mt-8 space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-4 w-full animate-pulse rounded bg-neutral-200"
          />
        ))}
      </div>
    </div>
  );
}
