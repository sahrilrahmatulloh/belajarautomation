"use client";

import { useId } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  Code2,
  FolderKanban,
  Settings,
  BriefcaseBusiness,
} from "lucide-react";

import {
  setRoadmapCtaCollapsed,
  useRoadmapCtaCollapsed,
} from "@/lib/roadmapCtaPreference";

// Titik pemberhentian di peta. x/y memakai koordinat viewBox SVG (520 x 260);
// titik "atas" menaruh label di atas lingkaran agar label tidak bertumpuk.
const steps = [
  { label: "Fundamental", icon: BookOpen, x: 45, y: 190, labelAbove: false },
  { label: "Programming", icon: Code2, x: 150, y: 80, labelAbove: true },
  { label: "Automation", icon: Settings, x: 260, y: 180, labelAbove: false },
  { label: "Project", icon: FolderKanban, x: 370, y: 75, labelAbove: true },
  { label: "Career Ready", icon: BriefcaseBusiness, x: 475, y: 170, labelAbove: false },
];

const TRAIL =
  "M45 190 C 95 190, 100 80, 150 80 S 210 180, 260 180 S 320 75, 370 75 S 425 170, 475 170";

function RoadmapTrailMap() {
  return (
    <div className="relative mx-auto aspect-[2/1] w-full max-w-xl">
      <svg
        viewBox="0 0 520 260"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <pattern id="roadmap-map-dots" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" className="fill-border" />
          </pattern>
        </defs>
        <rect width="520" height="260" rx="20" fill="url(#roadmap-map-dots)" />
        {/* Badan jalan, lalu marka putus-putus di tengahnya. */}
        <path
          d={TRAIL}
          fill="none"
          strokeWidth="16"
          strokeLinecap="round"
          className="stroke-primary/10"
        />
        <path
          d={TRAIL}
          fill="none"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="2 9"
          className="stroke-primary/60"
        />
      </svg>

      <ol className="absolute inset-0">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isLast = index === steps.length - 1;

          return (
            <li
              key={step.label}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${(step.x / 520) * 100}%`, top: `${(step.y / 260) * 100}%` }}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 shadow-sm sm:h-11 sm:w-11 ${
                  isLast
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-primary/30 bg-card text-primary"
                }`}
              >
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
              </span>
              <span
                className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-semibold sm:text-xs ${
                  step.labelAbove ? "bottom-full mb-1.5" : "top-full mt-1.5"
                }`}
              >
                <span className="sr-only">Langkah {index + 1}: </span>
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default function RoadmapCTA() {
  const collapsed = useRoadmapCtaCollapsed();
  const contentId = useId();

  return (
    <section
      aria-labelledby={`${contentId}-title`}
      className={`overflow-hidden rounded-3xl border border-border bg-card shadow-sm ${
        collapsed ? "px-6 py-4 sm:px-8" : "p-6 sm:p-8"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <h2 id={`${contentId}-title`} className="text-xl font-bold text-card-foreground">
          Tidak tahu mulai dari mana?
        </h2>

        <button
          type="button"
          aria-expanded={!collapsed}
          aria-controls={contentId}
          onClick={() => setRoadmapCtaCollapsed(!collapsed)}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          {collapsed ? "Tampilkan" : "Sembunyikan"}
          <ChevronDown
            className={`h-4 w-4 transition-transform ${collapsed ? "" : "rotate-180"}`}
            aria-hidden="true"
          />
        </button>
      </div>

      <div
        id={contentId}
        hidden={collapsed}
        className="mt-2 flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-10"
      >
        {/* Content */}
        <div className="max-w-md shrink-0">
          <p className="text-sm leading-6 text-muted-foreground">
            Ikuti roadmap terstruktur yang sudah kami siapkan
            sesuai tujuan karirmu.
          </p>

          <Link
            href="/roadmap"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Lihat Roadmap
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Peta jalur roadmap */}
        <div className="min-w-0 flex-1">
          <RoadmapTrailMap />
        </div>
      </div>
    </section>
  );
}
