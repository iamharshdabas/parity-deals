import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // for faster build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
