"use client";

import { useSyncExternalStore } from "react";

import { DUMMY_CHALLENGE_SCORES } from "@/data/dummy/challengeAttempts";
import { XP_PER_CHALLENGE, XP_PER_QUIZ } from "@/data/xp";
import { getCompletedChallengeSlugs } from "@/lib/activity";
import { ChallengeType } from "@/types/Challenge";
import { ChallengeScore } from "@/types/ChallengeDetail";

// Hasil latihan disimpan di localStorage browser (belum ada backend), di atas
// riwayat aktivitas dummy. Nantinya hasil dan XP wajib dicatat di backend.
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
  const lastScore: number | undefined = attempts[slug]?.score ?? DUMMY_CHALLENGE_SCORES[slug];
  const status = hasPassed(slug, attempts)
    ? ("passed" as const)
    : lastScore === undefined
      ? ("not-started" as const)
      : ("failed" as const);
  return { status, lastScore };
}

// Mencatat hasil dan mengembalikan XP yang didapat: hanya saat lulus pertama kali.
export function recordChallengeAttempt(
  slug: string,
  type: ChallengeType,
  { score, passed }: ChallengeScore
) {
  const attempts = getSnapshot();
  const xp = passed && !hasPassed(slug, attempts) ? (type === "quiz" ? XP_PER_QUIZ : XP_PER_CHALLENGE) : 0;
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
