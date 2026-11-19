import { CatAvatar } from "@/types/Appearance";

// Avatar kucing (PRD FR-12). Gambar disimpan satu folder per gaya: public/profile/basic/<id>.webp
// dan public/profile/<gaya>/<id-jenis>-<gaya>.webp (mis. bug-hunter/oyen-bug-hunter.webp). Id jenis
// kucing adalah nama panggilannya (PRD FR-12, v2.50).
// Menambah avatar: taruh PNG di folder gayanya, jalankan npm run optimize:images -- avatars,
// samakan nama file dengan pola di atas, tambah entri di sini, lalu tambah barisnya di
// private.cosmetic_items lewat migrasi baru (dicek npm run check:cosmetics).
// Rilis awal: 8 avatar gaya Basic. Putih dan Oren gratis; enam lainnya terbuka di Pro dan
// Premium (keputusan pemilik, PRD v2.23). Kostum Bug Hunter dan Cyberpunk tersedia untuk
// kedelapan jenis kucing (PRD v2.42), lalu Wizard (PRD v2.50) dan Driver Racing (PRD v2.51).
// Kucing Putih Basic adalah avatar bawaan pengguna baru.
// Setiap jenis kucing punya nama panggilan (PRD FR-12, v2.50). Nama avatar = nama panggilan untuk
// gaya Basic, atau nama panggilan + gaya untuk kostum (mis. "Oyen Wizard"); jenis kucingnya
// tampil sebagai keterangan.
const basic = (id: string, name: string, breed: string, catType: string, paid = false): CatAvatar => ({
  id,
  name,
  breed,
  catType,
  style: "Basic",
  image: `/profile/basic/${id}.webp`,
  access: paid ? "paid" : "free",
  includedIn: paid ? ["pro", "premium"] : [],
});

// Gaya avatar (PRD FR-12), urutan sesuai chip di koleksi. Gaya selain Basic adalah kostum
// berbayar (Pro dan Premium); gambarnya ditambahkan bertahap per jenis kucing.
export const AVATAR_STYLES = [
  "Basic",
  "Bug Hunter",
  "Cyberpunk",
  "Wizard",
  "Driver Racing",
  "Astronot",
  "Master Chef",
] as const;

type AvatarStyle = (typeof AVATAR_STYLES)[number];

const STYLE_SLUG: Record<AvatarStyle, string> = {
  Basic: "basic",
  "Bug Hunter": "bug-hunter",
  Cyberpunk: "cyberpunk",
  Wizard: "wizard",
  "Driver Racing": "driver-racing",
  Astronot: "astronot",
  "Master Chef": "master-chef",
};

// Kostum selalu berbayar (Pro dan Premium), termasuk untuk Putih dan Oren (PRD FR-12).
// Nama mengikuti pola PRD: nama panggilan + gaya, mis. "Domino Astronot".
const costume = (baseId: string, style: Exclude<AvatarStyle, "Basic">): CatAvatar => {
  const base = BASIC_AVATARS.find((item) => item.id === baseId)!;
  const slug = STYLE_SLUG[style];
  return {
    id: `${baseId}-${slug}`,
    name: `${base.name} ${style}`,
    breed: base.breed,
    catType: base.catType,
    style,
    image: `/profile/${slug}/${baseId}-${slug}.webp`,
    access: "paid",
    includedIn: ["pro", "premium"],
  };
};

const BASIC_AVATARS: CatAvatar[] = [
  basic("mochi", "Mochi", "Kucing Putih", "putih"),
  basic("oyen", "Oyen", "Kucing Oren", "oren"),
  basic("kopi", "Kopi", "Kucing Hitam", "hitam", true),
  basic("domino", "Domino", "Kucing Tuxedo", "tuxedo", true),
  basic("mendung", "Mendung", "Kucing Abu-abu", "abu-abu", true),
  basic("karamel", "Karamel", "Kucing Coklat", "coklat", true),
  basic("belang", "Belang", "Kucing Corak Tiga", "corak tiga", true),
  basic("latte", "Latte", "Kucing Siam", "siam", true),
];

const CAT_IDS = BASIC_AVATARS.map((avatar) => avatar.id);

// Urutan koleksi: per gaya, lalu per jenis kucing seperti Basic.
export const AVATARS: CatAvatar[] = [
  ...BASIC_AVATARS,
  ...CAT_IDS.map((id) => costume(id, "Bug Hunter")),
  ...CAT_IDS.map((id) => costume(id, "Cyberpunk")),
  ...CAT_IDS.map((id) => costume(id, "Wizard")),
  ...CAT_IDS.map((id) => costume(id, "Driver Racing")),
];

export const DEFAULT_AVATAR_ID = "mochi";

export function getAvatar(id: string) {
  return AVATARS.find((avatar) => avatar.id === id);
}
