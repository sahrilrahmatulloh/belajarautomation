import Image from "next/image";

import RankEmblem from "@/components/common/RankEmblem";
import { DEFAULT_AVATAR } from "@/data/profile";
import { formatNumber } from "@/lib/format";
import { LeaderboardRow } from "@/lib/leaderboard";

// Penekanan visual untuk tiga posisi teratas.
const podiumStyles = [
  "bg-amber-400/20 text-amber-700 ring-1 ring-amber-400/40 dark:text-amber-300",
  "bg-slate-400/20 text-slate-700 ring-1 ring-slate-400/40 dark:text-slate-200",
  "bg-orange-500/20 text-orange-700 ring-1 ring-orange-500/40 dark:text-orange-300",
];

export default function LeaderboardRowItem({ row }: { row: LeaderboardRow }) {
  return (
    <li
      className={`flex items-center gap-3 px-3 py-3 sm:gap-4 sm:px-5 ${
        row.isCurrentUser ? "bg-primary/[0.06]" : ""
      }`}
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold tabular-nums ${
          podiumStyles[row.position - 1] ?? "text-muted-foreground"
        }`}
      >
        {row.position}
      </span>

      {/* Avatar maskot sesuai skin aktif; saat ini semua memakai skin Basic. */}
      <Image
        src={DEFAULT_AVATAR}
        alt=""
        width={36}
        height={36}
        className="h-9 w-9 shrink-0 rounded-full bg-muted object-cover"
      />

      <div className="min-w-0 flex-1">
        <p className="flex min-w-0 items-center gap-2 text-sm font-semibold">
          <span className="truncate">{row.name}</span>
          {row.isCurrentUser && (
            <span className="shrink-0 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
              Kamu
            </span>
          )}
        </p>
        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          <RankEmblem rank={row.rank} variant="compact" size={24} />
          {row.rank.name}
        </p>
      </div>

      <span className="shrink-0 text-sm font-bold tabular-nums">
        {formatNumber(row.periodXp)} XP
      </span>
    </li>
  );
}
