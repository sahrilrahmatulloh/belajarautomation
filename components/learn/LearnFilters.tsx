"use client";

import FilterChips from "@/components/filters/FilterChips";
import SearchField from "@/components/filters/SearchField";
import {
  COURSE_CATEGORIES,
  COURSE_LANGUAGE_FILTERS,
} from "@/data/courseCategories";

interface LearnFiltersProps {
  search: string;
  activeCategory: string;
  activeLanguage: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (category: string) => void;
  onLanguageChange: (language: string) => void;
}

const toOptions = (values: string[]) =>
  ["Semua", ...values].map((value) => ({ value, label: value }));

const categories = toOptions(COURSE_CATEGORIES);
const languages = toOptions(COURSE_LANGUAGE_FILTERS);

export default function LearnFilters({
  search,
  activeCategory,
  activeLanguage,
  onSearchChange,
  onCategoryChange,
  onLanguageChange,
}: LearnFiltersProps) {
  return (
    <div className="space-y-4">
      <SearchField
        value={search}
        onChange={onSearchChange}
        placeholder="Cari materi atau teknologi..."
      />

      <FilterChips
        label="Kategori"
        options={categories}
        active={activeCategory}
        onChange={onCategoryChange}
      />

      <FilterChips
        label="Bahasa"
        options={languages}
        active={activeLanguage}
        onChange={onLanguageChange}
      />
    </div>
  );
}
