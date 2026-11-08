// Memastikan katalog avatar dan tema di database (private.cosmetic_items, lewat migrasi
// supabase/migrations) sama dengan data/avatars.ts dan data/themes.ts: id dan akses
// (free/paid) harus cocok. Gagal (exit 1) bila tidak.
// Jalankan: npm run check:cosmetics (otomatis sebelum npm run build).
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const MIGRATIONS_DIR = "supabase/migrations";

// Dari kode: basic("id", "nama", "jenis", true) untuk avatar, dan blok id/access untuk tema.
const fromCode = new Map();
const avatarsSource = readFileSync("data/avatars.ts", "utf8");
for (const [, id, paid] of avatarsSource.matchAll(/basic\(\s*"([^"]+)",\s*"[^"]+",\s*"[^"]+"(?:,\s*(true|false))?\s*\)/g)) {
  fromCode.set(id, { kind: "avatar", access: paid === "true" ? "paid" : "free" });
}
const themesSource = readFileSync("data/themes.ts", "utf8");
for (const [, id, access] of themesSource.matchAll(/id:\s*"([^"]+)"[\s\S]*?access:\s*"(free|paid)"/g)) {
  fromCode.set(id, { kind: "theme", access });
}

// Dari migrasi: baris ('id', 'avatar'|'theme', 'free'|'paid', ...) pada insert cosmetic_items.
// Migrasi yang lebih baru menimpa yang lama untuk id yang sama.
const fromDb = new Map();
const migrations = readdirSync(MIGRATIONS_DIR).filter((file) => file.endsWith(".sql")).sort();
for (const file of migrations) {
  const sql = readFileSync(path.join(MIGRATIONS_DIR, file), "utf8");
  for (const block of sql.matchAll(/insert into private\.cosmetic_items[\s\S]*?;/g)) {
    for (const [, id, kind, access] of block[0].matchAll(/\(\s*'([^']+)',\s*'(avatar|theme)',\s*'(free|paid)'/g)) {
      fromDb.set(id, { kind, access });
    }
  }
}

const problems = [];
for (const [id, item] of fromCode) {
  const db = fromDb.get(id);
  if (!db) problems.push(`${id}: ada di data, belum ada di migrasi cosmetic_items`);
  else if (db.kind !== item.kind || db.access !== item.access) {
    problems.push(`${id}: data ${item.kind}/${item.access}, migrasi ${db.kind}/${db.access}`);
  }
}
for (const id of fromDb.keys()) {
  if (!fromCode.has(id)) problems.push(`${id}: ada di migrasi, tidak ada di data`);
}

if (problems.length > 0) {
  console.error("Katalog avatar/tema tidak sama dengan database:");
  for (const problem of problems) console.error(`  - ${problem}`);
  console.error("Tambahkan migrasi baru yang menyesuaikan private.cosmetic_items.");
  process.exit(1);
}

console.log(`Katalog kosmetik cocok: ${fromCode.size} item.`);
