import {
  CheckCircle2,
  BookOpen,
  FileText,
} from "lucide-react";

const activities = [
  {
    icon: CheckCircle2,
    title: "Menyelesaikan materi",
    subtitle: "CSS Selector di Playwright",
    time: "2 jam lalu",
  },
  {
    icon: BookOpen,
    title: "Menyelesaikan Quiz",
    subtitle: "Selenium WebDriver Basic",
    time: "5 jam lalu",
  },
  {
    icon: FileText,
    title: "Membaca Artikel",
    subtitle: "Page Object Model Best Practice",
    time: "1 hari lalu",
  },
];

export default function ActivityCard() {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 text-card-foreground shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Aktivitas Terbaru
        </h2>

        <button className="text-sm text-blue-600 hover:underline dark:text-blue-400">
          Lihat Semua
        </button>
      </div>

      <div className="space-y-5">
        {activities.map((activity, index) => {
          const Icon = activity.icon;

          return (
            <div key={index} className="flex gap-3">
              <div className="mt-1">
                <Icon
                  size={18}
                  className="text-green-500"
                />
              </div>

              <div className="flex-1">
                <p className="font-medium">
                  {activity.title}
                </p>

                <p className="text-sm text-muted-foreground">
                  {activity.subtitle}
                </p>
              </div>

              <span className="text-xs text-muted-foreground">
                {activity.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}