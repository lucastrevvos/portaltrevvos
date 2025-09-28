import type { NextConfig } from "next";
import type { RemotePattern } from "next/dist/shared/lib/image-config";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
let apiPattern: RemotePattern[] = [];

if (apiUrl) {
  try {
    const parsed = new URL(apiUrl);
    apiPattern.push({
      protocol: parsed.protocol.startsWith("https") ? "https" : "http",
      hostname: parsed.hostname,
    });
  } catch {
    // ignora se a URL estiver mal formada
  }
}

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "trevvos-uploads.s3.sa-east-1.amazonaws.com",
      },
      ...apiPattern,
    ],
  },
  output: "standalone",
};

export default nextConfig;
