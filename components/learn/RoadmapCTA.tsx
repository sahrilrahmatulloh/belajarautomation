"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, Map } from "lucide-react";

// Ajakan ringkas menuju Roadmap di bagian atas halaman Belajar (PRD FR-02 v2.47): tertutup
// secara bawaan agar halaman minimalis; tombol panah membuka penjelasan dan tombol Roadmap.
export default function RoadmapCTA() {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <section aria-label="Ajakan roadmap" className="rounded-2xl border border-primary/20 bg-primary/5">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-foreground transition-colors hover:bg-primary/10 sm:px-5"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary-accent">
          <Map className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="flex-1">Tidak tahu mulai dari mana?</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="flex-col gap-3 border-t border-primary/15 px-4 py-3 data-[open=true]:flex sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-5"
        data-open={open}
      >
        <p className="text-sm leading-6 text-muted-foreground">Ikuti roadmap terstruktur sesuai tujuan kariermu.</p>
        <Link
          href="/roadmap"
          className="inline-flex min-h-10 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover sm:w-auto"
        >
          Lihat Roadmap
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
