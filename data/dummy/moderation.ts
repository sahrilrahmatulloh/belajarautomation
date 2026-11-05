// DATA DUMMY — hapus sebelum rilis (PRD FR-16 D).
// Contoh akun yang ditandai sistem moderasi.
import { ModerationFlag } from "@/types/AdminPlatform";

// Batas penandaan belum final (PRD Bagian 12), jadi dikumpulkan di sini agar mudah diganti.
export const MODERATION_THRESHOLDS = {
  // XP harian di atas angka ini ditandai sebagai lonjakan.
  dailyXp: 500,
  // Lesson yang selesai lebih cepat dari ini ditandai terlalu cepat.
  minLessonSeconds: 30,
};

const daysAgo = (days: number) => new Date(Date.now() - days * 86_400_000).toISOString();

export const DUMMY_MODERATION_FLAGS: ModerationFlag[] = [
  { id: "flag-rina", userId: "user-1", reason: "lonjakan-xp", detail: `Mendapat 2.400 XP dalam sehari (batas ${MODERATION_THRESHOLDS.dailyXp} XP).`, status: "terbuka", createdAt: daysAgo(1) },
  { id: "flag-dimas", userId: "user-2", reason: "lesson-terlalu-cepat", detail: `12 lesson selesai rata-rata 8 detik (batas ${MODERATION_THRESHOLDS.minLessonSeconds} detik).`, status: "terbuka", createdAt: daysAgo(2) },
  { id: "flag-ayu", userId: "user-3", reason: "lonjakan-xp", detail: `Mendapat 900 XP dalam sehari (batas ${MODERATION_THRESHOLDS.dailyXp} XP).`, status: "terbuka", createdAt: daysAgo(4) },
];
