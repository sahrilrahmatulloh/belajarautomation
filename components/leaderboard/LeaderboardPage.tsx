import { Info, Trophy } from "lucide-react";

import { DUMMY_LEADERBOARD } from "@/data/dummyAccount";
import { getRank } from "@/data/ranks";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const podiumStyles = [
  "bg-amber-400/15 text-amber-600 dark:text-amber-300",
  "bg-slate-400/15 text-slate-600 dark:text-slate-300",
  "bg-orange-500/15 text-orange-700 dark:text-orange-300",
];

export default function LeaderboardPage() {
  const currentUserIndex = DUMMY_LEADERBOARD.findIndex(
    (entry) => entry.isCurrentUser
  );
  const currentUser = DUMMY_LEADERBOARD[currentUserIndex];
  const currentRank = currentUser ? getRank(currentUser.xp) : undefined;

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

      {/* Posisi kamu */}
      {currentUser && currentRank && (
        <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-primary/30 bg-primary/5 p-5">
          <div>
            <p className="text-sm text-muted-foreground">
              Posisi kamu
            </p>
            <p className="mt-1 text-3xl font-bold">
              #{currentUserIndex + 1}
            </p>
          </div>

          <div className="text-right">
            <p
              className="text-sm font-semibold"
              style={{ color: currentRank.color }}
            >
              {currentRank.name}
            </p>
            <p className="mt-1 text-xl font-bold">
              {currentUser.xp.toLocaleString("id-ID")} XP
            </p>
          </div>
        </section>
      )}

      {/* Daftar peringkat */}
      <section className="overflow-hidden rounded-2xl border border-border bg-card">
        <ol className="divide-y divide-border">
          {DUMMY_LEADERBOARD.map((entry, index) => {
            const rank = getRank(entry.xp);

            return (
              <li
                key={entry.name}
                className={`flex items-center gap-4 px-4 py-3 sm:px-5 ${
                  entry.isCurrentUser ? "bg-primary/5" : ""
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    podiumStyles[index] ?? "text-muted-foreground"
                  }`}
                >
                  {index + 1}
                </span>

                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                  {getInitials(entry.name)}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {entry.name}
                    {entry.isCurrentUser && (
                      <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                        Kamu
                      </span>
                    )}
                  </p>
                  <p
                    className="mt-0.5 text-xs font-medium"
                    style={{ color: rank.color }}
                  >
                    {rank.name}
                  </p>
                </div>

                <span className="shrink-0 text-sm font-bold tabular-nums">
                  {entry.xp.toLocaleString("id-ID")} XP
                </span>
              </li>
            );
          })}
        </ol>
      </section>

      <p className="flex items-start gap-2 text-sm text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        Peringkat dihitung dari aktivitas belajar, bukan dari status Premium.
      </p>
    </div>
  );
}
