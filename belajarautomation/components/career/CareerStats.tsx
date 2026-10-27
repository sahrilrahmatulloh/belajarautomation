import {
  BookOpenCheck,
  BriefcaseBusiness,
  Target,
} from "lucide-react";

const stats = [
  {
    label: "Career Resources",
    value: "6",
    icon: BookOpenCheck,
  },
  {
    label: "Available Resources",
    value: "5",
    icon: BriefcaseBusiness,
  },
  {
    label: "Career Goal",
    value: "Job Ready",
    icon: Target,
  },
];

export default function CareerStats() {
  return (
    <section className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
              <Icon className="h-5 w-5" />
            </div>

            <p className="mt-4 text-2xl font-bold">
              {stat.value}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              {stat.label}
            </p>
          </div>
        );
      })}
    </section>
  );
}