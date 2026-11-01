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

interface CourseBase {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: CourseCategory;
  // null untuk course konsep yang tidak memakai bahasa pemrograman.
  language: CourseLanguage | null;
  level: "Beginner" | "Intermediate" | "Advanced";
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
