import Link from "next/link";
import { ClipboardList, GraduationCap, Lock, Newspaper } from "lucide-react";

import PrototypeNotice from "./PrototypeNotice";

const LOCKED_TYPES = [
  { title: "Lesson", description: "Tersedia setelah sistem konten lesson siap.", icon: GraduationCap },
  { title: "Soal", description: "Tahap terakhir, karena memuat kunci jawaban.", icon: ClipboardList },
];

// Langkah 1 Buat Konten: pilih jenis konten (PRD FR-15).
export default function ContentTypePage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-5">
      <PrototypeNotice />

      <header>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Buat Konten</h1>
        <p className="mt-1 text-muted-foreground">Pilih jenis konten yang ingin kamu tulis.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/creator/buat/artikel" className="rounded-2xl border border-primary/40 bg-card p-5 transition-shadow hover:shadow-md">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary-accent">
            <Newspaper className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="mt-3 block font-semibold">Artikel</span>
          <span className="mt-1 block text-sm text-muted-foreground">Tulis artikel untuk halaman Blog.</span>
        </Link>

        {LOCKED_TYPES.map(({ title, description, icon: Icon }) => (
          <div key={title} aria-disabled="true" className="rounded-2xl border border-border bg-muted/30 p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-muted-foreground">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="mt-3 flex flex-wrap items-center gap-1.5 font-semibold">
              {title}
              <Lock className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">Segera hadir</span>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
