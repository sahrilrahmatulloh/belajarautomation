import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Code2,
  FolderKanban,
  Settings,
  BriefcaseBusiness,
} from "lucide-react";

const steps = [
  {
    label: "Fundamental",
    icon: BookOpen,
  },
  {
    label: "Programming",
    icon: Code2,
  },
  {
    label: "Automation",
    icon: Settings,
  },
  {
    label: "Project",
    icon: FolderKanban,
  },
  {
    label: "Career Ready",
    icon: BriefcaseBusiness,
  },
];

export default function RoadmapCTA() {
  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
        {/* Content */}
        <div className="max-w-md">
          <h2 className="text-xl font-bold text-card-foreground">
            Tidak tahu mulai dari mana?
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
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

        {/* Roadmap Steps */}
        <div className="flex-1 overflow-x-auto">
          <div className="flex min-w-[600px] items-start justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.label}
                  className="flex flex-1 items-start"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>

                    <span className="mt-3 text-xs font-medium">
                      {step.label}
                    </span>
                  </div>

                  {index < steps.length - 1 && (
                    <div className="mt-6 h-px flex-1 bg-border" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}