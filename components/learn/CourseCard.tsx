import Link from "next/link";

import ContentCover from "@/components/common/ContentCover";
import { BookOpen, Clock3, Code2 } from "lucide-react";

import { Course } from "@/types/Course";
import { Progress } from "@/components/ui/progress";

interface CourseCardProps {
  course: Course;
}

const categoryAccents: Record<string, { surface: string; icon: string; badge: string }> = {
  Fundamental: {
    surface: "bg-brand-cyan/10",
    icon: "text-brand-cyan",
    badge: "bg-brand-cyan/10 text-brand-cyan",
  },
  "Manual Testing": {
    surface: "bg-brand-sky/10",
    icon: "text-brand-sky",
    badge: "bg-brand-sky/10 text-brand-sky",
  },
  "Web Automation": {
    surface: "bg-brand-blue/10",
    icon: "text-brand-blue",
    badge: "bg-brand-blue/10 text-brand-blue",
  },
  "Mobile Testing": {
    surface: "bg-brand-indigo/10",
    icon: "text-brand-indigo",
    badge: "bg-brand-indigo/10 text-brand-indigo",
  },
  AI: {
    surface: "bg-brand-indigo/10",
    icon: "text-brand-indigo",
    badge: "bg-brand-indigo/10 text-brand-indigo",
  },
  "Low-Code": {
    surface: "bg-brand-sky/10",
    icon: "text-brand-sky",
    badge: "bg-brand-sky/10 text-brand-sky",
  },
  "API Testing": {
    surface: "bg-brand-cyan/10",
    icon: "text-brand-cyan",
    badge: "bg-brand-cyan/10 text-brand-cyan",
  },
  "Performance Testing": {
    surface: "bg-brand-sky/10",
    icon: "text-brand-sky",
    badge: "bg-brand-sky/10 text-brand-sky",
  },
  "Security Testing": {
    surface: "bg-brand-blue/10",
    icon: "text-brand-blue",
    badge: "bg-brand-blue/10 text-brand-blue",
  },
  Programming: {
    surface: "bg-brand-indigo/10",
    icon: "text-brand-indigo",
    badge: "bg-brand-indigo/10 text-brand-indigo",
  },
};

export default function CourseCard({
  course,
}: CourseCardProps) {
  const accent = categoryAccents[course.category] ?? categoryAccents.Fundamental;
  const isComingSoon = course.availability === "coming-soon";

  return (
    <Link
      href={`/learn/${course.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-150 hover:border-primary/30 hover:shadow-md"
    >
      <div className="relative aspect-video w-full overflow-hidden border-b border-border bg-muted">
        <ContentCover
          src={course.cover}
          title={course.title}
          category={course.category}
          kind="course"
          alt={`Sampul course ${course.title}`}
          sizes="(min-width: 1536px) 18vw, (min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
        />

        {isComingSoon && (
          <span className="absolute right-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm backdrop-blur-sm">
            Segera hadir
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-medium ${accent.badge}`}>
          {course.category}
        </span>

        <h2 className="mt-5 text-lg font-semibold text-card-foreground">
          {course.title}
        </h2>

        <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
          {course.description}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <span className="rounded-full bg-muted px-2.5 py-1">{course.level}</span>

          {course.language && (
            <span className="flex items-center gap-1">
              <Code2 className="h-3.5 w-3.5" />
              {course.language}
            </span>
          )}

          {course.availability === "available" && (
            <>
              <span className="flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5" />
                {course.lessons} Lessons
              </span>

              <span className="flex items-center gap-1">
                <Clock3 className="h-3.5 w-3.5" />
                {course.estimatedDuration}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="border-t border-border bg-muted/30 px-5 py-3">
        <div className="flex items-center justify-between gap-4">
          {isComingSoon ? (
            <span className="font-medium text-muted-foreground">
              Materi sedang disiapkan
            </span>
          ) : (
            <span className="font-medium text-green-600 dark:text-green-400">
              Gratis
            </span>
          )}

          {!isComingSoon && course.progress !== undefined ? (
            <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
              <Progress
                value={course.progress}
                className="max-w-24"
              />

              <span className="text-xs text-muted-foreground">
                {course.progress}%
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
