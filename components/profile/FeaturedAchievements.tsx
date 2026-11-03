import Link from "next/link";

import { AchievementState } from "@/lib/achievements";
import { formatDaysAgo } from "@/lib/format";

import AchievementBadge from "./AchievementBadge";

// Achievement unggulan di tab Ringkasan (PRD FR-14).
export default function FeaturedAchievements({
  featured,
  allHref,
}: {
  featured: AchievementState[];
  allHref: string;
}) {
  if (featured.length === 0) return null;

  return (
    <section aria-labelledby="achievement-unggulan" className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="achievement-unggulan" className="font-semibold">Achievement Unggulan</h2>
        <Link href={allHref} className="shrink-0 text-sm font-medium text-primary-accent hover:underline">
          Lihat semua
        </Link>
      </div>

      <ul className="mt-4 grid gap-4 sm:grid-cols-3">
        {featured.map(({ achievement, earned }) => (
          <li key={achievement.id} className="flex min-w-0 items-center gap-3">
            <AchievementBadge icon={achievement.icon} category={achievement.category} earned />
            <div className="min-w-0">
              <p className="truncate font-semibold">{achievement.name}</p>
              <p className="text-xs text-muted-foreground">
                {achievement.category} · {formatDaysAgo(earned!.daysAgo)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
