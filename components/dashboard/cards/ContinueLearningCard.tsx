import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

export default function ContinueLearningCard() {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 text-card-foreground shadow-sm transition hover:shadow-md">
      <div className="flex items-center gap-2">
        <BookOpen
          className="text-blue-600 dark:text-blue-400"
          size={20}
        />

        <h2 className="text-lg font-semibold">
          Mulai belajar
        </h2>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-bold">
          QA Fundamentals
        </h3>

        <p className="mt-2 text-sm text-muted-foreground">
          Kenali dasar Quality Assurance, proses pengembangan perangkat lunak,
          dan fundamental testing sebelum masuk ke automation.
        </p>
      </div>

      <Link href="/learn/qa-fundamentals" className="mt-auto flex w-full items-center justify-between rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:opacity-90">
        Lihat materi <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
