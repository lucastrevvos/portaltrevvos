// apps/web/src/app/(public)/login/page.tsx
import { loginAction } from "./actions";

type Search = { error?: string };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  // ✅ em Next 15, precisa aguardar
  const sp = await searchParams;
  const error = sp?.error;

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <div className="w-full rounded-lg border border-slate-200 p-6 shadow-sm">
        <h1 className="mb-4 text-xl font-semibold">Entrar</h1>

        {error && (
          <div className="mb-3 rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <form action={loginAction} className="grid gap-3">
          <input
            type="email"
            name="email"
            placeholder="seu@email.com"
            required
            className="rounded border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            required
            className="rounded border border-slate-300 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Entrar
          </button>
        </form>
      </div>
    </main>
  );
}
