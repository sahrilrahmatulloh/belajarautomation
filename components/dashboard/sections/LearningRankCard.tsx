import Link from "next/link";
import { ArrowRight, Crown, Sparkles } from "lucide-react";

import RankEmblem from "@/components/common/RankEmblem";
import { DUMMY_ACCOUNT } from "@/data/dummy/account";
import { getRankProgress } from "@/data/ranks";
import { formatNumber } from "@/lib/format";

export default function LearningRankCard() {
  const { xp } = DUMMY_ACCOUNT;
  const { rank, nextRank, xpToNext, percent } = getRankProgress(xp);

  return (
    <section className="relative isolate overflow-hidden rounded-xl bg-slate-950 p-4 text-white shadow-sm sm:p-5">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-24 h-56 w-40 rotate-45 rounded-[2rem] border border-blue-400/20 bg-blue-500/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 right-1/4 h-52 w-28 -rotate-45 rounded-[2rem] border border-cyan-300/15 bg-cyan-300/5"
      />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border p-1.5 sm:h-[4.5rem] sm:w-[4.5rem]"
          style={{ borderColor: `${rank.color}55`, backgroundColor: `${rank.color}1a` }}
        >
          <RankEmblem
            rank={rank}
            variant="full"
            size={56}
            priority
            className="drop-shadow-[0_0_10px_rgba(255,255,255,0.15)]"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-200">
            Rank kamu
          </p>
          {/* Latar kartu selalu gelap, jadi warna rank aman dipakai sebagai teks. */}
          <h2 className="mt-0.5 text-lg font-bold sm:text-xl" style={{ color: rank.accentColor ?? rank.color }}>
            {rank.name}
          </h2>

          <div className="mt-2 max-w-md">
            {nextRank ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-x-3 text-xs text-slate-300">
                  <span className="font-semibold text-white">{formatNumber(xp)} XP</span>
                  <span>
                    {formatNumber(xpToNext)} XP lagi menuju {nextRank.name} · {percent}%
                  </span>
                </div>
                <div
                  className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/10"
                  role="progressbar"
                  aria-label={`Progres menuju ${nextRank.name}`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={percent}
                >
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${percent}%`, backgroundColor: rank.color }}
                  />
                </div>
              </>
            ) : (
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-300">
                <span className="font-semibold text-white">{formatNumber(xp)} XP</span>
                <span className="inline-flex items-center gap-1.5 font-medium" style={{ color: rank.accentColor }}>
                  <Crown className="h-3.5 w-3.5" aria-hidden="true" />
                  Rank tertinggi tercapai
                </span>
              </p>
            )}
          </div>
        </div>

        <Link
          href="/leaderboard"
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
        >
          Lihat leaderboard
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>

        <Sparkles
          className="absolute right-4 top-4 hidden h-4 w-4 text-cyan-200/70 sm:block"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
