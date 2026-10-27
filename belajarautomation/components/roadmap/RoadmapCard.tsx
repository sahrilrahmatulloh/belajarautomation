import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  Layers3,
  Lock,
} from "lucide-react";

import { Roadmap } from "@/types/Roadmap";

interface RoadmapCardProps {
  roadmap: Roadmap;
}

export default function RoadmapCard({
  roadmap,
}: RoadmapCardProps) {
  const Icon = roadmap.icon;
  const isComingSoon = roadmap.status === "coming-soon";

  return (
    <article
      className={`
        relative flex min-h-[320px] flex-col overflow-hidden
        rounded-3xl border bg-card p-6 text-card-foreground
        transition-all duration-300
        ${
          isComingSoon
            ? "opacity-70"
            : "hover:-translate-y-1 hover:shadow-lg"
        }
      `}
    >
      {/* Badge */}
      <div className="absolute right-5 top-5">
        {roadmap.featured && (
          <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
            Recommended
          </span>
        )}

        {isComingSoon && (
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            Coming Soon
          </span>
        )}
      </div>

      {/* Icon */}
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
        <Icon className="h-6 w-6" />
      </div>

      {/* Content */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold">
          {roadmap.title}
        </h3>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {roadmap.description}
        </p>
      </div>

      {/* Information */}
      <div className="mt-6 flex flex-wrap gap-2">
        <span className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium">
          {roadmap.level}
        </span>

        {!isComingSoon && (
          <>
            <span className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-medium">
              <Layers3 className="h-3.5 w-3.5" />
              {roadmap.modules} Modul
            </span>

            <span className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-medium">
              <Clock3 className="h-3.5 w-3.5" />
              {roadmap.duration}
            </span>
          </>
        )}
      </div>

      {/* Action */}
      <div className="mt-auto pt-7">
        {isComingSoon ? (
          <button
            type="button"
            disabled
            className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border py-3 text-sm font-medium text-muted-foreground"
          >
            <Lock className="h-4 w-4" />
            Coming Soon
          </button>
        ) : (
          <Link
            href={`/roadmap/${roadmap.id}`}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Lihat Roadmap
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </article>
  );
}