import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock3, PenLine } from "lucide-react";

import { getLessonPageData } from "@/lib/courseLessons";

type LessonPageProps = NonNullable<ReturnType<typeof getLessonPageData>>;

const navLinkClassName =
  "flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-accent";

// Halaman lesson sementara: isi materi belum ditulis, jadi belum ada tombol selesai
// agar tidak mencatat progres atau XP dari materi yang belum dipelajari.
export default function LessonPage({
  course,
  lesson,
  position,
  total,
  previous,
  next,
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
        </div>
      </section>

      <section className="rounded-3xl border border-dashed border-border bg-card p-6">
        <h2 className="flex items-center gap-2 font-semibold">
          <PenLine className="h-5 w-5 text-primary" aria-hidden="true" />
          Materi sedang ditulis
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Isi lesson ini belum tersedia. Kamu bisa melihat lesson lain di course ini
          sambil menunggu materinya selesai.
        </p>
      </section>

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
