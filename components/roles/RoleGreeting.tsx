import { LucideIcon } from "lucide-react";

interface RoleGreetingProps {
  title: string;
  description: string;
  icon: LucideIcon;
  meta?: string;
  action?: React.ReactNode;
}

export default function RoleGreeting({
  title,
  description,
  icon: Icon,
  meta,
  action,
}: RoleGreetingProps) {
  return (
    <section className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:p-6">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="h-7 w-7" aria-hidden="true" />
      </div>

      <div className="min-w-0 flex-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h1>

        <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
          {description}
        </p>

        {meta && (
          <p className="mt-2 text-xs font-medium text-primary">
            {meta}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </section>
  );
}
