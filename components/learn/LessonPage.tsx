import Link from "next/link";
import { ArrowLeft, Clock3, PenLine } from "lucide-react";

import ArticleDraftBadge from "@/components/blog/ArticleDraftBadge";
import { ArticleSources } from "@/components/blog/ArticleParts";
import { getLessonPageData } from "@/lib/courseLessons";
import { LessonContent } from "@/lib/lessons";

import LessonNavigation from "./LessonNavigation";

type LessonPageProps = NonNullable<ReturnType<typeof getLessonPageData>> & {
  lessonContent: LessonContent | null;
  // Isi MDX yang sudah dirender di server.
  body: React.ReactNode;
};

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

      <LessonNavigation
        // Status "sudah digulir sampai akhir" dimulai ulang di setiap lesson.
        key={lesson.slug}
        courseSlug={course.slug}
        courseTitle={course.title}
        lessonSlug={lesson.slug}
        total={total}
        previous={previous ? { slug: previous.slug, title: previous.title } : null}
        next={next ? { slug: next.slug, title: next.title } : null}
        hasContent={lessonContent !== null}
      />
    </div>
  );
}
