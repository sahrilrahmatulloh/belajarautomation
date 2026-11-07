import { CatAvatar } from "@/types/Appearance";

// Avatar kucing (PRD FR-12). Menambah avatar baru cukup dengan menaruh PNG di
// public/profile, menjalankan npm run optimize:images -- avatars, menambah satu entri di sini,
// lalu menambah barisnya di private.cosmetic_items lewat migrasi baru (dicek npm run check:cosmetics).
// Rilis awal: 8 avatar gaya Basic. Putih dan Oren gratis; enam lainnya terbuka di Pro dan
// Premium (keputusan pemilik, PRD v2.23).
// Kucing Putih Basic adalah avatar bawaan pengguna baru.
const basic = (id: string, name: string, catType: string, paid = false): CatAvatar => ({
  id,
  name,
  catType,
  style: "Basic",
  image: `/profile/${id}.webp`,
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
  "Driver Formula",
  "Space Explorer",
  "Ninja",
  "Knight",
  "Master Chef",
] as const;

export const AVATARS: CatAvatar[] = [
  basic("kucing-putih", "Kucing Putih", "putih"),
  basic("kucing-oren", "Kucing Oren", "oren"),
  basic("kucing-hitam", "Kucing Hitam", "hitam", true),
  basic("kucing-tuxedo", "Kucing Tuxedo", "tuxedo", true),
  basic("kucing-abu", "Kucing Abu-abu", "abu-abu", true),
  basic("kucing-coklat", "Kucing Coklat", "coklat", true),
  basic("kucing-corak-tiga", "Kucing Corak Tiga", "corak tiga", true),
  basic("kucing-siam", "Kucing Siam", "siam", true),
];

export const DEFAULT_AVATAR_ID = "kucing-putih";

export function getAvatar(id: string) {
  return AVATARS.find((avatar) => avatar.id === id);
}
