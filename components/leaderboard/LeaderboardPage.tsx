import Link from "next/link";
import { FlaskConical, Trophy } from "lucide-react";

export default function LeaderboardPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <section className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <Trophy className="h-5 w-5" />
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Leaderboard
          </h1>

          <p className="mt-1 text-muted-foreground">
            Peringkat belajar berdasarkan XP dari materi dan latihan.
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-dashed border-border bg-card px-6 py-14 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
          <Trophy className="h-7 w-7 text-muted-foreground" />
        </div>

        <h2 className="mt-5 text-xl font-semibold">
          Leaderboard belum aktif
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          Leaderboard akan aktif setelah sistem XP tersedia. Peringkat
          dihitung dari aktivitas belajar, bukan dari status Premium.
        </p>

        <Link
          href="/playground"
          className="mt-6 inline-flex min-h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <FlaskConical className="h-4 w-4" />
          Latihan di Playground
        </Link>
      </section>
    </div>
  );
}
