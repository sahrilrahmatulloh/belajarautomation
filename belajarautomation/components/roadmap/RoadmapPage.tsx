import { Route } from "lucide-react";

import { ROADMAPS } from "@/data/roadmap";
import RoadmapPathCard from "./RoadmapCard";

export default function RoadmapPage() {
  return (
    <div className="space-y-8">
      <section>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Route className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Roadmap
            </h1>

            <p className="mt-1 text-muted-foreground">
              Pilih jalur belajar sesuai tujuan karier automation kamu.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5">
          <h2 className="text-xl font-semibold">
            Pilih Roadmap Kamu
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Ikuti jalur terstruktur dari fundamental hingga siap
            membangun automation project.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {ROADMAPS.map((roadmap) => (
            <RoadmapPathCard
              key={roadmap.id}
              roadmap={roadmap}
            />
          ))}
        </div>
      </section>
    </div>
  );
}