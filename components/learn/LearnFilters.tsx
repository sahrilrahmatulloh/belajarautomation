"use client";

import FilterChips, { FilterOption } from "@/components/filters/FilterChips";
import FilterPanel from "@/components/filters/FilterPanel";
import SearchField from "@/components/filters/SearchField";
import { LEVEL_OPTIONS } from "@/lib/filters";

interface LearnFiltersProps {
  search: string;
  categoryOptions: FilterOption[];
  languageOptions: FilterOption[];
  category: string;
  language: string;
  level: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onLanguageChange: (value: string) => void;
  onLevelChange: (value: string) => void;
}

export default function LearnFilters({
  search,
  categoryOptions,
  languageOptions,
  category,
  language,
  level,
  onSearchChange,
  onCategoryChange,
  onLanguageChange,
  onLevelChange,
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
        layout="scroll"
        options={categoryOptions}
        active={category}
        onChange={onCategoryChange}
      />

      <FilterPanel
        groups={[
          { label: "Bahasa", options: languageOptions, value: language, onChange: onLanguageChange },
          { label: "Level", options: LEVEL_OPTIONS, value: level, onChange: onLevelChange },
        ]}
      />
    </div>
  );
}
