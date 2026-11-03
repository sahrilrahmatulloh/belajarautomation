// Memastikan setiap artikel di content/blog valid (PRD FR-07): frontmatter lengkap,
// kategori valid, slug unik dan sama dengan nama file, file sampul ada, setiap ajakan
// menuju course "available", latihan, atau roadmap yang ada, video referensi valid (maksimal
// 3 per artikel), dan MDX bisa dikompilasi.
// Gagal (exit 1) bila tidak. Jalankan: npm run check:blog (otomatis sebelum npm run build).
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { compile } from "@mdx-js/mdx";
import matter from "gray-matter";
import remarkGfm from "remark-gfm";

import { findVideos } from "./blog-videos.mjs";

const CONTENT_DIR = process.argv[2] ?? "content/blog";
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const REQUIRED_TEXT = ["title", "slug", "excerpt", "category", "cover"];
const VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;
const VIDEO_DURATION_PATTERN = /^(\d+:[0-5]\d|\d+:[0-5]\d:[0-5]\d)$/;
const MAX_VIDEOS = 3;

const categories = [...readFileSync("types/Article.ts", "utf8").match(/ARTICLE_CATEGORIES = \[([\s\S]*?)\]/)[1].matchAll(/"([^"]+)"/g)].map(
  (match) => match[1]
);

const availableCourses = new Set(
  readFileSync("data/courses.ts", "utf8")
    .split(/\r?\n  \{/)
    .slice(1)
    .filter((block) => /availability:\s*"available"/.test(block))
    .map((block) => block.match(/slug:\s*"([^"]+)"/)?.[1])
);
const practices = new Set(
  [...readFileSync("data/challenges.ts", "utf8").matchAll(/^ {4}slug:\s*"([^"]+)"/gm)].map((match) => match[1])
);
const roadmaps = new Set(
  [...readFileSync("data/roadmap.ts", "utf8").matchAll(/^ {4}id:\s*"([^"]+)"/gm)].map((match) => match[1])
);

function ctaProblem({ type, slug } = {}) {
  if (type === "roadmap") {
    return slug === undefined || roadmaps.has(slug) ? null : `roadmap "${slug}" tidak ada`;
  }
  if (type === "course") {
    return availableCourses.has(slug) ? null : `course "${slug}" tidak ada atau belum tersedia`;
  }
  if (type === "practice") return practices.has(slug) ? null : `latihan "${slug}" tidak ada`;
  return `jenis ajakan "${type}" tidak dikenal`;
}

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

  if (data.sources !== undefined) {
    const valid = Array.isArray(data.sources) && data.sources.every((source) => source?.title && /^https?:\/\//.test(source?.url ?? ""));
    if (!valid) report(`"sources" harus berisi daftar { title, url } dengan url http(s)`);
  }

  // Kotak ajakan di dalam isi artikel, mis. <Ajakan type="course" slug="playwright" />.
  for (const [tag] of content.matchAll(/<Ajakan\b[^>]*>/g)) {
    const type = tag.match(/type="([^"]+)"/)?.[1];
    const slug = tag.match(/slug="([^"]+)"/)?.[1];
    const problem = ctaProblem({ type, slug });
    if (problem) report(`<Ajakan>: ${problem}`);
  }

  for (const [, src] of content.matchAll(/<Gambar\b[^>]*\bsrc="([^"]+)"/g)) {
    if (!existsSync(path.join("public", src))) report(`<Gambar>: file "${src}" tidak ada di public/`);
  }

  // Video referensi YouTube (PRD FR-02 bagian G).
  const videos = findVideos(content);
  if (videos.length > MAX_VIDEOS) report(`maksimal ${MAX_VIDEOS} video per artikel, ada ${videos.length}`);
  for (const video of videos) {
    const label = `<VideoYouTube id="${video.id ?? ""}">`;
    if (!VIDEO_ID_PATTERN.test(video.id ?? "")) report(`${label}: "id" harus 11 karakter huruf, angka, - atau _`);
    if (!video.judul?.trim()) report(`${label}: "judul" wajib diisi`);
    if (!video.channel?.trim()) report(`${label}: "channel" wajib diisi`);
    if (!VIDEO_DURATION_PATTERN.test(video.durasi ?? "")) report(`${label}: "durasi" wajib berformat m:ss atau h:mm:ss`);
  }

  try {
    await compile(content, { remarkPlugins: [remarkGfm] });
  } catch (error) {
    report(`MDX tidak valid: ${error.message}`);
  }
}

if (problems.length > 0) {
  console.error(`Masalah artikel blog (${problems.length}):`);
  problems.forEach((item) => console.error(`  - ${item}`));
  process.exit(1);
}

console.log(`Semua ${files.length} artikel blog valid.`);
