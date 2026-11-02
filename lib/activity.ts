import { DUMMY_ACTIVITY } from "@/data/dummy/activity";
import { DUMMY_CHALLENGE_SCORES } from "@/data/dummy/challengeAttempts";
import { ActivityEntry, ActivityType } from "@/types/Activity";

// Statistik akun dihitung dari riwayat aktivitas agar tampilan di dashboard,
// profil, dan leaderboard selalu sama. Nantinya dihitung di backend.
export function getActivityXp() {
  return DUMMY_ACTIVITY.reduce((total, entry) => total + entry.xp, 0);
}

export function getActivityCount(type: ActivityType) {
  return DUMMY_ACTIVITY.filter((entry) => entry.type === type).length;
}

// Slug latihan yang sudah lulus, termasuk kuis.
export function getCompletedChallengeSlugs() {
  return new Set(DUMMY_ACTIVITY.flatMap((entry) => entry.challengeSlug ?? []));
}

// Status dan skor terakhir latihan. Sekali lulus tetap lulus walau diulang.
export function getChallengeProgress(slug: string) {
  const lastScore: number | undefined = DUMMY_CHALLENGE_SCORES[slug];
  const status = getCompletedChallengeSlugs().has(slug)
    ? ("passed" as const)
    : lastScore === undefined
      ? ("not-started" as const)
      : ("failed" as const);
  return { status, lastScore };
}

// Jumlah aktivitas dan XP per hari, dengan kunci jumlah hari sebelum hari ini.
export function getActivityByDaysAgo() {
  const days = new Map<number, { count: number; xp: number }>();
  for (const entry of DUMMY_ACTIVITY) {
    const day = days.get(entry.daysAgo) ?? { count: 0, xp: 0 };
    days.set(entry.daysAgo, { count: day.count + 1, xp: day.xp + entry.xp });
  }
  return days;
}

// Jumlah hari aktif berturut-turut sampai hari ini.
export function getStreakDays() {
  const activeDays = new Set(DUMMY_ACTIVITY.map((entry) => entry.daysAgo));
  let streak = 0;
  while (activeDays.has(streak)) streak += 1;
  return streak;
}

// Aktivitas dalam N hari terakhir (termasuk hari ini), yang terbaru lebih dulu.
export function getRecentActivity(days: number): ActivityEntry[] {
  return DUMMY_ACTIVITY.filter((entry) => entry.daysAgo < days).reverse();
}

// Mengelompokkan aktivitas yang sudah terurut per hari.
export function groupActivityByDay(entries: ActivityEntry[]) {
  const groups = new Map<number, ActivityEntry[]>();
  for (const entry of entries) {
    groups.set(entry.daysAgo, [...(groups.get(entry.daysAgo) ?? []), entry]);
  }
  return [...groups].map(([daysAgo, items]) => ({ daysAgo, items }));
}

// Ringkasan periode, selalu mencakup semua jenis aktivitas.
export function getActivitySummary(days: number) {
  const entries = getRecentActivity(days);
  return {
    xp: entries.reduce((total, entry) => total + entry.xp, 0),
    lessons: entries.filter((entry) => entry.type === "lesson").length,
    challenges: entries.filter((entry) => entry.type === "challenge").length,
  };
}

// XP dan status aktif per hari untuk N hari terakhir, dari yang terlama ke hari ini.
export function getDailyActivity(days: number) {
  return Array.from({ length: days }, (_, index) => {
    const daysAgo = days - 1 - index;
    const entries = DUMMY_ACTIVITY.filter((entry) => entry.daysAgo === daysAgo);
    return {
      daysAgo,
      xp: entries.reduce((total, entry) => total + entry.xp, 0),
      isActive: entries.length > 0,
    };
  });
}

// Slug lesson yang sudah diselesaikan di satu course.
export function getCompletedLessonSlugs(courseSlug: string) {
  return new Set(
    DUMMY_ACTIVITY.flatMap((entry) =>
      entry.type === "lesson" && entry.courseSlug === courseSlug && entry.lessonSlug ? entry.lessonSlug : []
    )
  );
}
