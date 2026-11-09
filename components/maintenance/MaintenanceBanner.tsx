"use client";

import Link from "next/link";
import { CalendarClock, CircleCheck, TriangleAlert, Wrench, X } from "lucide-react";

import { dismissInterrupted, useAccountKey, useChallengeDrafts } from "@/lib/challengeDrafts";
import { formatCountdown, formatMaintenanceTime } from "@/lib/maintenanceRules";

import { challengeTitle } from "./MaintenanceScreen";
import { useMaintenance } from "./useMaintenance";

const TONES = {
  info: "border-primary/30 bg-primary/5",
  warning: "border-amber-500/40 bg-amber-500/10",
  urgent: "border-amber-600 bg-amber-100 text-amber-950 dark:bg-amber-950 dark:text-amber-50",
  success: "border-emerald-500/40 bg-emerald-500/10",
};

function Bar({ tone, icon: Icon, children }: { tone: keyof typeof TONES; icon: typeof Wrench; children: React.ReactNode }) {
  return (
    <section aria-label="Pemberitahuan maintenance" className={`flex shrink-0 items-start gap-2 border-b px-4 py-2.5 text-sm sm:px-5 ${TONES[tone]}`}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <div className="min-w-0 flex-1">{children}</div>
    </section>
  );
}

// Pemberitahuan maintenance di atas halaman, untuk setiap tahap (PRD FR-16 K).
export default function MaintenanceBanner() {
  const { current, phase, now, isAdmin, isFinalMinute } = useMaintenance();
  const account = useAccountKey();
  const interrupted = Object.entries(useChallengeDrafts(account)).filter(([, draft]) => draft.interruptedBy !== null);

  if (current && phase === "terjadwal") {
    return (
      <Bar tone="info" icon={CalendarClock}>
        <span className="font-semibold">Maintenance terjadwal</span> {formatMaintenanceTime(current.startAt)} sampai sekitar {formatMaintenanceTime(current.estimatedEndAt)}. {current.message}
      </Bar>
    );
  }

  if (current && phase === "persiapan") {
    const countdown = formatCountdown(Date.parse(current.startAt) - now);

    // Menit terakhir: lebih menonjol, tetapi tetap di area banner agar tidak menutupi tombol Kirim.
    if (isFinalMinute && !isAdmin) {
      return (
        <Bar tone="urgent" icon={TriangleAlert}>
          <p role="alert" className="font-semibold">
            Maintenance dimulai kurang dari 1 menit lagi. Jawaban dan drafmu sudah tersimpan otomatis.
          </p>
          <p className="mt-0.5">
            Sisa waktu <time className="font-semibold tabular-nums">{countdown}</time>. Kirim sekarang bila sudah selesai.
          </p>
        </Bar>
      );
    }

    return (
      <Bar tone="warning" icon={TriangleAlert}>
        <span className="font-semibold">
          Maintenance dimulai dalam <time className="tabular-nums">{countdown}</time>.
        </span>{" "}
        {isAdmin
          ? "Pengguna tidak dapat memulai kuis dan latihan baru."
          : "Selesaikan pekerjaanmu. Jawaban tersimpan otomatis, dan kuis serta latihan baru belum bisa dimulai."}
      </Bar>
    );
  }

  if (current && phase === "aktif") {
    return (
      <Bar tone="warning" icon={Wrench}>
        {isAdmin ? (
          <>
            <span className="font-semibold">Mode maintenance aktif.</span> Hanya Admin yang dapat memakai situs.{" "}
            <Link href="/admin/maintenance" className="font-semibold text-primary-accent underline-offset-2 hover:underline">
              Kelola maintenance
            </Link>
          </>
        ) : (
          <>
            <span className="font-semibold">Situs sedang maintenance.</span> {current.message} Perkiraan selesai {formatMaintenanceTime(current.estimatedEndAt)}. Silakan kembali setelah maintenance selesai.
          </>
        )}
      </Bar>
    );
  }

  if (interrupted.length > 0) {
    return (
      <Bar tone="success" icon={CircleCheck}>
        <div className="flex items-start justify-between gap-3">
          <p>
            <span className="font-semibold">Maintenance selesai.</span> Lanjutkan pekerjaanmu:{" "}
            {interrupted.map(([slug], index) => (
              <span key={slug}>
                {index > 0 && ", "}
                <Link href={`/playground/${slug}`} className="font-semibold text-primary-accent underline-offset-2 hover:underline">
                  {challengeTitle(slug)}
                </Link>
              </span>
            ))}
          </p>
          <button type="button" aria-label="Tutup pemberitahuan" onClick={() => dismissInterrupted(account)} className="rounded-md p-1 hover:bg-accent">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </Bar>
    );
  }

  return null;
}
