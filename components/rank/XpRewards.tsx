import { Sparkles } from "lucide-react";

import { XP_REWARDS } from "@/data/xp";

// Cara mendapatkan XP (PRD FR-05, Sistem XP).
export default function XpRewards() {
  return (
    <section id="cara-mendapatkan-xp" aria-labelledby="xp-rewards-title" className="scroll-mt-20 space-y-4">
      <div>
        <h2 id="xp-rewards-title" className="flex items-center gap-2 text-xl font-bold">
          <Sparkles className="h-5 w-5 text-primary-accent" aria-hidden="true" />
          Cara Mendapatkan XP
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">XP diberikan atas aktivitas belajar yang valid.</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <ul className="divide-y divide-border text-sm">
          {XP_REWARDS.map((reward) => (
            <li key={reward.activity} className="flex items-center justify-between gap-3 py-2">
              <span className="text-muted-foreground">{reward.activity}</span>
              <span className="shrink-0 font-semibold tabular-nums">+{reward.xp} XP</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          XP hanya diberikan saat aktivitas diselesaikan pertama kali. Mengulang lesson, kuis, atau challenge tetap
          boleh, tetapi tidak menambah XP. Pembelian tidak menambah XP.
        </p>
      </div>
    </section>
  );
}
