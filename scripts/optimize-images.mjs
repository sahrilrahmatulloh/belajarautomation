// Mengubah emblem rank PNG di public/ranks menjadi WebP dengan latar transparan.
// Tepi transparan dipangkas, lebar maksimal 320px, target di bawah 60 KB.
// PNG asli dihapus setelah WebP berhasil dibuat. Jalankan: npm run optimize:ranks
import { readdir, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const RANKS_DIR = path.join(process.cwd(), "public", "ranks");
const MAX_WIDTH = 320;
const START_QUALITY = 90;
const MIN_QUALITY = 60;
const QUALITY_STEP = 5;
const LIMIT_KB = 60;

const toKb = (bytes) => Math.round(bytes / 1024);

async function encode(file, quality) {
  const trimmed = await sharp(file).trim().toBuffer();
  return sharp(trimmed)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality, alphaQuality: 100 })
    .toBuffer({ resolveWithObject: true });
}

const sources = (await readdir(RANKS_DIR)).filter((name) => /\.png$/i.test(name));

if (sources.length === 0) {
  console.log("Tidak ada PNG di public/ranks.");
  process.exit(0);
}

const rows = [];

for (const name of sources) {
  const input = path.join(RANKS_DIR, name);
  const output = path.join(RANKS_DIR, name.replace(/\.png$/i, ".webp"));
  const before = (await stat(input)).size;

  // Turunkan kualitas bertahap bila hasil masih di atas batas.
  let quality = START_QUALITY;
  let result = await encode(input, quality);
  while (toKb(result.data.length) >= LIMIT_KB && quality > MIN_QUALITY) {
    quality -= QUALITY_STEP;
    result = await encode(input, quality);
  }

  await writeFile(output, result.data);
  await unlink(input);

  rows.push({
    emblem: path.basename(output),
    sebelum: `${toKb(before)} KB`,
    sesudah: `${toKb(result.data.length)} KB`,
    dimensi: `${result.info.width}x${result.info.height}`,
    kualitas: quality,
  });
}

console.table(rows);

const overLimit = rows.filter((row) => Number.parseInt(row.sesudah, 10) >= LIMIT_KB);
if (overLimit.length > 0) {
  console.warn(`Peringatan: ${overLimit.length} emblem masih ${LIMIT_KB} KB atau lebih.`);
}
