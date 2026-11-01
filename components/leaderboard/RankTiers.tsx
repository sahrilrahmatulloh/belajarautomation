import { Sparkles } from "lucide-react";

import RankEmblem from "@/components/common/RankEmblem";
import { DUMMY_ACCOUNT } from "@/data/dummy/account";
import { getRank, RANKS } from "@/data/ranks";
import { XP_REWARDS } from "@/data/xp";
import { formatNumber } from "@/lib/format";

export default function RankTiers() {
  const currentRank = getRank(DUMMY_ACCOUNT.xp);

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

      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {RANKS.map((rank) => {
          const isCurrent = rank.name === currentRank.name;

          return (
            <li
              key={rank.name}
              className={`flex items-center gap-3 rounded-2xl border bg-card p-3 ${
                isCurrent ? "border-primary ring-1 ring-primary/30" : "border-border"
              }`}
            >
              <RankEmblem rank={rank} variant="full" size={56} />
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 font-semibold">
                  <span
                    aria-hidden="true"
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: rank.color }}
                  />
                  {rank.name}
                  {isCurrent && (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                      Rank kamu
                    </span>
                  )}
                </p>
                <p className="mt-0.5 text-xs font-medium text-foreground/80">
                  Mulai {formatNumber(rank.minXp)} XP
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{rank.description}</p>
              </div>
            </li>
          );
        })}
      </ol>

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
