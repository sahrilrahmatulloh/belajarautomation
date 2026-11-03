import Link from "next/link";
import { ArrowRight, Map } from "lucide-react";

// Ajakan ringkas menuju Roadmap di bagian atas halaman Belajar (PRD FR-02).
export default function RoadmapCTA() {
  return (
    <section
      aria-label="Ajakan roadmap"
      className="flex flex-col gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-5"
    >
      <div className="flex items-start gap-3 sm:items-center">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary-accent">
          <Map className="h-5 w-5" aria-hidden="true" />
        </span>
        <p className="text-sm leading-6">
          <span className="font-semibold text-foreground">Tidak tahu mulai dari mana?</span>{" "}
          <span className="text-muted-foreground">
            Ikuti roadmap terstruktur sesuai tujuan kariermu.
          </span>
        </p>
      </div>

      <Link
        href="/roadmap"
        className="inline-flex min-h-10 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover sm:w-auto"
      >
        Lihat Roadmap
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </section>
  );
}
