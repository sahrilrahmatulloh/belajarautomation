"use client";

import Link from "next/link";

import { useCoursesInProgress } from "@/lib/lessonProgress";

export default function LearningProgress() {
  const courses = useCoursesInProgress();

  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      <h2 className="text-xl font-bold">Progres Belajar</h2>
      <p className="mt-1 text-sm text-muted-foreground">Course yang sedang kamu pelajari.</p>

      <ul className="mt-4 space-y-4">
        {courses.map(({ course, completedLessons, totalLessons, percent }) => (
          <li key={course.slug}>
            <div className="flex items-baseline justify-between gap-3">
              <Link href={`/learn/${course.slug}`} className="min-w-0 truncate text-sm font-semibold hover:text-primary-accent">
                {course.title}
              </Link>
              <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                {completedLessons} / {totalLessons} lesson
              </span>
            </div>
            <div
              role="progressbar"
              aria-label={`Progres ${course.title}`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percent}
              className="mt-2 h-2 overflow-hidden rounded-full bg-muted"
            >
              <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
