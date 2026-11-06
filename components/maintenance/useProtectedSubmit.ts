"use client";

import { useEffect, useEffectEvent } from "react";

import { useMaintenance } from "./useMaintenance";

interface PendingDraft {
  isPendingSubmit: boolean;
  setPendingSubmit: (pending: boolean) => void;
}

// Jawaban yang dikirim saat maintenance Aktif tidak hilang: disimpan sebagai kiriman tertunda,
// lalu dikirim otomatis setelah maintenance selesai (PRD FR-16 K).
export function useProtectedSubmit(draft: PendingDraft, submit: () => void) {
  const maintenance = useMaintenance();
  const isBlocked = !maintenance.isAdmin && maintenance.phase === "aktif";

  // Waktu dibaca langsung: tahap di render bisa tertinggal hingga satu detik dari jam sebenarnya.
  const resume = useEffectEvent(() => {
    if (!maintenance.isAdmin && maintenance.isActiveNow()) return;
    draft.setPendingSubmit(false);
    submit();
  });

  useEffect(() => {
    if (draft.isPendingSubmit && maintenance.isLoaded && !isBlocked) resume();
  }, [draft.isPendingSubmit, maintenance.isLoaded, isBlocked]);

  return () => {
    if (!maintenance.isAdmin && maintenance.isActiveNow()) {
      draft.setPendingSubmit(true);
      return;
    }
    submit();
  };
}
