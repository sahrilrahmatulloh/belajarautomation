import { Award, BookOpenCheck, Target, Trophy } from "lucide-react";

import { formatNumber } from "@/lib/format";

interface ProfileStatsProps {
  xp: number;
  lessons: number;
  challenges: number;
  achievements: number;
}

// Statistik utama profil (PRD FR-13).
export default function ProfileStats({ xp, lessons, challenges, achievements }: ProfileStatsProps) {
  const stats = [
    { label: "Total XP", value: xp, Icon: Trophy, iconStyle: "bg-amber-500/10 text-amber-600 dark:text-amber-300" },
    { label: "Materi Selesai", value: lessons, Icon: BookOpenCheck, iconStyle: "bg-brand-blue/10 text-brand-blue" },
    { label: "Challenge Selesai", value: challenges, Icon: Target, iconStyle: "bg-rose-500/10 text-rose-600 dark:text-rose-300" },
    { label: "Achievement", value: achievements, Icon: Award, iconStyle: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300" },
  ];

  return (
    <section aria-label="Statistik belajar" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map(({ label, value, Icon, iconStyle }) => (
        <article key={label} className="flex min-w-0 items-center gap-3 rounded-2xl border border-border bg-card p-4">
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconStyle}`}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-xs leading-4 text-muted-foreground sm:text-sm">{label}</p>
            <p className="text-xl font-bold tabular-nums">{formatNumber(value)}</p>
          </div>
        </article>
      ))}
    </section>
  );
}
