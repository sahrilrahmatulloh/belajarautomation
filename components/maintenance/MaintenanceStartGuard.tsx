"use client";

import { useState } from "react";
import { TriangleAlert } from "lucide-react";

import { useAccountKey, useChallengeDrafts } from "@/lib/challengeDrafts";
import { formatMaintenanceTime, prepStartTime } from "@/lib/maintenanceRules";

import { useMaintenance } from "./useMaintenance";

// Selama tahap Persiapan, latihan baru tidak dapat dimulai. Latihan yang sudah dikerjakan, atau
// halamannya sudah terbuka sebelum Persiapan, tetap boleh diselesaikan (PRD FR-16 K).
export default function MaintenanceStartGuard({ slug, children }: { slug: string; children: React.ReactNode }) {
  const { current, phase, isAdmin } = useMaintenance();
  const hasDraft = Boolean(useChallengeDrafts(useAccountKey())[slug]);
  const [openedAt] = useState(() => Date.now());
  const isBlocked = current !== null && phase === "persiapan" && !isAdmin && !hasDraft && openedAt >= prepStartTime(current);

  if (!isBlocked) return children;

  return (
    <section className="flex items-start gap-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 sm:p-5">
      <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-300" aria-hidden="true" />
      <div>
        <h2 className="font-semibold">Latihan baru belum bisa dimulai</h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Maintenance dimulai {formatMaintenanceTime(current.startAt)}. Agar pekerjaanmu tidak terpotong, mulai latihan ini setelah maintenance selesai.
        </p>
      </div>
    </section>
  );
}
