// apps/web/src/app/(public)/login/actions.ts
"use server";

import { apiFetch } from "apps/web/src/lib/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// helper simples para mensagem
function readErr(e: unknown): string {
  if (typeof e === "object" && e && "message" in e) {
    const m = (e as any).message;
    if (m && m !== "NEXT_REDIRECT") return String(m);
  }
  return "Falha ao entrar.";
}

export async function loginAction(fd: FormData) {
  // 1) tenta logar
  let data: { accessToken: string; refreshToken: string };
  try {
    data = await apiFetch<{ accessToken: string; refreshToken: string }>(
      "/auth/login",
      {
        method: "POST",
        body: {
          email: String(fd.get("email") || ""),
          password: String(fd.get("password") || ""),
        },
      }
    );
  } catch (e) {
    // 2) se falhar, redireciona com erro legível
    const msg = readErr(e);
    redirect(`/login?error=${encodeURIComponent(msg)}`);
  }

  // 3) sucesso: grava cookies
  const c = await cookies();
  c.set("accessToken", data.accessToken, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 15,
  });
  c.set("refreshToken", data.refreshToken, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  // 4) redireciona para home (não está dentro do try/catch!)
  redirect("/");
}
