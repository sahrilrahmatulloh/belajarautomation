// Memastikan setiap artikel di content/blog valid (PRD FR-07): frontmatter lengkap,
// kategori valid, slug unik dan sama dengan nama file, file sampul ada, setiap ajakan
// menuju course "available", latihan, atau roadmap yang ada, video referensi valid (maksimal
// 3 per artikel), dan MDX bisa dikompilasi.
// Gagal (exit 1) bila tidak. Jalankan: npm run check:blog (otomatis sebelum npm run build).
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import matter from "gray-matter";

import { checkContentBody, ctaProblem, sourcesProblem } from "./content-checks.mjs";

const CONTENT_DIR = process.argv[2] ?? "content/blog";
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const REQUIRED_TEXT = ["title", "slug", "excerpt", "category", "cover"];
const categories = [...readFileSync("types/Article.ts", "utf8").match(/ARTICLE_CATEGORIES = \[([\s\S]*?)\]/)[1].matchAll(/"([^"]+)"/g)].map(
  (match) => match[1]
);

// Tanggal YAML tanpa tanda kutip terbaca sebagai Date.
const isValidDate = (value) => value instanceof Date || DATE_PATTERN.test(String(value));

const problems = [];
const slugs = new Map();
const files = existsSync(CONTENT_DIR) ? readdirSync(CONTENT_DIR).filter((file) => file.endsWith(".mdx")) : [];

for (const file of files) {
  const report = (message) => problems.push(`${file}: ${message}`);
  const { data, content } = matter(readFileSync(path.join(CONTENT_DIR, file), "utf8"));

  for (const field of REQUIRED_TEXT) {
    if (typeof data[field] !== "string" || !data[field].trim()) report(`"${field}" wajib diisi`);
  }

  if (data.author !== undefined && (typeof data.author !== "string" || !data.author.trim())) {
    report(`"author" tidak boleh kosong; hapus untuk memakai penulis bawaan`);
  }

  if (data.category && !categories.includes(data.category)) report(`kategori "${data.category}" tidak valid`);

  if (data.slug) {
    if (data.slug !== path.basename(file, ".mdx")) report(`slug "${data.slug}" harus sama dengan nama file`);
    if (slugs.has(data.slug)) report(`slug "${data.slug}" sudah dipakai ${slugs.get(data.slug)}`);
    slugs.set(data.slug, file);
  }

  if (!isValidDate(data.publishedAt)) report(`"publishedAt" wajib berformat YYYY-MM-DD`);
  if (data.updatedAt !== undefined && !isValidDate(data.updatedAt)) report(`"updatedAt" wajib berformat YYYY-MM-DD`);

  if (data.status !== "draft" && data.status !== "published") report(`"status" harus "draft" atau "published"`);
  if (typeof data.featured !== "boolean") report(`"featured" harus true atau false`);

  if (typeof data.cover === "string" && (!data.cover.startsWith("/") || !existsSync(path.join("public", data.cover)))) {
    report(`file sampul "${data.cover}" tidak ada di public/`);
  }

  if (!Array.isArray(data.cta) || data.cta.length === 0) {
    report(`"cta" wajib berisi minimal satu tujuan`);
  } else {
    for (const cta of data.cta) {
      const problem = ctaProblem(cta);
      if (problem) report(`cta: ${problem}`);
    }
  }

  const sourcesIssue = sourcesProblem(data.sources);
  if (sourcesIssue) report(sourcesIssue);

  await checkContentBody(content, "artikel", report);
}

if (problems.length > 0) {
  console.error(`Masalah artikel blog (${problems.length}):`);
  problems.forEach((item) => console.error(`  - ${item}`));
  process.exit(1);
}

console.log(`Semua ${files.length} artikel blog valid.`);
