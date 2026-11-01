import { Briefcase, FolderKanban, Library, LucideIcon, Newspaper } from "lucide-react";

// Fitur yang sementara ditutup untuk pengguna dan tampil sebagai "Segera hadir".
// Kode fiturnya tetap ada. Untuk membukanya kembali: hapus entri di sini,
// hapus layout.tsx di folder app/<fitur>, dan hapus `comingSoon` di data/navigation.ts.
export interface ComingSoonFeature {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const COMING_SOON_FEATURES = {
  blog: {
    title: "Blog",
    description: "Artikel seputar QA, testing, automation, dan karier sedang disiapkan.",
    icon: Newspaper,
  },
  ebooks: {
    title: "eBook",
    description: "Koleksi eBook QA dan automation sedang disiapkan.",
    icon: Library,
  },
  projects: {
    title: "Project",
    description: "Project latihan untuk membangun portofolio sedang disiapkan.",
    icon: FolderKanban,
  },
  career: {
    title: "Karier",
    description: "Panduan CV, portofolio, dan persiapan interview sedang disiapkan.",
    icon: Briefcase,
  },
} satisfies Record<string, ComingSoonFeature>;
