import Link from "next/link";
import {
  ArrowLeft,
  Clock3,
  Layers3,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import RoadmapStepCard from "@/components/roadmap/RoadmapStepCard";
import RoadmapTrackCard from "@/components/roadmap/RoadmapTrackCard";

import {
  QA_AUTOMATION_STEPS,
  QA_AUTOMATION_TRACKS,
  QA_AUTOMATION_FINAL_STEPS,
} from "@/data/qaAutomationRoadmap";

export default function QAAutomationRoadmapPage() {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl space-y-10">
        {/* Back */}
        <Link
          href="/roadmap"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Roadmap
        </Link>

        {/* Header */}
        <section>
          <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
            Recommended
          </span>

          <h1 className="mt-5 text-4xl font-bold tracking-tight">
            QA Automation Engineer
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
            Jalur lengkap untuk membangun fondasi QA,
            menguasai automation, memilih spesialisasi,
            hingga mengerjakan industry project.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-full bg-muted px-4 py-2 text-sm">
              Beginner → Advanced
            </span>

            <span className="flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm">
              <Layers3 className="h-4 w-4" />
              Core + Specialization
            </span>

            <span className="flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm">
              <Clock3 className="h-4 w-4" />
              4–6 Bulan
            </span>
          </div>
        </section>

        {/* Core Foundation */}
        <section>
          <h2 className="text-2xl font-bold">
            01. Core Foundation
          </h2>

          <p className="mt-2 text-muted-foreground">
            Fondasi wajib sebelum memilih jalur spesialisasi.
          </p>

          <div className="mt-6 space-y-4">
            {QA_AUTOMATION_STEPS.map((step) => (
              <RoadmapStepCard
                key={step.id}
                step={step}
              />
            ))}
          </div>
        </section>

        {/* Branch */}
        <section>
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground">
              PILIH SPESIALISASI
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Mau fokus ke mana?
            </h2>

            <p className="mt-2 text-muted-foreground">
              Setelah menyelesaikan core foundation,
              pilih track sesuai tujuanmu.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {QA_AUTOMATION_TRACKS.map((track) => (
              <RoadmapTrackCard
                key={track.id}
                track={track}
              />
            ))}
          </div>
        </section>

        {/* Final Stage */}
        <section>
          <h2 className="text-2xl font-bold">
            03. Engineering & Career
          </h2>

          <p className="mt-2 text-muted-foreground">
            Satukan skill automation kamu dan persiapkan diri
            untuk workflow industri.
          </p>

          <div className="mt-6 space-y-4">
            {QA_AUTOMATION_FINAL_STEPS.map((step) => (
              <RoadmapStepCard
                key={step.id}
                step={step}
              />
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}