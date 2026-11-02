// DATA DUMMY — hapus sebelum rilis (PRD FR-01, aturan bisnis #16).
// Riwayat belajar contoh untuk kartu Lanjutkan Belajar dan statistik
// "Materi Selesai". Hanya memakai course "available" di data/courses.ts.
// Jumlah lesson dan waktu terakhir dibuka wajib sama dengan riwayat aktivitas
// (data/dummy/activity.ts), diperiksa oleh npm run check:activity.

export interface LearningProgressEntry {
  courseSlug: string;
  // Lesson terakhir yang dibuka (slug sesuai data/courseDetails.ts).
  lastLesson: {
    slug: string;
    title: string;
  };
  completedLessons: number;
  // Jumlah hari sebelum hari ini, mengikuti riwayat aktivitas.
  lastOpenedDaysAgo: number;
}

export const DUMMY_LEARNING_PROGRESS: LearningProgressEntry[] = [
  {
    courseSlug: "qa-fundamentals",
    lastLesson: { slug: "test-case", title: "Membuat Test Case" },
    completedLessons: 8,
    lastOpenedDaysAgo: 0,
  },
  {
    courseSlug: "playwright",
    lastLesson: { slug: "locator", title: "Memahami Locator" },
    completedLessons: 3,
    lastOpenedDaysAgo: 2,
  },
  {
    courseSlug: "test-design",
    lastLesson: {
      slug: "struktur-test-case-yang-baik",
      title: "Struktur Test Case yang Baik",
    },
    completedLessons: 1,
    lastOpenedDaysAgo: 6,
  },
  {
    courseSlug: "bug-reporting",
    lastLesson: {
      slug: "berkomunikasi-dengan-developer",
      title: "Berkomunikasi dengan Developer",
    },
    completedLessons: 7,
    lastOpenedDaysAgo: 15,
  },
];
