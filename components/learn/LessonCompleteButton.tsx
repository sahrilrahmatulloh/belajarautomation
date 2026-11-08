"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { CheckCircle2, ChevronsDown } from "lucide-react";

import { completeLessonAction } from "@/app/learn/actions";
import { XP_PER_COURSE_COMPLETION, XP_PER_LESSON } from "@/data/xp";
import { completeLesson, useLessonProgress } from "@/lib/lessonProgress";
import { notify } from "@/lib/notify";
import { refreshRealProgress, useIsRealAccount } from "@/lib/realProgress";
import { useSession } from "@/lib/session";

// Hanya tampil pada lesson yang sudah punya isi, agar progres dan XP tidak tercatat dari materi
// yang belum bisa dipelajari. Tombol baru aktif setelah pengguna menggulir sampai akhir isi
// lesson (PRD FR-05: menyelesaikan materi sesuai aturan).
export default function LessonCompleteButton({ courseSlug, lessonSlug }: { courseSlug: string; lessonSlug: string }) {
  const session = useSession();
  const isReal = useIsRealAccount();
  const { isCompleted, finishedCourses } = useLessonProgress();
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const [courseBonusEarned, setCourseBonusEarned] = useState(false);
  const [isPending, startTransition] = useTransition();
  const endMarker = useRef<HTMLDivElement>(null);

  // Penanda akhir isi lesson; tombol aktif setelah penanda ini terlihat di layar.
  useEffect(() => {
    const marker = endMarker.current;
    if (!marker || hasReachedEnd) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) setHasReachedEnd(true);
    });
    observer.observe(marker);
    return () => observer.disconnect();
  }, [hasReachedEnd]);

  if (!session) return null;

  if (isCompleted(courseSlug, lessonSlug)) {
    const bonus = courseBonusEarned || finishedCourses.includes(courseSlug);
    return (
      <div role="status" className="flex items-center gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
        <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />
        {bonus ? `Lesson selesai. Course tuntas, bonus +${XP_PER_COURSE_COMPLETION} XP!` : "Lesson selesai."}
      </div>
    );
  }

  const complete = () => {
    if (!isReal) {
      completeLesson(session.email, courseSlug, lessonSlug);
      return;
    }
    startTransition(async () => {
      const result = await completeLessonAction(courseSlug, lessonSlug);
      if (!result.ok) {
        notify.error(result.message);
        return;
      }
      setCourseBonusEarned(result.courseBonus);
      await refreshRealProgress();
      if (result.xpAwarded > 0) {
        notify.success(
          result.courseBonus
            ? `Lesson selesai, +${result.xpAwarded} XP termasuk bonus course tuntas.`
            : `Lesson selesai, +${result.xpAwarded} XP.`
        );
      }
    });
  };

  const isDisabled = !hasReachedEnd || isPending;

  return (
    <div className="space-y-2">
      {/* Penanda akhir isi lesson. */}
      <div ref={endMarker} aria-hidden="true" className="h-px w-full" />
      <button
        type="button"
        onClick={complete}
        disabled={isDisabled}
        aria-describedby={hasReachedEnd ? undefined : "lesson-complete-hint"}
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
        {isPending ? "Menyimpan..." : `Tandai selesai (+${XP_PER_LESSON} XP)`}
      </button>
      {!hasReachedEnd && (
        <p id="lesson-complete-hint" className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <ChevronsDown className="h-3.5 w-3.5" aria-hidden="true" />
          Gulir sampai akhir materi untuk menandai lesson selesai.
        </p>
      )}
    </div>
  );
}
