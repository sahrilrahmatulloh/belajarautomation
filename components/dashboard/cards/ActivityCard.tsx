import { History } from "lucide-react";

export default function ActivityCard() {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 text-card-foreground shadow-sm">
      <History className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
      <h2 className="mt-4 text-lg font-semibold">Aktivitas terbaru</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Riwayat aktivitas belum tersedia. Aktivitas akan muncul setelah platform
        memiliki penyimpanan progres belajar.
      </p>
    </div>
  );
}
