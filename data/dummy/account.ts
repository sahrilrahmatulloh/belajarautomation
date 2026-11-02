// DATA DUMMY — hapus sebelum rilis (PRD FR-01, aturan bisnis #16).
// Akun contoh untuk demo dashboard dan leaderboard.

import { getActivityCount, getActivityXp, getStreakDays } from "@/lib/activity";

export const DUMMY_ACCOUNT = {
  name: "Sobat QA",
  // Dihitung dari riwayat aktivitas (data/dummy/activity.ts) agar XP, challenge
  // selesai, dan streak konsisten di semua halaman.
  xp: getActivityXp(),
  completedChallenges: getActivityCount("challenge"),
  streakDays: getStreakDays(),
  // Tingkat membership (PRD FR-10); akun demo memakai Basic (gratis).
  membership: "basic" as const,
  // Nilai awal opsi privasi leaderboard (PRD FR-06).
  showOnLeaderboard: true,
};
