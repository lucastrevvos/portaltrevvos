import { Me } from "@trevvos/types";
import { cookies } from "next/headers";
import { apiFetch } from "./api";

// apps/web/src/lib/post-utils.ts
export type { PostWithRelations } from "@trevvos/types";

const APP = process.env.NEXT_PUBLIC_APP_SLUG || "portal";
const ACCESS_COOKIE = process.env.NEXT_PUBLIC_ACCESS_COOKIE || "accessToken";

/** Post flexível para consumo em UI */
export type MaybePost = {
  id?: string | number;
  slug?: string | null;
  title?: string | null;
  subtitle?: string | null;
  excerpt?: string | null;
  content?: string | null;
  contentHtml?: string | null;

  // imagens/capa
  coverImage?: string | null; // sua API pode devolver null
  cover?: string | { url?: string | null } | null;
  images?: Array<{ url?: string | null } | null> | null;

  // categoria(s)
  category?:
    | string
    | { name?: string | null; slug?: string | null }
    | { category?: { name?: string | null; slug?: string | null } | null }
    | null;
  categories?: Array<
    | string
    | { name?: string | null; slug?: string | null }
    | { category?: { name?: string | null; slug?: string | null } | null }
    | null
  > | null;

  // tags
  tags?: Array<{
    tag?: { name?: string | null; slug?: string | null } | null;
  } | null> | null;

  // autor e datas
  author?: { name?: string | null } | string | null;
  authorName?: string | null;

  publishedAt?: string | Date | null;
  createdAt?: string | Date | null;

  // extras
  read?: string | null;
};

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

export function canDoIt(me: Me): boolean {
  if (!me) return false;
  if (me?.globalRole === "ADMIN") return true;
  const role = me?.apps?.[APP];
  return role === "OWNER" || role === "ADMIN" || role === "EDITOR";
}

export function slugify(input?: string | null) {
  if (!input) return "";
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function getCoverUrl(p?: MaybePost | null): string | undefined {
  if (!p) return undefined;
  if (typeof p.coverImage === "string" && p.coverImage.trim())
    return p.coverImage;
  if (typeof p.cover === "string" && p.cover.trim()) return p.cover;
  if (p.cover && typeof p.cover === "object" && p.cover.url)
    return p.cover.url ?? undefined;
  if (Array.isArray(p.images) && p.images.length) {
    const first = p.images.find(Boolean);
    if (first && typeof first === "object") return first.url ?? undefined;
  }
  return undefined;
}

export function getCategoryName(p?: MaybePost | null): string | undefined {
  if (!p) return undefined;
  const fromSingle =
    typeof p.category === "string"
      ? p.category
      : p.category && typeof p.category === "object"
      ? (p.category as any).name ?? (p.category as any).category?.name
      : undefined;

  if (fromSingle && typeof fromSingle === "string" && fromSingle.trim())
    return fromSingle;

  if (Array.isArray(p.categories) && p.categories.length) {
    for (const c of p.categories) {
      if (!c) continue;
      if (typeof c === "string" && c.trim()) return c;
      if (typeof c === "object") {
        const nm = (c as any).name ?? (c as any).category?.name;
        if (typeof nm === "string" && nm.trim()) return nm;
      }
    }
  }
  return undefined;
}

export function getCategorySlug(p?: MaybePost | null): string | undefined {
  if (!p) return undefined;
  const fromSingle =
    typeof p.category === "string"
      ? slugify(p.category)
      : p.category && typeof p.category === "object"
      ? slugify((p.category as any).slug ?? (p.category as any).category?.slug)
      : undefined;

  if (fromSingle && fromSingle.trim()) return fromSingle;

  if (Array.isArray(p.categories) && p.categories.length) {
    for (const c of p.categories) {
      if (!c) continue;
      if (typeof c === "string") {
        const s = slugify(c);
        if (s) return s;
      } else if (typeof c === "object") {
        const s = slugify(
          (c as any).slug ??
            (c as any).category?.slug ??
            (c as any).name ??
            (c as any).category?.name
        );
        if (s) return s;
      }
    }
  }

  const fallback = getCategoryName(p);
  return fallback ? slugify(fallback) : undefined;
}

export function getSlug(p?: MaybePost | null): string | number | undefined {
  return (p?.slug ?? undefined) || p?.id;
}

export function getAuthor(p?: MaybePost | null): string {
  const nm =
    (typeof p?.author === "string" ? p?.author : p?.author?.name) ??
    p?.authorName;
  return nm && nm.trim() ? nm : "Equipe Trevvos";
}

export function formatDate(d?: string | Date | null) {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
      .format(date)
      .replace(".", "");
  } catch {
    return "";
  }
}

/** extrai nomes de tags com segurança */
export function getTagNames(p?: MaybePost | null): string[] {
  if (!p?.tags) return [];
  const out: string[] = [];
  for (const t of p.tags) {
    const name = t?.tag?.name;
    if (typeof name === "string" && name.trim()) out.push(name);
  }
  return out;
}
