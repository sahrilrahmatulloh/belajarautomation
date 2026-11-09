"use client";

import { useSyncExternalStore } from "react";

import { Notification } from "@/types/Notification";

// Notifikasi naik rank (PRD FR-05, kelompok Progres), per akun. Disimpan di browser sampai
// notifikasi tersedia di backend (Fase 7).
const STORAGE_KEY = "belajarautomation-rank-up-notifications";
const EMPTY: Record<string, Notification[]> = {};

let cache: Record<string, Notification[]> | null = null;
const listeners = new Set<() => void>();

function getSnapshot() {
  if (cache === null) {
    try {
      const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}");
      cache = parsed && typeof parsed === "object" ? (parsed as Record<string, Notification[]>) : {};
    } catch {
      cache = {};
    }
  }
  return cache;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function addRankUpNotification(account: string, rankName: string) {
  const all = getSnapshot();
  const createdAt = new Date().toISOString();
  const item: Notification = {
    id: `rank-up-${account}-${rankName}`,
    group: "progress",
    title: `Naik rank ke ${rankName}`,
    body: `Selamat, kamu sekarang ${rankName}. Lihat rank berikutnya dan cara mendapatkan XP.`,
    href: "/rank",
    createdAt,
    read: false,
  };
  // Satu notifikasi per rank; rank yang sama tidak dicatat dua kali.
  const own = (all[account] ?? []).filter((existing) => existing.id !== item.id);
  const next = { ...all, [account]: [item, ...own] };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Penyimpanan tidak tersedia; notifikasi hanya di memori.
  }
  cache = next;
  listeners.forEach((listener) => listener());
}

export function useRankUpNotifications(account: string | undefined) {
  const all = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
  return account ? (all[account] ?? []) : [];
}
