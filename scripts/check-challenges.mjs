// Memastikan data latihan Playground konsisten. Gagal (exit 1) bila:
// - courseSlug tidak ada di katalog, course-nya belum "available", atau kategorinya berbeda;
// - latihan tidak punya detail, atau jenisnya berbeda antara daftar dan detail;
// - soal kuis tidak punya jawaban atau pembahasan, atau jumlahnya berbeda dari questionCount;
// - Bug Hunt atau Locator menunjuk halaman latihan yang tidak ada;
// - bug yang benar tidak ada di daftar pilihan temuan.
// Jalankan: npm run check:challenges (otomatis sebelum npm run build).
import { readFileSync } from "node:fs";

const read = (file) => readFileSync(file, "utf8").replace(/\r\n/g, "\n");
const field = (block, name) => block.match(new RegExp(`^\\s*${name}:\\s*"([^"]*)"`, "m"))?.[1];

const courses = new Map(
  read("data/courses.ts")
    .split(/\n\s*\{\n\s*id:/)
    .slice(1)
    .map((block) => [field(block, "slug"), block])
);

const practicePages = new Set(
  [...read("data/practicePages.ts").matchAll(/^\s+(\w+):\s*"/gm)].map(([, id]) => id)
);

const challenges = read("data/challenges.ts").split(/\n  \{\n/).slice(1);
const details = new Map(
  read("data/challengeDetails.ts")
    .split(/\n  \{\n(?=\s+slug:)/)
    .slice(1)
    .map((block) => [field(block, "slug"), block])
);

const problems = [];

function checkQuiz(slug, detail, questionCount) {
  const questions = detail.split(/\n\s*\{\n\s*question:/).slice(1);

  if (Number(questionCount) !== questions.length) {
    problems.push(`${slug}: questionCount ${questionCount}, soal ${questions.length}`);
  }
  if (!/passingScore:\s*70\b/.test(detail)) {
    problems.push(`${slug}: passingScore harus 70`);
  }

  questions.forEach((question, index) => {
    const label = `${slug} soal ${index + 1}`;
    const options = question.match(/options:\s*\[([\s\S]*?)\n\s*\],/)?.[1] ?? "";
    const optionCount = [...options.matchAll(/^\s*"(?:[^"\\]|\\.)*",?$/gm)].length;
    const correctIndex = question.match(/correctIndex:\s*(\d+)/)?.[1];

    if (optionCount < 2) problems.push(`${label}: opsi kurang dari 2`);
    if (correctIndex === undefined) problems.push(`${label}: tidak punya jawaban`);
    else if (Number(correctIndex) >= optionCount) problems.push(`${label}: correctIndex di luar opsi`);
    if (!/explanation:\s*\n?\s*"\S/.test(question)) problems.push(`${label}: tidak punya pembahasan`);
  });
}

function checkPracticePage(slug, detail) {
  const page = field(detail, "practicePage");
  if (!practicePages.has(page)) {
    problems.push(`${slug}: halaman latihan "${page}" tidak ada`);
  }
}

function checkBugHunt(slug, detail) {
  checkPracticePage(slug, detail);

  const findingIds = new Set([...detail.matchAll(/^\s*id:\s*"([^"]+)"/gm)].map(([, id]) => id));
  const bugIds = [...(detail.match(/bugIds:\s*\[([^\]]*)\]/)?.[1] ?? "").matchAll(/"([^"]+)"/g)].map(([, id]) => id);

  if (bugIds.length === 0) problems.push(`${slug}: daftar bug kosong`);
  for (const id of bugIds) {
    if (!findingIds.has(id)) problems.push(`${slug}: bug "${id}" tidak ada di daftar temuan`);
  }
  if (findingIds.size <= bugIds.length) problems.push(`${slug}: tidak punya pilihan pengecoh`);
  if (!/maxFalsePositives:\s*\d+/.test(detail)) problems.push(`${slug}: tidak punya batas salah tandai`);
}

function checkTestCase(slug, detail) {
  if (!/sampleAnswer:\s*`\S/.test(detail)) problems.push(`${slug}: tidak punya contoh jawaban`);
  if (!/required:\s*true/.test(detail)) problems.push(`${slug}: checklist tidak punya poin wajib`);
}

function checkLocator(slug, detail) {
  checkPracticePage(slug, detail);

  if (!field(detail, "targetElementId")) problems.push(`${slug}: tidak punya elemen target`);
  if (!/targetDescription:\s*"\S/.test(detail)) problems.push(`${slug}: tidak punya deskripsi elemen target`);
}

for (const block of challenges) {
  const slug = field(block, "slug") ?? "?";
  const courseSlug = field(block, "courseSlug");
  const type = field(block, "type");
  const course = courses.get(courseSlug);

  if (!courseSlug) {
    problems.push(`${slug}: belum punya courseSlug`);
  } else if (!course) {
    problems.push(`${slug}: course "${courseSlug}" tidak ada di katalog`);
  } else {
    if (field(course, "availability") !== "available") {
      problems.push(`${slug}: course "${courseSlug}" belum available`);
    }
    if (field(course, "category") !== field(block, "category")) {
      problems.push(`${slug}: kategori harus sama dengan course (${field(course, "category")})`);
    }
  }

  const detail = details.get(slug);
  if (!detail) {
    problems.push(`${slug}: tidak punya detail di data/challengeDetails.ts`);
    continue;
  }
  if (field(detail, "type") !== type) {
    problems.push(`${slug}: jenis di daftar "${type}", di detail "${field(detail, "type")}"`);
  }

  if (type === "quiz") checkQuiz(slug, detail, block.match(/questionCount:\s*(\d+)/)?.[1]);
  else if (type === "bug-hunt") checkBugHunt(slug, detail);
  else if (type === "test-case") checkTestCase(slug, detail);
  else if (type === "locator") checkLocator(slug, detail);
  else problems.push(`${slug}: jenis "${type}" tidak dikenal`);
}

const listed = new Set(challenges.map((block) => field(block, "slug")));
for (const slug of details.keys()) {
  if (!listed.has(slug)) problems.push(`${slug}: ada di detail tetapi tidak ada di daftar`);
}

if (problems.length > 0) {
  console.error(`Masalah latihan Playground (${problems.length}):`);
  problems.forEach((item) => console.error(`  - ${item}`));
  process.exit(1);
}

console.log(`Semua ${challenges.length} latihan Playground konsisten.`);
