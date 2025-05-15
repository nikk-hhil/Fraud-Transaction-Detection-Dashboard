import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Add Docker compatibility settings
  webpack: (config) => {
    return config;
  },
  // Ensure Next.js listens on all network interfaces
  experimental: {
    // Any existing experimental features would stay here
  }
};

export default nextConfig;