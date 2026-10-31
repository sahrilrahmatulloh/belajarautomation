"use client";

import { useMemo, useState } from "react";

import { COURSES } from "@/data/courses";
import CourseCard from "./CourseCard";
import LearnFilters from "./LearnFilters";

export default function CourseGrid() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] =
    useState("Semua");

  const filteredCourses = useMemo(() => {
    return COURSES.filter((course) => {
      const matchesSearch =
        course.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        course.description
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        activeCategory === "Semua" ||
        course.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  return (
    <section className="space-y-6">
      <LearnFilters
        search={search}
        activeCategory={activeCategory}
        onSearchChange={setSearch}
        onCategoryChange={setActiveCategory}
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
        <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
          <h2 className="font-semibold">Materi tidak ditemukan</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Coba kata kunci atau kategori lain.
          </p>
        </div>
      )}
    </section>
  );
}
