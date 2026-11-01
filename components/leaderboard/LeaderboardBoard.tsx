"use client";

import Link from "next/link";
import { CalendarRange, EyeOff } from "lucide-react";

import RankEmblem from "@/components/common/RankEmblem";
import { DUMMY_LEADERBOARD_WEEK } from "@/data/dummy/leaderboard";
import { formatDate, formatNumber } from "@/lib/format";
import {
  getLeaderboard,
  LEADERBOARD_LIMIT,
  LEADERBOARD_PERIODS,
} from "@/lib/leaderboard";
import { useHiddenFromLeaderboard } from "@/lib/leaderboardPrivacy";
import { useUrlFilters } from "@/lib/useUrlFilters";

import LeaderboardRowItem from "./LeaderboardRowItem";

const FILTER_KEYS = ["periode"] as const;

export default function LeaderboardBoard() {
  const { values, setFilters } = useUrlFilters(FILTER_KEYS);
  const hidden = useHiddenFromLeaderboard();

  // Default Mingguan; nilai URL yang tidak dikenal juga jatuh ke Mingguan.
  const period =
    LEADERBOARD_PERIODS.find((item) => item.slug === values.periode) ??
    LEADERBOARD_PERIODS[0];
  const { top, currentUser, isCurrentUserInTop } = getLeaderboard(period.value, hidden);

  const periodInfo =
    period.value === "weekly"
      ? `${formatDate(DUMMY_LEADERBOARD_WEEK.start)} – ${formatDate(DUMMY_LEADERBOARD_WEEK.end)} · direset setiap Senin pukul 00.00 WIB`
      : "Berdasarkan total XP sejak bergabung";

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="tablist"
          aria-label="Periode leaderboard"
          className="inline-flex w-fit rounded-xl border border-border bg-muted/50 p-1"
        >
          {LEADERBOARD_PERIODS.map((item) => {
            const isActive = item.value === period.value;
            return (
              <button
                key={item.value}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setFilters({ periode: item.slug })}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <p className="flex items-center gap-1.5 text-xs text-muted-foreground sm:text-sm">
          <CalendarRange className="h-4 w-4 shrink-0" aria-hidden="true" />
          {periodInfo}
        </p>
      </div>

      {/* Posisi pengguna selalu disematkan, termasuk di luar 50 besar. */}
      <section
        aria-label="Posisi kamu"
        className="flex flex-wrap items-center gap-4 rounded-2xl border border-primary/30 bg-primary/5 p-4 sm:p-5"
      >
        <div>
          <p className="text-sm text-muted-foreground">Posisi kamu</p>
          <p className="mt-0.5 text-3xl font-bold tabular-nums">#{currentUser.position}</p>
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-3">
          <RankEmblem rank={currentUser.rank} size={48} priority />
          <div className="min-w-0">
            <p className="font-semibold">{currentUser.rank.name}</p>
            <p className="text-sm text-muted-foreground">
              {formatNumber(currentUser.periodXp)} XP{" "}
              {period.value === "weekly" ? "minggu ini" : "total"}
            </p>
          </div>
        </div>

        {hidden && (
          <p className="flex w-full items-start gap-2 rounded-xl bg-background/70 px-3 py-2 text-xs text-muted-foreground">
            <EyeOff className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>
              Kamu memilih tidak tampil di leaderboard, jadi posisi ini hanya terlihat olehmu.{" "}
              <Link href="/settings#privasi" className="font-medium text-primary hover:underline">
                Ubah di Pengaturan
              </Link>
            </span>
          </p>
        )}
      </section>

      <section aria-label={`${LEADERBOARD_LIMIT} peringkat teratas`}>
        <p className="mb-2 text-sm text-muted-foreground">
          {LEADERBOARD_LIMIT} peringkat teratas · {period.label}
        </p>

        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <ol className="divide-y divide-border">
            {top.map((row) => (
              <LeaderboardRowItem key={row.id} row={row} />
            ))}
          </ol>

          {!hidden && !isCurrentUserInTop && (
            <ol aria-label="Posisi kamu" className="border-t-2 border-dashed border-border">
              <LeaderboardRowItem row={currentUser} />
            </ol>
          )}
        </div>
      </section>
    </div>
  );
}
