import { BannerTheme } from "@/types/Appearance";

// Tema banner untuk Welcome Banner dan banner profil (PRD FR-12). Menambah tema
// baru cukup dengan menaruh PNG di public/banner, menjalankan
// npm run optimize:images (membuat gambar dan thumbnail), lalu menambah satu entri.
export const THEMES: BannerTheme[] = [
  {
    id: "kucing-fuji",
    name: "Penerbangan Fuji",
    image: "/banner/kucing-fuji.webp",
    thumbnail: "/banner/kucing-fuji-thumb.webp",
    video: "/banner/kucing-fuji.mp4",
    access: "free",
    includedIn: [],
    // Ilustrasi memuat maskot kucing putih di kursi pesawat, jadi avatar aktif tidak
    // ditampilkan di atasnya agar tidak ada dua kucing.
    hasCharacter: true,
  },
];

export const DEFAULT_THEME_ID = "kucing-fuji";

export function getTheme(id: string) {
  return THEMES.find((theme) => theme.id === id);
}
