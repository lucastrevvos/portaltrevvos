import { cookies } from "next/headers";
import Link from "next/link";

export async function SiteHeader() {
  const token = (await cookies()).get("accessToken")?.value;

  return (
    <header className="border-b border-slate-200">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          Trevvos
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/">Início</Link>
          {token && (
            <Link
              href="/new-post"
              className="rounded-md bg-slate-900 px-3 py-1.5 font-medium text-white hover:bg-slate-800"
            >
              Novo Post
            </Link>
          )}
          {!token ? (
            <Link href="/login">Entrar</Link>
          ) : (
            <form action="/logout" method="post">
              <button className="text-slate-600 hover:underline">Sair</button>
            </form>
          )}
        </nav>
      </div>
    </header>
  );
}
