import Link from "next/link";
import { BookOpen, Lock } from "lucide-react";

import { Course } from "@/types/Course";
import { Progress } from "@/components/ui/progress";

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({
  course,
}: CourseCardProps) {
  const Icon = course.icon;

  return (
    <Link
      href={`/learn/${course.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
    >
      <div className="flex flex-1 flex-col p-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <Icon className="h-7 w-7 text-primary" />
        </div>

        <h2 className="mt-5 text-lg font-semibold text-card-foreground">
          {course.title}
        </h2>

        <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
          {course.description}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span>{course.level}</span>

          <span className="flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            {course.lessons} Lessons
          </span>
        </div>
      </div>

      <div className="border-t border-border bg-muted/30 px-5 py-3">
        <div className="flex items-center justify-between gap-4">
          <span
            className={
              course.isPremium
                ? "font-medium text-violet-600 dark:text-violet-400"
                : "font-medium text-green-600 dark:text-green-400"
            }
          >
            {course.isPremium ? "Premium" : "Free"}
          </span>

          {course.progress !== undefined ? (
            <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
              <Progress
                value={course.progress}
                className="max-w-24"
              />

              <span className="text-xs text-muted-foreground">
                {course.progress}%
              </span>
            </div>
          ) : course.isPremium ? (
            <Lock className="h-4 w-4 text-violet-500" />
          ) : null}
        </div>
      </div>
    </Link>
  );
}