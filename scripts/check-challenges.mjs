// Memastikan setiap challenge terhubung ke course di katalog (data/courses.ts).
// Gagal (exit 1) bila courseSlug kosong atau tidak ditemukan.
// Jalankan: npm run check:challenges (otomatis sebelum npm run build).
import { readFileSync } from "node:fs";

const courseSlugs = new Set(
  [...readFileSync("data/courses.ts", "utf8").matchAll(/^\s+slug:\s*"([^"]+)"/gm)].map(
    ([, slug]) => slug
  )
);

const challengeBlocks = readFileSync("data/challenges.ts", "utf8").split(/\r?\n  \{/).slice(1);

const missing = [];

for (const block of challengeBlocks) {
  const slug = block.match(/slug:\s*"([^"]+)"/)?.[1] ?? "?";
  const courseSlug = block.match(/courseSlug:\s*"([^"]+)"/)?.[1];

  if (!courseSlug) {
    missing.push(`${slug}: belum punya courseSlug`);
  } else if (!courseSlugs.has(courseSlug)) {
    missing.push(`${slug}: course "${courseSlug}" tidak ada di katalog`);
  }
}

if (missing.length > 0) {
  console.error(`Masalah challenge (${missing.length}):`);
  missing.forEach((item) => console.error(`  - ${item}`));
  process.exit(1);
}

console.log(`Semua ${challengeBlocks.length} challenge terhubung ke katalog.`);
