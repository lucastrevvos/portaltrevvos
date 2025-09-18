export type { PostWithRelations } from "@trevvos/types";

export function slugify(input?: string): string {
  const s = (input ?? "")
    .toLowerCase()
    .normalize("NFD") // separa acentos
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
  return s; // sempre string (pode ser "", mas nunca undefined)
}

export function getTagNames(p: any): string[] {
  const arr = p?.tags ?? p?.postTags ?? [];
  return arr
    .map((t: any) => t?.tag?.name ?? t?.name)
    .filter(
      (x: any): x is string => typeof x === "string" && x.trim().length > 0
    );
}

export function getCoverUrl(p?: any): string | undefined {
  if (!p) return undefined;

  // 👇 cobre o campo real da tua API
  if (typeof p.coverImage === "string") return p.coverImage;

  if (typeof p.cover === "string") return p.cover as string;
  if (p.cover?.url) return p.cover.url as string;
  if (Array.isArray(p.images) && p.images[0]?.url)
    return p.images[0].url as string;
  return undefined;
}
export function getCategoryName(p?: any): string | undefined {
  if (!p) return undefined;
  if (typeof p.category === "string") return p.category as string;
  if (typeof p.category?.name === "string") return p.category.name as string;
  if (typeof p.category?.category?.name === "string")
    return p.category.category.name as string;
  if (Array.isArray(p.categories) && p.categories.length) {
    const c0 = p.categories[0];
    if (typeof c0 === "string") return c0 as string;
    if (typeof c0?.name === "string") return c0.name as string;
    if (typeof c0?.category?.name === "string")
      return c0.category.name as string;
  }
  return undefined;
}

export function getCategorySlug(p?: any): string | undefined {
  if (!p) return undefined;
  if (typeof p.category === "string") return slugify(p.category);
  if (typeof p.category?.slug === "string") return p.category.slug as string;
  if (typeof p.category?.category?.slug === "string")
    return p.category.category.slug as string;
  if (Array.isArray(p.categories) && p.categories.length) {
    const c0 = p.categories[0];
    if (typeof c0 === "string") return slugify(c0);
    if (typeof c0?.slug === "string") return c0.slug as string;
    if (typeof c0?.category?.slug === "string")
      return c0.category.slug as string;
  }
  const name = getCategoryName(p);
  return name ? slugify(name) : undefined;
}
export function getSlug(p?: any): string | number | undefined {
  return p?.slug ?? p?.id;
}

export function getAuthor(p?: any): string {
  return p?.author?.name ?? p?.authorName ?? "Equipe Trevvos";
}

export function formatDate(d?: string | Date) {
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
