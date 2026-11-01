// Mengubah PNG di public/ menjadi WebP terkompresi, lalu menghapus PNG asli.
// - ranks:   emblem rank, latar transparan, tepi dipangkas, lebar maks 320px, < 60 KB.
// - avatars: avatar kucing (public/profile), latar transparan, lebar maks 512px, < 60 KB.
//            PNG tanpa alpha dipotong mengikuti bingkai lingkarannya.
// - themes:  tema banner (public/banner), lebar maks 2400px, < 250 KB, ditambah
//            thumbnail <nama>-thumb.webp selebar 480px untuk koleksi tema.
// Jalankan: npm run optimize:images (semua) atau npm run optimize:images -- avatars
import { readdir, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const GROUPS = {
  ranks: { dir: "public/ranks", maxWidth: 320, limitKb: 60, transparent: true, trim: true },
  avatars: { dir: "public/profile", maxWidth: 512, limitKb: 60, transparent: true },
  themes: { dir: "public/banner", maxWidth: 2400, limitKb: 250, thumbnailWidth: 480 },
};

const START_QUALITY = 90;
const MIN_QUALITY = 50;
const QUALITY_STEP = 5;

const toKb = (bytes) => Math.round(bytes / 1024);

// Beberapa avatar diekspor tanpa kanal alpha, dengan pola kotak-kotak
// "transparan" yang ikut tercetak. Avatar berbingkai lingkaran, jadi bingkainya
// dicari dari piksel yang bukan abu-abu terang, lalu bagian di luar lingkaran
// dibuat transparan.
async function cutCircleFrame(input) {
  const { data, info } = await sharp(input).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const isBackground = (x, y) => {
    const index = (y * width + x) * 3;
    const min = Math.min(data[index], data[index + 1], data[index + 2]);
    const max = Math.max(data[index], data[index + 1], data[index + 2]);
    return min >= 222 && max - min <= 8;
  };

  // Kolom/baris dianggap bagian bingkai bila memuat beberapa piksel non-latar.
  const MIN_PIXELS = 3;
  const columns = [];
  const rows = [];
  for (let x = 0; x < width; x += 1) {
    let count = 0;
    for (let y = 0; y < height && count < MIN_PIXELS; y += 1) if (!isBackground(x, y)) count += 1;
    if (count >= MIN_PIXELS) columns.push(x);
  }
  for (let y = 0; y < height; y += 1) {
    let count = 0;
    for (let x = 0; x < width && count < MIN_PIXELS; x += 1) if (!isBackground(x, y)) count += 1;
    if (count >= MIN_PIXELS) rows.push(y);
  }

  const left = columns[0];
  const top = rows[0];
  const size = Math.min(columns.at(-1) - left, rows.at(-1) - top) + 1;
  const mask = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" /></svg>`
  );

  return sharp(input)
    .extract({ left, top, width: size, height: size })
    .ensureAlpha()
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
}

async function prepare(input, group) {
  if (group.transparent && !(await sharp(input).metadata()).hasAlpha) {
    return cutCircleFrame(input);
  }
  // Pangkas tepi transparan agar ilustrasi memenuhi bidang gambar.
  return group.trim ? sharp(input).trim().toBuffer() : sharp(input).toBuffer();
}

async function encode(source, width, quality, transparent) {
  return sharp(source)
    .resize({ width, withoutEnlargement: true })
    .webp(transparent ? { quality, alphaQuality: 100 } : { quality })
    .toBuffer({ resolveWithObject: true });
}

// Turunkan kualitas bertahap bila hasil masih di atas batas.
async function encodeUnderLimit(source, width, limitKb, transparent) {
  let quality = START_QUALITY;
  let result = await encode(source, width, quality, transparent);
  while (toKb(result.data.length) >= limitKb && quality > MIN_QUALITY) {
    quality -= QUALITY_STEP;
    result = await encode(source, width, quality, transparent);
  }
  return { ...result, quality };
}

const requested = process.argv.slice(2);
const groupNames = requested.length > 0 ? requested : Object.keys(GROUPS);
const unknown = groupNames.filter((name) => !GROUPS[name]);
if (unknown.length > 0) {
  console.error(`Kelompok tidak dikenal: ${unknown.join(", ")}. Pilihan: ${Object.keys(GROUPS).join(", ")}`);
  process.exit(1);
}

const rows = [];

for (const name of groupNames) {
  const group = GROUPS[name];
  const dir = path.join(process.cwd(), group.dir);
  const sources = (await readdir(dir)).filter((file) => /\.png$/i.test(file));

  for (const file of sources) {
    const input = path.join(dir, file);
    const before = (await stat(input)).size;
    const source = await prepare(input, group);

    const outputs = [{ suffix: "", width: group.maxWidth, limitKb: group.limitKb }];
    if (group.thumbnailWidth) {
      outputs.push({ suffix: "-thumb", width: group.thumbnailWidth, limitKb: group.limitKb });
    }

    for (const output of outputs) {
      const result = await encodeUnderLimit(source, output.width, output.limitKb, group.transparent);
      const outputName = file.replace(/\.png$/i, `${output.suffix}.webp`);
      await writeFile(path.join(dir, outputName), result.data);
      rows.push({
        kelompok: name,
        file: outputName,
        sebelum: output.suffix ? "-" : `${toKb(before)} KB`,
        sesudah: `${toKb(result.data.length)} KB`,
        dimensi: `${result.info.width}x${result.info.height}`,
        kualitas: result.quality,
        limitKb: output.limitKb,
      });
    }

    await unlink(input);
  }
}

if (rows.length === 0) {
  console.log(`Tidak ada PNG untuk diproses (${groupNames.join(", ")}).`);
  process.exit(0);
}

console.table(rows, ["kelompok", "file", "sebelum", "sesudah", "dimensi", "kualitas"]);

const overLimit = rows.filter((row) => Number.parseInt(row.sesudah, 10) >= row.limitKb);
if (overLimit.length > 0) {
  console.warn(`Peringatan: ${overLimit.length} file masih melebihi batas ukuran.`);
}
