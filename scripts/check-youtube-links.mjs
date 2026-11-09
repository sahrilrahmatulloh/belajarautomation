// Memeriksa apakah video referensi di artikel dan lesson masih tersedia (PRD FR-02 bagian G). Exit 1 bila
// ada masalah. Tidak masuk prebuild agar build tidak bergantung pada jaringan; dijalankan
// berkala oleh .github/workflows/youtube-links.yml.
// Jalankan: npm run check:youtube
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { findVideos } from "./blog-videos.mjs";

const CONTENT_DIRS = process.argv[2] ? [process.argv[2]] : ["content/blog", "content/lessons"];
const TIMEOUT_MS = 15000;

async function checkVideo({ id, embed }) {
  const watchUrl = `https://www.youtube.com/watch?v=${id}`;
  const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(watchUrl)}&format=json`;

  let status;
  try {
    status = (await fetch(oembedUrl, { signal: AbortSignal.timeout(TIMEOUT_MS) })).status;
  } catch (error) {
    return `gagal diperiksa (${error.message})`;
  }

  if (status === 200) return null;
  // Selain 404, YouTube mengembalikan 400 untuk ID video yang tidak ada.
  if (status === 400 || status === 404) return "video dihapus, dijadikan privat, atau ID tidak valid";
  if (status === 401 || status === 403) {
    // Video yang sudah dipasang sebagai tautan memang tidak bisa di-embed.
    return embed ? "embed dimatikan pemilik video; pasang embed={false}" : null;
  }
  return `gagal diperiksa (status ${status})`;
}

const files = CONTENT_DIRS.flatMap((dir) =>
  existsSync(dir)
    ? readdirSync(dir, { recursive: true }).filter((file) => file.endsWith(".mdx")).map((file) => path.join(dir, file))
    : []
);
const problems = [];
let total = 0;

for (const file of files) {
  const videos = findVideos(readFileSync(file, "utf8"));
  total += videos.length;

  for (const video of videos) {
    const problem = await checkVideo(video);
    if (problem) problems.push(`${file}: ${video.id} (${video.judul}): ${problem}`);
  }
}

if (problems.length > 0) {
  console.error(`Masalah video referensi (${problems.length} dari ${total}):`);
  problems.forEach((item) => console.error(`  - ${item}`));
  // Bukan process.exit: di Windows bisa crash saat koneksi fetch belum tertutup.
  process.exitCode = 1;
} else {
  console.log(`Semua ${total} video referensi tersedia.`);
}
