import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/auth/", "/new-post", "/edit-post", "/edit-post/*"],
    },
    sitemap: `${SITE}/sitemap.xml`,
  };
}
