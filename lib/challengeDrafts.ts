"use client";

import { useSyncExternalStore } from "react";

import { useSession } from "@/lib/session";

// Jawaban latihan yang belum dikirim, disimpan setiap kali jawaban berubah agar tidak hilang saat
// maintenance (PRD FR-16 K). Disimpan per akun di localStorage; nantinya di backend (PRD 7.5).
const STORAGE_KEY = "belajarautomation-challenge-drafts";
const GUEST = "tamu";

export interface ChallengeDraft {
  state: unknown;
  // Ringkasan untuk halaman maintenance, mis. "7 dari 10 soal terjawab".
  summary: string;
  updatedAt: string;
  // Dikirim saat maintenance Aktif: dikirim otomatis setelah maintenance selesai.
  pendingSubmit: boolean;
  // Jadwal maintenance yang memotong pengerjaan, untuk ajakan melanjutkan.
  interruptedBy: string | null;
}

type AccountDrafts = Record<string, ChallengeDraft>;
type Drafts = Record<string, AccountDrafts>;

const EMPTY: Drafts = {};
const NO_DRAFTS: AccountDrafts = {};

let cache: Drafts | null = null;
const listeners = new Set<() => void>();

function read(): Drafts {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}");
    return parsed && typeof parsed === "object" ? (parsed as Drafts) : {};
  } catch {
    return {};
  }
}

function getSnapshot() {
  if (cache === null) cache = read();
  return cache;
}

function write(next: Drafts) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Penyimpanan tidak tersedia; jawaban hanya bertahan di memori.
  }
  cache = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);

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

function updateAccount(account: string, change: (drafts: AccountDrafts) => AccountDrafts) {
  const all = getSnapshot();
  write({ ...all, [account]: change(all[account] ?? {}) });
}

// Dibaca langsung dari penyimpanan, mis. saat halaman baru dimuat dan hook belum menerima data.
export function hasChallengeDraft(account: string, slug: string) {
  return Boolean(getSnapshot()[account]?.[slug]);
}

export function useAccountKey() {
  return useSession()?.email ?? GUEST;
}

export function useChallengeDrafts(account: string) {
  const drafts = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
  return drafts[account] ?? NO_DRAFTS;
}

// Menandai semua pekerjaan yang terpotong maintenance, untuk ajakan "Lanjutkan" setelahnya.
export function markDraftsInterrupted(account: string, windowId: string) {
  const drafts = getSnapshot()[account];
  if (!drafts || Object.values(drafts).every((draft) => draft.interruptedBy === windowId)) return;
  updateAccount(account, (current) => Object.fromEntries(Object.entries(current).map(([slug, draft]) => [slug, { ...draft, interruptedBy: windowId }])));
}

export function dismissInterrupted(account: string) {
  updateAccount(account, (current) => Object.fromEntries(Object.entries(current).map(([slug, draft]) => [slug, { ...draft, interruptedBy: null }])));
}

// Pengganti useState untuk jawaban latihan: setiap perubahan langsung tersimpan.
export function useChallengeDraft<T>(slug: string, initial: T, summarize: (state: T) => string) {
  const account = useAccountKey();
  const draft = useChallengeDrafts(account)[slug];
  const state = draft ? (draft.state as T) : initial;

  const setState = (next: T | ((current: T) => T)) => {
    const latest = getSnapshot()[account]?.[slug];
    const base = latest ? (latest.state as T) : initial;
    const value = typeof next === "function" ? (next as (current: T) => T)(base) : next;
    updateAccount(account, (current) => ({
      ...current,
      [slug]: { state: value, summary: summarize(value), updatedAt: new Date().toISOString(), pendingSubmit: false, interruptedBy: latest?.interruptedBy ?? null },
    }));
  };

  const setPendingSubmit = (pendingSubmit: boolean) => {
    const latest = getSnapshot()[account]?.[slug];
    if (latest) updateAccount(account, (current) => ({ ...current, [slug]: { ...latest, pendingSubmit } }));
  };

  // Dipanggil setelah jawaban terkirim atau saat mengulang dari awal.
  const clear = () => {
    if (!getSnapshot()[account]?.[slug]) return;
    updateAccount(account, (current) => Object.fromEntries(Object.entries(current).filter(([key]) => key !== slug)));
  };

  return { state, setState, clear, hasDraft: Boolean(draft), isPendingSubmit: draft?.pendingSubmit ?? false, setPendingSubmit };
}
