import type { MetadataRoute } from "next";

import { getArticles } from "@/lib/blog";
import { SITE_URL } from "@/lib/siteUrl";

const PUBLIC_PAGES = ["/blog", "/login", "/register"];

// Halaman publik dan artikel yang sudah terbit (PRD FR-07). Artikel draf tidak masuk,
// termasuk di DEV walaupun halamannya bisa dibuka.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...PUBLIC_PAGES.map((path) => ({ url: `${SITE_URL}${path}` })),
    ...getArticles()
      .filter((article) => article.status === "published")
      .map((article) => ({
        url: `${SITE_URL}/blog/${article.slug}`,
        lastModified: article.updatedAt ?? article.publishedAt,
      })),
  ];
}
