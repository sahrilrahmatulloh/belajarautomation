import {
  BookOpen,
  CheckCircle2,
  FlaskConical,
} from "lucide-react";

const activities = [
  {
    id: 1,
    title: "Menyelesaikan materi Playwright Locator",
    time: "2 jam lalu",
    icon: BookOpen,
  },
  {
    id: 2,
    title: "Menyelesaikan challenge Locator Strategy",
    time: "Kemarin",
    icon: FlaskConical,
  },
  {
    id: 3,
    title: "Menyelesaikan QA Fundamentals",
    time: "3 hari lalu",
    icon: CheckCircle2,
  },
];

export default function RecentActivity() {
  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      <h2 className="text-xl font-bold">
        Aktivitas Terbaru
      </h2>

      <p className="mt-1 text-sm text-muted-foreground">
        Aktivitas belajar terbaru kamu.
      </p>

      <div className="mt-6 space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;

          return (
            <div
              key={activity.id}
              className="flex items-center gap-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                <Icon className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-medium">
                  {activity.title}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {activity.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}