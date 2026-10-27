import {
  ArrowRight,
  Check,
  Crown,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const benefits = [
  "Akses semua materi premium",
  "Source code & project automation",
  "E-book dan update materi terbaru",
];

export default function PremiumSection() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 text-card-foreground shadow-sm">
      {/* Decoration */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative grid items-center gap-8 lg:grid-cols-2">
        {/* Left */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            <Crown className="h-4 w-4" />
            Premium Membership
          </div>

          <h2 className="mt-5 text-3xl font-bold">
            Upgrade skill QA Automation kamu
            ke level berikutnya.
          </h2>

          <p className="mt-3 max-w-xl text-muted-foreground">
            Dapatkan akses penuh ke materi, project, source code,
            dan resource premium untuk mempercepat proses belajarmu.
          </p>

          <Button className="mt-6 rounded-xl">
            Upgrade ke Premium
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Right */}
        <div className="rounded-2xl border border-border bg-background/60 p-6">
          <div className="mb-5 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />

            <h3 className="font-semibold">
              Yang kamu dapatkan
            </h3>
          </div>

          <div className="space-y-4">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-center gap-3"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950">
                  <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>

                <span className="text-sm">
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}