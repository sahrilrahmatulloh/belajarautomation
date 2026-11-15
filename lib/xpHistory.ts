"use client";

import { useEffect, useState } from "react";

import { CHALLENGES } from "@/data/challenges";
import { COURSE_DETAILS } from "@/data/courseDetails";
import { COURSES } from "@/data/courses";
import { getActivityByDaysAgo, getRecentActivity } from "@/lib/activity";
import { useRealProgress } from "@/lib/realProgress";
import { useSession } from "@/lib/session";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { ActivityEntry, ActivityType } from "@/types/Activity";

// Riwayat XP untuk Ringkasan profil (PRD FR-13): XP per hari untuk grafik Progres XP dan
// aktivitas terbaru.
// - Akun Supabase: dari tabel xp_transactions milik sendiri (RLS hanya mengizinkan baris sendiri).
// - Akun demo: riwayat aktivitas dummy.

// Batas baris yang dibaca; cukup untuk periode grafik terpanjang (90 hari).
const ROW_LIMIT = 500;
const DAY_MS = 86_400_000;

export interface XpHistory {
  // XP yang diperoleh per hari, dengan kunci jumlah hari sebelum hari ini.
  gainsByDaysAgo: Map<number, number>;
  // Aktivitas terbaru lebih dulu.
  recent: ActivityEntry[];
  isLoaded: boolean;
}

interface XpTransactionRow {
  id: number;
  source_type: "lesson" | "module" | "course" | "quiz" | "challenge" | "correction";
  source_id: string;
  xp: number;
  created_at: string;
}

const timeFormatter = new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false });

function daysAgoOf(date: Date, today: Date) {
  const startOf = (value: Date) => new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();
  return Math.max(0, Math.round((startOf(today) - startOf(date)) / DAY_MS));
}

function lessonTitle(courseSlug: string, lessonSlug: string) {
  const detail = COURSE_DETAILS.find((item) => item.courseSlug === courseSlug);
  return detail?.modules.flatMap((module) => module.lessons).find((lesson) => lesson.slug === lessonSlug)?.title ?? lessonSlug;
}

function moduleTitle(courseSlug: string, moduleKey: string) {
  const detail = COURSE_DETAILS.find((item) => item.courseSlug === courseSlug);
  return detail?.modules.find((module) => `modul-${module.id}` === moduleKey)?.title ?? moduleKey;
}

function toEntry(row: XpTransactionRow, today: Date): ActivityEntry {
  const date = new Date(row.created_at);
  const base = { id: `xp-${row.id}`, xp: row.xp, daysAgo: daysAgoOf(date, today), time: timeFormatter.format(date) };
  switch (row.source_type) {
    case "lesson": {
      const [courseSlug, lessonSlug] = row.source_id.split("/");
      return { ...base, type: "lesson", title: lessonTitle(courseSlug, lessonSlug), courseSlug, lessonSlug };
    }
    case "module": {
      // source_id: course/modul-<id> (PRD FR-05 v2.47).
      const [courseSlug, moduleKey] = row.source_id.split("/");
      return { ...base, type: "module_complete", title: moduleTitle(courseSlug, moduleKey), courseSlug };
    }
    case "course": {
      const title = COURSES.find((course) => course.slug === row.source_id)?.title ?? row.source_id;
      return { ...base, type: "course_complete", title, courseSlug: row.source_id };
    }
    case "quiz":
    case "challenge": {
      const title = CHALLENGES.find((challenge) => challenge.slug === row.source_id)?.title ?? row.source_id;
      const type: ActivityType = row.source_type === "quiz" ? "quiz" : "challenge";
      return { ...base, type, title, challengeSlug: row.source_id };
    }
    case "correction":
      // Penyesuaian otomatis saat aturan XP berubah ke per modul (migrasi 20261115090000).
      if (row.source_id === "aturan-xp-per-modul") return { ...base, type: "correction", title: "Penyesuaian aturan XP per modul" };
      return { ...base, type: "correction", title: "Koreksi XP oleh Admin" };
  }
}

function summarize(entries: ActivityEntry[]): Map<number, number> {
  const gains = new Map<number, number>();
  for (const entry of entries) gains.set(entry.daysAgo, (gains.get(entry.daysAgo) ?? 0) + entry.xp);
  return gains;
}

type RealState = { key: string; rows: XpTransactionRow[] } | null;

export function useXpHistory(): XpHistory {
  const session = useSession();
  const real = useRealProgress();
  const userId = session?.source === "supabase" ? (session.userId ?? null) : null;
  // Dibaca ulang setiap kali total XP berubah, mis. setelah lesson selesai atau koreksi Admin.
  const key = userId && real ? `${userId}:${real.totalXp}` : null;
  const [state, setState] = useState<RealState>(null);

  useEffect(() => {
    const client = getSupabaseBrowserClient();
    if (!key || !client) return;
    let cancelled = false;
    void client
      .from("xp_transactions")
      .select("id, source_type, source_id, xp, created_at")
      .order("created_at", { ascending: false })
      .limit(ROW_LIMIT)
      .then(({ data, error }) => {
        if (cancelled) return;
        setState({ key, rows: error || !data ? [] : (data as XpTransactionRow[]) });
      });
    return () => {
      cancelled = true;
    };
  }, [key]);

  if (userId) {
    const rows = state && state.key === key ? state.rows : null;
    const today = new Date();
    // Sejak XP materi per modul, lesson selesai tidak lagi punya transaksi XP; lesson diambil dari
    // progres lesson (0 XP) agar tetap tampil di riwayat. Lesson lama yang sudah punya transaksi
    // XP lesson tidak ditambahkan dua kali.
    const withXp = new Set((rows ?? []).filter((row) => row.source_type === "lesson").map((row) => row.source_id));
    const lessonRows = (real?.lessons ?? [])
      .filter((item) => !withXp.has(`${item.courseSlug}/${item.lessonSlug}`))
      .map((item) => ({
        at: item.completedAt,
        entry: {
          ...toEntry({ id: 0, source_type: "lesson", source_id: `${item.courseSlug}/${item.lessonSlug}`, xp: 0, created_at: item.completedAt }, today),
          id: `lesson-${item.courseSlug}-${item.lessonSlug}`,
        },
      }));
    const recent = [...(rows ?? []).map((row) => ({ at: row.created_at, entry: toEntry(row, today) })), ...lessonRows]
      .sort((a, b) => (a.at < b.at ? 1 : a.at > b.at ? -1 : 0))
      .map((item) => item.entry);
    return { gainsByDaysAgo: summarize(recent), recent, isLoaded: rows !== null };
  }

  const gainsByDaysAgo = new Map([...getActivityByDaysAgo()].map(([daysAgo, day]) => [daysAgo, day.xp]));
  return { gainsByDaysAgo, recent: getRecentActivity(90), isLoaded: true };
}

// Total XP kumulatif di akhir setiap hari, dari yang terlama ke hari ini. Dihitung mundur dari
// total XP saat ini agar titik terakhir selalu sama dengan total XP di profil.
export function cumulativeXp(totalXp: number, gainsByDaysAgo: Map<number, number>, days: number) {
  const points: { daysAgo: number; xp: number }[] = [];
  let value = totalXp;
  for (let daysAgo = 0; daysAgo < days; daysAgo += 1) {
    points.push({ daysAgo, xp: Math.max(0, value) });
    value -= gainsByDaysAgo.get(daysAgo) ?? 0;
  }
  return points.reverse();
}
