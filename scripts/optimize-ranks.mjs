// Membuat emblem rank WebP (latar transparan) dari PNG sumber di public/ranks.
// Tepi transparan dipangkas, lalu emblem dimuat ke kanvas persegi 256px,
// cukup tajam untuk tampilan terbesar (sekitar 96px pada layar 2x).
// PNG sumber tidak dihapus. Jalankan: npm run optimize:ranks
import { readdir, stat } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const RANKS_DIR = path.join(process.cwd(), "public", "ranks");
const SIZE = 256;
const QUALITY = 85;

const toKb = (bytes) => Math.round(bytes / 1024);

const sources = (await readdir(RANKS_DIR)).filter((name) => /\.png$/i.test(name));

if (sources.length === 0) {
  console.log("Tidak ada PNG di public/ranks.");
  process.exit(0);
}

for (const name of sources) {
  const input = path.join(RANKS_DIR, name);
  const output = path.join(RANKS_DIR, name.replace(/\.png$/i, ".webp"));

  const trimmed = await sharp(input).trim().toBuffer();
  await sharp(trimmed)
    .resize(SIZE, SIZE, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: QUALITY, alphaQuality: 100 })
    .toFile(output);

  console.log(
    `${name} (${toKb((await stat(input)).size)} KB) -> ${path.basename(output)} (${toKb((await stat(output)).size)} KB)`
  );
}
