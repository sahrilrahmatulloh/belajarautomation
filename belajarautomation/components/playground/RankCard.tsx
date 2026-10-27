import { Shield, Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function RankCard() {
  const currentRP = 1240;
  const nextRankRP = 1500;

  const progress = (currentRP / nextRankRP) * 100;
  const remainingRP = nextRankRP - currentRP;

  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10">
            <Shield className="h-7 w-7 text-violet-600 dark:text-violet-400" />
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Playground Rank
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              Bug Hunter II
            </h2>
          </div>
        </div>

        <div className="w-full md:max-w-md">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 font-medium">
              <Trophy className="h-4 w-4 text-violet-500" />
              {currentRP.toLocaleString("id-ID")} RP
            </span>

            <span className="text-muted-foreground">
              {remainingRP} RP menuju Bug Hunter I
            </span>
          </div>

          <Progress
            value={progress}
            className="mt-3"
          />
        </div>
      </div>
    </section>
  );
}