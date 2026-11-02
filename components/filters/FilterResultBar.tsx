"use client";

import { RotateCcw } from "lucide-react";

interface FilterResultBarProps {
  count: number;
  noun: string;
  canReset: boolean;
  onReset: () => void;
  // Tampil sebagai judul daftar, bukan keterangan kecil.
  prominent?: boolean;
}

export default function FilterResultBar({
  count,
  noun,
  canReset,
  onReset,
  prominent = false,
}: FilterResultBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <p
        aria-live="polite"
        className={prominent ? "font-semibold" : "text-sm text-muted-foreground"}
      >
        <span className="font-semibold text-foreground">{count}</span> {noun}
      </p>

      {canReset && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Reset filter
        </button>
      )}
    </div>
  );
}
