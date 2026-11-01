import { BannerTheme } from "@/types/Appearance";

// Tema banner untuk Welcome Banner dan banner profil (PRD FR-12). Menambah tema
// baru cukup dengan menaruh PNG di public/banner, menjalankan
// npm run optimize:images (membuat gambar dan thumbnail), lalu menambah satu entri.
export const THEMES: BannerTheme[] = [
  {
    id: "mountain-workspace",
    name: "Mountain Workspace",
    image: "/banner/mountain-workspace.webp",
    thumbnail: "/banner/mountain-workspace-thumb.webp",
    access: "free",
    includedIn: [],
    // Ilustrasi ini masih memuat kucing oren di meja kerja, jadi avatar aktif
    // tidak ditampilkan di atasnya agar tidak ada dua kucing. Tema final harus
    // tanpa karakter (PRD FR-12) agar avatar pengguna yang tampil.
    hasCharacter: true,
  },
];

export const DEFAULT_THEME_ID = "mountain-workspace";

export function getTheme(id: string) {
  return THEMES.find((theme) => theme.id === id);
}
