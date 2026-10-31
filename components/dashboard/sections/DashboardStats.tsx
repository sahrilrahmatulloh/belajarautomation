import { BookOpenCheck, Flame, Target, Trophy } from "lucide-react";

const stats = [
  {
    label: "Total XP",
    value: "—",
    detail: "Data XP belum tersedia",
    Icon: Trophy,
    iconStyle: "bg-amber-500/10 text-amber-600 dark:text-amber-300",
  },
  {
    label: "Materi Selesai",
    value: "—",
    detail: "Progres belum tersimpan",
    Icon: BookOpenCheck,
    iconStyle: "bg-brand-blue/10 text-brand-blue",
  },
  {
    label: "Challenge Selesai",
    value: "—",
    detail: "Aktivitas belum tersimpan",
    Icon: Target,
    iconStyle: "bg-rose-500/10 text-rose-600 dark:text-rose-300",
  },
  {
    label: "Streak Belajar",
    value: "—",
    detail: "Riwayat belajar belum tersedia",
    Icon: Flame,
    iconStyle: "bg-orange-500/10 text-orange-600 dark:text-orange-300",
  },
];

export default function DashboardStats() {
  return (
    <section aria-label="Statistik belajar" className="grid grid-cols-2 gap-3">
      {stats.map(({ label, value, detail, Icon, iconStyle }) => (
        <article
          key={label}
          className="min-w-0 rounded-xl border border-border bg-card p-3 shadow-sm sm:p-3.5"
        >
          <div className="flex items-start gap-3">
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconStyle}`}>
              <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h3 className="text-xs font-medium leading-5 text-muted-foreground sm:text-sm">
                {label}
              </h3>
              <p className="mt-0.5 text-lg font-bold tracking-tight sm:text-xl">
                {value}
              </p>
            </div>
          </div>
          <p className="mt-2 text-[11px] leading-4 text-muted-foreground sm:text-xs">
            {detail}
          </p>
        </article>
      ))}
    </section>
  );
}
