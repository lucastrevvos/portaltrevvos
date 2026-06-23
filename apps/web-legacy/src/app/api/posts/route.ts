import "server-only";
import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  process.env.NEXT_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "";

function badEnv(msg: string) {
  return NextResponse.json({ error: msg }, { status: 500 });
}

export async function GET(req: NextRequest) {
  try {
    if (!API_BASE) {
      return badEnv("NEXT_API_BASE_URL não definido no ambiente do web.");
    }
    // Evita usar localhost em produção
    if (process.env.NODE_ENV === "production" && /localhost/.test(API_BASE)) {
      return badEnv("NEXT_API_BASE_URL aponta para localhost em produção.");
    }

    const qs = req.nextUrl.searchParams.toString();
    const url = `${API_BASE.replace(/\/+$/, "")}/posts${qs ? `?${qs}` : ""}`;

    const res = await fetch(url, { cache: "no-store" });

    // Encaminha o body original (texto) e status/headers
    const body = await res.text();
    const headers = new Headers();
    headers.set(
      "content-type",
      res.headers.get("content-type") ?? "application/json"
    );
    headers.set("x-proxy-target", url);
    headers.set("x-proxy-status", String(res.status));

    // Se a API devolveu 4xx/5xx, repassa com o texto (ajuda a depurar)
    return new NextResponse(body, { status: res.status, headers });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Proxy falhou", message: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
