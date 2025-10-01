import "server-only";
import { Me } from "@trevvos/types";
import { cookies } from "next/headers";
import { apiFetch } from "./api";

const ACCESS_COOKIE = process.env.NEXT_PUBLIC_ACCESS_COOKIE || "accessToken";

// === Auth helpers (server-side) ===
export async function fetchMe(): Promise<Me> {
  try {
    const token = (await cookies()).get(ACCESS_COOKIE)?.value;
    if (!token) return null;
    const me = await apiFetch<any>("/auth/me", { accessToken: token });
    return me ?? null;
  } catch {
    return null;
  }
}
