import { Suspense } from "react";
import { Info, Trophy } from "lucide-react";

import LeaderboardBoard from "./LeaderboardBoard";

export default function LeaderboardPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <section className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <Trophy className="h-5 w-5" />
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Leaderboard
          </h1>

          <p className="mt-1 text-muted-foreground">
            Peringkat belajar berdasarkan XP dari materi, kuis, dan challenge.
          </p>
        </div>
      </section>

      {/* LeaderboardBoard membaca tab aktif dari URL (useSearchParams). */}
      <Suspense fallback={<p className="text-sm text-muted-foreground">Memuat leaderboard...</p>}>
        <LeaderboardBoard />
      </Suspense>

      <p className="flex items-start gap-2 text-sm text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        Peringkat berdasarkan total XP dari aktivitas belajar yang valid. Pembelian tidak menambah XP.
      </p>
    </div>
  );
}
