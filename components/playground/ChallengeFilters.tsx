"use client";

import CatalogFilters from "@/components/filters/CatalogFilters";
import { FilterOption } from "@/components/filters/FilterChips";
import { LEVEL_OPTIONS } from "@/lib/filters";

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

// Konfigurasi filter Playground di atas pola filter katalog bersama (CatalogFilters).
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
    <CatalogFilters
      search={search}
      searchPlaceholder="Cari challenge..."
      onSearchChange={onSearchChange}
      categoryOptions={categoryOptions}
      category={category}
      onCategoryChange={onCategoryChange}
      panelGroups={[
        { label: "Level", options: LEVEL_OPTIONS, value: level, onChange: onLevelChange },
        { label: "Jenis", options: typeOptions, value: type, onChange: onTypeChange },
      ]}
    />
  );
}
