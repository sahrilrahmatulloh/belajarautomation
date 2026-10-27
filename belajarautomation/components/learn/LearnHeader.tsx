import { BookOpen } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function LearnHeader() {
  const totalProgress = 24;

  return (
    <section className="flex flex-col gap-6 border-b border-border pb-8 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Belajar QA Automation
        </h1>

        <p className="mt-2 text-muted-foreground">
          Pilih teknologi dan skill yang ingin kamu kuasai.
        </p>
      </div>

      <div className="flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm lg:w-[360px]">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-muted">
          <BookOpen className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground">
            Total Progress
          </p>

          <div className="mt-1 flex items-center gap-4">
            <span className="text-xl font-bold">
              {totalProgress}%
            </span>

            <Progress
              value={totalProgress}
              className="flex-1"
            />
          </div>
        </div>
      </div>
    </section>
  );
}