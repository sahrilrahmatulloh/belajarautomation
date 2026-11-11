import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

import { formatDaysAgo } from "@/lib/format";
import { ActivityEntry } from "@/types/Activity";

import ActivityRow from "./ActivityRow";

const RECENT_LIMIT = 3;

// Aktivitas Terbaru di Ringkasan profil (PRD FR-13): tiga aktivitas terakhir.
export default function RecentActivity({ entries, isLoaded = true }: { entries: ActivityEntry[]; isLoaded?: boolean }) {
  const latest = entries.slice(0, RECENT_LIMIT);

  return (
    <section aria-labelledby="aktivitas-terbaru" className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 id="aktivitas-terbaru" className="flex items-center gap-2 font-semibold">
          <Zap className="h-5 w-5 text-primary-accent" aria-hidden="true" />
          Aktivitas Terbaru
        </h2>
        <Link
          href="/profile?tab=aktivitas"
          className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary-accent hover:underline"
        >
          Lihat semua
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      {!isLoaded ? (
        <p role="status" className="py-6 text-center text-sm text-muted-foreground">
          Memuat aktivitas...
        </p>
      ) : latest.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          Belum ada aktivitas. Mulai belajar untuk melihat riwayatmu di sini.
        </p>
      ) : (
        <ul className="mt-2 divide-y divide-border">
          {latest.map((entry) => (
            <ActivityRow key={entry.id} entry={entry} whenLabel={formatDaysAgo(entry.daysAgo)} />
          ))}
        </ul>
      )}
    </section>
  );
}
