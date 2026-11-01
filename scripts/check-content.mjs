// Pemeriksaan status konten dan akses course (CURRICULUM bagian 1).
// 1. Course fondasi wajib "free" (gagal bila dilanggar).
// 2. Mendaftar course "available" yang masih berstatus konten "draft";
//    sebelum rilis daftar ini wajib kosong.
// Jalankan: npm run check:content (draf hanya peringatan, ikut sebelum npm run build)
//           npm run check:content:release (gagal bila masih ada draf)
import { readFileSync } from "node:fs";

const strict = process.argv.includes("--strict");

// Course fondasi yang wajib gratis menurut CURRICULUM v2.1.
const REQUIRED_FREE = ["qa-fundamentals", "dasar-web-api", "test-design", "bug-reporting", "git-github"];

const courses = readFileSync("data/courses.ts", "utf8")
  .split(/\r?\n  \{/)
  .slice(1)
  .map((block) => ({
    slug: block.match(/slug:\s*"([^"]+)"/)?.[1] ?? "?",
    title: block.match(/title:\s*"([^"]+)"/)?.[1] ?? "?",
    category: block.match(/category:\s*"([^"]+)"/)?.[1],
    hasLanguage: /languages:\s*\[\s*"/.test(block),
    available: /availability:\s*"available"/.test(block),
    draft: /contentStatus:\s*"draft"/.test(block),
    access: block.match(/access:\s*"([^"]+)"/)?.[1],
  }));

const accessProblems = [];
for (const course of courses) {
  if (course.access !== "free" && course.access !== "premium") {
    accessProblems.push(`${course.slug}: access harus "free" atau "premium"`);
  }
}
for (const slug of REQUIRED_FREE) {
  const course = courses.find((item) => item.slug === slug);
  if (!course) accessProblems.push(`${slug}: course fondasi tidak ada di katalog`);
  else if (course.access !== "free") accessProblems.push(`${slug}: course fondasi wajib free`);
}
const isFree = (course) => course.access === "free";
if (!courses.some((course) => isFree(course) && course.category === "Programming" && course.hasLanguage)) {
  accessProblems.push("minimal satu course bahasa pemrograman wajib free");
}
if (!courses.some((course) => isFree(course) && course.category === "Web Automation" && course.hasLanguage)) {
  accessProblems.push("minimal satu tool automation wajib free");
}

if (accessProblems.length > 0) {
  console.error(`Masalah akses course (${accessProblems.length}):`);
  accessProblems.forEach((item) => console.error(`  - ${item}`));
  process.exit(1);
}

const premium = courses.filter((course) => course.access === "premium").length;
console.log(`Akses course valid: ${courses.length - premium} free, ${premium} premium.`);

const drafts = courses
  .filter((course) => course.available && course.draft)
  .map((course) => `${course.slug} (${course.title})`);

if (drafts.length === 0) {
  console.log("Semua course available sudah berstatus ready.");
  process.exit(0);
}

const log = strict ? console.error : console.warn;
log(`${strict ? "Gagal" : "Pengingat"}: ${drafts.length} course available masih draft:`);
drafts.forEach((item) => log(`  - ${item}`));

if (strict) {
  log("Lengkapi materinya (contentStatus: \"ready\") atau ubah ke coming-soon sebelum rilis.");
  process.exit(1);
}
