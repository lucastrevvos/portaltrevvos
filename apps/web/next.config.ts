import type { NextConfig } from "next";

// pega hostname da API do Render a partir da env
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
let apiHostname: string | undefined;
try {
  apiHostname = apiUrl ? new URL(apiUrl).hostname : undefined;
} catch {
  apiHostname = undefined;
}

const nextConfig: NextConfig = {
  // não travar build por lint
  eslint: { ignoreDuringBuilds: true },

  images: {
    // permite imagens do S3 e da API (se servir /uploads)
    remotePatterns: [
      // S3 (ajuste bucket/região)
      {
        protocol: "https",
        hostname: "trevvos-uploads.s3.sa-east-1.amazonaws.com",
      },
      // Qualquer *.amazonaws.com (opcional; comente a linha de cima se usar esta)
      // { protocol: "https", hostname: "**.amazonaws.com" },

      // API Render (ex.: trevvos-api.onrender.com)
      ...(apiHostname
        ? ([{ protocol: "https", hostname: apiHostname }] as const)
        : []),
    ],
  },

  // (opcional) otimiza páginas estáticas incrementais, se usar
  // experimental: { incrementalCacheHandlerPath: undefined },
};

export default nextConfig;
