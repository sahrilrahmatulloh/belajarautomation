"use client";

import { useCallback, useSyncExternalStore } from "react";

import { DUMMY_CHALLENGE_SCORES } from "@/data/dummy/challengeAttempts";
import { XP_PER_CHALLENGE, XP_PER_QUIZ } from "@/data/xp";
import { getCompletedChallengeSlugs } from "@/lib/activity";
import { ChallengeType } from "@/types/Challenge";
import { refreshRealProgress, useIsRealAccount, useRealProgress } from "@/lib/realProgress";
import { ChallengeScore } from "@/types/ChallengeDetail";

// Hasil latihan (PRD FR-05).
// - Akun Supabase: dicatat server saat penilaian (app/playground/[slug]/actions.ts) dan dibaca
//   dari database (lib/realProgress.ts).
// - Akun demo: localStorage di atas riwayat aktivitas dummy.
const STORAGE_KEY = "belajarautomation-challenge-attempts";
const EMPTY: Attempts = {};

type Attempts = Record<string, ChallengeScore>;

let cache: Attempts | null = null;
const listeners = new Set<() => void>();

function read(): Attempts {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}");
    return parsed && typeof parsed === "object" ? (parsed as Attempts) : {};
  } catch {
    return {};
  }
}

function getSnapshot() {
  if (cache === null) cache = read();
  return cache;
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

function hasPassed(slug: string, attempts: Attempts) {
  return getCompletedChallengeSlugs().has(slug) || Boolean(attempts[slug]?.passed);
}

// Sekali lulus tetap lulus walau diulang; skor selalu dari percobaan terakhir.
export function useChallengeProgress(slug: string) {
  const attempts = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
  const isReal = useIsRealAccount();
  const real = useRealProgress();
  if (isReal) {
    const own = real?.challenges[slug];
    return {
      status: own?.passed ? ("passed" as const) : own ? ("failed" as const) : ("not-started" as const),
      lastScore: own?.lastScore,
    };
  }
  const lastScore: number | undefined = attempts[slug]?.score ?? DUMMY_CHALLENGE_SCORES[slug];
  const status = hasPassed(slug, attempts)
    ? ("passed" as const)
    : lastScore === undefined
      ? ("not-started" as const)
      : ("failed" as const);
  return { status, lastScore };
}

// XP latihan: hanya saat lulus pertama kali, dan Test Case tidak memberi XP karena dinilai
// sendiri oleh pengguna (PRD FR-05).
function attemptXp(type: ChallengeType) {
  if (type === "quiz") return XP_PER_QUIZ;
  if (type === "test-case") return 0;
  return XP_PER_CHALLENGE;
}

// Mencatat hasil akun demo di browser dan mengembalikan XP yang didapat.
export function recordChallengeAttempt(
  slug: string,
  type: ChallengeType,
  { score, passed }: ChallengeScore
) {
  const attempts = getSnapshot();
  const xp = passed && !hasPassed(slug, attempts) ? attemptXp(type) : 0;
  const next = { ...attempts, [slug]: { score, passed: passed || Boolean(attempts[slug]?.passed) } };

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Penyimpanan tidak tersedia (mis. mode privat); hasil hanya di memori.
  }
  cache = next;
  listeners.forEach((listener) => listener());
  return xp;
}

// Pencatat hasil latihan untuk workspace: akun Supabase memakai XP yang sudah dicatat server,
// akun demo dicatat di browser. Mengembalikan XP yang didapat dari percobaan ini.
export function useRecordChallengeAttempt() {
  const isReal = useIsRealAccount();
  return useCallback(
    (slug: string, type: ChallengeType, result: ChallengeScore) => {
      if (!isReal) return recordChallengeAttempt(slug, type, result);
      void refreshRealProgress();
      return result.xp?.xpAwarded ?? 0;
    },
    [isReal]
  );
}
