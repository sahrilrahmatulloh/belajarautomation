import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Layers3,
  Lock,
} from "lucide-react";

import ContentCover from "@/components/common/ContentCover";
import { getRoadmapCourseStats } from "@/lib/roadmap";
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
  const stats = getRoadmapCourseStats(roadmap);
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
      <div className="absolute right-4 top-4 z-10">
        {roadmap.featured && (
          <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
            Recommended
          </span>
        )}

        {isComingSoon && (
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            Coming Soon
          </span>
        )}
      </div>

      {/* Sampul: gambar persegi ditampilkan utuh */}
      <div className="relative -mx-5 -mt-5 mb-5 aspect-[4/3] overflow-hidden border-b border-border bg-muted sm:-mx-6 sm:-mt-6 sm:mb-6">
        <ContentCover
          src={roadmap.cover}
          title={roadmap.title}
          category={roadmap.level}
          kind="roadmap"
          alt={`Sampul roadmap ${roadmap.title}`}
          fit="contain"
          sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
        />
      </div>

      {/* Content */}
      <div className="flex items-start gap-3">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${accent.surface}`}>
          <Icon className={`h-5 w-5 ${accent.icon}`} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h3 className="text-xl font-semibold">
            {roadmap.title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {roadmap.description}
          </p>
        </div>
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
              {stats.total} course
            </span>

            <span className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-medium">
              <Clock3 className="h-3.5 w-3.5" />
              {roadmap.duration}
            </span>
          </>
        )}
      </div>

      {!isComingSoon && (
        <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
          <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" />
          {stats.available} dari {stats.total} course tersedia
        </p>
      )}

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
