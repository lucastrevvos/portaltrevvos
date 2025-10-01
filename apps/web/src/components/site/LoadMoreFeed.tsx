"use client";

import { useCallback, useMemo, useState } from "react";
import type { MaybePost } from "../../lib/post-utils";
import { PostHero } from "./PostHero";

type Props = {
  initialPosts: MaybePost[];
  queryBase: string; // ex: "/posts?status=PUBLISHED"
  take?: number; // default 20
  initialSkip?: number; // quantos já foram consumidos (hero = 1)
};

export function LoadMoreFeed({
  initialPosts,
  queryBase,
  take = 20,
  initialSkip = 0,
}: Props) {
  const [items, setItems] = useState<MaybePost[]>(initialPosts);
  const [skip, setSkip] = useState(initialPosts.length + initialSkip);
  const [loading, setLoading] = useState(false);
  const [ended, setEnded] = useState(initialPosts.length < take); // se já veio menos que take, acabou
  const [error, setError] = useState<string | null>(null);

  const endpoint = useMemo(() => {
    // offset pagination
    const sep = queryBase.includes("?") ? "&" : "?";
    return `${queryBase}${sep}take=${take}&skip=${skip}`;
  }, [queryBase, take, skip]);

  const loadMore = useCallback(async () => {
    if (loading || ended) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(endpoint, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const next: MaybePost[] = await res.json();

      if (!Array.isArray(next)) {
        throw new Error("Formato inesperado da API");
      }

      // evita duplicados por id (caso backend altere ordenação)
      const map = new Map<string | number, MaybePost>();
      for (const p of [...items, ...next]) {
        const id = (p as any)?.id ?? (p as any)?.slug ?? Math.random();
        map.set(id, p);
      }
      const merged = Array.from(map.values());

      setItems(merged);
      setSkip(merged.length + initialSkip);
      if (next.length < take) setEnded(true);
    } catch (e: any) {
      setError(e?.message ?? "Erro ao carregar.");
    } finally {
      setLoading(false);
    }
  }, [endpoint, items, take, initialSkip, loading, ended]);

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {items.map((p) => (
        <PostHero key={(p as any).id ?? (p as any).slug} post={p} />
      ))}

      {/* Área de controle abaixo da grid */}
      <div className="sm:col-span-2 flex flex-col items-center gap-3 pt-2">
        {error && <p className="text-sm text-red-600">{error}</p>}

        {!ended ? (
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-4 py-2 rounded-xl border border-neutral-300 hover:border-neutral-400 disabled:opacity-60"
          >
            {loading ? "Carregando..." : "Carregar mais"}
          </button>
        ) : (
          <p className="text-sm text-neutral-500">Sem mais posts por agora.</p>
        )}
      </div>
    </div>
  );
}
