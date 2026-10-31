"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock3, Layers3 } from "lucide-react";

import { COURSE_DETAILS } from "@/data/courseDetails";
import { COURSES } from "@/data/courses";
import { COURSE_CATEGORIES } from "@/data/courseCategories";
import { RECOMMENDED_COURSE_SLUGS } from "@/data/recommendations";
import type { Course, CourseCategory } from "@/types/Course";

type RecommendationCategory = "Semua" | CourseCategory;

const categories: RecommendationCategory[] = ["Semua", ...COURSE_CATEGORIES];

const recommendedSlugs = new Set(RECOMMENDED_COURSE_SLUGS);

const accents: Record<string, { surface: string; icon: string; label: string; shape: string }> = {
  Fundamental: {
    surface: "from-blue-700 to-sky-500",
    icon: "bg-white/15 text-white",
    label: "bg-cyan-300/15 text-cyan-100",
    shape: "border-white/20 bg-sky-200/15",
  },
  Programming: {
    surface: "from-indigo-800 to-blue-600",
    icon: "bg-white/15 text-white",
    label: "bg-indigo-200/15 text-indigo-100",
    shape: "border-indigo-100/20 bg-indigo-100/10",
  },
  "Web Automation": {
    surface: "from-blue-800 to-blue-500",
    icon: "bg-white/15 text-white",
    label: "bg-sky-200/15 text-sky-100",
    shape: "border-sky-100/20 bg-sky-100/10",
  },
  "Manual Testing": {
    surface: "from-sky-700 to-cyan-500",
    icon: "bg-white/15 text-white",
    label: "bg-white/15 text-white",
    shape: "border-cyan-100/20 bg-cyan-100/10",
  },
  "Mobile Testing": {
    surface: "from-indigo-800 to-sky-600",
    icon: "bg-white/15 text-white",
    label: "bg-indigo-100/15 text-indigo-50",
    shape: "border-indigo-100/20 bg-indigo-100/10",
  },
  "API Testing": {
    surface: "from-cyan-800 to-sky-600",
    icon: "bg-white/15 text-white",
    label: "bg-cyan-100/15 text-cyan-50",
    shape: "border-cyan-100/20 bg-cyan-100/10",
  },
};

function matchesCategory(course: Course, category: RecommendationCategory) {
  return category === "Semua" || course.category === category;
}

function RecommendationCard({ course }: { course: Course }) {
  const Icon = course.icon;
  const accent = accents[course.category] ?? accents.Fundamental;
  const detail = COURSE_DETAILS.find((item) => item.courseSlug === course.slug);

  return (
    <Link
      href={`/learn/${course.slug}`}
      className="group flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-150 hover:border-primary/30 hover:shadow-md"
    >
      <div className={`relative isolate flex h-24 items-end overflow-hidden bg-gradient-to-br ${accent.surface} p-3 text-white sm:h-28`}>
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute -right-5 -top-12 h-36 w-24 rotate-45 rounded-3xl border ${accent.shape}`}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 bottom-[-4rem] h-40 w-40 rounded-full border border-white/15"
        />
        <div className="relative flex w-full items-end justify-between gap-3">
          <div className="min-w-0">
            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${accent.label}`}>
              {course.category}
            </span>
            <h3 className="mt-1.5 line-clamp-1 text-base font-bold leading-tight drop-shadow-sm sm:text-lg">
              {course.title}
            </h3>
          </div>
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg backdrop-blur-sm ${accent.icon}`}>
            <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <p className="line-clamp-2 min-h-9 text-xs leading-4.5 text-muted-foreground sm:text-sm">
          {course.description}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-muted-foreground sm:text-xs">
          {detail && (
            <span className="inline-flex items-center gap-1.5">
              <Layers3 className="h-3.5 w-3.5 text-brand-blue" aria-hidden="true" />
              {detail.modules.length} modul
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5 text-brand-sky" aria-hidden="true" />
            {course.lessons} materi
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="h-3.5 w-3.5 text-brand-cyan" aria-hidden="true" />
            {course.estimatedDuration}
          </span>
        </div>

        {course.progress !== undefined ? (
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progres kursus</span>
              <span className="font-semibold text-foreground">{course.progress}%</span>
            </div>
            <div
              className="mt-2 h-2 overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-label={`Progres ${course.title}`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={course.progress}
            >
              <div className="h-full rounded-full bg-primary transition-[width] duration-300" style={{ width: `${course.progress}%` }} />
            </div>
          </div>
        ) : (
          <p className="mt-3 text-[11px] text-muted-foreground sm:text-xs">Belum dimulai · {course.level}</p>
        )}

        <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
          <span className="text-xs font-semibold text-primary sm:text-sm">Lihat materi</span>
          <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </div>
      </div>
    </Link>
  );
}

export default function RecommendationsSection() {
  const [activeCategory, setActiveCategory] = useState<RecommendationCategory>("Semua");
  const recommendedCourses = useMemo(
    () => COURSES.filter((course) => recommendedSlugs.has(course.slug)),
    [],
  );
  const filteredCourses = useMemo(
    () => recommendedCourses.filter((course) => matchesCategory(course, activeCategory)),
    [recommendedCourses, activeCategory],
  );

  return (
    <section aria-labelledby="recommendations-title" className="min-w-0 space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="recommendations-title" className="text-xl font-bold sm:text-2xl">
            Rekomendasi untukmu
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Materi pilihan dari koleksi kursus yang tersedia.
          </p>
        </div>
        <Link href="/learn" className="inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-primary hover:underline">
          Lihat semua <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Filter rekomendasi">
        {categories.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActiveCategory(category)}
              className={`min-h-10 shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {filteredCourses.length ? (
        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredCourses.map((course) => (
            <RecommendationCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-card px-5 py-10 text-center">
          <p className="font-semibold">Belum ada materi di kategori ini</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Coba kategori lain atau lihat seluruh katalog materi.
          </p>
          <Link href="/learn" className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground">
            Buka katalog <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      )}
    </section>
  );
}
