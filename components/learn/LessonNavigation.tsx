"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronsDown, Flag } from "lucide-react";

import { completeLessonAction } from "@/app/learn/actions";
import { XP_PER_COURSE_COMPLETION, XP_PER_LESSON } from "@/data/xp";
import { completeLesson, useLessonProgress } from "@/lib/lessonProgress";
import { notify } from "@/lib/notify";
import { refreshRealProgress, useIsRealAccount } from "@/lib/realProgress";
import { useSession } from "@/lib/session";

interface LessonLink {
  slug: string;
  title: string;
}

interface LessonNavigationProps {
  courseSlug: string;
  courseTitle: string;
  lessonSlug: string;
  total: number;
  previous: LessonLink | null;
  next: LessonLink | null;
  // Lesson yang belum ditulis tidak bisa diselesaikan, agar progres dan XP tidak tercatat dari
  // materi yang belum dipelajari.
  hasContent: boolean;
}

const navLinkClassName =
  "flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-accent";

// Navigasi lesson sekaligus penanda selesai (PRD FR-05): klik "Berikutnya" menandai lesson ini
// selesai, dan lesson terakhir diselesaikan dengan "Selesaikan course". Lesson hanya tercatat
// selesai bila isinya sudah digulir sampai akhir; navigasi tetap bisa dipakai kapan saja.
export default function LessonNavigation({ courseSlug, courseTitle, lessonSlug, total, previous, next, hasContent }: LessonNavigationProps) {
  const session = useSession();
  const router = useRouter();
  const isReal = useIsRealAccount();
  const { isCompleted, completedSlugs } = useLessonProgress();
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const [isPending, startTransition] = useTransition();
  const endMarker = useRef<HTMLDivElement>(null);
  const courseHref = `/learn/${courseSlug}`;

  const canComplete = hasContent && Boolean(session);
  const isDone = canComplete && isCompleted(courseSlug, lessonSlug);
  // Lesson terakhir yang menuntaskan course: semua lesson lain sudah selesai.
  const others = [...completedSlugs(courseSlug)].filter((slug) => slug !== lessonSlug).length;
  const finishesCourse = others >= total - 1;

  // Penanda akhir isi lesson.
  useEffect(() => {
    const marker = endMarker.current;
    if (!marker || hasReachedEnd) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) setHasReachedEnd(true);
    });
    observer.observe(marker);
    return () => observer.disconnect();
  }, [hasReachedEnd]);

  const shouldRecord = canComplete && !isDone && hasReachedEnd;

  // Mencatat lesson selesai. Akun demo dicatat di browser; akun sungguhan dicatat server.
  const record = async () => {
    if (!session) return;
    if (!isReal) {
      completeLesson(session.email, courseSlug, lessonSlug);
      notify.success(
        finishesCourse
          ? `Course ${courseTitle} tuntas! +${XP_PER_LESSON + XP_PER_COURSE_COMPLETION} XP termasuk bonus course.`
          : `Lesson selesai, +${XP_PER_LESSON} XP.`
      );
      return;
    }
    const result = await completeLessonAction(courseSlug, lessonSlug);
    if (!result.ok) {
      notify.error(result.message);
      return;
    }
    await refreshRealProgress();
    if (result.courseBonus) {
      notify.success(`Course ${courseTitle} tuntas! +${result.xpAwarded} XP termasuk bonus course.`);
    } else if (result.xpAwarded > 0) {
      notify.success(`Lesson selesai, +${result.xpAwarded} XP.`);
    }
  };

  // "Berikutnya": pindah lesson tanpa menunggu pencatatan selesai.
  const onNext = () => {
    if (shouldRecord) void record();
  };

  // "Selesaikan course": tunggu pencatatan, lalu kembali ke halaman course.
  const finish = () => {
    if (!shouldRecord) {
      router.push(courseHref);
      return;
    }
    startTransition(async () => {
      await record();
      router.push(courseHref);
    });
  };

  return (
    <div className="space-y-3">
      <div ref={endMarker} aria-hidden="true" className="h-px w-full" />

      {isDone && (
        <div role="status" className="flex items-center gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />
          Lesson selesai.
        </div>
      )}

      {canComplete && !isDone && !hasReachedEnd && (
        <p id="lesson-complete-hint" className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <ChevronsDown className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          Gulir sampai akhir materi agar lesson ini tercatat selesai.
        </p>
      )}

      <nav aria-label="Navigasi lesson" className="flex flex-col gap-3 sm:flex-row">
        {previous && (
          <Link href={`${courseHref}/${previous.slug}`} className={navLinkClassName}>
            <ArrowLeft className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <span className="min-w-0">
              <span className="block text-xs text-muted-foreground">Sebelumnya</span>
              <span className="block text-sm font-semibold">{previous.title}</span>
            </span>
          </Link>
        )}

        {next ? (
          <Link href={`${courseHref}/${next.slug}`} onClick={onNext} className={`${navLinkClassName} justify-end text-right`}>
            <span className="min-w-0">
              <span className="block text-xs text-muted-foreground">
                {canComplete && !isDone ? `Berikutnya (+${XP_PER_LESSON} XP)` : "Berikutnya"}
              </span>
              <span className="block text-sm font-semibold">{next.title}</span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          </Link>
        ) : canComplete && !isDone ? (
          <button
            type="button"
            onClick={finish}
            disabled={isPending}
            className="flex min-w-0 flex-1 items-center justify-end gap-3 rounded-2xl bg-primary p-4 text-right text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="min-w-0">
              <span className="block text-xs">
                {finishesCourse ? `+${XP_PER_LESSON + XP_PER_COURSE_COMPLETION} XP termasuk bonus course` : `+${XP_PER_LESSON} XP`}
              </span>
              <span className="block text-sm font-semibold">
                {isPending ? "Menyimpan..." : finishesCourse ? "Selesaikan course" : "Selesai, lihat semua materi"}
              </span>
            </span>
            <Flag className="h-4 w-4 shrink-0" aria-hidden="true" />
          </button>
        ) : (
          <Link href={courseHref} className={`${navLinkClassName} justify-end text-right`}>
            <span className="text-sm font-semibold">Lihat semua materi</span>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          </Link>
        )}
      </nav>
    </div>
  );
}
