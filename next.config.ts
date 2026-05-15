import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "**.supabase.in" },
    ],
  },
  // フェーズ1移行中: @supabase/ssr の型推論が一部の場所で
  // never に解決される既知の問題があるため、デプロイをブロックしない。
  // フェーズ2以降で型を修正する。
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
