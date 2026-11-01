import { LucideIcon } from "lucide-react";

export type CourseCategory =
  | "Fundamental"
  | "Manual Testing"
  | "Web Automation"
  | "Mobile Testing"
  | "API Testing"
  | "Performance Testing"
  | "Security Testing"
  | "Programming"
  | "AI"
  | "Low-Code";

export type CourseLanguage =
  | "JavaScript"
  | "TypeScript"
  | "Java"
  | "Python"
  | "SQL"
  | "Groovy";

export type CourseAvailability = "available" | "coming-soon";

// ready: seluruh lesson sudah ditulis dan ditinjau.
// draft: struktur modul ada, tetapi sebagian/seluruh isi lesson masih placeholder.
// Sebelum rilis, setiap course "available" wajib "ready" (CURRICULUM bagian 1).
export type CourseContentStatus = "ready" | "draft";

// free: dapat dipelajari semua pengguna, termasuk Basic.
// premium: hanya untuk pengguna Pro dan Premium; Basic tetap melihat katalog,
// deskripsi, daftar modul, dan cuplikan (PRD FR-02, FR-10; CURRICULUM bagian 1).
export type CourseAccess = "free" | "premium";

interface CourseBase {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: CourseCategory;
  // Daftar kosong untuk course konsep yang tidak memakai bahasa pemrograman.
  languages: CourseLanguage[];
  level: "Beginner" | "Intermediate" | "Advanced";
  contentStatus: CourseContentStatus;
  access: CourseAccess;
  // Path sampul di public/; kosong bila belum ada (tampil placeholder).
  cover?: string;
  progress?: number;
  icon: LucideIcon;
}

// Course "available" wajib punya jumlah lesson dan estimasi waktu.
// Course "coming-soon" boleh belum punya karena materinya sedang disiapkan.
export type Course = CourseBase &
  (
    | {
        availability: "available";
        lessons: number;
        estimatedDuration: string;
      }
    | {
        availability: "coming-soon";
        lessons?: number;
        estimatedDuration?: string;
      }
  );

export type AvailableCourse = Extract<Course, { availability: "available" }>;
