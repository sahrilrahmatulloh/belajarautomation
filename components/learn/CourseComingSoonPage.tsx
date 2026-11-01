import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock3, Code2, Map } from "lucide-react";

import ContentCover from "@/components/common/ContentCover";
import { Course } from "@/types/Course";

interface CourseComingSoonPageProps {
  course: Course;
  roadmaps: { id: string; title: string }[];
}

export default function CourseComingSoonPage({
  course,
  roadmaps,
}: CourseComingSoonPageProps) {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <Link
        href="/learn"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Belajar
      </Link>

      <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
        <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-2xl bg-muted md:mb-8 md:aspect-[2/1]">
          <ContentCover
            src={course.cover}
            title={course.title}
            category={course.category}
            kind="course"
            alt={`Sampul course ${course.title}`}
            sizes="(min-width: 1280px) 1100px, (min-width: 1024px) 70vw, 100vw"
            priority
          />
          <span className="absolute right-4 top-4 rounded-full bg-background/90 px-3 py-1.5 text-xs font-semibold shadow-sm backdrop-blur-sm">
            Segera hadir
          </span>
        </div>

        <p className="text-sm font-medium text-muted-foreground">
          {course.category}
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          {course.title}
        </h1>

        <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">
          {course.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium">
            {course.level}
          </span>

          {course.languages.length > 0 && (
            <span className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-medium">
              <Code2 className="h-3.5 w-3.5" />
              {course.languages.join(", ")}
            </span>
          )}
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-3xl border border-dashed border-border bg-card p-6">
          <h2 className="flex items-center gap-2 font-semibold">
            <Clock3 className="h-5 w-5 text-primary" />
            Materi sedang disiapkan
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Modul dan lesson untuk course ini sedang disusun. Sementara itu,
            kamu bisa mempelajari course lain yang sudah tersedia.
          </p>
          <Link
            href="/learn"
            className="mt-4 inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            Lihat course yang tersedia
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6">
          <h2 className="flex items-center gap-2 font-semibold">
            <Map className="h-5 w-5 text-primary" />
            Ada di roadmap
          </h2>

          {roadmaps.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {roadmaps.map((roadmap) => (
                <li key={roadmap.id}>
                  <Link
                    href={`/roadmap/${roadmap.id}`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-3 text-sm font-medium transition-colors hover:bg-accent"
                  >
                    {roadmap.title}
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              Course ini belum masuk roadmap mana pun.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
