// Memastikan setiap course di roadmap ada di katalog (data/courses.ts).
// Gagal (exit 1) bila ada slug yang tidak ditemukan.
// Jalankan: npm run check:roadmaps (otomatis sebelum npm run build).
import { readFileSync } from "node:fs";

const courseSlugs = new Set(
  [...readFileSync("data/courses.ts", "utf8").matchAll(/^\s+slug:\s*"([^"]+)"/gm)].map(
    ([, slug]) => slug
  )
);

const roadmapSource = readFileSync("data/roadmap.ts", "utf8");
const roadmapBlocks = roadmapSource.split(/\r?\n  \{\r?\n    id: /).slice(1);

const missing = [];
let checked = 0;

for (const block of roadmapBlocks) {
  const roadmapId = block.match(/^"([^"]+)"/)?.[1] ?? "?";
  // Node ditulis sebagai course("slug") atau courseSlug: "slug".
  const slugs = [
    ...block.matchAll(/course\(\s*"([^"]+)"/g),
    ...block.matchAll(/courseSlug:\s*"([^"]+)"/g),
  ].map(([, slug]) => slug);

  if (slugs.length === 0) {
    missing.push(`${roadmapId}: tidak punya node course`);
  }

  for (const slug of slugs) {
    checked += 1;
    if (!courseSlugs.has(slug)) {
      missing.push(`${roadmapId}: course "${slug}" tidak ada di katalog`);
    }
  }
}

if (missing.length > 0) {
  console.error(`Masalah roadmap (${missing.length}):`);
  missing.forEach((item) => console.error(`  - ${item}`));
  process.exit(1);
}

console.log(`Semua ${checked} node di ${roadmapBlocks.length} roadmap terhubung ke katalog.`);
