"use client";

import { useId, useState } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";

import FilterChips, { FilterOption } from "./FilterChips";

export interface FilterGroup {
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}

interface FilterPanelProps {
  groups: FilterGroup[];
}

// Tombol "Filter" yang membuka panel berisi filter tambahan (mis. Level, Jenis).
export default function FilterPanel({ groups }: FilterPanelProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const activeCount = groups.filter((group) => group.value !== "").length;

  return (
    <div className="space-y-3">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
      >
        <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
        Filter
        {activeCount > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">
            {activeCount}
          </span>
        )}
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          id={panelId}
          className="space-y-4 rounded-2xl border border-border bg-card p-4"
        >
          {groups.map((group) => (
            <FilterChips
              key={group.label}
              label={group.label}
              options={group.options}
              active={group.value}
              onChange={group.onChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
