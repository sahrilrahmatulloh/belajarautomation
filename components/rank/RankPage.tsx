import Link from "next/link";
import { ArrowRight, Shield } from "lucide-react";

import RankTiers from "./RankTiers";
import XpRewards from "./XpRewards";

// Halaman Rank & XP (PRD FR-05): tingkatan rank dan cara mendapatkan XP.
// Dibuka dari kartu "Rank kamu" di dashboard dan dari kartu "Posisi kamu" di leaderboard.
export default function RankPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <section className="flex flex-wrap items-center gap-x-3 gap-y-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <Shield className="h-5 w-5" aria-hidden="true" />
        </div>

        {/* Di layar kecil tombol turun ke baris sendiri agar judul tidak terhimpit. */}
        <div className="min-w-0 flex-1 basis-48">
          <h1 className="text-3xl font-bold tracking-tight">Rank &amp; XP</h1>
          <p className="mt-1 text-muted-foreground">Tingkatan rank, progres kamu, dan cara mendapatkan XP.</p>
        </div>

        <Link
          href="/leaderboard"
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm font-semibold transition-colors hover:bg-accent sm:w-auto"
        >
          Lihat leaderboard
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </section>

      <RankTiers />

      <XpRewards />
    </div>
  );
}
