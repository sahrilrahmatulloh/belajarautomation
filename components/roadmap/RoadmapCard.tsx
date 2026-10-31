import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  Layers3,
  Lock,
} from "lucide-react";

import { Roadmap } from "@/types/Roadmap";

const roadmapAccents: Record<string, { surface: string; icon: string; badge: string }> = {
  fundamental: {
    surface: "bg-brand-blue/10",
    icon: "text-brand-blue",
    badge: "bg-brand-blue/10 text-brand-blue",
  },
  "qa-manual-engineer": {
    surface: "bg-brand-sky/10",
    icon: "text-brand-sky",
    badge: "bg-brand-sky/10 text-brand-sky",
  },
  "qa-automation-web": {
    surface: "bg-brand-blue/10",
    icon: "text-brand-blue",
    badge: "bg-brand-blue/10 text-brand-blue",
  },
  "qa-automation-mobile": {
    surface: "bg-brand-cyan/10",
    icon: "text-brand-cyan",
    badge: "bg-brand-cyan/10 text-brand-cyan",
  },
  "api-test-engineer": {
    surface: "bg-brand-sky/10",
    icon: "text-brand-sky",
    badge: "bg-brand-sky/10 text-brand-sky",
  },
  programming: {
    surface: "bg-brand-indigo/10",
    icon: "text-brand-indigo",
    badge: "bg-brand-indigo/10 text-brand-indigo",
  },
};

interface RoadmapCardProps {
  roadmap: Roadmap;
}

export default function RoadmapCard({
  roadmap,
}: RoadmapCardProps) {
  const Icon = roadmap.icon;
  const isComingSoon = roadmap.status === "coming-soon";
  const accent = roadmapAccents[roadmap.id] ?? roadmapAccents.fundamental;

  return (
    <article
      className={`
        relative flex min-h-[320px] flex-col overflow-hidden
        rounded-2xl border bg-card p-5 text-card-foreground
        transition-all duration-150 sm:p-6
        ${
          isComingSoon
            ? "opacity-70"
            : "hover:border-primary/30 hover:shadow-md"
        }
      `}
    >
      {/* Badge */}
      <div className="absolute right-5 top-5">
        {roadmap.featured && (
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${accent.badge}`}>
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
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accent.surface}`}>
        <Icon className={`h-6 w-6 ${accent.icon}`} />
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
              {roadmap.steps.length} Langkah
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
