// apps/web/src/app/feed.xml/route.ts
import { NextResponse } from "next/server";
import type { PostWithRelations } from "@trevvos/types";
import { apiFetch } from "../../lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const TITLE = "Trevvos";
  const DESC = "Conteúdo + Apps que fazem sentido.";

  const posts = await apiFetch<PostWithRelations[]>(
    "/posts?status=PUBLISHED&take=50"
  );

  const items = posts
    .map((p) => {
      const url = `${SITE}/post/${(p as any).slug ?? (p as any).id}`;
      const title = (p as any).title ?? "Post";
      const summary =
        (p as any).excerpt ??
        (p as any).subtitle ??
        ((p as any).content || "").slice(0, 180);
      const pub = new Date(
        (p as any).publishedAt ?? (p as any).createdAt ?? Date.now()
      ).toUTCString();

      return `
<item>
  <title><![CDATA[${title}]]></title>
  <link>${url}</link>
  <guid isPermaLink="true">${url}</guid>
  <description><![CDATA[${summary}]]></description>
  <pubDate>${pub}</pubDate>
</item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title><![CDATA[${TITLE}]]></title>
  <link>${SITE}</link>
  <description><![CDATA[${DESC}]]></description>
  <language>pt-BR</language>
  ${items}
</channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "content-type": "application/rss+xml; charset=UTF-8",
      "cache-control": "public, s-maxage=600, stale-while-revalidate=86400",
    },
  });
}
