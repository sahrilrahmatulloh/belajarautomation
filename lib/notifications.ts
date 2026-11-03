"use client";

import { useMemo, useSyncExternalStore } from "react";

import { DUMMY_NOTIFICATIONS } from "@/data/dummy/notifications";
import { useNotificationPreferences } from "@/lib/notificationPreferences";
import { useSession } from "@/lib/session";
import { Notification } from "@/types/Notification";

// Status dibaca disimpan di localStorage browser, satu sumber untuk lonceng, popover,
// dan halaman. Nantinya status dibaca disimpan per pengguna di backend (PRD 4.4).
const STORAGE_KEY = "belajarautomation-notifications-read";
const EMPTY: string[] = [];

let cache: string[] | null = null;
const listeners = new Set<() => void>();

function readIds(): string[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function getSnapshot() {
  if (cache === null) cache = readIds();
  return cache;
}

function write(ids: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Penyimpanan tidak tersedia (mis. mode privat); status hanya di memori.
  }
  cache = ids;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  // Sinkron antar tab.
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

// Notifikasi untuk pengguna saat ini, terbaru lebih dulu. Notifikasi khusus role hanya
// tampil untuk role tersebut, dan kelompok yang dimatikan di pengaturan tidak ditampilkan.
export function useNotifications() {
  const session = useSession();
  const readIdList = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
  const { mutedGroups } = useNotificationPreferences();

  return useMemo<Notification[]>(() => {
    const readSet = new Set(readIdList);
    return DUMMY_NOTIFICATIONS.filter((item) => !item.role || item.role === session?.role)
      .filter((item) => !mutedGroups.includes(item.group))
      .map((item) => ({ ...item, read: item.read || readSet.has(item.id) }))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [readIdList, session?.role, mutedGroups]);
}

export const notificationActions = {
  markRead(ids: string[]) {
    write([...new Set([...getSnapshot(), ...ids])]);
  },
};
