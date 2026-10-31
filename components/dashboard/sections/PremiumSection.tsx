import {
  ArrowRight,
  Check,
  Crown,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const benefits = [
  "Tema visual & warna aksen tambahan",
  "3 klaim eBook",
  "3 klaim project",
];

export default function PremiumSection() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm sm:p-8">

      <div className="relative grid items-center gap-8 lg:grid-cols-2">
        {/* Left */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <Crown className="h-4 w-4" />
            Premium Lifetime
          </div>

          <h2 className="mt-5 text-3xl font-bold">
            Personalisasi pengalaman
            belajarmu, sekali beli selamanya.
          </h2>

          <p className="mt-3 max-w-xl text-muted-foreground">
            Semua materi tetap gratis. Premium memberi tema visual,
            warna aksen tambahan, serta klaim eBook dan project, tanpa
            keunggulan XP, rank, maupun leaderboard.
          </p>

          <Button disabled className="mt-6 cursor-not-allowed rounded-xl opacity-50">
            Upgrade belum tersedia
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Right */}
        <div className="rounded-2xl border border-border bg-background/60 p-6">
          <div className="mb-5 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />

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
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Check className="h-4 w-4 text-primary" />
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
