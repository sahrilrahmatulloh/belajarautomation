import Link from "next/link";

import { getRecentActivity } from "@/lib/activity";
import { formatDaysAgo } from "@/lib/format";

import ActivityRow from "./ActivityRow";

const RECENT_LIMIT = 5;

export default function RecentActivity() {
  const entries = getRecentActivity(30).slice(0, RECENT_LIMIT);

  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-xl font-bold">Aktivitas Terbaru</h2>
        <Link href="/profile?tab=aktivitas" className="shrink-0 text-sm font-medium text-primary-accent hover:underline">
          Lihat semua
        </Link>
      </div>

      <ul className="mt-3 divide-y divide-border">
        {entries.map((entry) => (
          <ActivityRow key={entry.id} entry={entry} whenLabel={formatDaysAgo(entry.daysAgo)} />
        ))}
      </ul>
    </section>
  );
}
