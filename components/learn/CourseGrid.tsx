"use client";

import { useMemo } from "react";

import CatalogFilters from "@/components/filters/CatalogFilters";
import FilterEmptyState from "@/components/filters/FilterEmptyState";
import FilterResultBar from "@/components/filters/FilterResultBar";
import {
  COURSE_CATEGORIES,
  COURSE_LANGUAGE_FILTERS,
} from "@/data/courseCategories";
import { COURSES } from "@/data/courses";
import {
  getCategoryOptions,
  LEVEL_OPTIONS,
  matchesKeyword,
  toFilterSlug,
  validFilterValue,
} from "@/lib/filters";
import { useCatalogFilters } from "@/lib/useUrlFilters";
import CourseCard from "./CourseCard";

const FILTER_KEYS = ["q", "kategori", "bahasa", "level", "tersedia"] as const;

// Course yang sudah tersedia tampil lebih dulu; urutan katalog dipertahankan.
const sortedCourses = [...COURSES].sort(
  (a, b) =>
    Number(a.availability === "coming-soon") -
    Number(b.availability === "coming-soon")
);

const categoryOptions = getCategoryOptions(
  COURSE_CATEGORIES,
  COURSES.map((course) => course.category)
);

const languageOptions = [
  { value: "", label: "Semua" },
  ...COURSE_LANGUAGE_FILTERS.map((language) => ({
    value: toFilterSlug(language),
    label: language,
  })),
];

export default function CourseGrid() {
  const { values, search, setSearch, setFilters, reset } = useCatalogFilters(FILTER_KEYS);

  const category = validFilterValue(values.kategori, categoryOptions);
  const language = validFilterValue(values.bahasa, languageOptions);
  const level = validFilterValue(values.level, LEVEL_OPTIONS);
  const availableOnly = values.tersedia === "1";

  const filteredCourses = useMemo(
    () =>
      sortedCourses.filter(
        (course) =>
          matchesKeyword(search, course.title, course.description) &&
          (!category || toFilterSlug(course.category) === category) &&
          (!language || course.languages.some((item) => toFilterSlug(item) === language)) &&
          (!level || course.level.toLowerCase() === level) &&
          (!availableOnly || course.availability === "available")
      ),
    [search, category, language, level, availableOnly]
  );

  const hasActiveFilter = Boolean(search.trim() || category || language || level || availableOnly);

  return (
    <section aria-label="Daftar course" className="space-y-5">
      <CatalogFilters
        search={search}
        searchPlaceholder="Cari course..."
        onSearchChange={setSearch}
        categoryOptions={categoryOptions}
        category={category}
        onCategoryChange={(value) => setFilters({ kategori: value })}
        panelGroups={[
          { label: "Bahasa", options: languageOptions, value: language, onChange: (value) => setFilters({ bahasa: value }) },
          { label: "Level", options: LEVEL_OPTIONS, value: level, onChange: (value) => setFilters({ level: value }) },
        ]}
        panelToggles={[
          {
            label: "Hanya yang tersedia",
            checked: availableOnly,
            onChange: (checked) => setFilters({ tersedia: checked ? "1" : "" }),
          },
        ]}
      />

      <FilterResultBar
        count={filteredCourses.length}
        noun="course"
        canReset={hasActiveFilter}
        onReset={reset}
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
      ) : (
        <FilterEmptyState
          title="Course tidak ditemukan"
          description="Coba kata kunci, kategori, bahasa, atau level lain."
          onReset={reset}
        />
      )}
    </section>
  );
}
