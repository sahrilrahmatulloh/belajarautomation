"use client";

import FilterChips, { FilterOption } from "./FilterChips";
import FilterPanel, { FilterGroup, FilterToggle } from "./FilterPanel";
import SearchField from "./SearchField";

interface CatalogFiltersProps {
  search: string;
  searchPlaceholder: string;
  onSearchChange: (value: string) => void;
  categoryOptions: FilterOption[];
  category: string;
  onCategoryChange: (value: string) => void;
  panelGroups: FilterGroup[];
  panelToggles?: FilterToggle[];
}

// Pola filter katalog bersama (Belajar, Playground): pencarian, satu baris
// chip kategori, dan tombol "Filter" untuk filter tambahan.
export default function CatalogFilters({
  search,
  searchPlaceholder,
  onSearchChange,
  categoryOptions,
  category,
  onCategoryChange,
  panelGroups,
  panelToggles,
}: CatalogFiltersProps) {
  return (
    <div className="min-w-0 space-y-3">
      <SearchField value={search} onChange={onSearchChange} placeholder={searchPlaceholder} />

      <div className="flex min-w-0 items-center gap-3">
        <div className="min-w-0 flex-1">
          <FilterChips
            label="Kategori"
            layout="scroll"
            options={categoryOptions}
            active={category}
            onChange={onCategoryChange}
          />
        </div>
        <div className="shrink-0 pb-1">
          <FilterPanel groups={panelGroups} toggles={panelToggles} />
        </div>
      </div>
    </div>
  );
}
