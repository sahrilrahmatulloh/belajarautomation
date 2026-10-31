import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";

import { RoadmapStep } from "@/types/Roadmap";

interface RoadmapNodeProps {
  step: RoadmapStep;
  index: number;
  isLast: boolean;
  prerequisiteTitles: string[];
  // Diisi hanya jika course-nya benar-benar tersedia di /learn.
  courseHref?: string;
}

export default function RoadmapNode({
  step,
  index,
  isLast,
  prerequisiteTitles,
  courseHref,
}: RoadmapNodeProps) {
  const Icon = step.icon;
  const isLeft = index % 2 === 0;

  return (
    <li className="relative grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 md:grid-cols-[minmax(0,1fr)_3rem_minmax(0,1fr)] md:gap-x-8">
      {/* Garis penghubung ke node berikutnya */}
      {!isLast && (
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-5 top-5 w-0.5 -translate-x-1/2 bg-border md:left-1/2 md:top-6"
        />
      )}

      {/* Node */}
      <div className="col-start-1 row-start-1 flex justify-center md:col-start-2">
        <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary bg-background text-primary md:h-12 md:w-12">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>

      {/* Konten */}
      <div
        className={`col-start-2 row-start-1 flex flex-col pb-10 ${
          isLeft
            ? "md:col-start-1 md:items-end md:text-right"
            : "md:col-start-3"
        }`}
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          Langkah {index + 1}
        </p>

        <h3 className="mt-1 text-lg font-semibold">
          {step.title}
        </h3>

        <p className="mt-1 max-w-md text-sm leading-6 text-muted-foreground">
          {step.description}
        </p>

        {prerequisiteTitles.length > 0 && (
          <p className="mt-2 text-xs text-muted-foreground">
            Prasyarat: {prerequisiteTitles.join(", ")}
          </p>
        )}

        {courseHref ? (
          <Link
            href={courseHref}
            className="mt-3 inline-flex min-h-9 w-fit items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-sm font-medium transition-colors hover:bg-accent"
          >
            Lihat Materi
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        ) : (
          <span className="mt-3 inline-flex min-h-9 w-fit cursor-not-allowed items-center gap-1.5 rounded-lg border border-dashed border-border px-3 text-sm text-muted-foreground">
            <Clock3 className="h-4 w-4" aria-hidden="true" />
            Materi segera hadir
          </span>
        )}
      </div>
    </li>
  );
}
