"use client";

export interface FilterOption {
  value: string;
  label: string;
  disabled?: boolean;
  // Keterangan singkat untuk opsi nonaktif, mis. "Segera hadir".
  note?: string;
}

interface FilterChipsProps {
  label: string;
  options: FilterOption[];
  active: string;
  onChange: (value: string) => void;
  // "stacked": label di atas, chip terbungkus (isi panel Filter).
  // "scroll": satu baris yang bisa digeser horizontal; halaman tidak ikut melebar.
  layout?: "stacked" | "scroll";
}

export default function FilterChips({
  label,
  options,
  active,
  onChange,
  layout = "stacked",
}: FilterChipsProps) {
  const isScroll = layout === "scroll";

  return (
    <div
      role="group"
      aria-label={`Filter ${label}`}
      className={
        isScroll
          ? "-mx-1 flex min-w-0 gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:thin]"
          : "flex flex-wrap items-center gap-2"
      }
    >
      {!isScroll && (
        <span className="w-full text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      )}

      {options.map((option) => {
        const isActive = active === option.value;

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            disabled={option.disabled}
            onClick={() => onChange(option.value)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60 ${
              isActive
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground enabled:hover:bg-accent enabled:hover:text-foreground"
            }`}
          >
            {option.label}
            {option.note && (
              <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                {option.note}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
