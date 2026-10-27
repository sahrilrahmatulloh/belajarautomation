import Link from "next/link";

import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock3,
  Lock,
  PlayCircle,
} from "lucide-react";

import { Course } from "@/types/Course";
import { CourseDetail } from "@/types/CourseDetail";

interface CourseDetailPageProps {
  course: Course;
  detail: CourseDetail;
}

export default function CourseDetailPage({
  course,
  detail,
}: CourseDetailPageProps) {
  const Icon = course.icon;

  const completedLessons = detail.modules
    .flatMap((module) => module.lessons)
    .filter((lesson) => lesson.isCompleted).length;

  const totalLessons = detail.modules
    .flatMap((module) => module.lessons).length;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <Link
        href="/learn"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Belajar
      </Link>

      {/* Course Header */}
      <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Icon className="h-7 w-7" />
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {course.category}
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-tight">
                {course.title}
              </h1>

              <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
                {detail.overview}
              </p>
            </div>
          </div>

          <span className="w-fit rounded-full bg-muted px-3 py-1.5 text-xs font-medium">
            {course.level}
          </span>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">
              Progress Course
            </span>

            <span className="text-muted-foreground">
              {completedLessons} / {totalLessons} materi
            </span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{
                width: `${
                  totalLessons > 0
                    ? (completedLessons / totalLessons) * 100
                    : 0
                }%`,
              }}
            />
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="space-y-5">
        <div>
          <h2 className="text-2xl font-bold">
            Course Content
          </h2>

          <p className="mt-1 text-muted-foreground">
            Pelajari materi secara bertahap dari fundamental hingga advanced.
          </p>
        </div>

        {detail.modules.map((module, moduleIndex) => (
          <div
            key={module.id}
            className="overflow-hidden rounded-3xl border border-border bg-card"
          >
            <div className="border-b border-border p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-sm font-bold">
                  {moduleIndex + 1}
                </div>

                <div>
                  <h3 className="font-semibold">
                    {module.title}
                  </h3>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {module.lessons.length} materi
                  </p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-border">
              {module.lessons.map((lesson) => {
                const lessonHref =
                  `/learn/${course.slug}/${lesson.slug}`;

                const content = (
                  <div className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-accent">
                    <div className="shrink-0">
                      {lesson.isCompleted ? (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      ) : lesson.isLocked ? (
                        <Lock className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <PlayCircle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">
                        {lesson.title}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock3 className="h-3.5 w-3.5" />
                      {lesson.duration}
                    </div>
                  </div>
                );

                if (lesson.isLocked) {
                  return (
                    <div key={lesson.id}>
                      {content}
                    </div>
                  );
                }

                return (
                  <Link
                    key={lesson.id}
                    href={lessonHref}
                  >
                    {content}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}