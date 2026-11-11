import Link from "next/link";
import { ChevronsRight, Layers } from "lucide-react";

import RankEmblem from "@/components/common/RankEmblem";
import { getRankProgress } from "@/data/ranks";
import { formatNumber } from "@/lib/format";

// Kartu Progress Rank di Ringkasan profil (PRD FR-13): emblem rank saat ini dan berikutnya
// dengan warna identitas masing-masing (FR-05), bar progres, dan sisa XP.
export default function RankProgressCard({ xp, showLink = true }: { xp: number; showLink?: boolean }) {
  const { rank, nextRank, xpToNext, percent } = getRankProgress(xp);

  return (
    <section aria-labelledby="progress-rank" className="flex min-w-0 flex-col rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 id="progress-rank" className="flex items-center gap-2 font-semibold">
          <Layers className="h-5 w-5 text-primary-accent" aria-hidden="true" />
          Progress Rank
        </h2>
        {showLink && (
          <Link href="/rank" className="shrink-0 text-sm font-medium text-primary-accent hover:underline">
            Lihat detail rank
          </Link>
        )}
      </div>

      <div className="mt-4 flex flex-1 items-center justify-center gap-4">
        <div className="flex min-w-0 flex-col items-center text-center">
          <RankEmblem rank={rank} variant="full" size={64} />
          <p className="mt-2 font-semibold">{rank.name}</p>
          <p className="text-xs text-muted-foreground">(Saat ini)</p>
        </div>
        {nextRank && (
          <>
            <ChevronsRight className="h-6 w-6 shrink-0 text-primary-accent" aria-hidden="true" />
            <div className="flex min-w-0 flex-col items-center text-center">
              <RankEmblem rank={nextRank} variant="full" size={64} />
              <p className="mt-2 font-semibold">{nextRank.name}</p>
              <p className="text-xs text-muted-foreground">(Berikutnya)</p>
            </div>
          </>
        )}
      </div>

      <div className="mt-4">
        <div
          role="progressbar"
          aria-label={nextRank ? `Progress rank menuju ${nextRank.name}` : "Rank tertinggi tercapai"}
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-2.5 overflow-hidden rounded-full bg-muted"
        >
          <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
        </div>
        <div className="mt-2 flex items-center justify-between gap-3 text-sm">
          {nextRank ? (
            <>
              <span className="tabular-nums">
                {formatNumber(xp)} / {formatNumber(nextRank.minXp)} XP
              </span>
              <span className="tabular-nums text-muted-foreground">{formatNumber(xpToNext)} XP lagi</span>
            </>
          ) : (
            <span>Rank tertinggi tercapai</span>
          )}
        </div>
      </div>
    </section>
  );
}
