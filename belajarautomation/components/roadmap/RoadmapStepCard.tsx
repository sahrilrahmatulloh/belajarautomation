import {
  Check,
  Lock,
  Play,
} from "lucide-react";

import { RoadmapStep } from "@/types/RoadmapDetail";

interface RoadmapStepCardProps {
  step: RoadmapStep;
}

export default function RoadmapStepCard({
  step,
}: RoadmapStepCardProps) {
  const Icon = step.icon;

  return (
    <div
      className={`rounded-2xl border p-5 ${
        step.status === "current"
          ? "border-primary bg-primary/5"
          : "border-border bg-card"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted">
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold">
              {step.title}
            </h3>

            {step.status === "completed" && (
              <Check className="h-5 w-5 text-green-500" />
            )}

            {step.status === "current" && (
              <Play className="h-5 w-5" />
            )}

            {step.status === "locked" && (
              <Lock className="h-4 w-4 text-muted-foreground" />
            )}
          </div>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {step.description}
          </p>
        </div>
      </div>
    </div>
  );
}