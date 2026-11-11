import Link from "next/link";
import { Award } from "lucide-react";

import { AchievementState } from "@/lib/achievements";

import AchievementBadge from "./AchievementBadge";

const LATEST_LIMIT = 3;
const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Kartu Achievement di Ringkasan profil (PRD FR-13, FR-14): persentase tercapai dan badge
// terbaru. Seluruh kartu menuju tab Pencapaian.
export default function AchievementSummary({ states, href }: { states: AchievementState[]; href: string }) {
  const earned = states
    .filter((state) => state.earned)
    .sort((a, b) => a.earned!.daysAgo - b.earned!.daysAgo);
  const total = states.length;
  const percent = total === 0 ? 0 : Math.round((earned.length / total) * 100);
  const latest = earned.slice(0, LATEST_LIMIT);
  const remaining = earned.length - latest.length;

  return (
    // Judul adalah tautan yang area kliknya diperluas ke seluruh kartu, agar nama aksesibelnya
    // sama dengan teks yang terlihat.
    <section
      aria-labelledby="achievement-ringkasan"
      className="relative flex min-w-0 flex-col rounded-2xl border border-border bg-card p-5 transition-colors has-[a:hover]:border-primary/50"
    >
      <h2 id="achievement-ringkasan" className="flex items-center gap-2 font-semibold">
        <Award className="h-5 w-5 text-primary-accent" aria-hidden="true" />
        <Link href={href} className="after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-primary">
          Achievement
        </Link>
      </h2>

      <div className="mt-4 flex items-center gap-5">
        <div className="relative h-28 w-28 shrink-0">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden="true">
            <circle cx="50" cy="50" r={RADIUS} fill="none" strokeWidth="10" className="stroke-muted" />
            <circle
              cx="50"
              cy="50"
              r={RADIUS}
              fill="none"
              strokeWidth="10"
              strokeLinecap="round"
              stroke="var(--color-primary)"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE * (1 - percent / 100)}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold tabular-nums">{percent}%</span>
            <span className="text-xs text-muted-foreground">Progress</span>
          </div>
        </div>

        <dl className="min-w-0 flex-1 space-y-2 text-sm">
          <div className="flex items-center justify-between gap-3">
            <dt className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-primary" aria-hidden="true" />
              Tercapai
            </dt>
            <dd className="font-semibold tabular-nums">{earned.length}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/50" aria-hidden="true" />
              Belum Tercapai
            </dt>
            <dd className="font-semibold tabular-nums">{total - earned.length}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-4 border-t border-border pt-3">
        <p className="text-sm font-medium">Achievement Terbaru</p>
        {latest.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">Belum ada achievement. Terus belajar untuk mendapatkannya.</p>
        ) : (
          <ul className="mt-2 flex items-center gap-2">
            {latest.map(({ achievement }) => (
              <li key={achievement.id} title={achievement.name}>
                <AchievementBadge icon={achievement.icon} category={achievement.category} earned size={44} />
                <span className="sr-only">{achievement.name}</span>
              </li>
            ))}
            {remaining > 0 && (
              <li className="flex h-9 min-w-11 items-center justify-center rounded-lg bg-muted px-2 text-sm font-semibold tabular-nums">
                +{remaining}
                <span className="sr-only"> achievement lainnya</span>
              </li>
            )}
          </ul>
        )}
      </div>
    </section>
  );
}
