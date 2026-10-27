import Link from "next/link";
import {
  ArrowLeft,
  Clock3,
  Layers3,
  Sparkles,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import RoadmapStepCard from "@/components/roadmap/RoadmapStepCard";
import { VIBE_CODING_STEPS } from "@/data/vibeCodingRoadmap";

export default function VibeCodingQARoadmapPage() {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl space-y-10">
        {/* Back */}
        <Link
          href="/roadmap"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Roadmap
        </Link>

        {/* Header */}
        <section>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-xs font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            Modern QA Workflow
          </div>

          <h1 className="text-4xl font-bold tracking-tight">
            Vibe Coding QA Engineer
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
            Jalur modern untuk membangun test automation dengan bantuan
            AI coding tools dan agents tanpa mengabaikan review,
            debugging, dan engineering practice.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-full bg-muted px-4 py-2 text-sm">
              Intermediate
            </span>

            <span className="flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm">
              <Layers3 className="h-4 w-4" />
              {VIBE_CODING_STEPS.length} Tahap
            </span>

            <span className="flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm">
              <Clock3 className="h-4 w-4" />
              2–3 Bulan
            </span>
          </div>
        </section>

        {/* Roadmap Steps */}
        <section className="space-y-4">
          {VIBE_CODING_STEPS.map((step) => (
            <RoadmapStepCard
              key={step.id}
              step={step}
            />
          ))}
        </section>
      </div>
    </DashboardLayout>
  );
}