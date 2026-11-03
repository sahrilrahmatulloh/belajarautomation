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
    <section id="tingkatan-rank" aria-labelledby="rank-tiers-title" className="min-w-0 scroll-mt-20 space-y-4">
      <div>
        <h2 id="rank-tiers-title" className="text-xl font-bold">
          Tingkatan Rank
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Rank ditentukan dari total XP dan menjadi indikator perkembangan belajar,
          bukan sertifikasi profesional.
        </p>
      </div>

      {/* Kolom berjajar dari Trainee (kiri) ke Master (kanan). Di layar sempit
          baris ini digeser horizontal tanpa membuat halaman ikut melebar. */}
      <ol
        aria-label="Tingkatan rank, dari terendah ke tertinggi"
        tabIndex={0}
        className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2 pt-1 [scrollbar-width:thin] lg:grid lg:grid-cols-6 lg:overflow-visible"
      >
        {RANKS.map((rank, rankIndex) => {
          const isCurrent = rankIndex === currentIndex;
          const isAchieved = rankIndex < currentIndex;
          const isLocked = rankIndex > currentIndex;

          return (
            <li
              key={rank.name}
              aria-current={isCurrent ? "step" : undefined}
              className={`relative flex w-40 shrink-0 snap-start flex-col items-center overflow-hidden rounded-2xl border p-3 text-center lg:w-auto ${
                isCurrent
                  ? "border-primary bg-primary/[0.07] shadow-md ring-1 ring-primary/40"
                  : "border-border bg-card"
              }`}
            >
              {/* Rona warna identitas rank di bagian atas kolom. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-24"
                style={{ background: `linear-gradient(to bottom, ${rank.color}2e, transparent)` }}
              />

              <RankEmblem
                rank={rank}
                variant="full"
                size={72}
                className={`relative mt-1 ${isLocked ? "opacity-75 grayscale-[25%]" : ""}`}
              />

              <p
                className="relative mt-2 w-full truncate rounded-full border bg-background/80 px-2 py-0.5 text-sm font-semibold"
                style={{ borderColor: `${rank.color}99` }}
              >
                {rank.name}
              </p>

              <p className="mt-2 text-sm font-bold tabular-nums">{formatNumber(rank.minXp)} XP</p>
              <p className="mt-1 text-[11px] leading-4 text-muted-foreground">{rank.description}</p>

              <div className="mt-auto w-full pt-3">
                {isCurrent && (
                  <>
                    <span className="inline-block rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                      Rank kamu
                    </span>
                    {nextRank && (
                      <div
                        role="progressbar"
                        aria-label={`Progres menuju ${nextRank.name}`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={percent}
                        className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"
                      >
                        <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
                      </div>
                    )}
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {nextRank ? `${percent}% menuju ${nextRank.name}` : "Rank tertinggi"}
                    </p>
                  </>
                )}
                {isAchieved && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                    <Check className="h-3 w-3" aria-hidden="true" />
                    Tercapai
                  </span>
                )}
                {isLocked && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Lock className="h-3 w-3" aria-hidden="true" />
                    Butuh {formatNumber(rank.minXp - DUMMY_ACCOUNT.xp)} XP lagi
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <h3 className="flex items-center gap-2 font-semibold">
          <Sparkles className="h-4 w-4 text-primary-accent" aria-hidden="true" />
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
