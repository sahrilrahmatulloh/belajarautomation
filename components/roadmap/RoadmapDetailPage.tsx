import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Layers3,
  ListChecks,
  Target,
  Wrench,
} from "lucide-react";

import { Roadmap } from "@/types/Roadmap";

import RoadmapTimeline from "./RoadmapTimeline";

interface RoadmapDetailPageProps {
  roadmap: Roadmap;
}

export default function RoadmapDetailPage({
  roadmap,
}: RoadmapDetailPageProps) {
  const Icon = roadmap.icon;

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <Link
        href="/roadmap"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Roadmap
      </Link>

      {/* Informasi jalur */}
      <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Icon className="h-7 w-7" />
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {roadmap.title}
            </h1>

            <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
              {roadmap.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium">
                {roadmap.level}
              </span>

              <span className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-medium">
                <Layers3 className="h-3.5 w-3.5" />
                {roadmap.steps.length} Langkah
              </span>

              <span className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-medium">
                <Clock3 className="h-3.5 w-3.5" />
                {roadmap.duration}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 border-t border-border pt-6 md:grid-cols-3">
          <div>
            <h2 className="flex items-center gap-2 font-semibold">
              <Target className="h-5 w-5 text-primary" />
              Tujuan
            </h2>

            <ul className="mt-3 space-y-2">
              {roadmap.goals.map((goal) => (
                <li
                  key={goal}
                  className="flex items-start gap-2 text-sm leading-6 text-muted-foreground"
                >
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" />
                  {goal}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="flex items-center gap-2 font-semibold">
              <Wrench className="h-5 w-5 text-primary" />
              Skill
            </h2>

            <div className="mt-3 flex flex-wrap gap-2">
              {roadmap.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h2 className="flex items-center gap-2 font-semibold">
              <ListChecks className="h-5 w-5 text-primary" />
              Prasyarat
            </h2>

            <ul className="mt-3 space-y-2">
              {roadmap.prerequisites.map((prerequisite) => (
                <li
                  key={prerequisite}
                  className="flex items-start gap-2 text-sm leading-6 text-muted-foreground"
                >
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
                  {prerequisite}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Visualisasi */}
      <section>
        <h2 className="text-2xl font-bold">
          Alur Belajar
        </h2>

        <p className="mt-1 text-muted-foreground">
          Ikuti langkah dari atas ke bawah. Progres belum disimpan.
        </p>

        <div className="mt-8">
          <RoadmapTimeline steps={roadmap.steps} />
        </div>
      </section>
    </div>
  );
}
