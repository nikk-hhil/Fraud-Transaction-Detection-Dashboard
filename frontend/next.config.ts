import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Add Docker compatibility settings
  webpack: (config) => {
    return config;
  },
  // Important for Docker to detect file changes
  webpackDevMiddleware: (config: any) => {
    config.watchOptions = {
      poll: 1000, // Check for changes every second
      aggregateTimeout: 300, // Delay before rebuilding
    };
    return config;
  },
  // Ensure Next.js listens on all network interfaces
  experimental: {
    // Any existing experimental features would stay here
  }
};

export default nextConfig;