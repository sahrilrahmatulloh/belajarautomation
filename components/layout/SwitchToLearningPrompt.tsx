"use client";

import Link from "next/link";
import { GraduationCap } from "lucide-react";

import { useSession } from "@/lib/session";
import { useViewMode, viewModeActions } from "@/lib/viewMode";

// Tampil saat halaman khusus pelajar dibuka dari mode peran (PRD FR-15).
export default function SwitchToLearningPrompt() {
  const session = useSession();
  const { home } = useViewMode();

  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary-accent">
        <GraduationCap className="h-7 w-7" aria-hidden="true" />
      </span>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">Halaman ini untuk Mode Belajar</h1>
      <p className="mt-2 text-muted-foreground">
        Materi, latihan, keranjang, membership, dan leaderboard tersedia di Mode Belajar. Kamu bisa kembali ke mode
        peranmu kapan saja lewat menu profil.
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => session && viewModeActions.switchToLearning(session.email)}
          className="inline-flex min-h-10 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          Beralih ke Mode Belajar
        </button>
        <Link
          href={home}
          className="inline-flex min-h-10 items-center rounded-xl border border-border px-4 text-sm font-semibold transition-colors hover:bg-accent"
        >
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
}
