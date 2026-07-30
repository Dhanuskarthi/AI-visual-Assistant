import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "/api/server.py",
      },
      {
        source: "/uploads/:path*",
        destination: "/api/server.py",
      },
    ];
  },
};

export default nextConfig;
