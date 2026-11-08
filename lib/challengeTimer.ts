"use client";

import { useEffect, useEffectEvent, useRef, useState, useSyncExternalStore } from "react";

import { useMaintenance } from "@/components/maintenance/useMaintenance";
import { hasChallengeDraft, useAccountKey } from "@/lib/challengeDrafts";
import { notify } from "@/lib/notify";
import { ChallengeType } from "@/types/Challenge";

// Batas waktu pengerjaan latihan (PRD FR-04). Saat waktu habis, jawaban yang sudah diisi
// dikirim otomatis.
export const CHALLENGE_TIME_LIMIT_MINUTES: Record<ChallengeType, number> = {
  quiz: 15,
  "bug-hunt": 30,
  "test-case": 30,
  locator: 30,
};

// Waktu mulai per akun dan per latihan, agar memuat ulang halaman tidak mengulang waktu.
// Disimpan di browser; nantinya di backend bersama sesi pengerjaan (PRD 7.5).
const STORAGE_KEY = "belajarautomation-challenge-timers";
type Timers = Record<string, Record<string, number>>;
const EMPTY: Timers = {};

let cache: Timers | null = null;
const listeners = new Set<() => void>();

function getSnapshot(): Timers {
  if (cache === null) {
    try {
      const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}");
      cache = parsed && typeof parsed === "object" ? (parsed as Timers) : {};
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

function setStartedAt(account: string, slug: string, startedAt: number | null) {
  const all = getSnapshot();
  const own = { ...(all[account] ?? {}) };
  if (startedAt === null) delete own[slug];
  else own[slug] = startedAt;
  const next = { ...all, [account]: own };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Penyimpanan tidak tersedia; waktu hanya bertahan selama halaman terbuka.
  }
  cache = next;
  listeners.forEach((listener) => listener());
}

const overlap = (startA: number, endA: number, startB: number, endB: number) =>
  Math.max(0, Math.min(endA, endB) - Math.max(startA, startB));

// Sisa waktu dalam milidetik. Waktu berhenti selama maintenance Aktif (PRD FR-16 K): masa
// maintenance yang beririsan dengan pengerjaan tidak dihitung, termasuk bila halaman ditutup.
export function remainingMs(startedAt: number, limitMs: number, now: number, pauses: { start: number; end: number }[]) {
  const paused = pauses.reduce((total, pause) => total + overlap(startedAt, now, pause.start, pause.end), 0);
  return Math.max(0, limitMs - (now - startedAt - paused));
}

export function formatRemaining(ms: number) {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

interface TimerOptions {
  slug: string;
  type: ChallengeType;
  // Waktu berjalan selama latihan sedang dikerjakan (belum ada hasil).
  running: boolean;
  onExpire: () => void;
}

export function useChallengeTimer({ slug, type, running, onExpire }: TimerOptions) {
  const account = useAccountKey();
  const startedAt = useSyncExternalStore(subscribe, () => getSnapshot()[account]?.[slug] ?? null, () => EMPTY[account]?.[slug] ?? null);
  const maintenance = useMaintenance();
  const [now, setNow] = useState(() => Date.now());
  const expired = useRef(false);
  const warned = useRef(false);
  const limitMs = CHALLENGE_TIME_LIMIT_MINUTES[type] * 60 * 1000;

  const pauses: { start: number; end: number }[] = [];
  if (!maintenance.isAdmin) {
    if (maintenance.current && maintenance.phase === "aktif") {
      pauses.push({ start: new Date(maintenance.current.startAt).getTime(), end: now });
    }
    if (maintenance.lastEnded?.endedAt) {
      pauses.push({ start: new Date(maintenance.lastEnded.startAt).getTime(), end: new Date(maintenance.lastEnded.endedAt).getTime() });
    }
  }
  const remaining = startedAt === null ? limitMs : remainingMs(startedAt, limitMs, now, pauses);

  // Memulai waktu saat latihan dibuka. Pengerjaan lama yang waktunya sudah habis tanpa jawaban
  // tersimpan dimulai ulang; yang punya jawaban dikirim otomatis oleh efek di bawah.
  useEffect(() => {
    if (!running) return;
    const stored = getSnapshot()[account]?.[slug];
    const current = Date.now();
    if (stored === undefined || (!hasChallengeDraft(account, slug) && current - stored >= limitMs)) {
      expired.current = false;
      warned.current = false;
      setStartedAt(account, slug, current);
    }
  }, [running, account, slug, limitMs]);

  useEffect(() => {
    if (!running) return;
    const tick = () => setNow(Date.now());
    const first = window.setTimeout(tick, 0);
    const timer = window.setInterval(tick, 1000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(timer);
    };
  }, [running]);

  const expire = useEffectEvent(() => {
    notify.info("Waktu habis. Jawabanmu dikirim otomatis.");
    onExpire();
  });
  const warn = useEffectEvent(() => notify.warning("Sisa waktu 1 menit."));

  useEffect(() => {
    if (!running || startedAt === null || !maintenance.isLoaded) return;
    if (remaining <= 0 && !expired.current) {
      expired.current = true;
      expire();
    } else if (remaining > 0 && remaining <= 60 * 1000 && !warned.current) {
      warned.current = true;
      warn();
    }
  }, [running, startedAt, remaining, maintenance.isLoaded]);

  return {
    remaining,
    limitMinutes: CHALLENGE_TIME_LIMIT_MINUTES[type],
    isPaused: pauses.some((pause) => pause.end === now),
    // Setelah jawaban terkirim: pengerjaan berikutnya mulai dengan waktu penuh.
    stop: () => setStartedAt(account, slug, null),
    // Mengulang latihan dari awal.
    restart: () => {
      expired.current = false;
      warned.current = false;
      setStartedAt(account, slug, Date.now());
    },
  };
}
