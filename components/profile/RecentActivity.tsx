import { History } from "lucide-react";

export default function RecentActivity() {
  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      <h2 className="text-xl font-bold">
        Aktivitas Terbaru
      </h2>

      <p className="mt-1 text-sm text-muted-foreground">
        Riwayat aktivitas belum tersedia karena aktivitas belajar belum disimpan.
      </p>

      <div className="mt-6 flex items-center gap-3 rounded-xl bg-muted/50 p-4 text-sm text-muted-foreground">
        <History className="h-4 w-4 shrink-0" aria-hidden="true" />
        Belum ada aktivitas tersimpan.
      </div>
    </section>
  );
}
