import { Flame } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function ProgressCard() {
  const progress = 67;

  return (
    <div className="rounded-3xl border border-border bg-card p-6 text-card-foreground shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Progress Belajar
        </h2>

        <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
          {progress}%
        </span>
      </div>

      <Progress value={progress} className="mt-6" />

      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-2">
          <Flame className="text-orange-500" size={18} />

          <p className="text-sm">
            7 Hari Belajar Berturut-turut
          </p>
        </div>

        <p className="text-sm text-muted-foreground">
          Level 8 QA Explorer
        </p>

        <p className="text-xs text-muted-foreground">
          +12 XP menuju Level 9
        </p>
      </div>
    </div>
  );
}