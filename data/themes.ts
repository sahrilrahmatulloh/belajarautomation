import { BannerTheme } from "@/types/Appearance";

// Tema banner untuk Welcome Banner dan banner profil (PRD FR-12). Satu folder per tema:
// public/banner/<id-tema>/ berisi PNG (mis. banner.png) dan video banner.mp4 bila bergerak.
// Jalankan npm run optimize:images -- themes (membuat banner.webp dan thumb.webp), tambah
// satu entri di sini, lalu tambah barisnya di private.cosmetic_items lewat migrasi baru.
export const THEMES: BannerTheme[] = [
  {
    id: "kucing-fuji",
    name: "Penerbangan Fuji",
    image: "/banner/kucing-fuji/banner.webp",
    thumbnail: "/banner/kucing-fuji/thumb.webp",
    video: "/banner/kucing-fuji/banner.mp4",
    access: "free",
    includedIn: [],
    // Ilustrasi memuat maskot kucing putih di kursi pesawat, jadi avatar aktif tidak
    // ditampilkan di atasnya agar tidak ada dua kucing.
    hasCharacter: true,
  },
  {
    id: "kucing-cyberpunk",
    name: "Neon Night",
    image: "/banner/kucing-cyberpunk/banner.webp",
    thumbnail: "/banner/kucing-cyberpunk/thumb.webp",
    video: "/banner/kucing-cyberpunk/banner.mp4",
    access: "free",
    includedIn: [],
    // Kota cyberpunk malam dengan kucing abu-abu di depan laptop.
    hasCharacter: true,
  },
];

export const DEFAULT_THEME_ID = "kucing-fuji";

export function getTheme(id: string) {
  return THEMES.find((theme) => theme.id === id);
}
