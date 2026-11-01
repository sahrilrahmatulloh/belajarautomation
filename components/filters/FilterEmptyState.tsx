"use client";

import { RotateCcw, SearchX } from "lucide-react";

interface FilterEmptyStateProps {
  title: string;
  description: string;
  onReset: () => void;
}

export default function FilterEmptyState({ title, description, onReset }: FilterEmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted">
        <SearchX className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
      </div>
      <h2 className="mt-3 font-semibold">{title}</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      <button
        type="button"
        onClick={onReset}
        className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-xl border border-border px-4 text-sm font-medium transition-colors hover:bg-accent"
      >
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
        Reset filter
      </button>
    </div>
  );
}
