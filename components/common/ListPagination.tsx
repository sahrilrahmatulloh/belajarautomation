"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

const buttonClass = "inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-border px-2 text-sm font-medium transition-colors enabled:hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50";

export function pageSlice<T>(items: T[], page: number, pageSize: number) {
  return items.slice((page - 1) * pageSize, page * pageSize);
}

// Nomor halaman ringkas: halaman pertama, terakhir, saat ini, dan satu tetangga di kiri dan kanannya;
// sisanya diganti "…". Semua halaman tampil bila jumlahnya 7 atau kurang.
function visiblePages(page: number, pageCount: number): ({ number: number; isNeighbor: boolean } | "gap")[] {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, index) => ({ number: index + 1, isNeighbor: false }));
  const result: ({ number: number; isNeighbor: boolean } | "gap")[] = [];
  let previous = 0;
  for (let number = 1; number <= pageCount; number += 1) {
    const isEdge = number === 1 || number === pageCount || number === page;
    const isNeighbor = Math.abs(number - page) === 1;
    if (!isEdge && !isNeighbor) continue;
    if (number - previous > 1) result.push("gap");
    result.push({ number, isNeighbor: isNeighbor && !isEdge });
    previous = number;
  }
  return result;
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
        {visiblePages(page, pageCount).map((item, index) =>
          item === "gap" ? (
            <span key={`gap-${index}`} aria-hidden="true" className="inline-flex h-9 min-w-6 items-center justify-center text-sm text-muted-foreground">
              …
            </span>
          ) : (
            <button
              key={item.number}
              type="button"
              aria-label={`Halaman ${item.number}`}
              aria-current={item.number === page ? "page" : undefined}
              onClick={() => onChange(item.number)}
              // Halaman tetangga disembunyikan di layar kecil agar satu baris.
              className={`${buttonClass} ${item.number === page ? "border-primary bg-primary text-primary-foreground" : ""} ${item.isNeighbor ? "max-sm:hidden" : ""}`}
            >
              {item.number}
            </button>
          )
        )}
        <button type="button" aria-label="Halaman berikutnya" disabled={page === pageCount} onClick={() => onChange(page + 1)} className={buttonClass}>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
