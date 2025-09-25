export function articleJsonLd(opts: {
  url: string;
  title: string;
  description?: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
  siteName?: string;
}) {
  const {
    url,
    title,
    description,
    image,
    datePublished,
    dateModified,
    authorName = "Equipe Trevvos",
    siteName = "Trevvos",
  } = opts;

  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: title,
    description: description || "",
    image: image ? [image] : undefined,
    author: { "@type": "Person", name: authorName },
    publisher: {
      "@type": "Organization",
      name: siteName,
      logo: {
        "@type": "ImageObject",
        url: `${
          process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
        }/icon.png`,
      },
    },
    datePublished,
    dateModified: dateModified || datePublished,
  };
  return JSON.stringify(data);
}
