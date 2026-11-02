import { ReactNode, Ref } from "react";
import { FlaskConical } from "lucide-react";

import { PRACTICE_PAGES, PracticePageId } from "@/data/practicePages";

interface PracticeFrameProps {
  pageId: PracticePageId;
  // Kontainer tempat selector Locator Challenge dijalankan.
  rootRef?: Ref<HTMLDivElement>;
  children: ReactNode;
}

// Bingkai yang menandai aplikasi tiruan agar tidak disangka fitur sungguhan (PRD FR-04).
export default function PracticeFrame({ pageId, rootRef, children }: PracticeFrameProps) {
  return (
    <section
      aria-label={`Halaman latihan: ${PRACTICE_PAGES[pageId]}`}
      className="overflow-hidden rounded-2xl border-2 border-dashed border-amber-500/60"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 bg-amber-500/10 px-4 py-2.5 text-sm">
        <span className="inline-flex items-center gap-1.5 font-semibold text-amber-800 dark:text-amber-300">
          <FlaskConical className="h-4 w-4" aria-hidden="true" />
          Halaman latihan
        </span>
        <span className="text-xs text-muted-foreground">
          Ini aplikasi tiruan, bukan fitur sungguhan. Data yang diisi tidak dikirim ke mana pun.
        </span>
      </div>

      <div ref={rootRef} data-practice-root className="bg-background p-4 sm:p-6">
        {children}
      </div>
    </section>
  );
}
