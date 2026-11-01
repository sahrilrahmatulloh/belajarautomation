"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
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

const categories = ["Semua", ...COURSE_CATEGORIES];
const languages = ["Semua", ...COURSE_LANGUAGE_FILTERS];

function FilterChips({
  label,
  options,
  active,
  onChange,
}: {
  label: string;
  options: string[];
  active: string;
  onChange: (value: string) => void;
}) {
  return (
    <div
      role="group"
      aria-label={`Filter ${label}`}
      className="flex flex-wrap items-center gap-2"
    >
      <span className="mr-1 w-full text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:w-20">
        {label}
      </span>

      {options.map((option) => {
        const isActive = active === option;

        return (
          <button
            key={option}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-150 ${
              isActive
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

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
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />

        <Input
          aria-label="Cari materi atau teknologi"
          value={search}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
          placeholder="Cari materi atau teknologi..."
          className="h-11 pl-10"
        />
      </div>

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
