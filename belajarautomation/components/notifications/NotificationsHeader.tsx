import { Bell } from "lucide-react";

export default function NotificationsHeader() {
  return (
    <section className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
        <Bell className="h-5 w-5" />
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Notifications
        </h1>

        <p className="mt-1 text-muted-foreground">
          Lihat update terbaru dari aktivitas belajarmu.
        </p>
      </div>
    </section>
  );
}