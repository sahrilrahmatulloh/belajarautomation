"use client";

import { ChallengeCategory } from "@/types/Challenge";

export type ChallengeFilter =
  | "All"
  | ChallengeCategory;

interface ChallengeFiltersProps {
  activeCategory: ChallengeFilter;
  onCategoryChange: (
    category: ChallengeFilter
  ) => void;
}

const categories: ChallengeFilter[] = [
  "All",
  "Locator",
  "Test Case",
  "Bug Hunt",
  "API",
  "Automation",
  "AI",
];

export default function ChallengeFilters({
  activeCategory,
  onCategoryChange,
}: ChallengeFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const isActive =
          activeCategory === category;

        return (
          <button
            key={category}
            type="button"
              aria-pressed={isActive}
            onClick={() =>
              onCategoryChange(category)
            }
            className={`rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
