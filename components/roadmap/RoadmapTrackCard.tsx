import { CheckCircle2 } from "lucide-react";

import { RoadmapTrack } from "@/types/RoadmapDetail";

interface RoadmapTrackCardProps {
  track: RoadmapTrack;
}

export default function RoadmapTrackCard({
  track,
}: RoadmapTrackCardProps) {
  const Icon = track.icon;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/30 sm:p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
        <Icon className="h-6 w-6" />
      </div>

      <h3 className="mt-5 text-xl font-semibold">
        {track.title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {track.description}
      </p>

      <div className="mt-6 space-y-3">
        {track.steps.map((step) => (
          <div
            key={step}
            className="flex items-center gap-3 text-sm"
          >
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            {step}
          </div>
        ))}
      </div>

      <button
        type="button"
        disabled
        className="mt-6 w-full cursor-not-allowed rounded-xl border border-border py-3 text-sm font-medium text-muted-foreground opacity-60"
      >
        Pemilihan track belum tersedia
      </button>
    </div>
  );
}
