import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingExcludes: {
    "*": ["data/**", "Database/**"],
  },
};

export default nextConfig;
