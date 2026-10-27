import Link from "next/link";
import { ArrowLeft, Clock3, Layers3 } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import RoadmapStepCard from "@/components/roadmap/RoadmapStepCard";
import { WEB_AUTOMATION_STEPS } from "@/data/webAutomationRoadmap";

export default function WebAutomationRoadmapPage() {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl space-y-10">
        <Link
          href="/roadmap"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Roadmap
        </Link>

        <section>
          <h1 className="text-4xl font-bold tracking-tight">
            Web Automation Engineer
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
            Jalur spesialisasi untuk membangun automation testing
            aplikasi web dari fundamental hingga CI/CD.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-full bg-muted px-4 py-2 text-sm">
              Beginner → Advanced
            </span>

            <span className="flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm">
              <Layers3 className="h-4 w-4" />
              {WEB_AUTOMATION_STEPS.length} Tahap
            </span>

            <span className="flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm">
              <Clock3 className="h-4 w-4" />
              3–4 Bulan
            </span>
          </div>
        </section>

        <section className="space-y-4">
          {WEB_AUTOMATION_STEPS.map((step) => (
            <RoadmapStepCard key={step.id} step={step} />
          ))}
        </section>
      </div>
    </DashboardLayout>
  );
}