import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  allowedDevOrigins: ["*"],
  experimental: {
    serverActions: {
      allowedOrigins: ["192.168.86.31:3000"],
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
