// Mendaftar course "available" yang masih berstatus konten "draft".
// Sebelum rilis daftar ini wajib kosong (CURRICULUM bagian 1).
// Jalankan: npm run check:content (peringatan saja, ikut sebelum npm run build)
//           npm run check:content:release (gagal bila masih ada draf)
import { readFileSync } from "node:fs";

const strict = process.argv.includes("--strict");

const courseBlocks = readFileSync("data/courses.ts", "utf8").split(/\r?\n  \{/).slice(1);

const drafts = courseBlocks
  .filter(
    (block) =>
      /availability:\s*"available"/.test(block) && /contentStatus:\s*"draft"/.test(block)
  )
  .map((block) => {
    const slug = block.match(/slug:\s*"([^"]+)"/)?.[1] ?? "?";
    const title = block.match(/title:\s*"([^"]+)"/)?.[1] ?? "?";
    return `${slug} (${title})`;
  });

if (drafts.length === 0) {
  console.log("Semua course available sudah berstatus ready.");
  process.exit(0);
}

const log = strict ? console.error : console.warn;
log(`${strict ? "Gagal" : "Pengingat"}: ${drafts.length} course available masih draft:`);
drafts.forEach((item) => log(`  - ${item}`));

if (strict) {
  log("Lengkapi materinya (contentStatus: \"ready\") atau ubah ke coming-soon sebelum rilis.");
  process.exit(1);
}
