import { Timer } from "lucide-react";

import { formatRemaining } from "@/lib/challengeTimer";

// Sisa waktu pengerjaan latihan (PRD FR-04). Menempel di bawah navbar agar tetap terlihat
// saat halaman digulir.
export default function ChallengeTimer({ remaining, limitMinutes, isPaused }: { remaining: number; limitMinutes: number; isPaused: boolean }) {
  const isLow = remaining <= 60 * 1000;

  return (
    <div
      className={`sticky top-[4.5rem] z-20 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-2xl border px-4 py-2.5 shadow-sm backdrop-blur ${
        isLow ? "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950" : "border-border bg-card/95"
      }`}
    >
      <p role="timer" className={`flex items-center gap-2 text-sm font-semibold ${isLow ? "text-red-700 dark:text-red-300" : ""}`}>
        <Timer className="h-4 w-4 shrink-0" aria-hidden="true" />
        Sisa waktu <span className="font-mono text-base tabular-nums">{formatRemaining(remaining)}</span>
        {isPaused && <span className="text-xs font-medium">(berhenti selama maintenance)</span>}
      </p>
      <p className={`text-xs ${isLow ? "text-red-800 dark:text-red-200" : "text-muted-foreground"}`}>
        Batas {limitMinutes} menit. Jawaban terkirim otomatis saat waktu habis.
      </p>
    </div>
  );
}
