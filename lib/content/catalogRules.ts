import CATALOG_RULES from "@/data/catalogRules.json";
import { CHALLENGES } from "@/data/challenges";
import { COURSES } from "@/data/courses";
import { getRank, RANKS } from "@/data/ranks";
import { XP_PER_CHALLENGE, XP_PER_COURSE_COMPLETION, XP_PER_LESSON, XP_PER_QUIZ } from "@/data/xp";
import { CatalogOverride, CourseCatalogState } from "@/types/AdminPlatform";

// Aturan katalog (PRD FR-02, FR-05, dan FR-16 G). Daftar course fondasi dan target lesson ada di
// data/catalogRules.json, sumber yang sama dengan scripts/check-content.mjs.
const LESSON_TARGETS: Record<string, number> = CATALOG_RULES.lessonTargets;

export const MASTER_XP = RANKS[RANKS.length - 1].minXp;

export function isRequiredFree(courseSlug: string) {
  return CATALOG_RULES.requiredFree.includes(courseSlug);
}

// Status course setelah perubahan simulasi. Data di repository tetap sumber kebenaran.
export function courseCatalogState(courseSlug: string, overrides: Record<string, CatalogOverride>): CourseCatalogState | null {
  const course = COURSES.find((item) => item.slug === courseSlug);
  if (!course) return null;
  return { availability: course.availability, contentStatus: course.contentStatus, access: course.access, ...overrides[courseSlug] };
}

function courseXp(courseSlug: string) {
  return (LESSON_TARGETS[courseSlug] ?? 0) * XP_PER_LESSON + XP_PER_COURSE_COMPLETION;
}

// Total XP dari course dan latihan gratis, memakai target lesson kurikulum dan latihan yang ada di data.
export function freeXpTotal(overrides: Record<string, CatalogOverride>) {
  const isFree = (courseSlug: string) => courseCatalogState(courseSlug, overrides)?.access === "free";
  const fromCourses = COURSES.filter((course) => isFree(course.slug)).reduce((total, course) => total + courseXp(course.slug), 0);
  const fromChallenges = CHALLENGES.filter((challenge) => isFree(challenge.courseSlug)).reduce(
    (total, challenge) => total + (challenge.type === "quiz" ? XP_PER_QUIZ : XP_PER_CHALLENGE),
    0
  );
  return fromCourses + fromChallenges;
}

export { getRank };
