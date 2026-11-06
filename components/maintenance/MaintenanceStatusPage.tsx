"use client";

import Link from "next/link";
import { CircleCheck } from "lucide-react";

import MaintenanceScreen from "./MaintenanceScreen";
import { useMaintenance } from "./useMaintenance";

// Halaman /maintenance: menampilkan status terkini, termasuk saat situs sudah kembali normal.
export default function MaintenanceStatusPage() {
  const { isLoaded, current, phase } = useMaintenance();

  if (!isLoaded) return <p className="py-10 text-center text-sm text-muted-foreground">Memuat status...</p>;
  if (current && phase === "aktif") return <MaintenanceScreen window={current} />;

  return (
    <main className="grid min-h-dvh place-items-center bg-background px-4 py-10 text-foreground">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 text-center sm:p-8">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
          <CircleCheck className="h-7 w-7" aria-hidden="true" />
        </span>
        <h1 className="mt-4 text-2xl font-bold tracking-tight">Situs berjalan normal</h1>
        <p className="mt-2 text-muted-foreground">Tidak ada maintenance yang sedang berlangsung.</p>
        <Link href="/" className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover">
          Ke Beranda
        </Link>
      </div>
    </main>
  );
}
