"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { ArticleCategory } from "@/types/Article";

export type BlogCategory =
  | "All"
  | ArticleCategory;

interface BlogFiltersProps {
  search: string;
  activeCategory: BlogCategory;
  onSearchChange: (value: string) => void;
  onCategoryChange: (
    category: BlogCategory
  ) => void;
}

const categories: BlogCategory[] = [
  "All",
  "Automation",
  "Playwright",
  "Mobile",
  "API Testing",
  "Career",
  "AI",
];

export default function BlogFilters({
  search,
  activeCategory,
  onSearchChange,
  onCategoryChange,
}: BlogFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
          placeholder="Cari artikel..."
          className="pl-10"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isActive =
            activeCategory === category;

          return (
            <button
              key={category}
              type="button"
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
    </div>
  );
}