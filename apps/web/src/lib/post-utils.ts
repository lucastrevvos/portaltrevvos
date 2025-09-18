export type { PostWithRelations } from "@trevvos/types";

export function slugify(input?: string): string {
  const s = (input ?? "").toString();
  return s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // espaços -> hífen
    .replace(/[^a-z0-9-]/g, "") // remove chars fora do slug
    .replace(/-+/g, "-"); // hifens repetidos -> um
}

export function getCoverUrl(p?: any): string | undefined {
  if (!p) return undefined;
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
