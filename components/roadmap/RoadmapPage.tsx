import { Route } from "lucide-react";

import FeatureBanner from "@/components/common/FeatureBanner";
import { ROADMAPS } from "@/data/roadmap";
import RoadmapPathCard from "./RoadmapCard";

export default function RoadmapPage() {
  return (
    <div className="space-y-8">
      <FeatureBanner
        icon={<Route />}
        title="Roadmap"
        description={[
          "Pilih jalur belajar sesuai tujuan karier automation kamu.",
          "Ikuti jalur terstruktur dari fundamental hingga siap membangun automation project.",
        ]}
      />

      <section>
        <h2 className="mb-5 text-xl font-semibold">Pilih Roadmap Kamu</h2>

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