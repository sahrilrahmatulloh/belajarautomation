"use client";

import { useSyncExternalStore } from "react";

import { ROLE_HOME } from "@/data/navigation";
import { useSession } from "@/lib/session";
import { NotificationGroup } from "@/types/Notification";
import { UserRole } from "@/types/Role";

// Pengguna dengan peran tambahan punya Mode Belajar dan mode perannya (PRD FR-15). Yang
// disimpan adalah email akun beserta modenya, jadi mode bawaan setiap akun adalah peran
// utamanya dan pilihan satu akun tidak terbawa ke akun lain.
const STORAGE_KEY = "belajarautomation-view-mode";
const LEARNING = "belajar";

let cache: string | null | undefined;
const listeners = new Set<() => void>();

function getSnapshot() {
  if (cache === undefined) {
    try {
      cache = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      cache = null;
    }
  }
  return cache;
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  // Sinkron antar tab.
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

function write(value: string | null) {
  try {
    if (value) window.localStorage.setItem(STORAGE_KEY, value);
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Penyimpanan tidak tersedia; mode hanya bertahan di memori.
  }
  cache = value;
  listeners.forEach((listener) => listener());
}

export const viewModeActions = {
  switchToLearning(email: string) {
    write(`${email}|${LEARNING}`);
  },
  switchToRole(email: string, role: UserRole) {
    write(`${email}|${role}`);
  },
};

export function useViewMode() {
  const session = useSession();
  const stored = useSyncExternalStore(subscribe, getSnapshot, () => null);

  const extraRoles = (session?.roles ?? []).filter((role) => role !== "user");
  const hasRole = extraRoles.length > 0;
  const [storedEmail, storedMode] = stored?.split("|") ?? [];
  const mode = storedEmail === session?.email ? storedMode : undefined;
  const isLearning = !hasRole || mode === LEARNING;
  const activeRole: UserRole = isLearning
    ? "user"
    : (extraRoles.find((role) => role === mode) ?? (session && session.role !== "user" ? session.role : extraRoles[0]));

  return { hasRole, extraRoles, isRoleMode: !isLearning, activeRole, home: ROLE_HOME[activeRole] };
}

// Kelompok notifikasi per mode (PRD FR-15).
const ROLE_MODE_GROUPS: NotificationGroup[] = ["role", "system"];
const LEARNING_MODE_GROUPS: NotificationGroup[] = ["progress", "content", "transaction", "system"];

export function getVisibleNotificationGroups(isRoleMode: boolean) {
  return isRoleMode ? ROLE_MODE_GROUPS : LEARNING_MODE_GROUPS;
}

// Halaman khusus pelajar. Di mode peran, halaman ini menampilkan ajakan beralih mode.
const LEARNER_PATHS = [
  "/cart",
  "/career",
  "/checkout",
  "/ebooks",
  "/leaderboard",
  "/learn",
  "/membership",
  "/playground",
  "/projects",
  "/roadmap",
];

export function isLearnerPath(pathname: string) {
  return LEARNER_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}
