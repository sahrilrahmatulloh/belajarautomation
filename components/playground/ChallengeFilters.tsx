"use client";

import FilterChips, { FilterOption } from "@/components/filters/FilterChips";
import FilterPanel from "@/components/filters/FilterPanel";
import SearchField from "@/components/filters/SearchField";

export const LEVEL_OPTIONS: FilterOption[] = [
  { value: "", label: "Semua" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

interface ChallengeFiltersProps {
  search: string;
  categoryOptions: FilterOption[];
  typeOptions: FilterOption[];
  category: string;
  level: string;
  type: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onLevelChange: (value: string) => void;
  onTypeChange: (value: string) => void;
}

export default function ChallengeFilters({
  search,
  categoryOptions,
  typeOptions,
  category,
  level,
  type,
  onSearchChange,
  onCategoryChange,
  onLevelChange,
  onTypeChange,
}: ChallengeFiltersProps) {
  return (
    <div className="space-y-4">
      <SearchField
        value={search}
        onChange={onSearchChange}
        placeholder="Cari challenge..."
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
          { label: "Level", options: LEVEL_OPTIONS, value: level, onChange: onLevelChange },
          { label: "Jenis", options: typeOptions, value: type, onChange: onTypeChange },
        ]}
      />
    </div>
  );
}
