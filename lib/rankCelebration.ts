"use client";

import { useSyncExternalStore } from "react";

// Rank yang sudah dirayakan per akun (PRD FR-05), agar popup naik rank muncul sekali per rank
// dan di halaman mana pun: saat total XP melewati batas rank yang belum dirayakan, popup
// tampil, termasuk bila XP bertambah dari perangkat lain atau koreksi Admin.
// Disimpan di browser; perangkat baru mencatat rank saat ini tanpa popup.
const STORAGE_KEY = "belajarautomation-rank-celebrated";

interface CelebrationState {
  // minXp rank tertinggi yang sudah dirayakan atau sudah dimiliki saat pertama tercatat.
  celebrated: number;
  // minXp rank yang popup-nya sedang menunggu ditutup.
  showing: number | null;
}

type Store = Record<string, CelebrationState>;
const EMPTY: Store = {};

let cache: Store | null = null;
const listeners = new Set<() => void>();

function getSnapshot(): Store {
  if (cache === null) {
    try {
      const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}");
      cache = parsed && typeof parsed === "object" ? (parsed as Store) : {};
    } catch {
      cache = {};
    }
  }
  return cache;
}

function write(account: string, state: CelebrationState) {
  const next = { ...getSnapshot(), [account]: state };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Penyimpanan tidak tersedia; status hanya bertahan selama halaman terbuka.
  }
  cache = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// Mengembalikan true bila rank ini baru saja dicapai dan popup perlu tampil.
export function syncCelebratedRank(account: string, currentMinXp: number) {
  const state = getSnapshot()[account];
  if (!state) {
    write(account, { celebrated: currentMinXp, showing: null });
    return false;
  }
  if (currentMinXp <= state.celebrated) return false;
  write(account, { celebrated: currentMinXp, showing: currentMinXp });
  return true;
}

export function dismissRankCelebration(account: string) {
  const state = getSnapshot()[account];
  if (state?.showing !== null && state) write(account, { ...state, showing: null });
}

// minXp rank yang popup-nya perlu tampil, atau null.
export function useShowingRankCelebration(account: string | undefined) {
  const store = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
  return account ? (store[account]?.showing ?? null) : null;
}
