// apps/web/src/app/auth/logout/route.ts

import { apiFetch, ApiHttpError } from "apps/web/src/lib/api";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const ACCESS_COOKIE = process.env.NEXT_PUBLIC_ACCESS_COOKIE || "accessToken";

async function handleLogout() {
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;

  // tenta deslogar no backend, mas não trava o fluxo
  if (token) {
    try {
      await apiFetch("/auth/logout", { method: "POST", accessToken: token });
    } catch (e) {
      // se o backend só aceitar GET
      if (e instanceof ApiHttpError && e.statusCode === 405) {
        try {
          await apiFetch("/auth/logout", { method: "GET", accessToken: token });
        } catch {
          /* ignora */
        }
      }
    }
  }

  // redireciona e limpa o cookie SEMPRE
  const res = NextResponse.redirect(new URL("/", SITE_URL));
  res.cookies.set(ACCESS_COOKIE, "", { path: "/", expires: new Date(0) });
  return res;
}

export async function POST() {
  return handleLogout();
}

// opcional: permitir GET /auth/logout
export const GET = POST;
