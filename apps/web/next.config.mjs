// apps/web/next.config.mjs
import { URL } from "url";

/** @type {import("next").NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "trevvos-uploads.s3.sa-east-1.amazonaws.com",
      },
      ...(process.env.NEXT_PUBLIC_API_URL
        ? (() => {
            try {
              const parsed = new URL(process.env.NEXT_PUBLIC_API_URL);
              return [
                {
                  protocol: parsed.protocol.startsWith("https")
                    ? "https"
                    : "http",
                  hostname: parsed.hostname,
                },
              ];
            } catch {
              return [];
            }
          })()
        : []),
    ],
  },
  output: "standalone",
};

export default nextConfig;
