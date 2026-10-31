interface DashboardPanelProps {
  id: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export default function DashboardPanel({
  id,
  title,
  description,
  action,
  children,
}: DashboardPanelProps) {
  return (
    <section
      aria-labelledby={id}
      className="min-w-0 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5"
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id={id} className="text-lg font-bold">
            {title}
          </h2>
          {description && (
            <p className="mt-0.5 text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {action}
      </div>

      {children}
    </section>
  );
}
