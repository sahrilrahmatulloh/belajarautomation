"use client";

import { useSyncExternalStore } from "react";

// Alert singkat di atas layar untuk hasil aksi (simpan, buat, ubah, hapus) dan status
// koneksi internet (PRD 4.6). Dipanggil dari mana saja: notify.success("Profil tersimpan.").

export type NotifyTone = "success" | "error" | "info" | "warning";

export interface NotifyItem {
  id: string;
  tone: NotifyTone;
  message: string;
  // Tetap tampil sampai ditutup atau diganti, mis. alert offline.
  persistent: boolean;
}

interface NotifyOptions {
  // Alert dengan id yang sama menggantikan alert sebelumnya.
  id?: string;
  persistent?: boolean;
}

export const NOTIFY_LIMIT = 3;
export const NOTIFY_DURATION_MS: Record<NotifyTone, number> = {
  success: 4000,
  info: 4000,
  warning: 8000,
  error: 8000,
};

const EMPTY: NotifyItem[] = [];
let items: NotifyItem[] = EMPTY;
let counter = 0;
const timers = new Map<string, ReturnType<typeof setTimeout>>();
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function dismiss(id: string) {
  const timer = timers.get(id);
  if (timer) clearTimeout(timer);
  timers.delete(id);
  if (!items.some((item) => item.id === id)) return;
  items = items.filter((item) => item.id !== id);
  emit();
}

function push(tone: NotifyTone, message: string, options: NotifyOptions = {}) {
  counter += 1;
  const id = options.id ?? `notify-${counter}`;
  const persistent = options.persistent ?? false;

  const existingTimer = timers.get(id);
  if (existingTimer) clearTimeout(existingTimer);
  timers.delete(id);

  // Alert terbaru di atas; yang paling lama dibuang bila lebih dari batas.
  const next = [{ id, tone, message, persistent }, ...items.filter((item) => item.id !== id)];
  for (const removed of next.slice(NOTIFY_LIMIT)) {
    const timer = timers.get(removed.id);
    if (timer) clearTimeout(timer);
    timers.delete(removed.id);
  }
  items = next.slice(0, NOTIFY_LIMIT);
  emit();

  if (!persistent) timers.set(id, setTimeout(() => dismiss(id), NOTIFY_DURATION_MS[tone]));
  return id;
}

export const notify = {
  success: (message: string, options?: NotifyOptions) => push("success", message, options),
  error: (message: string, options?: NotifyOptions) => push("error", message, options),
  info: (message: string, options?: NotifyOptions) => push("info", message, options),
  warning: (message: string, options?: NotifyOptions) => push("warning", message, options),
  dismiss,
};

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useNotifications() {
  return useSyncExternalStore(subscribe, () => items, () => EMPTY);
}
