"use client";

import { useSyncExternalStore } from "react";

import { Session } from "@/types/Auth";

// SESI DUMMY: disimpan di localStorage karena belum ada autentikasi.
// Bukan proteksi akses; route tetap terbuka (lihat PRD 8.3).
const STORAGE_KEY = "belajarautomation-session";
const ROLES = ["user", "creator", "reviewer", "admin"];

let cache: Session | null | undefined;
const listeners = new Set<() => void>();

function readSession(): Session | null {
  try {
    const parsed: unknown = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY) ?? "null"
    );

    if (
      parsed &&
      typeof parsed === "object" &&
      "name" in parsed &&
      "email" in parsed &&
      "role" in parsed &&
      typeof parsed.name === "string" &&
      typeof parsed.email === "string" &&
      typeof parsed.role === "string" &&
      ROLES.includes(parsed.role)
    ) {
      return parsed as Session;
    }
  } catch {
    // Data rusak atau penyimpanan tidak tersedia.
  }
  return null;
}

function getSnapshot() {
  if (cache === undefined) {
    cache = readSession();
  }
  return cache;
}

function writeSession(session: Session | null) {
  try {
    if (session) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Penyimpanan tidak tersedia; sesi hanya bertahan di memori.
  }
  cache = session;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      cache = undefined;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useSession() {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}

export const sessionActions = {
  signIn(session: Session) {
    writeSession(session);
  },
  signOut() {
    writeSession(null);
  },
};
