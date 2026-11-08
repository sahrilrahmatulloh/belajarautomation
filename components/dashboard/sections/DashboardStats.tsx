"use client";

import { BookOpenCheck, Flame, Target, Trophy } from "lucide-react";

import { DUMMY_ACCOUNT } from "@/data/dummy/account";
import { getCurrentUserPosition } from "@/lib/leaderboard";
import { useAccountStats } from "@/lib/lessonProgress";
import { useIsRealAccount, useRealProgress } from "@/lib/realProgress";
import { learningStreak } from "@/lib/streak";

const leaderboardPosition = getCurrentUserPosition("global");

interface StatsInput {
  xp: number;
  lessons: number;
  challenges: number;
  streakDays: number;
  xpDetail: string;
}

const getStats = ({ xp, lessons, challenges, streakDays, xpDetail }: StatsInput) => [
  {
    label: "Total XP",
    value: xp.toLocaleString("id-ID"),
    detail: xpDetail,
    Icon: Trophy,
    iconStyle: "bg-amber-500/10 text-amber-600 dark:text-amber-300",
  },
  {
    label: "Materi Selesai",
    value: String(lessons),
    detail: "Lesson yang sudah dipelajari",
    Icon: BookOpenCheck,
    iconStyle: "bg-brand-blue/10 text-brand-blue",
  },
  {
    label: "Challenge Selesai",
    value: String(challenges),
    detail: "Latihan di Playground",
    Icon: Target,
    iconStyle: "bg-rose-500/10 text-rose-600 dark:text-rose-300",
  },
  {
    label: "Streak Belajar",
    value: `${streakDays} hari`,
    detail: "Belajar berturut-turut",
    Icon: Flame,
    iconStyle: "bg-orange-500/10 text-orange-600 dark:text-orange-300",
  },
];

export default function DashboardStats() {
  const { xp, lessons, challenges } = useAccountStats();
  const isReal = useIsRealAccount();
  const real = useRealProgress();
  const stats = getStats({
    xp,
    lessons,
    challenges,
    // Akun Supabase: hari berturut-turut menyelesaikan lesson, dihitung dari progres di database.
    streakDays: isReal ? learningStreak(real?.lessons.map((item) => item.completedAt) ?? []) : DUMMY_ACCOUNT.streakDays,
    xpDetail: isReal ? "Dari lesson, kuis, dan challenge" : `Peringkat #${leaderboardPosition} di leaderboard Global`,
  });

  return (
    <section aria-label="Statistik belajar" className="grid grid-cols-2 gap-3">
      {stats.map(({ label, value, detail, Icon, iconStyle }) => (
        <article
          key={label}
          className="min-w-0 rounded-xl border border-border bg-card p-3 shadow-sm sm:p-3.5"
        >
          <div className="flex items-start gap-3">
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconStyle}`}>
              <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h3 className="text-xs font-medium leading-5 text-muted-foreground sm:text-sm">
                {label}
              </h3>
              <p className="mt-0.5 text-lg font-bold tracking-tight sm:text-xl">
                {value}
              </p>
            </div>
          </div>
          <p className="mt-2 text-[11px] leading-4 text-muted-foreground sm:text-xs">
            {detail}
          </p>
        </article>
      ))}
    </section>
  );
}
