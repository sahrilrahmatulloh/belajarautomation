"use client";

import { useMemo, useState } from "react";

import FilterResultBar from "@/components/filters/FilterResultBar";
import {
  COURSE_CATEGORIES,
  COURSE_LANGUAGE_FILTERS,
} from "@/data/courseCategories";
import { COURSES } from "@/data/courses";
import {
  LEVEL_OPTIONS,
  matchesKeyword,
  toFilterSlug,
  validFilterValue,
} from "@/lib/filters";
import { useUrlFilters } from "@/lib/useUrlFilters";
import CourseCard from "./CourseCard";
import LearnFilters from "./LearnFilters";

const FILTER_KEYS = ["q", "kategori", "bahasa", "level"] as const;

// Course yang sudah tersedia tampil lebih dulu; urutan katalog dipertahankan.
const sortedCourses = [...COURSES].sort(
  (a, b) =>
    Number(a.availability === "coming-soon") -
    Number(b.availability === "coming-soon")
);

const toOptions = (labels: string[]) => [
  { value: "", label: "Semua" },
  ...labels.map((label) => ({ value: toFilterSlug(label), label })),
];

const categoryOptions = toOptions(COURSE_CATEGORIES);
const languageOptions = toOptions(COURSE_LANGUAGE_FILTERS);

export default function CourseGrid() {
  const { values, setFilters, resetFilters } = useUrlFilters(FILTER_KEYS);
  // Teks pencarian disimpan lokal agar input tetap responsif; URL ikut diperbarui.
  const [search, setSearch] = useState(values.q);

  const category = validFilterValue(values.kategori, categoryOptions);
  const language = validFilterValue(values.bahasa, languageOptions);
  const level = validFilterValue(values.level, LEVEL_OPTIONS);

  const filteredCourses = useMemo(
    () =>
      sortedCourses.filter(
        (course) =>
          matchesKeyword(search, course.title, course.description) &&
          (!category || toFilterSlug(course.category) === category) &&
          (!language || course.languages.some((item) => toFilterSlug(item) === language)) &&
          (!level || course.level.toLowerCase() === level)
      ),
    [search, category, language, level]
  );

  const categoryLabel = categoryOptions.find((option) => option.value === category)?.label;
  const isCategoryOnly = !search.trim() && !language && !level && Boolean(category);
  const hasActiveFilter = Boolean(search.trim() || category || language || level);

  function handleSearchChange(value: string) {
    setSearch(value);
    setFilters({ q: value.trim() });
  }

  function handleReset() {
    setSearch("");
    resetFilters();
  }

  return (
    <section className="space-y-6">
      <LearnFilters
        search={search}
        categoryOptions={categoryOptions}
        languageOptions={languageOptions}
        category={category}
        language={language}
        level={level}
        onSearchChange={handleSearchChange}
        onCategoryChange={(value) => setFilters({ kategori: value })}
        onLanguageChange={(value) => setFilters({ bahasa: value })}
        onLevelChange={(value) => setFilters({ level: value })}
      />

      <FilterResultBar
        count={filteredCourses.length}
        noun="materi"
        canReset={hasActiveFilter}
        onReset={handleReset}
      />

      {filteredCourses.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
            />
          ))}
        </div>
      ) : isCategoryOnly ? (
        <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
          <h2 className="font-semibold">Materi {categoryLabel} segera hadir</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Materi untuk kategori ini sedang disiapkan. Sementara itu, coba kategori lain.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
          <h2 className="font-semibold">Materi tidak ditemukan</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Coba kata kunci, kategori, bahasa, atau level lain, atau reset filter.
          </p>
        </div>
      )}
    </section>
  );
}
