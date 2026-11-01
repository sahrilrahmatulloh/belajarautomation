"use client";

import Image from "next/image";
import Link from "next/link";
import { Crown, EyeOff, Globe2, TrendingUp } from "lucide-react";

import RankEmblem from "@/components/common/RankEmblem";
import { DUMMY_ACCOUNT } from "@/data/dummy/account";
import { ACTIVE_AVATAR } from "@/data/dummy/appearance";
import { getRankProgress } from "@/data/ranks";
import { formatNumber } from "@/lib/format";
import { getLeaderboard, LEADERBOARD_LIMIT, LeaderboardTab } from "@/lib/leaderboard";
import { useUrlFilters } from "@/lib/useUrlFilters";

import LeaderboardRowItem from "./LeaderboardRowItem";

const FILTER_KEYS = ["tab"] as const;

export default function LeaderboardBoard() {
  const { values, setFilters } = useUrlFilters(FILTER_KEYS);
  // Tab rank pengguna aktif lebih dulu; nilai URL lain dianggap tab rank.
  const tab: LeaderboardTab = values.tab === "global" ? "global" : "rank";

  // Label dan isi tab rank mengikuti XP pengguna, jadi otomatis berubah saat naik rank.
  const { rank, nextRank, xpToNext } = getRankProgress(DUMMY_ACCOUNT.xp);
  const isHidden = !DUMMY_ACCOUNT.showOnLeaderboard;
  const { top, total, currentUser, isCurrentUserInTop } = getLeaderboard(tab);

  const tabs = [
    {
      value: "rank" as const,
      label: rank.name,
      icon: <RankEmblem rank={rank} variant="compact" size={22} />,
    },
    {
      value: "global" as const,
      label: "Global",
      icon: <Globe2 className="h-4 w-4" aria-hidden="true" />,
    },
  ];

  return (
    <div className="space-y-5">
      <div
        role="tablist"
        aria-label="Kategori leaderboard"
        className="inline-flex w-fit rounded-xl border border-border bg-muted/50 p-1"
      >
        {tabs.map((item) => {
          const isActive = item.value === tab;
          const isRankTab = item.value === "rank";
          return (
            <button
              key={item.value}
              type="button"
              role="tab"
              id={`tab-${item.value}`}
              aria-selected={isActive}
              aria-controls="leaderboard-panel"
              onClick={() => setFilters({ tab: item.value })}
              className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
                isActive
                  ? "bg-card text-foreground shadow-sm"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              // Tab rank memakai warna identitas rank untuk border dan latar tipisnya.
              style={
                isRankTab && isActive
                  ? { borderColor: rank.color, backgroundColor: `${rank.color}1f` }
                  : isActive
                    ? { borderColor: "var(--border)" }
                    : undefined
              }
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </div>

      <div id="leaderboard-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="space-y-5">
        {/* Posisi pengguna selalu disematkan, termasuk di luar 50 besar. */}
        <section
          aria-label="Posisi kamu"
          className="flex flex-wrap items-center gap-4 rounded-2xl border bg-card p-4 sm:p-5"
          style={{ borderColor: `${rank.color}80` }}
        >
          <div className="flex items-center gap-3">
            <Image
              src={ACTIVE_AVATAR.image}
              alt=""
              width={56}
              height={56}
              className="h-14 w-14 shrink-0 rounded-full bg-muted"
            />
            <div>
              <p className="text-sm text-muted-foreground">
                Posisi kamu {tab === "global" ? "secara global" : `di ${rank.name}`}
              </p>
              <p className="mt-0.5 text-3xl font-bold tabular-nums">#{currentUser.position}</p>
            </div>
          </div>

          {/* Lebar minimum agar turun ke baris baru di layar sempit, tidak terhimpit. */}
          <div className="flex min-w-[12rem] flex-1 items-center gap-3">
            <RankEmblem rank={rank} variant="full" size={56} priority />
            <div className="min-w-0">
              <p className="font-semibold">{rank.name}</p>
              <p className="text-sm text-muted-foreground">{formatNumber(currentUser.totalXp)} XP</p>
            </div>
          </div>

          {tab === "rank" && (
            <p className="flex w-full items-center gap-2 rounded-xl bg-muted/60 px-3 py-2 text-sm">
              {nextRank ? (
                <>
                  <TrendingUp className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  Butuh {formatNumber(xpToNext)} XP lagi untuk naik ke {nextRank.name}
                </>
              ) : (
                <>
                  <Crown className="h-4 w-4 shrink-0" style={{ color: rank.accentColor }} aria-hidden="true" />
                  Rank tertinggi telah tercapai
                </>
              )}
            </p>
          )}

          {isHidden && (
            <p className="flex w-full items-start gap-2 text-xs text-muted-foreground">
              <EyeOff className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>
                Kamu tidak ditampilkan di leaderboard publik.{" "}
                <Link href="/settings#privasi" className="font-medium text-primary hover:underline">
                  Ubah di Pengaturan
                </Link>
              </span>
            </p>
          )}
        </section>

        <section aria-label={`${LEADERBOARD_LIMIT} peringkat teratas`}>
          <p className="mb-2 text-sm text-muted-foreground">
            {Math.min(LEADERBOARD_LIMIT, total)} teratas dari {formatNumber(total)} peserta ·{" "}
            {tab === "global" ? "Global" : rank.name}
          </p>

          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <ol className="divide-y divide-border">
              {top.map((row) => (
                <LeaderboardRowItem key={row.id} row={row} />
              ))}
            </ol>

            {!isHidden && !isCurrentUserInTop && (
              <>
                <div
                  aria-hidden="true"
                  className="border-y border-border bg-muted/40 py-1 text-center text-sm font-bold tracking-widest text-muted-foreground"
                >
                  …
                </div>
                <ol aria-label="Posisi kamu di luar 50 besar">
                  <LeaderboardRowItem row={currentUser} />
                </ol>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
