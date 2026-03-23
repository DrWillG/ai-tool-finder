import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/ai-tool-finder",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
