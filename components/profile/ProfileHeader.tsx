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
    <section className="relative isolate overflow-hidden rounded-3xl border border-border bg-slate-900 text-white">
      <Image
        src={ACTIVE_THEME.image}
        alt=""
        fill
        priority
        sizes="(min-width: 1152px) 1152px, 100vw"
        className="-z-20 object-cover object-[75%_50%]"
      />
      {/* Gradasi gelap dari kiri agar teks putih terbaca di tema apa pun */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/90 via-slate-950/75 to-slate-950/45 sm:via-slate-950/60 sm:to-transparent"
      />

      <Link
        href="/settings"
        aria-label="Pengaturan profil"
        className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950/40 text-white backdrop-blur-sm transition-colors hover:bg-slate-950/60"
      >
        <Settings2 className="h-5 w-5" aria-hidden="true" />
      </Link>

      <div className="flex flex-col gap-5 p-5 sm:p-6 lg:max-w-[72%] lg:flex-row lg:items-center lg:p-8">
        <div className="flex min-w-0 items-center gap-4 pr-12 sm:gap-5 lg:pr-8">
          <div className="shrink-0 overflow-hidden rounded-2xl bg-white p-1 shadow-lg">
            <Image
              src={ACTIVE_AVATAR.image}
              alt={`Avatar ${ACTIVE_AVATAR.name}`}
              width={112}
              height={112}
              className="h-20 w-20 sm:h-24 sm:w-24"
            />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">
              {DUMMY_ACCOUNT.name}
            </h1>
            <p className="mt-1 text-sm text-white/75">
              Belajar QA Automation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-5 sm:gap-8">
          {/* Rank */}
          <div className="flex shrink-0 items-center gap-3 lg:border-l lg:border-white/20 lg:pl-8">
            <RankEmblem rank={rank} variant="full" size={56} />
            <div>
              <p className="text-xs text-white/70">Rank</p>
              <p className="font-semibold">{rank.name}</p>
            </div>
          </div>

          {/* XP dan progress menuju rank berikutnya */}
          <div className="min-w-0 flex-1 border-l border-white/20 pl-5 sm:pl-8 lg:w-56 lg:flex-none">
            <p className="text-lg font-bold tabular-nums">{formatNumber(DUMMY_ACCOUNT.xp)} XP</p>
            <div
              role="progressbar"
              aria-label={nextRank ? `Progress menuju ${nextRank.name}` : "Rank tertinggi tercapai"}
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
              className="mt-2 h-2 overflow-hidden rounded-full bg-white/20"
            >
              <div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: rank.color }} />
            </div>
            <p className="mt-1.5 text-xs text-white/75">
              {nextRank
                ? `${formatNumber(xpToNext)} XP lagi ke ${nextRank.name} (${percent}%)`
                : "Rank tertinggi tercapai"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
