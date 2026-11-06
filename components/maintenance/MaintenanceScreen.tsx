"use client";

import { ShieldCheck, Wrench } from "lucide-react";

import { CHALLENGES } from "@/data/challenges";
import { useAccountKey, useChallengeDrafts } from "@/lib/challengeDrafts";
import { formatMaintenanceTime } from "@/lib/maintenanceRules";
import { sessionActions, useSession } from "@/lib/session";
import { MaintenanceWindow } from "@/types/Maintenance";

export function challengeTitle(slug: string) {
  return CHALLENGES.find((item) => item.slug === slug)?.title ?? slug;
}

// Halaman pengganti seluruh situs selama maintenance Aktif (PRD FR-16 K).
export default function MaintenanceScreen({ window: maintenance }: { window: MaintenanceWindow }) {
  const session = useSession();
  const drafts = Object.entries(useChallengeDrafts(useAccountKey()));

  return (
    <main className="grid min-h-dvh place-items-center bg-background px-4 py-10 text-foreground">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 text-center sm:p-8">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-amber-500/15 text-amber-700 dark:text-amber-300">
          <Wrench className="h-7 w-7" aria-hidden="true" />
        </span>
        <h1 className="mt-4 text-2xl font-bold tracking-tight">Situs sedang maintenance</h1>
        <p className="mt-2 leading-7 text-muted-foreground">{maintenance.message}</p>
        <p className="mt-3 text-sm font-medium">Perkiraan selesai: {formatMaintenanceTime(maintenance.estimatedEndAt)}</p>

        {drafts.length > 0 && (
          <section aria-labelledby="pekerjaan-tersimpan" className="mt-6 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-left">
            <h2 id="pekerjaan-tersimpan" className="flex items-center gap-2 font-semibold text-emerald-800 dark:text-emerald-200">
              <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
              Pekerjaanmu aman
            </h2>
            <ul className="mt-2 space-y-1.5 text-sm">
              {drafts.map(([slug, draft]) => (
                <li key={slug}>
                  <span className="font-semibold">{challengeTitle(slug)}:</span> {draft.summary}, tersimpan.
                  {draft.pendingSubmit && " Jawaban akan dikirim otomatis setelah maintenance selesai."}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-sm text-muted-foreground">Kamu bisa melanjutkan dari titik terakhir setelah maintenance selesai.</p>
          </section>
        )}

        <p className="mt-6 text-sm text-muted-foreground">Terima kasih atas kesabaranmu. Silakan kembali setelah maintenance selesai.</p>

        {session && (
          <button type="button" onClick={() => sessionActions.signOut()} className="mt-3 text-sm font-semibold text-primary-accent hover:underline">
            Keluar dari akun
          </button>
        )}
      </div>
    </main>
  );
}
