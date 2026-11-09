import { CatAvatar } from "@/types/Appearance";

// Avatar kucing (PRD FR-12). Gambar disimpan satu folder per gaya: public/profile/basic/<id>.webp
// dan public/profile/<gaya>/<id-jenis>-<gaya>.webp (mis. bug-hunter/kucing-oren-bug-hunter.webp).
// Menambah avatar: taruh PNG di folder gayanya, jalankan npm run optimize:images -- avatars,
// samakan nama file dengan pola di atas, tambah entri di sini, lalu tambah barisnya di
// private.cosmetic_items lewat migrasi baru (dicek npm run check:cosmetics).
// Rilis awal: 8 avatar gaya Basic. Putih dan Oren gratis; enam lainnya terbuka di Pro dan
// Premium (keputusan pemilik, PRD v2.23). Kostum Bug Hunter dan Cyberpunk tersedia untuk
// kedelapan jenis kucing (PRD v2.42).
// Kucing Putih Basic adalah avatar bawaan pengguna baru.
const basic = (id: string, name: string, catType: string, paid = false): CatAvatar => ({
  id,
  name,
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
  "Driver Formula",
  "Space Explorer",
  "Ninja",
  "Knight",
  "Master Chef",
] as const;

type AvatarStyle = (typeof AVATAR_STYLES)[number];

const STYLE_SLUG: Record<AvatarStyle, string> = {
  Basic: "basic",
  "Bug Hunter": "bug-hunter",
  Cyberpunk: "cyberpunk",
  Wizard: "wizard",
  "Driver Formula": "driver-formula",
  "Space Explorer": "space-explorer",
  Ninja: "ninja",
  Knight: "knight",
  "Master Chef": "master-chef",
};

// Kostum selalu berbayar (Pro dan Premium), termasuk untuk Putih dan Oren (PRD FR-12).
// Nama mengikuti pola PRD, mis. "Kucing Tuxedo Ninja".
const costume = (baseId: string, style: Exclude<AvatarStyle, "Basic">): CatAvatar => {
  const base = BASIC_AVATARS.find((item) => item.id === baseId)!;
  const slug = STYLE_SLUG[style];
  return {
    id: `${baseId}-${slug}`,
    name: `${base.name} ${style}`,
    catType: base.catType,
    style,
    image: `/profile/${slug}/${baseId}-${slug}.webp`,
    access: "paid",
    includedIn: ["pro", "premium"],
  };
};

const BASIC_AVATARS: CatAvatar[] = [
  basic("kucing-putih", "Kucing Putih", "putih"),
  basic("kucing-oren", "Kucing Oren", "oren"),
  basic("kucing-hitam", "Kucing Hitam", "hitam", true),
  basic("kucing-tuxedo", "Kucing Tuxedo", "tuxedo", true),
  basic("kucing-abu", "Kucing Abu-abu", "abu-abu", true),
  basic("kucing-coklat", "Kucing Coklat", "coklat", true),
  basic("kucing-corak-tiga", "Kucing Corak Tiga", "corak tiga", true),
  basic("kucing-siam", "Kucing Siam", "siam", true),
];

const CAT_IDS = BASIC_AVATARS.map((avatar) => avatar.id);

// Urutan koleksi: per gaya, lalu per jenis kucing seperti Basic.
export const AVATARS: CatAvatar[] = [
  ...BASIC_AVATARS,
  ...CAT_IDS.map((id) => costume(id, "Bug Hunter")),
  ...CAT_IDS.map((id) => costume(id, "Cyberpunk")),
];

export const DEFAULT_AVATAR_ID = "kucing-putih";

export function getAvatar(id: string) {
  return AVATARS.find((avatar) => avatar.id === id);
}
