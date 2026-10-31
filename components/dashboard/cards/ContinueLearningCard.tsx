import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, Clock3, Layers3 } from "lucide-react";

import { COURSES } from "@/data/courses";
import { COURSE_DETAILS } from "@/data/courseDetails";

function formatDuration(minutes: number) {
  if (!minutes) return "Durasi belum tersedia";
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours && remainingMinutes) return `${hours} jam ${remainingMinutes} menit`;
  if (hours) return `${hours} jam`;
  return `${minutes} menit`;
}

export default function ContinueLearningCard() {
  const course = COURSES.find((item) => item.slug === "qa-fundamentals") ?? COURSES[0];
  if (!course) return null;

  const detail = COURSE_DETAILS.find((item) => item.courseSlug === course.slug);
  const modules = detail?.modules ?? [];
  const totalMinutes = modules
    .flatMap((module) => module.lessons)
    .reduce((total, lesson) => total + (Number.parseInt(lesson.duration, 10) || 0), 0);
  const Icon = course.icon;

  return (
    <section aria-labelledby="continue-learning-title" className="space-y-2.5">
      <div>
        <h2 id="continue-learning-title" className="text-lg font-bold sm:text-xl">
          Lanjutkan Belajar
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
          Belum ada progres tersimpan. Materi ini bisa menjadi langkah awal.
        </p>
      </div>

      <article className="grid overflow-hidden rounded-xl border border-border bg-card shadow-sm md:grid-cols-[minmax(190px,0.75fr)_minmax(0,1.5fr)]">
        <div className="relative flex min-h-32 flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-4 text-white md:min-h-full">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-12 h-40 w-28 rotate-45 rounded-3xl border border-white/20 bg-white/10"
          />
          <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-white/15 backdrop-blur-sm">
            <Icon className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="relative mt-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-100">
              {course.category}
            </span>
            <p className="mt-1 text-xl font-bold">{course.title}</p>
          </div>
        </div>

        <div className="flex min-w-0 flex-col p-4">
          <span className="w-fit rounded-full bg-brand-sky/10 px-2 py-0.5 text-[11px] font-semibold text-brand-sky">
            Rekomendasi awal
          </span>
          <h3 className="mt-2 text-lg font-bold">{course.title}</h3>
          <p className="mt-1.5 line-clamp-2 text-sm leading-5 text-muted-foreground">
            {detail?.overview ?? course.description}
          </p>

          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Layers3 className="h-3.5 w-3.5 text-brand-blue" aria-hidden="true" />
              {modules.length || "—"} modul
            </span>
            <span className="inline-flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-brand-sky" aria-hidden="true" />
              {course.lessons} materi
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5 text-brand-cyan" aria-hidden="true" />
              {formatDuration(totalMinutes)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
              {course.level}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
            <p className="text-xs text-muted-foreground">Progress belum dicatat</p>
            <Link
              href={`/learn/${course.slug}`}
              className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:text-sm"
            >
              Buka kursus <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </article>
    </section>
  );
}
