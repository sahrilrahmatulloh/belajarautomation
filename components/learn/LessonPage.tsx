import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock3, PenLine } from "lucide-react";

import ArticleDraftBadge from "@/components/blog/ArticleDraftBadge";
import { ArticleSources } from "@/components/blog/ArticleParts";
import { getLessonPageData } from "@/lib/courseLessons";
import { LessonContent } from "@/lib/lessons";

import LessonCompleteButton from "./LessonCompleteButton";

type LessonPageProps = NonNullable<ReturnType<typeof getLessonPageData>> & {
  lessonContent: LessonContent | null;
  // Isi MDX yang sudah dirender di server.
  body: React.ReactNode;
};

const navLinkClassName =
  "flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-accent";

// Lesson yang belum ditulis tidak punya tombol selesai, agar tidak mencatat progres atau XP
// dari materi yang belum dipelajari.
export default function LessonPage({
  course,
  lesson,
  position,
  total,
  previous,
  next,
  lessonContent,
  body,
}: LessonPageProps) {
  const courseHref = `/learn/${course.slug}`;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href={courseHref}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Kembali ke {course.title}
      </Link>

      <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
        <p className="text-sm font-medium text-muted-foreground">
          {lesson.moduleTitle}
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          {lesson.title}
        </h1>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium">
            Materi {position} dari {total}
          </span>

          <span className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-medium">
            <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
            {lesson.duration}
          </span>

          {lessonContent && (
            <span className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium">Oleh {lessonContent.author}</span>
          )}

          {lessonContent?.status === "draft" && <ArticleDraftBadge />}
        </div>
      </section>

      {lessonContent ? (
        <>
          <section aria-label="Isi lesson" className="min-w-0 rounded-3xl border border-border bg-card p-6 sm:p-8">
            {body}
            <ArticleSources sources={lessonContent.sources} />
          </section>
          <LessonCompleteButton courseSlug={course.slug} lessonSlug={lesson.slug} />
        </>
      ) : (
        <section className="rounded-3xl border border-dashed border-border bg-card p-6">
          <h2 className="flex items-center gap-2 font-semibold">
            <PenLine className="h-5 w-5 text-primary-accent" aria-hidden="true" />
            Materi sedang ditulis
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Isi lesson ini belum tersedia. Kamu bisa melihat lesson lain di course ini
            sambil menunggu materinya selesai.
          </p>
        </section>
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
          <Link href={`${courseHref}/${next.slug}`} className={`${navLinkClassName} justify-end text-right`}>
            <span className="min-w-0">
              <span className="block text-xs text-muted-foreground">Berikutnya</span>
              <span className="block text-sm font-semibold">{next.title}</span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          </Link>
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
