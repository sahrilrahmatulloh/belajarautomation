import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/books", destination: "/ebooks", permanent: true },
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
