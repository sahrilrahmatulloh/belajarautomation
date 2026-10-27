export type ArticleCategory =
  | "Automation"
  | "Playwright"
  | "Mobile"
  | "API Testing"
  | "Career"
  | "AI";

export interface ArticleSection {
  heading: string;
  paragraphs: string[];
}

export interface Article {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: ArticleCategory;
  author: string;
  publishedAt: string;
  readTime: string;
  cover: string;
  featured: boolean;
  content: ArticleSection[];
}