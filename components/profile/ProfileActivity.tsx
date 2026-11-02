"use client";

import { useState } from "react";
import FilterChips from "@/components/filters/FilterChips";
import FilterEmptyState from "@/components/filters/FilterEmptyState";
import {
  getActivitySummary,
  getDailyActivity,
  getRecentActivity,
  groupActivityByDay,
} from "@/lib/activity";
import { validFilterValue } from "@/lib/filters";
import { dateFromDaysAgo, formatNumber } from "@/lib/format";
import { useUrlFilters } from "@/lib/useUrlFilters";
import { ActivityType } from "@/types/Activity";

import ActivityRow from "./ActivityRow";

// Tab Aktivitas (PRD FR-13): riwayat per tanggal, filter, ringkasan periode,
// grafik XP harian, dan heatmap konsistensi belajar.
const FILTER_KEYS = ["jenis", "periode"] as const;

const TYPE_OPTIONS = [
  { value: "", label: "Semua" },
  { value: "materi", label: "Materi" },
  { value: "kuis", label: "Kuis" },
  { value: "challenge", label: "Challenge" },
  { value: "achievement", label: "Achievement" },
  { value: "rank", label: "Rank" },
];

// Bonus selesai course termasuk Materi karena berasal dari menyelesaikan lesson.
const TYPES_BY_FILTER: Record<string, ActivityType[]> = {
  materi: ["lesson", "course_complete"],
  kuis: ["quiz"],
  challenge: ["challenge"],
  achievement: ["achievement"],
  rank: ["rank_up"],
};

// 30 hari adalah periode bawaan, jadi tidak ditulis ke URL.
const PERIOD_OPTIONS = [
  { value: "7", label: "7 hari" },
  { value: "", label: "30 hari" },
  { value: "90", label: "90 hari" },
];

const fullDateFormatter = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});
const weekdayFormatter = new Intl.DateTimeFormat("id-ID", { weekday: "short" });

function dayLabel(today: Date, daysAgo: number) {
  if (daysAgo === 0) return "Hari ini";
  if (daysAgo === 1) return "Kemarin";
  return fullDateFormatter.format(dateFromDaysAgo(today, daysAgo));
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-2xl border border-border bg-card p-3 sm:p-4">
      <p className="text-xs text-muted-foreground sm:text-sm">{label}</p>
      <p className="mt-1 text-xl font-bold tabular-nums sm:text-2xl">{value}</p>
    </div>
  );
}

function XpBarChart({ today }: { today: Date }) {
  const days = getDailyActivity(7);
  const maxXp = Math.max(...days.map((day) => day.xp), 1);
  const total = days.reduce((sum, day) => sum + day.xp, 0);

  return (
    <section aria-labelledby="grafik-xp" className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="flex items-baseline justify-between gap-2">
        <h2 id="grafik-xp" className="font-semibold">XP 7 Hari Terakhir</h2>
        <p className="text-sm tabular-nums text-muted-foreground">{formatNumber(total)} XP</p>
      </div>
      <ol className="mt-4 grid grid-cols-7 gap-1.5 sm:gap-2">
        {days.map((day) => (
          <li key={day.daysAgo} className="flex min-w-0 flex-col items-center gap-1.5">
            {/* Tinggi tetap agar batang hari tanpa XP tetap sejajar */}
            <span className="h-4 text-[11px] font-medium tabular-nums text-muted-foreground">{day.xp > 0 ? day.xp : ""}</span>
            <div className="flex h-24 w-full items-end">
              <div
                className={`w-full rounded-t-md ${day.xp > 0 ? "bg-primary" : "bg-muted"}`}
                // Hari tanpa XP tetap punya batang tipis agar sumbunya terbaca.
                style={{ height: day.xp > 0 ? `${Math.max((day.xp / maxXp) * 100, 6)}%` : "4px" }}
              />
            </div>
            <span className={`text-[11px] ${day.daysAgo === 0 ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
              <span aria-hidden="true">{weekdayFormatter.format(dateFromDaysAgo(today, day.daysAgo))}</span>
              <span className="sr-only">
                {dayLabel(today, day.daysAgo)}: {day.xp} XP
              </span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

// Warna heatmap mengikuti XP harian; hari aktif tanpa XP tetap terlihat aktif.
function heatLevel(xp: number, isActive: boolean) {
  if (!isActive) return "bg-muted";
  if (xp >= 50) return "bg-primary";
  if (xp >= 20) return "bg-primary/60";
  return "bg-primary/30";
}

function ActivityHeatmap({ today }: { today: Date }) {
  const days = getDailyActivity(30);
  const activeDays = days.filter((day) => day.isActive).length;

  return (
    <section aria-labelledby="heatmap-aktivitas" className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="flex items-baseline justify-between gap-2">
        <h2 id="heatmap-aktivitas" className="font-semibold">Konsistensi 30 Hari</h2>
        <p className="text-sm tabular-nums text-muted-foreground">{activeDays} hari aktif</p>
      </div>
      <ol className="mt-4 grid grid-cols-10 gap-1.5">
        {days.map((day) => {
          const description = `${dayLabel(today, day.daysAgo)}: ${day.isActive ? `aktif, ${day.xp} XP` : "tidak aktif"}`;
          return (
            <li key={day.daysAgo} title={description} className={`aspect-square rounded-[4px] ${heatLevel(day.xp, day.isActive)}`}>
              <span className="sr-only">{description}</span>
            </li>
          );
        })}
      </ol>
      <div aria-hidden="true" className="mt-3 flex items-center justify-end gap-1.5 text-[11px] text-muted-foreground">
        Sedikit
        <span className="h-3 w-3 rounded-[3px] bg-muted" />
        <span className="h-3 w-3 rounded-[3px] bg-primary/30" />
        <span className="h-3 w-3 rounded-[3px] bg-primary/60" />
        <span className="h-3 w-3 rounded-[3px] bg-primary" />
        Banyak
      </div>
    </section>
  );
}

export default function ProfileActivity() {
  const { values, setFilters, resetFilters } = useUrlFilters(FILTER_KEYS);
  // Tab ini hanya dirender di browser, jadi tanggalnya mengikuti zona waktu pengguna.
  const [today] = useState(() => new Date());

  const type = validFilterValue(values.jenis, TYPE_OPTIONS);
  const period = validFilterValue(values.periode, PERIOD_OPTIONS);
  const days = Number(period || 30);
  const periodLabel = `${days} hari terakhir`;

  const summary = getActivitySummary(days);
  const entries = getRecentActivity(days).filter(
    (entry) => !type || TYPES_BY_FILTER[type].includes(entry.type)
  );
  const groups = groupActivityByDay(entries);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <FilterChips
          label="jenis aktivitas"
          layout="scroll"
          options={TYPE_OPTIONS}
          active={type}
          onChange={(value) => setFilters({ jenis: value })}
        />
        <FilterChips
          label="periode"
          layout="scroll"
          options={PERIOD_OPTIONS}
          active={period}
          onChange={(value) => setFilters({ periode: value })}
        />
      </div>

      <section aria-label={`Ringkasan ${periodLabel}`}>
        <p className="mb-2 text-sm text-muted-foreground">Ringkasan {periodLabel}</p>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <SummaryCard label="XP" value={formatNumber(summary.xp)} />
          <SummaryCard label="Materi selesai" value={formatNumber(summary.lessons)} />
          <SummaryCard label="Challenge selesai" value={formatNumber(summary.challenges)} />
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
        {/* Grafik di atas riwayat pada mobile agar tidak terdorong daftar yang panjang;
            berdampingan di tablet agar kotak heatmap tidak terlalu besar. */}
        <div className="grid min-w-0 content-start gap-5 sm:grid-cols-2 lg:order-last lg:sticky lg:top-24 lg:grid-cols-1 lg:self-start">
          <XpBarChart today={today} />
          <ActivityHeatmap today={today} />
        </div>

        <section aria-label="Riwayat aktivitas" className="min-w-0">
          {groups.length === 0 ? (
            <FilterEmptyState
              title="Tidak ada aktivitas"
              description="Belum ada aktivitas yang cocok dengan filter ini."
              onReset={resetFilters}
            />
          ) : (
            <div className="space-y-4">
              {groups.map((group) => (
                <div key={group.daysAgo} className="rounded-2xl border border-border bg-card px-4 pt-3 sm:px-5">
                  <h2 className="text-sm font-semibold">{dayLabel(today, group.daysAgo)}</h2>
                  <ul className="divide-y divide-border">
                    {group.items.map((entry) => (
                      <ActivityRow key={entry.id} entry={entry} />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
