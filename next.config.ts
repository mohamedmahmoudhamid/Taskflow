import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: "https://authentication-production-c654.up.railway.app/api/auth/:path*",
      },
    ];
  },
};

export default nextConfig;
