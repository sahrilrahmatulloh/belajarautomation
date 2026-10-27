import {
  BookOpenCheck,
  CheckCircle2,
  Flame,
  Route,
} from "lucide-react";

const stats = [
  {
    label: "Materi Selesai",
    value: "24",
    icon: BookOpenCheck,
  },
  {
    label: "Challenge Selesai",
    value: "12",
    icon: CheckCircle2,
  },
  {
    label: "Roadmap Progress",
    value: "38%",
    icon: Route,
  },
  {
    label: "Learning Streak",
    value: "7 Hari",
    icon: Flame,
  },
];

export default function ProfileStats() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <Icon className="h-5 w-5 text-muted-foreground" />

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