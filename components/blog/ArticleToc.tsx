"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ListTree } from "lucide-react";

import { ArticleHeading } from "@/types/Article";

// Jarak dari atas layar yang dianggap sedang dibaca: tepat di bawah header.
const ACTIVE_OFFSET = 180;

function useActiveHeading(headings: ArticleHeading[]) {
  const [activeId, setActiveId] = useState(headings[0]?.id);

  useEffect(() => {
    const update = () => {
      let current = headings[0]?.id;
      for (const { id } of headings) {
        const top = document.getElementById(id)?.getBoundingClientRect().top;
        if (top !== undefined && top <= ACTIVE_OFFSET) current = id;
      }
      setActiveId(current);
    };

    // Yang digulir adalah <main>; scroll tidak menggelembung, jadi ditangkap di window.
    window.addEventListener("scroll", update, { capture: true, passive: true });
    const frame = window.requestAnimationFrame(update);
    return () => {
      window.removeEventListener("scroll", update, { capture: true });
      window.cancelAnimationFrame(frame);
    };
  }, [headings]);

  return activeId;
}

function TocLinks({
  headings,
  activeId,
  onNavigate,
}: {
  headings: ArticleHeading[];
  activeId?: string;
  onNavigate?: () => void;
}) {
  return (
    <ul className="space-y-0.5">
      {headings.map(({ id, title }) => {
        const isActive = id === activeId;

        return (
          <li key={id}>
            <a
              href={`#${id}`}
              onClick={onNavigate}
              aria-current={isActive ? "location" : undefined}
              className={`block rounded-lg px-3 py-1.5 text-sm transition-colors ${
                isActive
                  ? "bg-primary/10 font-semibold text-blue-700 dark:text-blue-300"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {title}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

// Menempel di samping pada layar lebar.
export function ArticleTocSidebar({ headings }: { headings: ArticleHeading[] }) {
  const activeId = useActiveHeading(headings);
  if (headings.length === 0) return null;

  return (
    <aside className="hidden xl:block">
      <nav aria-label="Daftar Isi" className="sticky top-4 rounded-2xl border border-border bg-card p-3">
        <p className="mb-2 px-3 font-semibold">Daftar Isi</p>
        <TocLinks headings={headings} activeId={activeId} />
      </nav>
    </aside>
  );
}

// Panel yang bisa dilipat pada layar sempit.
export function ArticleTocPanel({ headings }: { headings: ArticleHeading[] }) {
  const activeId = useActiveHeading(headings);
  const [open, setOpen] = useState(false);
  if (headings.length === 0) return null;

  return (
    <nav aria-label="Daftar Isi" className="mt-5 rounded-2xl border border-border bg-card xl:hidden">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex min-h-12 w-full items-center gap-2 px-4 text-left font-semibold"
      >
        <ListTree className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="flex-1">Daftar Isi</span>
        <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>

      {open && (
        <div className="border-t border-border p-2">
          <TocLinks headings={headings} activeId={activeId} onNavigate={() => setOpen(false)} />
        </div>
      )}
    </nav>
  );
}
