// DATA DUMMY — hapus sebelum rilis (PRD FR-14, aturan bisnis #16).
// Achievement akun demo. Yang sudah diperoleh dan tanggalnya diambil dari riwayat
// aktivitas, progres bertahap dihitung dari aktivitas yang sama, sehingga tidak
// bisa berbeda dari statistik lain. Achievement tidak memberikan XP.
import { DUMMY_ACTIVITY } from "@/data/dummy/activity";
import { getActivityCount } from "@/lib/activity";

export interface EarnedAchievement {
  achievementId: string;
  daysAgo: number;
  time: string;
}

export const DUMMY_EARNED_ACHIEVEMENTS: EarnedAchievement[] = DUMMY_ACTIVITY.flatMap((entry) =>
  entry.type === "achievement" && entry.achievementId
    ? [{ achievementId: entry.achievementId, daysAgo: entry.daysAgo, time: entry.time }]
    : []
);

// Progres achievement bertahap yang belum tercapai.
export const DUMMY_ACHIEVEMENT_PROGRESS: Record<string, number> = {
  "rajin-belajar": getActivityCount("lesson"),
  "test-designer": DUMMY_ACTIVITY.filter(
    (entry) => entry.type === "lesson" && entry.courseSlug === "test-design"
  ).length,
  "challenge-runner": getActivityCount("challenge"),
};
