import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Course } from "@/types/Course";

// Badge bersama untuk node course di timeline maupun di dalam cabang.
export function RoadmapCourseBadges({
  course,
  optional,
}: {
  course: Course;
  optional?: boolean;
}) {
  if (!optional && course.availability === "available") {
    return null;
  }

  return (
    <span className="flex flex-wrap gap-1.5">
      {optional && (
        <span className="rounded-full border border-dashed border-muted-foreground/50 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
          Opsional
        </span>
      )}
      {course.availability === "coming-soon" && (
        <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
          Segera hadir
        </span>
      )}
    </span>
  );
}

export function LihatMateriLink({
  course,
  size = "default",
}: {
  course: Course;
  size?: "default" | "sm";
}) {
  return (
    <Link
      href={`/learn/${course.slug}`}
      aria-label={`Lihat materi ${course.title}`}
      className={`inline-flex w-fit items-center gap-1.5 rounded-lg border border-border bg-card font-medium transition-colors hover:bg-accent ${
        size === "sm" ? "min-h-8 px-2.5 text-xs" : "min-h-9 px-3 text-sm"
      }`}
    >
      Lihat Materi
      <ArrowRight className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} aria-hidden="true" />
    </Link>
  );
}

interface RoadmapNodeProps {
  course: Course;
  step: number;
  optional?: boolean;
  isLast: boolean;
  // Garis ke node berikutnya putus-putus bila node berikutnya opsional.
  nextOptional: boolean;
}

export default function RoadmapNode({
  course,
  step,
  optional,
  isLast,
  nextOptional,
}: RoadmapNodeProps) {
  const Icon = course.icon;
  const isComingSoon = course.availability === "coming-soon";

  return (
    <li className="relative grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 pb-6">
      {!isLast && (
        <span
          aria-hidden="true"
          className={`absolute bottom-0 left-5 top-10 -translate-x-1/2 border-l-2 border-primary/40 ${
            nextOptional ? "border-dashed" : ""
          }`}
        />
      )}

      <div
        className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-background ${
          isComingSoon || optional
            ? "border-dashed border-muted-foreground/50 text-muted-foreground"
            : "border-primary text-primary-accent"
        }`}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>

      <div className="min-w-0 rounded-2xl border border-border bg-card p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary-accent">
            Langkah {step}
          </span>
          <RoadmapCourseBadges course={course} optional={optional} />
        </div>

        <h3 className="mt-1 text-base font-semibold sm:text-lg">
          {course.title}
        </h3>

        <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
          {course.description}
        </p>

        <div className="mt-3">
          <LihatMateriLink course={course} />
        </div>
      </div>
    </li>
  );
}
