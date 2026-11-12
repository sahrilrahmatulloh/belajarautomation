import { BookOpen, Layers, Trophy, Zap } from "lucide-react";

import { formatNumber } from "@/lib/format";

interface ProfileStatsProps {
  xp: number;
  lessons: number;
  challenges: number;
  achievements: number;
}

// Kartu statistik di Ringkasan profil (PRD FR-13). Label sama dengan kartu statistik dashboard.
export default function ProfileStats({ xp, lessons, challenges, achievements }: ProfileStatsProps) {
  const stats = [
    { label: "Materi Selesai", value: lessons, Icon: BookOpen, iconStyle: "bg-brand-blue/10 text-brand-blue" },
    { label: "Challenge Selesai", value: challenges, Icon: Layers, iconStyle: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300" },
    { label: "Achievement", value: achievements, Icon: Trophy, iconStyle: "bg-amber-500/10 text-amber-600 dark:text-amber-300" },
    { label: "Total XP", value: xp, Icon: Zap, iconStyle: "bg-primary/10 text-primary-accent" },
  ];

  return (
    <section aria-label="Statistik belajar" className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {stats.map(({ label, value, Icon, iconStyle }) => (
        <article key={label} className="flex min-w-0 items-center gap-3 rounded-2xl border border-border bg-card p-4">
          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconStyle}`}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 border-l border-border pl-3">
            <p className="truncate text-xs leading-4 text-muted-foreground sm:text-sm">{label}</p>
            <p className="text-xl font-bold tabular-nums sm:text-2xl">{formatNumber(value)}</p>
          </div>
        </article>
      ))}
    </section>
  );
}
