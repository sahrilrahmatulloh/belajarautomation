import { LucideIcon, Lightbulb, TriangleAlert } from "lucide-react";

function Callout({
  title,
  icon: Icon,
  className,
  children,
}: {
  title: string;
  icon: LucideIcon;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <aside className={`my-6 flex gap-3 rounded-xl border p-4 ${className}`}>
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <div className="min-w-0 text-sm leading-6 text-foreground [&>p]:my-0">
        <p className="font-semibold">{title}</p>
        {children}
      </div>
    </aside>
  );
}

export function Tips({ children }: { children: React.ReactNode }) {
  return (
    <Callout
      title="Tips"
      icon={Lightbulb}
      className="border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300"
    >
      {children}
    </Callout>
  );
}

export function Peringatan({ children }: { children: React.ReactNode }) {
  return (
    <Callout
      title="Peringatan"
      icon={TriangleAlert}
      className="border-destructive/40 bg-destructive/10 text-destructive"
    >
      {children}
    </Callout>
  );
}
