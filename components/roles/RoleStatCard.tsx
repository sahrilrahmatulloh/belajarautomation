import { LucideIcon } from "lucide-react";

interface RoleStatCardProps {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  iconStyle: string;
}

// Mengikuti gaya kartu di components/dashboard/sections/DashboardStats.tsx.
export default function RoleStatCard({
  label,
  value,
  detail,
  icon: Icon,
  iconStyle,
}: RoleStatCardProps) {
  return (
    <article className="min-w-0 rounded-xl border border-border bg-card p-3 shadow-sm sm:p-3.5">
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
  );
}
