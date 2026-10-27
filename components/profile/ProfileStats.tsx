import Link from "next/link";
import { ChartNoAxesColumnIncreasing } from "lucide-react";

export default function ProfileStats() {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <ChartNoAxesColumnIncreasing className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
      <h2 className="mt-3 font-semibold">Statistik belajar</h2>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">
        Statistik akan tersedia saat progres materi dan aktivitas belajar dapat disimpan ke akun.
      </p>
      <Link href="/learn" className="mt-3 inline-block text-sm font-medium text-primary hover:underline">
        Jelajahi materi
      </Link>
    </section>
  );
}
