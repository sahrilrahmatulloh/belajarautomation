"use client";

import { useSyncExternalStore } from "react";

// Preferensi tampilan ya/tidak yang disimpan di browser ini (belum ada backend).
// Bila storage tidak tersedia, pilihan hanya berlaku sampai halaman dimuat ulang.
export function createBooleanPreference(storageKey: string, defaultValue = false) {
  const listeners = new Set<() => void>();
  let memoryValue: boolean | null = null;

  function getSnapshot() {
    if (memoryValue !== null) return memoryValue;
    try {
      const stored = window.localStorage.getItem(storageKey);
      return stored === null ? defaultValue : stored === "1";
    } catch {
      return defaultValue;
    }
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }

  function set(value: boolean) {
    memoryValue = value;
    try {
      if (value === defaultValue) window.localStorage.removeItem(storageKey);
      else window.localStorage.setItem(storageKey, value ? "1" : "0");
    } catch {
      // Penyimpanan tidak tersedia; abaikan.
    }
    listeners.forEach((listener) => listener());
  }

  function useValue() {
    return useSyncExternalStore(subscribe, getSnapshot, () => defaultValue);
  }

  return { set, useValue };
}
