import { APP_ENV, isProduction } from "@/lib/env";

const BADGE_STYLES = {
  dev: { label: "DEV", className: "bg-orange-500 text-white dark:bg-orange-400 dark:text-orange-950" },
  uat: { label: "UAT", className: "bg-purple-600 text-white dark:bg-purple-400 dark:text-purple-950" },
} as const;

// Label lingkungan di pojok kiri bawah (PRD Bagian 13.3). Tidak tampil di
// production. pointer-events-none agar tidak menghalangi klik pada elemen di
// bawahnya, mis. menu sidebar di pojok yang sama.
export default function EnvironmentBadge() {
  if (isProduction) return null;
  const badge = BADGE_STYLES[APP_ENV as keyof typeof BADGE_STYLES];

  return (
    <div
      role="status"
      aria-label={`Lingkungan ${badge.label}`}
      className={`pointer-events-none fixed bottom-2 left-2 z-[60] select-none rounded-md px-1.5 py-0.5 font-mono text-[10px] font-bold leading-4 tracking-wider opacity-90 shadow-sm ring-1 ring-black/10 sm:bottom-3 sm:left-3 ${badge.className}`}
    >
      {badge.label}
    </div>
  );
}
