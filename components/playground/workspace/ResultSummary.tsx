import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";

import { ACTIVE_AVATAR } from "@/data/dummy/appearance";
import { ChallengeScore } from "@/types/ChallengeDetail";

interface ResultSummaryProps {
  result: ChallengeScore;
  xp: number;
  // Rincian singkat, mis. "8 dari 10 jawaban benar".
  detail: string;
  onRetry: () => void;
}

export default function ResultSummary({ result, xp, detail, onRetry }: ResultSummaryProps) {
  const Icon = result.passed ? CheckCircle2 : XCircle;

  return (
    <section
      aria-label="Hasil latihan"
      className={`flex flex-wrap items-center gap-4 rounded-2xl border p-4 sm:p-5 ${
        result.passed ? "border-emerald-500/30 bg-emerald-500/10" : "border-amber-500/30 bg-amber-500/10"
      }`}
    >
      <Image src={ACTIVE_AVATAR.image} alt="" width={64} height={64} className="h-16 w-16 shrink-0" />

      <div className="min-w-0 flex-1 basis-48">
        <h2
          className={`flex items-center gap-1.5 text-xl font-bold ${
            result.passed ? "text-emerald-700 dark:text-emerald-300" : "text-amber-800 dark:text-amber-300"
          }`}
        >
          <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
          {result.passed ? "Lulus" : "Belum lulus"}
        </h2>
        <p className="mt-1 text-sm font-semibold">Skor {result.score}%</p>
        <p className="mt-0.5 text-sm text-muted-foreground">{detail}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {xp > 0
            ? `Kamu mendapat +${xp} XP.`
            : result.passed
              ? "Tidak ada XP tambahan karena kamu sudah pernah lulus."
              : "XP diberikan saat kamu lulus untuk pertama kalinya."}
        </p>
      </div>

      <div className="flex w-full flex-wrap gap-2 sm:w-auto">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:flex-none"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Ulangi latihan
        </button>
        <Link
          href="/playground"
          className="inline-flex min-h-10 flex-1 items-center justify-center rounded-xl border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-accent sm:flex-none"
        >
          Daftar latihan
        </Link>
      </div>
    </section>
  );
}
