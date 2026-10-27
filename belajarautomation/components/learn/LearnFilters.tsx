"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

interface LearnFiltersProps {
  search: string;
  activeCategory: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (category: string) => void;
}

const categories = [
  "Semua",
  "Fundamental",
  "Programming",
  "Version Control",
  "Web Automation",
  "BDD",
  "Low-Code",
];

export default function LearnFilters({
  search,
  activeCategory,
  onSearchChange,
  onCategoryChange,
}: LearnFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />

        <Input
          value={search}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
          placeholder="Cari materi atau teknologi..."
          className="h-11 pl-10"
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