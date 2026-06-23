import type { PostWithRelations } from "@trevvos/types";
import { getCategorySlug } from "./post-utils";
import { apiFetch } from "./api";

/**
 * Busca até 50 posts da MESMA categoria, ordenados recentes primeiro,
 * e retorna anterior/próximo relativos ao post atual.
 */
export async function fetchSiblings(current: PostWithRelations) {
  const cat = getCategorySlug(current);
  if (!cat)
    return {
      prev: undefined as PostWithRelations | undefined,
      next: undefined as PostWithRelations | undefined,
    };

  const list = await apiFetch<PostWithRelations[]>(
    `/posts?category=${encodeURIComponent(cat)}&status=PUBLISHED&take=50`
  );

  const idOrSlug = (p: any) => p?.slug ?? p?.id;
  const idx = list.findIndex((p: any) => idOrSlug(p) === idOrSlug(current));
  if (idx === -1) return { prev: undefined, next: list[0] }; // fallback: sugere o mais recente

  // lista ordenada desc — "prev" é o mais ANTIGO (idx+1), "next" é o mais RECENTE (idx-1)
  const next = idx > 0 ? list[idx - 1] : undefined;
  const prev = idx < list.length - 1 ? list[idx + 1] : undefined;
  return { prev, next };
}
