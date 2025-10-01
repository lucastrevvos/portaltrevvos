import "server-only";
import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:3333";

export async function GET(req: NextRequest) {
  const qs = req.nextUrl.searchParams.toString();
  const url = `${API_BASE}/posts${qs ? `?${qs}` : ""}`;

  const r = await fetch(url, { cache: "no-store" });
  const body = await r.text();

  return new NextResponse(body, {
    status: r.status,
    headers: {
      "content-type": r.headers.get("content-type") ?? "application/json",
    },
  });
}
