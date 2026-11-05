"use client";

import { CheckCircle2 } from "lucide-react";

import { XP_PER_COURSE_COMPLETION, XP_PER_LESSON } from "@/data/xp";
import { completeLesson, useLessonProgress } from "@/lib/lessonProgress";
import { useSession } from "@/lib/session";

// Hanya tampil pada lesson yang sudah punya isi, agar progres dan XP tidak tercatat dari materi
// yang belum bisa dipelajari.
export default function LessonCompleteButton({ courseSlug, lessonSlug }: { courseSlug: string; lessonSlug: string }) {
  const session = useSession();
  const { isCompleted, finishedCourses } = useLessonProgress();

  if (!session) return null;

  if (isCompleted(courseSlug, lessonSlug)) {
    return (
      <div role="status" className="flex items-center gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
        <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />
        {finishedCourses.includes(courseSlug) ? `Lesson selesai. Course tuntas, bonus +${XP_PER_COURSE_COMPLETION} XP!` : "Lesson selesai."}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => completeLesson(session.email, courseSlug, lessonSlug)}
      className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover sm:w-auto"
    >
      <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
      Tandai selesai (+{XP_PER_LESSON} XP)
    </button>
  );
}
