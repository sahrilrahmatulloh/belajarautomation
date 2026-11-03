import "server-only";

import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import GithubSlugger from "github-slugger";
import matter from "gray-matter";

import { isDev } from "@/lib/env";
import { Article, ArticleHeading } from "@/types/Article";

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");
const DEFAULT_AUTHOR = "Tim BelajarAutomation";
const WORDS_PER_MINUTE = 200;
const RELATED_LIMIT = 3;

export interface ArticleWithContent {
  article: Article;
  content: string;
}

// Tanggal YAML tanpa tanda kutip terbaca sebagai Date.
function toDateString(value: unknown) {
  return value instanceof Date ? value.toISOString().slice(0, 10) : (value as string);
}

function countReadingMinutes(content: string) {
  const words = content
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter((word) => /[\p{L}\p{N}]/u.test(word));
  return Math.max(1, Math.ceil(words.length / WORDS_PER_MINUTE));
}

// Keabsahan frontmatter dijamin oleh npm run check:blog sebelum build.
function readArticle(file: string): ArticleWithContent {
  const { data, content } = matter(readFileSync(path.join(CONTENT_DIR, file), "utf8"));

  return {
    article: {
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt,
      category: data.category,
      author: data.author ?? DEFAULT_AUTHOR,
      publishedAt: toDateString(data.publishedAt),
      ...(data.updatedAt && { updatedAt: toDateString(data.updatedAt) }),
      cover: data.cover,
      status: data.status,
      featured: data.featured === true,
      cta: data.cta ?? [],
      sources: data.sources ?? [],
      readingMinutes: countReadingMinutes(content),
    },
    content,
  };
}

let cache: ArticleWithContent[] | null = null;

// Artikel yang boleh tampil di lingkungan ini, terbaru lebih dulu. Draf hanya tampil
// di DEV; UAT dan Production hanya menampilkan yang sudah terbit (PRD FR-07).
function readVisibleArticles() {
  cache ??= readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map(readArticle)
    .filter(({ article }) => isDev || article.status === "published")
    .sort((a, b) => b.article.publishedAt.localeCompare(a.article.publishedAt));
  return cache;
}

export function getArticles() {
  return readVisibleArticles().map(({ article }) => article);
}

export function getArticleBySlug(slug: string) {
  return readVisibleArticles().find(({ article }) => article.slug === slug);
}

// Artikel terkait: kategori yang sama lebih dulu, lalu yang terbaru.
export function getRelatedArticles(current: Article) {
  const others = getArticles().filter((article) => article.slug !== current.slug);
  return [
    ...others.filter((article) => article.category === current.category),
    ...others.filter((article) => article.category !== current.category),
  ].slice(0, RELATED_LIMIT);
}

// Daftar isi dari heading level 2. Heading level 3 ikut dihitung karena memakai slugger
// yang sama dengan rehype-slug (components/blog/mdx/ArticleContent.tsx), sehingga id
// heading kembar tetap cocok dengan yang ada di halaman.
export function getArticleHeadings(content: string): ArticleHeading[] {
  const slugger = new GithubSlugger();
  const withoutCode = content.replace(/^```[\s\S]*?^```/gm, "");
  const headings: ArticleHeading[] = [];

  for (const [, level, raw] of withoutCode.matchAll(/^(#{1,6})[ \t]+(.+?)[ \t]*\r?$/gm)) {
    const title = raw.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/[`*_]/g, "");
    const id = slugger.slug(title);
    if (level.length === 2) headings.push({ id, title });
  }

  return headings;
}
