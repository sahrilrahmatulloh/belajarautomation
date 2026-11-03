"use client";

import { useSyncExternalStore } from "react";

import { NotificationGroup } from "@/types/Notification";

// Kelompok yang dapat dimatikan. Transaksi serta Akun dan sistem selalu aktif (PRD 4.4).
export const MUTABLE_GROUPS: NotificationGroup[] = ["progress", "content", "role"];
export const ALWAYS_ON_GROUPS: NotificationGroup[] = ["transaction", "system"];

export interface NotificationPreferences {
  mutedGroups: NotificationGroup[];
  email: boolean;
}

// Preferensi disimpan di localStorage browser. Nantinya disimpan per pengguna di backend.
const STORAGE_KEY = "belajarautomation-notification-preferences";
const DEFAULT_PREFERENCES: NotificationPreferences = { mutedGroups: [], email: false };

let cache: NotificationPreferences | null = null;
const listeners = new Set<() => void>();

function readPreferences(): NotificationPreferences {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null");
    if (!parsed) return DEFAULT_PREFERENCES;
    return {
      mutedGroups: Array.isArray(parsed.mutedGroups)
        ? MUTABLE_GROUPS.filter((group) => parsed.mutedGroups.includes(group))
        : [],
      email: parsed.email === true,
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

function getSnapshot() {
  if (cache === null) cache = readPreferences();
  return cache;
}

function write(preferences: NotificationPreferences) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch {
    // Penyimpanan tidak tersedia (mis. mode privat); preferensi hanya di memori.
  }
  cache = preferences;
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

export function useNotificationPreferences() {
  return useSyncExternalStore(subscribe, getSnapshot, () => DEFAULT_PREFERENCES);
}

export const notificationPreferenceActions = {
  setGroupEnabled(group: NotificationGroup, enabled: boolean) {
    const current = getSnapshot();
    const others = current.mutedGroups.filter((item) => item !== group);
    write({ ...current, mutedGroups: enabled ? others : [...others, group] });
  },
  setEmail(email: boolean) {
    write({ ...getSnapshot(), email });
  },
};
