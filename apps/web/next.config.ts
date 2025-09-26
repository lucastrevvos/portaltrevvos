import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // ⚠️ desliga o ESLint durante o `next build`
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
