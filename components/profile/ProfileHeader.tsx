import Image from "next/image";
import Link from "next/link";
import { Settings2 } from "lucide-react";

import RankEmblem from "@/components/common/RankEmblem";
import { DUMMY_ACCOUNT } from "@/data/dummy/account";
import { ACTIVE_AVATAR, ACTIVE_THEME } from "@/data/dummy/appearance";
import { getRankProgress } from "@/data/ranks";
import { formatNumber } from "@/lib/format";

// Header profil (PRD FR-13): banner tema aktif, avatar aktif, rank, dan XP.
// Tanpa level, sub-tingkat rank, atau lencana verifikasi.
export default function ProfileHeader() {
  const { rank, nextRank, xpToNext, percent } = getRankProgress(DUMMY_ACCOUNT.xp);

  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-card">
      {/* Banner tema aktif */}
      <div className="relative h-28 sm:h-40">
        <Image
          src={ACTIVE_THEME.image}
          alt=""
          fill
          priority
          sizes="(min-width: 1152px) 1152px, 100vw"
          className="object-cover object-[75%_50%]"
        />
      </div>

      <div className="flex flex-col gap-5 px-5 pb-6 sm:px-8 lg:flex-row lg:items-end">
        <div className="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row sm:items-end">
          {/* Avatar menumpuk di tepi bawah banner */}
          <Image
            src={ACTIVE_AVATAR.image}
            alt={`Avatar ${ACTIVE_AVATAR.name}`}
            width={112}
            height={112}
            className="relative -mt-12 h-24 w-24 shrink-0 rounded-full bg-card ring-4 ring-card sm:-mt-14 sm:h-28 sm:w-28"
          />

          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">
              {DUMMY_ACCOUNT.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Profil belajar kamu di belajarautomation.com
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:shrink-0">
          {/* Rank dan progress XP */}
          <div
            className="flex min-w-0 items-center gap-3 rounded-2xl border bg-background/60 py-1.5 pl-1.5 pr-4 sm:w-72"
            style={{ borderColor: `${rank.color}66` }}
          >
            <RankEmblem rank={rank} variant="full" size={48} />
            <div className="min-w-0 flex-1">
              <p className="flex items-baseline justify-between gap-2">
                <span className="font-semibold">{rank.name}</span>
                <span className="text-xs tabular-nums text-muted-foreground">
                  {formatNumber(DUMMY_ACCOUNT.xp)} XP
                </span>
              </p>
              <div
                role="progressbar"
                aria-label={nextRank ? `Progress menuju ${nextRank.name}` : "Rank tertinggi tercapai"}
                aria-valuenow={percent}
                aria-valuemin={0}
                aria-valuemax={100}
                className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted"
              >
                <div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: rank.color }} />
              </div>
              <p className="mt-1 truncate text-xs text-muted-foreground">
                {nextRank
                  ? `${formatNumber(xpToNext)} XP lagi ke ${nextRank.name}`
                  : "Rank tertinggi tercapai"}
              </p>
            </div>
          </div>

          <Link
            href="/settings"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:bg-accent"
          >
            <Settings2 className="h-4 w-4" aria-hidden="true" />
            Pengaturan
          </Link>
        </div>
      </div>
    </section>
  );
}
