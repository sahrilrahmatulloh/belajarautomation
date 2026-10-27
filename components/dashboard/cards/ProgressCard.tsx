import Link from "next/link";
import { ArrowRight, BookOpenCheck } from "lucide-react";

export default function ProgressCard() {
  return (
    <div className="h-full rounded-3xl border border-border bg-card p-6 text-card-foreground shadow-sm">
      <BookOpenCheck className="h-5 w-5 text-primary" aria-hidden="true" />
      <h2 className="mt-4 text-lg font-semibold">Progres belajar</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Pelacakan progres akun belum tersedia. Kamu tetap bisa membuka materi
        dan melanjutkan belajar dari daftar kursus.
      </p>
      <Link href="/learn" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
        Jelajahi materi <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
