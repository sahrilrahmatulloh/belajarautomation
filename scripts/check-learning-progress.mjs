// Memastikan data dummy riwayat belajar (data/dummy/learningProgress.ts) konsisten
// dengan katalog: course ada dan "available", lesson terakhir ada di detail course
// dengan judul yang sama, dan jumlah lesson selesai tidak melebihi total lesson.
// Jalankan: npm run check:progress (otomatis sebelum npm run build).
import { readFileSync } from "node:fs";

// Detail course: slug lesson -> judul. createModules membentuk slug dari judul.
const slugify = (text) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const detailsSource = readFileSync("data/courseDetails.ts", "utf8");
const lessonsByCourse = new Map();
for (const block of detailsSource.split(/courseSlug:\s*"/).slice(1)) {
  const courseSlug = block.slice(0, block.indexOf('"'));
  const lessons = new Map();
  for (const [, slug, title] of block.matchAll(/slug:\s*"([^"]+)",\s*title:\s*"([^"]+)"/g)) {
    lessons.set(slug, title);
  }
  for (const [, title] of block.matchAll(/\[\s*"([^"]+)",\s*\d+\s*\]/g)) {
    lessons.set(slugify(title), title);
  }
  lessonsByCourse.set(courseSlug, lessons);
}

const coursesSource = readFileSync("data/courses.ts", "utf8");
const courses = new Map(
  coursesSource
    .split(/\r?\n  \{/)
    .slice(1)
    .map((block) => [
      block.match(/slug:\s*"([^"]+)"/)?.[1],
      {
        available: /availability:\s*"available"/.test(block),
        lessons: Number(block.match(/lessons:\s*(\d+)/)?.[1] ?? 0),
      },
    ])
);

const progressSource = readFileSync("data/dummy/learningProgress.ts", "utf8");
const entries = [
  ...progressSource.matchAll(
    /courseSlug:\s*"([^"]+)",\s*lastLesson:\s*\{\s*slug:\s*"([^"]+)",\s*title:\s*"([^"]+)",?\s*\},\s*completedLessons:\s*(\d+)/g
  ),
];

const problems = [];
for (const [, courseSlug, lessonSlug, lessonTitle, completed] of entries) {
  const course = courses.get(courseSlug);
  if (!course) {
    problems.push(`${courseSlug}: course tidak ada di katalog`);
    continue;
  }
  if (!course.available) problems.push(`${courseSlug}: course belum available`);
  if (Number(completed) > course.lessons) {
    problems.push(`${courseSlug}: ${completed} lesson selesai melebihi total ${course.lessons}`);
  }
  const expectedTitle = lessonsByCourse.get(courseSlug)?.get(lessonSlug);
  if (!expectedTitle) problems.push(`${courseSlug}: lesson "${lessonSlug}" tidak ada di detail course`);
  else if (expectedTitle !== lessonTitle) {
    problems.push(`${courseSlug}: judul "${lessonTitle}" seharusnya "${expectedTitle}"`);
  }
}

if (entries.length === 0) problems.push("tidak ada entri yang terbaca; periksa format file");

if (problems.length > 0) {
  console.error(`Masalah riwayat belajar dummy (${problems.length}):`);
  problems.forEach((item) => console.error(`  - ${item}`));
  process.exit(1);
}

console.log(`Semua ${entries.length} entri riwayat belajar dummy konsisten dengan katalog.`);
