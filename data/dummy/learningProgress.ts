// DATA DUMMY — hapus sebelum rilis (PRD FR-01, aturan bisnis #16).
// Riwayat belajar contoh untuk kartu Lanjutkan Belajar dan statistik
// "Materi Selesai". Hanya memakai course "available" di data/courses.ts.

export interface LearningProgressEntry {
  courseSlug: string;
  // Lesson terakhir yang dibuka (slug sesuai data/courseDetails.ts).
  lastLesson: {
    slug: string;
    title: string;
  };
  completedLessons: number;
  lastOpenedAt: string;
}

export const DUMMY_LEARNING_PROGRESS: LearningProgressEntry[] = [
  {
    courseSlug: "qa-fundamentals",
    lastLesson: { slug: "test-case", title: "Test Case" },
    completedLessons: 8,
    lastOpenedAt: "2026-10-31T19:40:00+07:00",
  },
  {
    courseSlug: "playwright",
    lastLesson: { slug: "locator", title: "Locator" },
    completedLessons: 3,
    lastOpenedAt: "2026-10-29T20:15:00+07:00",
  },
  {
    courseSlug: "test-design",
    lastLesson: {
      slug: "struktur-test-case-yang-baik",
      title: "Struktur Test Case yang Baik",
    },
    completedLessons: 1,
    lastOpenedAt: "2026-10-26T09:05:00+07:00",
  },
];
