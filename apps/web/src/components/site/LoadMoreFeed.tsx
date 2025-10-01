// apps/web/src/components/site/LoadMoreFeed.tsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MaybePost } from "../../lib/post-utils";
import { PostHero } from "./PostHero";

type Props = {
  initialPosts: MaybePost[];
  /** Ex.: "/api/posts?status=PUBLISHED" (proxy) ou "http://localhost:3333/posts?status=PUBLISHED" */
  queryBase: string;
  /** Quantidade por página */
  take?: number;
  /** Quantos já foram consumidos antes do grid (ex.: hero = 1) */
  initialSkip?: number;
  /** Nome do parâmetro de offset usado pelo backend */
  paramName?: "skip" | "offset";
};

export function LoadMoreFeed({
  initialPosts,
  queryBase,
  take = 2,
  initialSkip = 0,
  paramName = "skip",
}: Props) {
  const [items, setItems] = useState<MaybePost[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [ended, setEnded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // tudo que já foi mostrado (hero opcional + itens do grid)
  const computedSkip = initialSkip + items.length;

  // AbortController para cancelar fetch ao desmontar ou em clique rápido
  const abortRef = useRef<AbortController | null>(null);
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  // Montagem robusta da URL (suporta relativa "/api/..." e absoluta "http://...")
  const endpoint = useMemo(() => {
    // Como é client component, window existe.
    const isAbsolute = /^https?:\/\//i.test(queryBase);
    const base = isAbsolute
      ? queryBase
      : new URL(queryBase, window.location.origin).toString();
    const url = new URL(base);
    // preserva query existente e adiciona/atualiza paginação
    url.searchParams.set("take", String(take));
    url.searchParams.set(paramName, String(computedSkip));
    return url.toString();
  }, [queryBase, take, paramName, computedSkip]);

  const loadMore = useCallback(async () => {
    if (loading || ended) return;
    setLoading(true);
    setError(null);

    // cancela requisição anterior se existir
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch(endpoint, {
        cache: "no-store",
        signal: controller.signal,
        // credenciais só se seu proxy/endpoint exigir cookies
        // credentials: "include",
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const next: unknown = await res.json();
      if (!Array.isArray(next)) throw new Error("Formato inesperado da API");

      const casted = next as MaybePost[];

      // concatena; nada de dedupe agressivo aqui
      setItems((prev) => [...prev, ...casted]);

      // acabou quando vier menos que o take
      if (casted.length < take) setEnded(true);
    } catch (e: any) {
      if (e?.name === "AbortError") return; // usuário clicou de novo / desmontou
      setError(e?.message ?? "Erro ao carregar.");
    } finally {
      setLoading(false);
    }
  }, [endpoint, loading, ended, take]);

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {items.map((p, i) => {
        const key =
          (p as any)?.id ?? (p as any)?.slug ?? `post-${initialSkip}-${i}`;
        return <PostHero key={key} post={p} />;
      })}

      <div className="sm:col-span-2 flex flex-col items-center gap-3 pt-2">
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!ended ? (
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-4 font-medium cursor-pointer bg-emerald-50 text-green-700  py-2 rounded-xl border border-neutral-300 hover:border-neutral-400 disabled:opacity-60"
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
