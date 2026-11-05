// Memastikan setiap lesson di content/lessons valid (PRD FR-02 bagian F dan G): file cocok dengan
// course dan lesson di data/courseDetails.ts, frontmatter lengkap, isi lengkap tanpa video, dan
// course berstatus "ready" sudah memiliki seluruh lesson yang terbit.
// Gagal (exit 1) bila tidak. Jalankan: npm run check:lessons (otomatis sebelum npm run build).
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

import matter from "gray-matter";

import { checkContentBody, sourcesProblem } from "./content-checks.mjs";

const CONTENT_DIR = process.argv[2] ?? "content/lessons";

const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// Lesson per course. Sebagian ditulis dengan slug, sebagian lewat createModules dari judulnya.
function readCourseLessons() {
  const source = readFileSync("data/courseDetails.ts", "utf8");
  const blocks = source.slice(0, source.indexOf("function createModules")).split(/courseSlug:\s*"/).slice(1);
  return new Map(
    blocks.map((block) => {
      const slug = block.slice(0, block.indexOf('"'));
      const written = [...block.matchAll(/^\s+slug:\s*"([^"]+)"/gm)].map((match) => match[1]);
      const generated = [...block.matchAll(/^\s+\["(.+?)",\s*\d+\]/gm)].map((match) => slugify(match[1]));
      return [slug, new Set([...written, ...generated])];
    })
  );
}

function readReadyCourses() {
  return readFileSync("data/courses.ts", "utf8")
    .split(/\r?\n  \{/)
    .slice(1)
    .filter((block) => /contentStatus:\s*"ready"/.test(block))
    .map((block) => block.match(/slug:\s*"([^"]+)"/)?.[1]);
}

const courses = readCourseLessons();
const problems = [];
const published = new Map();
let total = 0;

const folders = existsSync(CONTENT_DIR)
  ? readdirSync(CONTENT_DIR).filter((name) => statSync(path.join(CONTENT_DIR, name)).isDirectory())
  : [];

for (const courseSlug of folders) {
  const lessons = courses.get(courseSlug);
  if (!lessons) problems.push(`${courseSlug}/: course tidak ada di data/courseDetails.ts`);

  for (const file of readdirSync(path.join(CONTENT_DIR, courseSlug)).filter((name) => name.endsWith(".mdx"))) {
    total += 1;
    const lessonSlug = path.basename(file, ".mdx");
    const report = (message) => problems.push(`${courseSlug}/${file}: ${message}`);
    const { data, content } = matter(readFileSync(path.join(CONTENT_DIR, courseSlug, file), "utf8"));

    if (lessons && !lessons.has(lessonSlug)) report(`lesson "${lessonSlug}" tidak ada di data/courseDetails.ts`);
    if (data.status !== "draft" && data.status !== "published") report(`"status" harus "draft" atau "published"`);
    if (data.author !== undefined && (typeof data.author !== "string" || !data.author.trim())) {
      report(`"author" tidak boleh kosong; hapus untuk memakai penulis bawaan`);
    }
    const sourcesIssue = sourcesProblem(data.sources);
    if (sourcesIssue) report(sourcesIssue);
    if (!content.trim()) report("isi lesson kosong");

    await checkContentBody(content, "lesson", report);

    if (data.status === "published") published.set(courseSlug, [...(published.get(courseSlug) ?? []), lessonSlug]);
  }
}

// Course "ready" berarti seluruh lesson sudah ditulis dan ditinjau (PRD FR-02).
for (const courseSlug of readReadyCourses()) {
  const missing = [...(courses.get(courseSlug) ?? [])].filter((slug) => !(published.get(courseSlug) ?? []).includes(slug));
  if (missing.length > 0) problems.push(`${courseSlug}: berstatus "ready" tetapi ${missing.length} lesson belum terbit`);
}

if (problems.length > 0) {
  console.error(`Masalah lesson (${problems.length}):`);
  problems.forEach((item) => console.error(`  - ${item}`));
  process.exit(1);
}

console.log(`Semua ${total} lesson valid.`);
