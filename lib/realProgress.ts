"use client";

import { useEffect, useSyncExternalStore } from "react";

import { getRank, Rank } from "@/data/ranks";
import { useSession } from "@/lib/session";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

// Progres belajar dan XP akun Supabase (PRD FR-05), dari fungsi database get_my_progress.
// Satu penyimpanan untuk dashboard, halaman Rank, profil, Playground, dan halaman lesson.
// Akun demo dan tamu tidak memakai modul ini (nilainya null).

export interface RealChallengeProgress {
  passed: boolean;
  bestScore: number;
  lastScore: number;
  attempts: number;
}

export interface RealProgress {
  totalXp: number;
  lessonsCompleted: number;
  challengesCompleted: number;
  // Urut dari yang paling lama selesai.
  lessons: { courseSlug: string; lessonSlug: string; completedAt: string }[];
  challenges: Record<string, RealChallengeProgress>;
}

interface ProgressDbRow {
  total_xp: number;
  lessons_completed: number;
  challenges_completed: number;
  lessons: { course_slug: string; lesson_slug: string; completed_at: string }[];
  challenges: { slug: string; passed: boolean; best_score: number; last_score: number; attempts: number }[];
}

interface State {
  userId: string | null;
  data: RealProgress | null;
}

let state: State = { userId: null, data: null };
let loadingFor: string | null = null;
const listeners = new Set<() => void>();
const rankUpListeners = new Set<(rank: Rank) => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function toProgress(row: ProgressDbRow): RealProgress {
  return {
    totalXp: row.total_xp,
    lessonsCompleted: row.lessons_completed,
    challengesCompleted: row.challenges_completed,
    lessons: (row.lessons ?? []).map((item) => ({
      courseSlug: item.course_slug,
      lessonSlug: item.lesson_slug,
      completedAt: item.completed_at,
    })),
    challenges: Object.fromEntries(
      (row.challenges ?? []).map((item) => [
        item.slug,
        { passed: item.passed, bestScore: item.best_score, lastScore: item.last_score, attempts: Number(item.attempts) },
      ])
    ),
  };
}

// Naik rank diumumkan sekali, saat total XP melewati batas rank berikutnya setelah sebuah aksi.
function announceRankUp(previousXp: number | undefined, nextXp: number) {
  if (previousXp === undefined) return;
  const before = getRank(previousXp);
  const after = getRank(nextXp);
  if (after.minXp > before.minXp) rankUpListeners.forEach((listener) => listener(after));
}

async function load(userId: string) {
  const client = getSupabaseBrowserClient();
  if (!client) return;
  loadingFor = userId;
  const { data, error } = await client.rpc("get_my_progress");
  if (loadingFor !== userId) return;
  loadingFor = null;
  if (error || !data) return;
  const previousXp = state.userId === userId ? state.data?.totalXp : undefined;
  const next = toProgress(data as ProgressDbRow);
  state = { userId, data: next };
  emit();
  announceRankUp(previousXp, next.totalXp);
}

// Dipanggil setelah aksi yang mungkin menambah XP (lesson selesai, kuis atau challenge dinilai).
export async function refreshRealProgress() {
  if (state.userId) await load(state.userId);
}

export function onRankUp(listener: (rank: Rank) => void) {
  rankUpListeners.add(listener);
  return () => {
    rankUpListeners.delete(listener);
  };
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// Mengembalikan null untuk akun demo dan tamu, atau selama progres belum termuat.
export function useRealProgress(): RealProgress | null {
  const session = useSession();
  const userId = session?.source === "supabase" ? (session.userId ?? null) : null;
  const snapshot = useSyncExternalStore(subscribe, () => state, () => state);

  useEffect(() => {
    if (!userId) return;
    if (state.userId === userId && state.data) return;
    if (loadingFor === userId) return;
    if (state.userId !== userId) {
      state = { userId, data: null };
      emit();
    }
    void load(userId);
  }, [userId]);

  return userId && snapshot.userId === userId ? snapshot.data : null;
}

// Benar untuk akun Supabase, walau progresnya belum termuat.
export function useIsRealAccount() {
  return useSession()?.source === "supabase";
}
