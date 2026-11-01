// DATA DUMMY — hapus sebelum rilis (PRD FR-01, aturan bisnis #16).
// Akun contoh untuk demo dashboard dan leaderboard.

import { XP_PER_CHALLENGE, XP_PER_LESSON } from "@/data/ranks";
import { getCompletedLessonCount } from "@/lib/learningProgress";

const completedChallenges = 4;

export const DUMMY_ACCOUNT = {
  name: "Sobat QA",
  // Dihitung dari aktivitas dummy dengan nilai XP PRD FR-05,
  // agar XP, "Materi Selesai", dan "Challenge Selesai" saling konsisten.
  xp: getCompletedLessonCount() * XP_PER_LESSON + completedChallenges * XP_PER_CHALLENGE,
  // XP yang diperoleh pada minggu berjalan (periode Mingguan leaderboard).
  weeklyXp: 155,
  completedChallenges,
  streakDays: 5,
};
