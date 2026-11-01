"use client";

import { useSyncExternalStore } from "react";

// Mengingat apakah CTA roadmap di halaman Belajar disembunyikan pengguna.
// Hanya preferensi tampilan di browser ini; bila storage tidak tersedia,
// pilihan hanya berlaku sampai halaman dimuat ulang.
const STORAGE_KEY = "belajarautomation-roadmap-cta-collapsed";
const listeners = new Set<() => void>();
let memoryValue: boolean | null = null;

function getSnapshot() {
  if (memoryValue !== null) return memoryValue;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setRoadmapCtaCollapsed(collapsed: boolean) {
  memoryValue = collapsed;
  try {
    if (collapsed) window.localStorage.setItem(STORAGE_KEY, "1");
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Penyimpanan tidak tersedia; abaikan.
  }
  listeners.forEach((listener) => listener());
}

export function useRoadmapCtaCollapsed() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
