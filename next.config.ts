import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Thumbnail video referensi YouTube.
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" }],
  },
  // Slug yang tidak dikenal dirender saat diminta untuk menampilkan halaman 404 blog,
  // jadi file artikel harus ikut tersedia di server.
  outputFileTracingIncludes: {
    "/blog/[slug]": ["./content/blog/**"],
    "/learn/[slug]/[lesson]": ["./content/lessons/**"],
  },
  async redirects() {
    return [
      { source: "/books", destination: "/ebooks", permanent: true },
      // Premium berganti nama menjadi Membership (PRD v2.0).
      { source: "/premium", destination: "/membership", permanent: true },
      { source: "/books/:slug", destination: "/ebooks/:slug", permanent: true },
      // Jalur roadmap lama sebelum diselaraskan dengan PRD.
      { source: "/roadmap/web-automation-engineer", destination: "/roadmap/qa-automation-web", permanent: true },
      { source: "/roadmap/mobile-automation-engineer", destination: "/roadmap/qa-automation-mobile", permanent: true },
      { source: "/roadmap/qa-automation-engineer", destination: "/roadmap", permanent: true },
      { source: "/roadmap/vibe-coding-qa-engineer", destination: "/roadmap", permanent: true },
    ];
  },
};

export default nextConfig;
