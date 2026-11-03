"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";

import { getContentRepository } from "@/lib/content";
import { isDev } from "@/lib/env";
import { useViewMode } from "@/lib/viewMode";

// Mengembalikan data dummy alur konten ke kondisi awal. Hanya di DEV (PRD FR-15).
export default function DummyDataSettings() {
  const { hasRole } = useViewMode();
  const [message, setMessage] = useState("");

  if (!isDev || !hasRole) return null;

  return (
    <section aria-labelledby="data-dummy" className="rounded-3xl border border-border bg-card p-6">
      <h2 id="data-dummy" className="text-xl font-bold">Data Dummy</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Mengembalikan konten, catatan revisi, riwayat status, dan peran ke kondisi awal. Hanya tersedia di DEV.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={async () => {
            await getContentRepository().reset();
            setMessage("Data dummy sudah direset.");
          }}
          className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-border px-4 text-sm font-semibold transition-colors hover:bg-accent"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Reset data dummy
        </button>
        <span role="status" className="text-sm text-muted-foreground">{message}</span>
      </div>
    </section>
  );
}
