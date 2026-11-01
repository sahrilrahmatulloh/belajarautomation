// Memastikan setiap path `cover` di data course dan roadmap menunjuk ke file
// yang ada di public/. Gagal (exit 1) bila ada yang hilang.
// Jalankan: npm run check:covers (otomatis sebelum npm run build).
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const DATA_FILES = ["data/courses.ts", "data/roadmap.ts"];
const COVER_PATTERN = /cover:\s*"([^"]+)"/g;

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

if (missing.length > 0) {
  console.error(`Sampul tidak ditemukan di public/ (${missing.length}):`);
  missing.forEach((item) => console.error(`  - ${item}`));
  process.exit(1);
}

console.log(`Semua ${checked} path sampul valid.`);
