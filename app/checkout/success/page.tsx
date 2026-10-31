import Link from "next/link";
import { CheckCircle2, Info } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";

interface SuccessPageProps {
  searchParams: Promise<{
    order?: string | string[];
  }>;
}

export default async function SuccessPage({
  searchParams,
}: SuccessPageProps) {
  const { order } = await searchParams;
  // Hanya terima format id simulasi agar teks dari URL tidak ditampilkan mentah.
  const orderId =
    typeof order === "string" && /^SIM-[A-Z0-9]{8}$/.test(order)
      ? order
      : undefined;

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-xl space-y-6 py-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
          <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Pesanan berhasil
          </h1>
          {orderId && (
            <p className="mt-2 text-sm text-muted-foreground">
              Nomor pesanan <span className="font-mono font-semibold text-foreground">{orderId}</span>
            </p>
          )}
        </div>

        <p className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-left text-sm font-medium text-amber-800 dark:text-amber-200">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          Ini simulasi. Tidak ada pembayaran yang diproses, dan eBook atau Premium belum aktif di akunmu.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/ebooks"
            className="inline-flex min-h-11 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"
          >
            Lihat eBook
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center rounded-xl border border-border px-4 text-sm font-medium hover:bg-accent"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
