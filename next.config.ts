import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/examination",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;