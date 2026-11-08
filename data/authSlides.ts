import { AVATARS } from "@/data/avatars";
import { BOOKS } from "@/data/books";
import { isDev } from "@/lib/env";

// Slide promosi di panel kiri halaman masuk dan daftar (PRD 4.5, Panel promosi).
// Diubah lewat file ini sampai pengelolaannya dipindah ke Panel Admin (Fase 6).
// Isi promosi harus sesuai kondisi nyata: fitur yang belum tersedia diberi label "Segera hadir".

export type AuthSlideVisual =
  // Tema banner bawaan (gambar dan video bergerak).
  | { kind: "theme" }
  // Deretan avatar kucing.
  | { kind: "avatars"; images: string[] }
  // eBook yang dipromosikan, ditampilkan sebagai kartu buku (sampul eBook belum tersedia).
  | { kind: "books"; titles: string[] };

export interface AuthSlide {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  badge?: string;
  visual: AuthSlideVisual;
}

const featuredBooks = BOOKS.slice(0, 3).map((book) => book.title);

export const AUTH_SLIDES: AuthSlide[] = [
  {
    id: "sambutan",
    eyebrow: "Learn · Practice · Build · Grow",
    title: "Belajar QA Automation dari nol hingga siap kerja.",
    description: "Materi terstruktur, latihan langsung di Playground, dan roadmap yang jelas.",
    visual: { kind: "theme" },
  },
  {
    id: "avatar-kucing",
    eyebrow: "Koleksi avatar",
    title: `${AVATARS.length} avatar kucing untuk profilmu.`,
    description: "Kucing Putih dan Kucing Oren gratis untuk semua. Gaya kostum seperti Bug Hunter dan Ninja segera hadir.",
    badge: "Baru",
    visual: { kind: "avatars", images: AVATARS.map((avatar) => avatar.image) },
  },
  {
    id: "ebook",
    eyebrow: "eBook",
    title: "eBook praktis untuk QA Engineer.",
    description: isDev
      ? `${BOOKS.length} eBook, dari Playwright sampai API Testing, dengan contoh yang bisa langsung dipraktikkan.`
      : "eBook praktis dari Playwright sampai API Testing, dengan contoh yang bisa langsung dipraktikkan.",
    badge: isDev ? "Baru" : "Segera hadir",
    visual: { kind: "books", titles: featuredBooks },
  },
];

// Pergeseran otomatis (PRD 4.5): berhenti saat diarahkan, difokuskan, dijeda, atau
// pengguna mengaktifkan "kurangi gerakan".
export const AUTH_SLIDE_INTERVAL_MS = 6000;
