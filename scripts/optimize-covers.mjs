// Mengubah semua PNG/JPG di public/covers/** menjadi WebP yang ringan.
// Jalankan: npm run optimize:covers
import { readdir, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const COVERS_DIR = path.join(process.cwd(), "public", "covers");
const MAX_WIDTH = 1600;
const START_QUALITY = 80;
const MIN_QUALITY = 70;
const QUALITY_STEP = 5;
const TARGET_KB = 150;
const LIMIT_KB = 250;

async function findImages(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) return findImages(fullPath);
      return /\.(png|jpe?g)$/i.test(entry.name) ? [fullPath] : [];
    })
  );
  return files.flat();
}

async function encode(file, quality) {
  return sharp(file)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality })
    .toBuffer({ resolveWithObject: true });
}

const toKb = (bytes) => Math.round(bytes / 1024);

const images = await findImages(COVERS_DIR);

if (images.length === 0) {
  console.log("Tidak ada PNG/JPG di public/covers.");
  process.exit(0);
}

const rows = [];

for (const file of images) {
  const before = (await stat(file)).size;

  // Turunkan kualitas bertahap bila hasil masih di atas batas.
  let quality = START_QUALITY;
  let result = await encode(file, quality);
  while (toKb(result.data.length) > LIMIT_KB && quality > MIN_QUALITY) {
    quality = Math.max(MIN_QUALITY, quality - QUALITY_STEP);
    result = await encode(file, quality);
  }

  const output = file.replace(/\.(png|jpe?g)$/i, ".webp");
  await writeFile(output, result.data);
  await unlink(file);

  const after = toKb(result.data.length);
  rows.push({
    file: path.relative(process.cwd(), output).replaceAll("\\", "/"),
    "sebelum (KB)": toKb(before),
    "sesudah (KB)": after,
    kualitas: quality,
    ukuran: `${result.info.width}x${result.info.height}`,
    catatan: after > LIMIT_KB ? "MASIH > 250 KB" : after > TARGET_KB ? "> target 150 KB" : "",
  });
}

console.table(rows);

const totalBefore = rows.reduce((sum, row) => sum + row["sebelum (KB)"], 0);
const totalAfter = rows.reduce((sum, row) => sum + row["sesudah (KB)"], 0);
console.log(`Total: ${totalBefore} KB -> ${totalAfter} KB`);

const overTarget = rows.filter((row) => row["sesudah (KB)"] > TARGET_KB);
if (overTarget.length > 0) {
  console.log(`Di atas target ${TARGET_KB} KB:`, overTarget.map((row) => row.file).join(", "));
}
