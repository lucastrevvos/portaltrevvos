import type { MetadataRoute } from "next";

import type { PostWithRelations } from "@trevvos/types";
import { apiFetch } from "../lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const posts = await apiFetch<PostWithRelations[]>(
    "/posts?status=PUBLISHED&take=1000"
  );

  const items: MetadataRoute.Sitemap = [
    {
      url: `${SITE}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...posts.map((p) => ({
      url: `${SITE}/post/${(p as any).slug ?? (p as any).id}`,
      lastModified: new Date(
        (p as any).updatedAt ?? (p as any).publishedAt ?? (p as any).createdAt
      ),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];

  return items;
}
