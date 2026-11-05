// Pemeriksaan isi MDX yang sama untuk artikel blog dan lesson: ajakan, gambar, video referensi,
// dan kompilasi. Dipakai check-blog dan check-lessons.
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { compile } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";

import { findVideos } from "./blog-videos.mjs";

const VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;
const VIDEO_DURATION_PATTERN = /^(\d+:[0-5]\d|\d+:[0-5]\d:[0-5]\d)$/;
const MAX_VIDEOS = 3;

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

export function ctaProblem({ type, slug } = {}) {
  if (type === "roadmap") {
    return slug === undefined || roadmaps.has(slug) ? null : `roadmap "${slug}" tidak ada`;
  }
  if (type === "course") {
    return availableCourses.has(slug) ? null : `course "${slug}" tidak ada atau belum tersedia`;
  }
  if (type === "practice") return practices.has(slug) ? null : `latihan "${slug}" tidak ada`;
  return `jenis ajakan "${type}" tidak dikenal`;
}

export function sourcesProblem(sources) {
  if (sources === undefined) return null;
  const valid = Array.isArray(sources) && sources.every((source) => source?.title && /^https?:\/\//.test(source?.url ?? ""));
  return valid ? null : `"sources" harus berisi daftar { title, url } dengan url http(s)`;
}

// `kind` dipakai di pesan batas video, mis. "artikel".
export async function checkContentBody(content, kind, report) {
  // Kotak ajakan di dalam isi, mis. <Ajakan type="course" slug="playwright" />.
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
  if (videos.length > MAX_VIDEOS) report(`maksimal ${MAX_VIDEOS} video per ${kind}, ada ${videos.length}`);
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
