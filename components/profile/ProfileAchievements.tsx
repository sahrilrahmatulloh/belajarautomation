"use client";

import { useState } from "react";

import FilterChips from "@/components/filters/FilterChips";
import { AchievementState } from "@/lib/achievements";
import { validFilterValue } from "@/lib/filters";
import { dateFromDaysAgo } from "@/lib/format";
import { useUrlFilters } from "@/lib/useUrlFilters";
import { AchievementCategory } from "@/types/Achievement";

import AchievementBadge from "./AchievementBadge";

// Tab Pencapaian (PRD FR-14). Achievement tidak memberikan XP.
const FILTER_KEYS = ["kategori"] as const;

const CATEGORIES: AchievementCategory[] = ["Belajar", "Testing", "Automation", "Challenge", "Konsistensi", "Milestone"];

const CATEGORY_OPTIONS = [
  { value: "", label: "Semua" },
  ...CATEGORIES.map((category) => ({ value: category.toLowerCase(), label: category })),
];

const dateFormatter = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" });

function ProgressBar({ value, max, label, className }: { value: number; max: number; label: string; className?: string }) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className={`h-2 overflow-hidden rounded-full bg-muted ${className ?? ""}`}
    >
      <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min((value / max) * 100, 100)}%` }} />
    </div>
  );
}

function AchievementCard({ state, today }: { state: AchievementState; today: Date }) {
  const { achievement, earned, progress } = state;

  return (
    <li className="flex min-w-0 items-start gap-3 rounded-2xl border border-border bg-card p-4">
      <AchievementBadge icon={achievement.icon} category={achievement.category} earned={Boolean(earned)} />
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{achievement.name}</p>
        <p className="mt-0.5 text-sm leading-5 text-muted-foreground">{achievement.description}</p>

        {earned && (
          <p className="mt-2 text-xs font-medium text-primary-accent">
            Diperoleh {dateFormatter.format(dateFromDaysAgo(today, earned.daysAgo))}
          </p>
        )}

        {progress !== undefined && achievement.target && (
          <div className="mt-2 flex items-center gap-2">
            <ProgressBar
              value={progress}
              max={achievement.target}
              label={`Progres ${achievement.name}`}
              className="flex-1"
            />
            <span className="shrink-0 text-xs font-medium tabular-nums text-muted-foreground">
              {progress} / {achievement.target}
            </span>
          </div>
        )}
      </div>
    </li>
  );
}

function AchievementSection({
  title,
  states,
  today,
}: {
  title: string;
  states: AchievementState[];
  today: Date;
}) {
  if (states.length === 0) return null;

  return (
    <section aria-label={title}>
      <h2 className="mb-3 font-semibold">
        {title} <span className="font-normal text-muted-foreground">({states.length})</span>
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {states.map((state) => (
          <AchievementCard key={state.achievement.id} state={state} today={today} />
        ))}
      </ul>
    </section>
  );
}

export default function ProfileAchievements({ states }: { states: AchievementState[] }) {
  const { values, setFilters } = useUrlFilters(FILTER_KEYS);
  // Tab ini hanya dirender di browser, jadi tanggalnya mengikuti zona waktu pengguna.
  const [today] = useState(() => new Date());

  const earnedTotal = states.filter((state) => state.earned).length;

  const category = validFilterValue(values.kategori, CATEGORY_OPTIONS);
  const visible = states.filter((state) => !category || state.achievement.category.toLowerCase() === category);

  // Yang terbaru diperoleh lebih dulu.
  const earned = visible
    .filter((state) => state.earned)
    .sort((a, b) => a.earned!.daysAgo - b.earned!.daysAgo);
  const inProgress = visible.filter((state) => state.progress !== undefined);
  const locked = visible.filter((state) => !state.earned && state.progress === undefined);

  return (
    <div className="space-y-5">
      <section aria-label="Progres total achievement" className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-2xl font-bold tabular-nums">
            {earnedTotal} / {states.length}
          </p>
          <p className="text-sm text-muted-foreground">achievement diperoleh</p>
        </div>
        <ProgressBar value={earnedTotal} max={states.length} label="Progres total achievement" className="mt-3" />
      </section>

      <FilterChips
        label="kategori achievement"
        layout="scroll"
        options={CATEGORY_OPTIONS}
        active={category}
        onChange={(value) => setFilters({ kategori: value })}
      />

      <AchievementSection title="Diperoleh" states={earned} today={today} />
      <AchievementSection title="Dalam progres" states={inProgress} today={today} />
      <AchievementSection title="Belum diperoleh" states={locked} today={today} />
    </div>
  );
}
