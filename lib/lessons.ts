import "server-only";

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import matter from "gray-matter";

import { showsDraftLearning } from "@/lib/env";
import { ArticleSource } from "@/types/Article";

const CONTENT_DIR = path.join(process.cwd(), "content", "lessons");
const DEFAULT_AUTHOR = "Tim BelajarAutomation";

export interface LessonContent {
  content: string;
  status: "draft" | "published";
  author: string;
  sources: ArticleSource[];
}

// Isi lesson dari content/lessons/<course>/<lesson>.mdx. Slug wajib sudah dicocokkan dengan
// data/courseDetails.ts oleh pemanggil. Draf tampil di DEV dan UAT (lib/env.ts); keabsahan frontmatter dijamin
// oleh npm run check:lessons sebelum build.
export function getLessonContent(courseSlug: string, lessonSlug: string): LessonContent | null {
  const file = path.join(CONTENT_DIR, courseSlug, `${lessonSlug}.mdx`);
  if (!existsSync(file)) return null;

  const { data, content } = matter(readFileSync(file, "utf8"));
  if (data.status !== "published" && !showsDraftLearning) return null;

  return { content, status: data.status, author: data.author ?? DEFAULT_AUTHOR, sources: data.sources ?? [] };
}
