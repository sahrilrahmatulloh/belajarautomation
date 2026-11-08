"use client";

import { useSyncExternalStore } from "react";

import { COURSE_DETAILS } from "@/data/courseDetails";
import { DUMMY_ACCOUNT } from "@/data/dummy/account";
import { XP_PER_COURSE_COMPLETION, XP_PER_LESSON } from "@/data/xp";
import { getCompletedLessonSlugs } from "@/lib/activity";
import { useXpCorrection } from "@/lib/content";
import { CourseInProgress, getCompletedLessonCount, getStudiedCourses } from "@/lib/learningProgress";
import { useIsRealAccount, useRealProgress } from "@/lib/realProgress";
import { useSession } from "@/lib/session";
import { COURSES } from "@/data/courses";

// Progres lesson dan XP (PRD FR-05).
// - Akun Supabase: dari database (lib/realProgress.ts); lesson ditandai selesai lewat Server Action.
// - Akun demo: localStorage di atas riwayat aktivitas dummy.
const STORAGE_KEY = "belajarautomation-lesson-progress";
const EMPTY: Record<string, string[]> = {};

let cache: { raw: string | null; value: Record<string, string[]> } | undefined;
const listeners = new Set<() => void>();

function readRaw() {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function getSnapshot() {
  const raw = readRaw();
  if (cache?.raw === raw && cache) return cache.value;
  let value = EMPTY;
  try {
    const parsed: unknown = JSON.parse(raw ?? "null");
    if (parsed && typeof parsed === "object") value = parsed as Record<string, string[]>;
  } catch {
    // Data rusak; mulai dari kosong.
  }
  cache = { raw, value };
  return value;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Sinkron antar tab.
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

const lessonKey = (courseSlug: string, lessonSlug: string) => `${courseSlug}/${lessonSlug}`;

export function completeLesson(email: string, courseSlug: string, lessonSlug: string) {
  const all = getSnapshot();
  const own = all[email] ?? [];
  const key = lessonKey(courseSlug, lessonSlug);
  if (own.includes(key)) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...all, [email]: [...own, key] }));
  } catch {
    // Penyimpanan tidak tersedia; progres tidak bisa disimpan.
    return;
  }
  listeners.forEach((listener) => listener());
}

function totalLessons(courseSlug: string) {
  return COURSE_DETAILS.find((item) => item.courseSlug === courseSlug)?.modules.flatMap((module) => module.lessons).length ?? 0;
}

// Tambahan di atas riwayat aktivitas dummy. Lesson yang sudah ada di riwayat tidak dihitung
// dua kali, dan XP hanya diberikan untuk penyelesaian pertama (PRD FR-05).
function summarize(keys: string[]) {
  const newByCourse = new Map<string, string[]>();
  for (const key of keys) {
    const [courseSlug, lessonSlug] = key.split("/");
    if (getCompletedLessonSlugs(courseSlug).has(lessonSlug)) continue;
    newByCourse.set(courseSlug, [...(newByCourse.get(courseSlug) ?? []), lessonSlug]);
  }

  let extraXp = 0;
  let extraLessons = 0;
  const finishedCourses: string[] = [];
  for (const [courseSlug, lessons] of newByCourse) {
    extraLessons += lessons.length;
    extraXp += lessons.length * XP_PER_LESSON;
    const total = totalLessons(courseSlug);
    if (total > 0 && getCompletedLessonSlugs(courseSlug).size + lessons.length >= total) {
      extraXp += XP_PER_COURSE_COMPLETION;
      finishedCourses.push(courseSlug);
    }
  }
  return { newByCourse, extraXp, extraLessons, finishedCourses };
}

export function useLessonProgress() {
  const session = useSession();
  const all = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
  // Koreksi XP dari Admin ikut menentukan total XP dan rank (PRD FR-16 D).
  const correction = useXpCorrection(session?.userId);
  const isReal = useIsRealAccount();
  const real = useRealProgress();

  if (isReal) {
    // Akun Supabase: hanya progres yang tercatat di database, tanpa riwayat dummy.
    const byCourse = new Map<string, string[]>();
    for (const item of real?.lessons ?? []) {
      byCourse.set(item.courseSlug, [...(byCourse.get(item.courseSlug) ?? []), item.lessonSlug]);
    }
    return {
      newByCourse: byCourse,
      extraXp: 0,
      extraLessons: 0,
      finishedCourses: [] as string[],
      isCompleted: (courseSlug: string, lessonSlug: string) => Boolean(byCourse.get(courseSlug)?.includes(lessonSlug)),
      completedSlugs: (courseSlug: string) => new Set(byCourse.get(courseSlug) ?? []),
    };
  }

  const keys = (session && all[session.email]) || [];
  const summary = summarize(keys);

  return {
    ...summary,
    extraXp: summary.extraXp + correction,
    isCompleted: (courseSlug: string, lessonSlug: string) =>
      keys.includes(lessonKey(courseSlug, lessonSlug)) || getCompletedLessonSlugs(courseSlug).has(lessonSlug),
    completedSlugs: (courseSlug: string) => new Set([...getCompletedLessonSlugs(courseSlug), ...(summary.newByCourse.get(courseSlug) ?? [])]),
  };
}

// Total XP, lesson selesai, dan challenge selesai akun saat ini (PRD FR-05).
export function useAccountStats() {
  const progress = useLessonProgress();
  const isReal = useIsRealAccount();
  const real = useRealProgress();
  if (isReal) {
    return {
      xp: real?.totalXp ?? 0,
      lessons: real?.lessonsCompleted ?? 0,
      challenges: real?.challengesCompleted ?? 0,
      isLoaded: real !== null,
    };
  }
  return {
    xp: DUMMY_ACCOUNT.xp + progress.extraXp,
    lessons: getCompletedLessonCount() + progress.extraLessons,
    challenges: DUMMY_ACCOUNT.completedChallenges,
    isLoaded: true,
  };
}

export function useAccountXp() {
  return useAccountStats().xp;
}

// Course yang masih berjalan, termasuk yang baru mulai dipelajari. Yang baru dikerjakan lebih dulu.
export function useCoursesInProgress(): CourseInProgress[] {
  const { newByCourse } = useLessonProgress();
  // Akun Supabase hanya memakai progres dari database.
  const studied = useIsRealAccount() ? [] : getStudiedCourses();

  const touched = [...newByCourse].flatMap(([courseSlug, lessons]): CourseInProgress[] => {
    const course = COURSES.find((item) => item.slug === courseSlug);
    if (course?.availability !== "available") return [];
    const detail = COURSE_DETAILS.find((item) => item.courseSlug === courseSlug);
    const lastSlug = lessons[lessons.length - 1];
    const lastTitle = detail?.modules.flatMap((module) => module.lessons).find((lesson) => lesson.slug === lastSlug)?.title ?? "";
    const base = studied.find((item) => item.course.slug === courseSlug);
    const completedLessons = Math.min((base?.completedLessons ?? 0) + lessons.length, course.lessons);
    return [
      {
        course,
        lastLesson: { slug: lastSlug, title: lastTitle },
        completedLessons,
        totalLessons: course.lessons,
        percent: Math.round((completedLessons / course.lessons) * 100),
        lastOpenedDaysAgo: 0,
      },
    ];
  });

  return [...touched, ...studied.filter((item) => !newByCourse.has(item.course.slug))].filter((item) => item.completedLessons < item.totalLessons);
}
