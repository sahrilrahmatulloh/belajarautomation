"use client";

import { useEffect, useState } from "react";

import { useContentData } from "@/lib/content";
import { isDev } from "@/lib/env";
import { isFinalMinute, maintenancePhase } from "@/lib/maintenanceRules";
import { useSession } from "@/lib/session";
import { MaintenanceWindow } from "@/types/Maintenance";

// Jam yang diperbarui setiap detik, hanya selama ada jadwal yang berjalan.
function useNow(isTicking: boolean) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!isTicking) return;
    const tick = () => setNow(Date.now());
    const first = window.setTimeout(tick, 0);
    const timer = window.setInterval(tick, 1000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(timer);
    };
  }, [isTicking]);

  return now;
}

// Status maintenance untuk seluruh situs (PRD FR-16 K). Simulasi DEV: jadwal tersimpan di
// browser ini. Saat backend tersedia, status wajib diperiksa di server (PRD 8.3).
export function useMaintenance() {
  const session = useSession();
  const windows = useContentData("maintenance", (repository) => repository.listMaintenance());
  const list = isDev ? (windows ?? []) : [];
  const current: MaintenanceWindow | null = list.find((item) => item.status === "terjadwal") ?? null;
  const now = useNow(current !== null);
  const phase = maintenancePhase(current, now);
  const lastEnded = list.filter((item) => item.status === "selesai").at(-1) ?? null;

  return {
    // Sebelum data terbaca, status maintenance belum diketahui.
    isLoaded: !isDev || windows !== undefined,
    current,
    phase,
    now,
    lastEnded,
    isFinalMinute: isFinalMinute(current, now),
    // Admin tetap bisa memakai seluruh situs untuk memeriksa perbaikan.
    isAdmin: session?.roles.includes("admin") ?? false,
    // Dibaca saat aksi berjalan, bukan dari jam yang diperbarui per detik.
    isActiveNow: () => maintenancePhase(current, Date.now()) === "aktif",
  };
}
