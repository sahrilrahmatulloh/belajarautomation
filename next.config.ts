import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/books", destination: "/ebooks", permanent: true },
      { source: "/books/:slug", destination: "/ebooks/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
