import { DUMMY_ACTIVITY } from "@/data/dummy/activity";
import { ActivityType } from "@/types/Activity";

// Statistik akun dihitung dari riwayat aktivitas agar tampilan di dashboard,
// profil, dan leaderboard selalu sama. Nantinya dihitung di backend.
export function getActivityXp() {
  return DUMMY_ACTIVITY.reduce((total, entry) => total + entry.xp, 0);
}

export function getActivityCount(type: ActivityType) {
  return DUMMY_ACTIVITY.filter((entry) => entry.type === type).length;
}

// Jumlah hari aktif berturut-turut sampai hari ini.
export function getStreakDays() {
  const activeDays = new Set(DUMMY_ACTIVITY.map((entry) => entry.daysAgo));
  let streak = 0;
  while (activeDays.has(streak)) streak += 1;
  return streak;
}
