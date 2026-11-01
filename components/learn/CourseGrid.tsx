"use client";

import { useMemo, useState } from "react";

import { COURSES } from "@/data/courses";
import CourseCard from "./CourseCard";
import LearnFilters from "./LearnFilters";

// Course yang sudah tersedia tampil lebih dulu; urutan katalog dipertahankan.
const sortedCourses = [...COURSES].sort(
  (a, b) =>
    Number(a.availability === "coming-soon") -
    Number(b.availability === "coming-soon")
);

export default function CourseGrid() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] =
    useState("Semua");
  const [activeLanguage, setActiveLanguage] =
    useState("Semua");

  const filteredCourses = useMemo(() => {
    const keyword = search.toLowerCase();

    return sortedCourses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(keyword) ||
        course.description.toLowerCase().includes(keyword);

      const matchesCategory =
        activeCategory === "Semua" ||
        course.category === activeCategory;

      const matchesLanguage =
        activeLanguage === "Semua" ||
        course.language === activeLanguage;

      return matchesSearch && matchesCategory && matchesLanguage;
    });
  }, [search, activeCategory, activeLanguage]);

  const isCategoryOnly =
    !search.trim() && activeLanguage === "Semua" && activeCategory !== "Semua";

  return (
    <section className="space-y-6">
      <LearnFilters
        search={search}
        activeCategory={activeCategory}
        activeLanguage={activeLanguage}
        onSearchChange={setSearch}
        onCategoryChange={setActiveCategory}
        onLanguageChange={setActiveLanguage}
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
          <h2 className="font-semibold">Materi {activeCategory} segera hadir</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Materi untuk kategori ini sedang disiapkan. Sementara itu, coba kategori lain.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
          <h2 className="font-semibold">Materi tidak ditemukan</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Coba kata kunci, kategori, atau bahasa lain.
          </p>
        </div>
      )}
    </section>
  );
}
