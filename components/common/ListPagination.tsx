"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

const buttonClass = "inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-border px-2 text-sm font-medium transition-colors enabled:hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50";

export function pageSlice<T>(items: T[], page: number, pageSize: number) {
  return items.slice((page - 1) * pageSize, page * pageSize);
}

// Halaman daftar dengan jumlah item tetap. Disembunyikan bila semuanya muat di satu halaman.
export default function ListPagination({
  total,
  page,
  pageSize,
  itemLabel,
  onChange,
}: {
  total: number;
  page: number;
  pageSize: number;
  itemLabel: string;
  onChange: (page: number) => void;
}) {
  const pageCount = Math.ceil(total / pageSize);
  if (pageCount <= 1) return null;

  return (
    <nav aria-label={`Halaman ${itemLabel}`} className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-muted-foreground">
        Menampilkan {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} dari {total} {itemLabel}
      </p>
      <div className="flex gap-1">
        <button type="button" aria-label="Halaman sebelumnya" disabled={page === 1} onClick={() => onChange(page - 1)} className={buttonClass}>
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </button>
        {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
          <button
            key={number}
            type="button"
            aria-label={`Halaman ${number}`}
            aria-current={number === page ? "page" : undefined}
            onClick={() => onChange(number)}
            className={`${buttonClass} ${number === page ? "border-primary bg-primary text-primary-foreground" : ""}`}
          >
            {number}
          </button>
        ))}
        <button type="button" aria-label="Halaman berikutnya" disabled={page === pageCount} onClick={() => onChange(page + 1)} className={buttonClass}>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
