"use client";

import { useSyncExternalStore } from "react";

import NotificationModal from "@/components/notifications/NotificationModal";
import { formatMaintenanceTime, maintenanceAnnouncementBody } from "@/lib/maintenanceRules";
import { useSession } from "@/lib/session";

import { useMaintenance } from "./useMaintenance";

// Popup yang sudah ditutup, per akun. Disimpan di localStorage karena belum ada backend.
const STORAGE_KEY = "belajarautomation-maintenance-popup";
const NONE: string[] = [];
const EMPTY: Record<string, string[]> = {};

let cache: Record<string, string[]> | null = null;
const listeners = new Set<() => void>();

function getSnapshot() {
  if (cache === null) {
    try {
      const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}");
      cache = parsed && typeof parsed === "object" ? (parsed as Record<string, string[]>) : {};
    } catch {
      cache = {};
    }
  }
  return cache;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function markSeen(account: string, key: string) {
  const all = getSnapshot();
  const next = { ...all, [account]: [...(all[account] ?? []), key] };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Penyimpanan tidak tersedia; popup hanya tertutup sampai halaman dimuat ulang.
  }
  cache = next;
  listeners.forEach((listener) => listener());
}

// Popup untuk User, Creator, dan Reviewer yang sudah login saat maintenance Terjadwal atau
// Persiapan. Muncul sekali per tahap; muncul lagi bila jadwalnya diubah (PRD FR-16 K).
export default function MaintenancePopup() {
  const session = useSession();
  const { current, phase, isAdmin } = useMaintenance();
  const seen = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);

  if (!session || isAdmin || !current || (phase !== "terjadwal" && phase !== "persiapan")) return null;

  const key = `${current.id}:${phase}:${current.startAt}`;
  if ((seen[session.email] ?? NONE).includes(key)) return null;

  const notification = {
    id: `maintenance-${key}`,
    group: "system" as const,
    title: phase === "persiapan" ? "Maintenance segera dimulai" : "Maintenance terjadwal",
    body:
      phase === "persiapan"
        ? `Maintenance dimulai ${formatMaintenanceTime(current.startAt)}. Selesaikan pekerjaanmu; jawaban tersimpan otomatis, dan kuis serta latihan baru belum bisa dimulai. ${current.message}`
        : maintenanceAnnouncementBody(current),
    createdAt: current.createdAt,
    read: false,
  };

  return <NotificationModal notification={notification} onClose={() => markSeen(session.email, key)} />;
}
