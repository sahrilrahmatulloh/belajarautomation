import { Check, Lock, Sparkles } from "lucide-react";

import RankEmblem from "@/components/common/RankEmblem";
import { DUMMY_ACCOUNT } from "@/data/dummy/account";
import { getRankProgress, RANKS } from "@/data/ranks";
import { XP_REWARDS } from "@/data/xp";
import { formatNumber } from "@/lib/format";

export default function RankTiers() {
  const { rank: currentRank, nextRank, percent } = getRankProgress(DUMMY_ACCOUNT.xp);
  const currentIndex = RANKS.indexOf(currentRank);

  return (
    <section id="tingkatan-rank" aria-labelledby="rank-tiers-title" className="scroll-mt-20 space-y-4">
      <div>
        <h2 id="rank-tiers-title" className="text-xl font-bold">
          Tingkatan Rank
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Rank ditentukan dari total XP dan menjadi indikator perkembangan belajar,
          bukan sertifikasi profesional.
        </p>
      </div>

      {/* Tangga rank: Master di puncak, Trainee di dasar. Garis jalur di belakang
          kartu terlihat di sela antarkartu sebagai anak tangga. */}
      <div className="relative">
        <div
          aria-hidden="true"
          className="absolute bottom-10 left-[2.5rem] top-10 w-1 -translate-x-1/2 rounded-full bg-primary/25"
        />
        <ol aria-label="Tingkatan rank, dari tertinggi ke terendah" className="relative space-y-4">

        {[...RANKS].reverse().map((rank) => {
          const rankIndex = RANKS.indexOf(rank);
          const isCurrent = rankIndex === currentIndex;
          const isAchieved = rankIndex < currentIndex;
          const isLocked = rankIndex > currentIndex;

          return (
            <li
              key={rank.name}
              aria-current={isCurrent ? "step" : undefined}
              className={`relative flex items-center gap-3 rounded-2xl border bg-card p-3 sm:gap-4 ${
                isCurrent ? "border-primary ring-1 ring-primary/30" : "border-border"
              }`}
            >
              <RankEmblem
                rank={rank}
                variant="full"
                size={56}
                className={isLocked ? "opacity-75 grayscale-[25%]" : undefined}
              />

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <p className={`flex items-center gap-2 font-semibold ${isLocked ? "text-muted-foreground" : ""}`}>
                    <span
                      aria-hidden="true"
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: rank.color }}
                    />
                    {rank.name}
                  </p>
                  {isCurrent && (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                      Rank kamu
                    </span>
                  )}
                  {isAchieved && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                      <Check className="h-3 w-3" aria-hidden="true" />
                      Tercapai
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs font-medium text-foreground/80">
                  Mulai {formatNumber(rank.minXp)} XP
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{rank.description}</p>

                {isCurrent && nextRank && (
                  <div className="mt-2 max-w-sm">
                    <div
                      role="progressbar"
                      aria-label={`Progres menuju ${nextRank.name}`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={percent}
                      className="h-1.5 overflow-hidden rounded-full bg-muted"
                    >
                      <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {formatNumber(DUMMY_ACCOUNT.xp)} XP · {percent}% menuju {nextRank.name}
                    </p>
                  </div>
                )}
              </div>

              {isLocked && (
                <span className="hidden shrink-0 items-center gap-1 text-xs text-muted-foreground sm:inline-flex">
                  <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                  Butuh {formatNumber(rank.minXp - DUMMY_ACCOUNT.xp)} XP lagi
                </span>
              )}
            </li>
          );
        })}
      </ol>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <h3 className="flex items-center gap-2 font-semibold">
          <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
          Cara mendapatkan XP
        </h3>
        <ul className="mt-3 divide-y divide-border text-sm">
          {XP_REWARDS.map((reward) => (
            <li key={reward.activity} className="flex items-center justify-between gap-3 py-2">
              <span className="text-muted-foreground">{reward.activity}</span>
              <span className="shrink-0 font-semibold tabular-nums">+{reward.xp} XP</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          XP hanya diberikan saat aktivitas diselesaikan pertama kali. Mengulang lesson,
          kuis, atau challenge tetap boleh, tetapi tidak menambah XP.
        </p>
      </div>
    </section>
  );
}
