// Kategori blog (PRD FR-07).
export const ARTICLE_CATEGORIES = [
  "QA Fundamentals",
  "Manual Testing",
  "Automation Testing",
  "API Testing",
  "Programming",
  "Career",
  "Tools dan teknologi",
] as const;

export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number];

export type ArticleStatus = "draft" | "published";

// Tujuan ajakan di artikel. Roadmap tanpa slug menuju halaman daftar roadmap.
export type ArticleCta =
  | { type: "course" | "practice"; slug: string }
  | { type: "roadmap"; slug?: string };

export interface ArticleSource {
  title: string;
  url: string;
}

// Judul bagian untuk daftar isi. id sama dengan id heading di halaman.
export interface ArticleHeading {
  id: string;
  title: string;
}

// Metadata artikel, dari frontmatter file content/blog/<slug>.mdx.
export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: ArticleCategory;
  author: string;
  // Format YYYY-MM-DD.
  publishedAt: string;
  updatedAt?: string;
  cover: string;
  status: ArticleStatus;
  featured: boolean;
  cta: ArticleCta[];
  sources: ArticleSource[];
  // Dihitung otomatis dari isi artikel.
  readingMinutes: number;
}
