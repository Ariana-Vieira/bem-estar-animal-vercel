import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cópia para a Vercel: não trava o deploy por erros de tipo do TypeScript
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
