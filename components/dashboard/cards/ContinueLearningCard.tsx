import Link from "next/link";
import { ArrowRight, BookOpen, CalendarClock, Layers3 } from "lucide-react";

import ContentCover from "@/components/common/ContentCover";
import { formatDate } from "@/lib/format";
import { CourseInProgress, getCoursesInProgress } from "@/lib/learningProgress";

function ProgressBar({ percent, label }: { percent: number; label: string }) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      className="h-2 w-full overflow-hidden rounded-full bg-muted"
    >
      <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
    </div>
  );
}

function lastOpenedLabel(item: CourseInProgress) {
  return `Terakhir dibuka ${formatDate(item.lastOpenedAt.slice(0, 10))}`;
}

function OtherCourseItem({ item }: { item: CourseInProgress }) {
  const { course } = item;

  return (
    <li>
      <Link
        href={`/learn/${course.slug}`}
        className="flex items-center gap-3 rounded-xl border border-border bg-card p-2.5 shadow-sm transition-colors hover:border-primary/40 hover:bg-primary/[0.03]"
      >
        <div className="relative aspect-video w-24 shrink-0 overflow-hidden rounded-lg bg-muted sm:w-28">
          <ContentCover
            src={course.cover}
            title={course.title}
            category={course.category}
            kind="course"
            alt={`Sampul course ${course.title}`}
            sizes="112px"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{course.title}</p>
          <p className="truncate text-xs text-muted-foreground">
            {item.lastLesson.title}
          </p>
          <div className="mt-1.5 flex items-center gap-2">
            <ProgressBar percent={item.percent} label={`Progres ${course.title}`} />
            <span className="shrink-0 text-[11px] font-semibold text-muted-foreground">
              {item.percent}%
            </span>
          </div>
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      </Link>
    </li>
  );
}

export default function ContinueLearningCard() {
  const [current, ...others] = getCoursesInProgress();

  return (
    <section aria-labelledby="continue-learning-title" className="space-y-2.5">
      <div>
        <h2 id="continue-learning-title" className="text-lg font-bold sm:text-xl">
          Lanjutkan Belajar
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
          {current
            ? "Lanjutkan dari materi terakhir yang kamu buka."
            : "Mulai belajar untuk melihat progresmu di sini."}
        </p>
      </div>

      {current ? (
        <>
          <article className="grid overflow-hidden rounded-xl border border-border bg-card shadow-sm md:grid-cols-[minmax(220px,0.9fr)_minmax(0,1.4fr)]">
            <div className="relative aspect-video overflow-hidden bg-muted md:aspect-auto md:min-h-full">
              <ContentCover
                src={current.course.cover}
                title={current.course.title}
                category={current.course.category}
                kind="course"
                alt={`Sampul course ${current.course.title}`}
                sizes="(max-width: 768px) 100vw, 360px"
              />
            </div>

            <div className="flex min-w-0 flex-col p-4">
              <span className="w-fit rounded-full bg-brand-sky/10 px-2 py-0.5 text-[11px] font-semibold text-brand-sky">
                {current.course.category}
              </span>
              <h3 className="mt-2 text-lg font-bold">{current.course.title}</h3>

              <div className="mt-2 space-y-1.5 text-xs text-muted-foreground sm:text-sm">
                <p className="flex items-start gap-1.5">
                  <BookOpen className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-blue" aria-hidden="true" />
                  <span>
                    Lesson terakhir:{" "}
                    <span className="font-medium text-foreground">
                      {current.lastLesson.title}
                    </span>
                  </span>
                </p>
                <p className="flex items-center gap-1.5">
                  <CalendarClock className="h-3.5 w-3.5 shrink-0 text-brand-cyan" aria-hidden="true" />
                  {lastOpenedLabel(current)}
                </p>
              </div>

              <div className="mt-4">
                <div className="mb-1.5 flex items-baseline justify-between gap-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <Layers3 className="h-3.5 w-3.5" aria-hidden="true" />
                    {current.completedLessons} dari {current.totalLessons} lesson
                  </span>
                  <span className="text-sm font-bold text-primary">{current.percent}%</span>
                </div>
                <ProgressBar
                  percent={current.percent}
                  label={`Progres ${current.course.title}`}
                />
              </div>

              <div className="mt-4 flex justify-end border-t border-border pt-3">
                <Link
                  href={`/learn/${current.course.slug}`}
                  className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:text-sm"
                >
                  Lanjutkan <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </article>

          {others.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
                Juga sedang dipelajari
              </h3>
              <ul className="grid gap-2.5 sm:grid-cols-2">
                {others.map((item) => (
                  <OtherCourseItem key={item.course.slug} item={item} />
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-card px-4 py-8 text-center">
          <BookOpen className="h-7 w-7 text-primary" aria-hidden="true" />
          <p className="mt-3 font-semibold">Belum ada materi yang sedang dipelajari</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Pilih course pertamamu di Learning Center.
          </p>
          <Link
            href="/learn"
            className="mt-4 inline-flex min-h-9 items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Jelajahi course <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      )}
    </section>
  );
}
