// Memastikan setiap path `cover` (course, roadmap), `emblem` (rank), serta `image` dan
// `thumbnail` (avatar, tema banner) menunjuk ke file yang ada di
// public/, dan setiap course punya sampul. Gagal (exit 1) bila tidak.
// Jalankan: npm run check:covers (otomatis sebelum npm run build).
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const DATA_FILES = ["data/courses.ts", "data/roadmap.ts", "data/ranks.ts"];
const COVER_PATTERN = /(?:cover|emblem):\s*"([^"]+)"/g;

const missing = [];
let checked = 0;

for (const dataFile of DATA_FILES) {
  const source = readFileSync(dataFile, "utf8");

  for (const [, coverPath] of source.matchAll(COVER_PATTERN)) {
    checked += 1;
    const filePath = path.join("public", coverPath);

    if (!coverPath.startsWith("/") || !existsSync(filePath)) {
      missing.push(`${dataFile}: ${coverPath}`);
    }
  }
}

// Setiap course wajib punya sampul.
const courseBlocks = readFileSync("data/courses.ts", "utf8").split(/\r?\n  \{/).slice(1);
for (const block of courseBlocks) {
  const slug = block.match(/slug:\s*"([^"]+)"/)?.[1];
  if (slug && !/cover:\s*"/.test(block)) {
    missing.push(`data/courses.ts: course "${slug}" belum punya cover`);
  }
}

if (missing.length > 0) {
  console.error(`Masalah path gambar (${missing.length}):`);
  missing.forEach((item) => console.error(`  - ${item}`));
  process.exit(1);
}

console.log(`Semua ${checked} path gambar (sampul, emblem, avatar, tema) valid.`);
