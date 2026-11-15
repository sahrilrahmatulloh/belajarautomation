import { COURSE_DETAILS } from "@/data/courseDetails";
import { XP_PER_COURSE_COMPLETION, XP_PER_MODULE } from "@/data/xp";

// Aturan XP materi (PRD FR-05 v2.47): XP diberikan saat seluruh lesson dalam satu modul selesai,
// ditambah bonus saat seluruh lesson course selesai. Dipakai server (Server Action) dan akun demo.

export interface LessonModule {
  // Kunci modul di riwayat XP: modul-<id>, unik di dalam course.
  key: string;
  title: string;
  lessonSlugs: string[];
}

function modulesOf(courseSlug: string): LessonModule[] {
  const detail = COURSE_DETAILS.find((item) => item.courseSlug === courseSlug);
  return (detail?.modules ?? []).map((module) => ({
    key: `modul-${module.id}`,
    title: module.title,
    lessonSlugs: module.lessons.map((lesson) => lesson.slug),
  }));
}

export function getLessonModule(courseSlug: string, lessonSlug: string) {
  return modulesOf(courseSlug).find((module) => module.lessonSlugs.includes(lessonSlug));
}

// Modul yang seluruh lesson-nya sudah selesai.
export function completedModules(courseSlug: string, completed: ReadonlySet<string>) {
  return modulesOf(courseSlug).filter((module) => module.lessonSlugs.every((slug) => completed.has(slug)));
}

// XP materi dari sekumpulan lesson selesai dalam satu course: per modul selesai, ditambah bonus
// course bila seluruh lesson selesai.
export function courseLessonXp(courseSlug: string, completed: ReadonlySet<string>) {
  const modules = modulesOf(courseSlug);
  const done = completedModules(courseSlug, completed).length;
  const finished = modules.length > 0 && done === modules.length;
  return done * XP_PER_MODULE + (finished ? XP_PER_COURSE_COMPLETION : 0);
}
