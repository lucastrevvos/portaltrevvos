export default function LoadingHome() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="h-8 w-40 animate-pulse rounded bg-neutral-200" />
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-neutral-200 p-5">
            <div className="h-40 w-full animate-pulse rounded bg-neutral-200" />
            <div className="mt-3 h-5 w-3/4 animate-pulse rounded bg-neutral-200" />
            <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-neutral-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
