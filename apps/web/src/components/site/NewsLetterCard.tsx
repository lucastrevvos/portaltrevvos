export function NewsletterCard() {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-gradient-to-br from-emerald-600 to-emerald-700 p-5 text-white shadow-sm">
      <h3 className="text-sm font-semibold">Assine a newsletter</h3>
      <p className="mt-1 text-sm/5 text-emerald-50">
        Receba 1 email semanal com notícias e apps novos.
      </p>
      <form action="/newsletter" method="post" className="mt-3 flex gap-2">
        <input
          name="email"
          type="email"
          placeholder="seu@email.com"
          className="h-9 w-full rounded-xl border border-white/20 bg-white/10 px-3 text-sm placeholder:text-emerald-100 outline-none focus:bg-white/20"
        />
        <button className="h-9 shrink-0 rounded-xl bg-white px-3 text-sm font-medium text-emerald-700 hover:bg-emerald-50">
          Assinar
        </button>
      </form>
    </div>
  );
}
