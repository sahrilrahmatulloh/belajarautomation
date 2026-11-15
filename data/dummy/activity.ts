// DATA DUMMY — hapus sebelum rilis (PRD FR-13, aturan bisnis #16).
// Riwayat aktivitas akun demo, dari yang terlama ke yang terbaru. Inilah sumber
// total XP, challenge selesai, dan streak (lib/activity.ts). Kesesuaiannya dengan
// katalog dan riwayat belajar diperiksa oleh npm run check:activity.
//
// XP mengikuti data/xp.ts (PRD FR-05 v2.47): lesson 0 XP, XP materi diberikan lewat
// moduleComplete tepat setelah lesson terakhir modul. Achievement dan kenaikan rank 0 XP.
// Total 320 XP (Apprentice) sesuai posisi leaderboard (data/dummy/leaderboard.ts).
import {
  XP_PER_CHALLENGE,
  XP_PER_COURSE_COMPLETION,
  XP_PER_MODULE,
  XP_PER_QUIZ,
} from "@/data/xp";
import { ActivityEntry } from "@/types/Activity";

const lesson = (courseSlug: string, lessonSlug: string, title: string, daysAgo: number, time: string): ActivityEntry => ({
  id: `lesson-${courseSlug}-${lessonSlug}`,
  type: "lesson",
  title,
  // XP materi diberikan per modul, bukan per lesson.
  xp: 0,
  courseSlug,
  lessonSlug,
  daysAgo,
  time,
});

// Modul tuntas: kunci modul-<id> sama dengan riwayat XP server (lib/xpRules.ts).
const moduleComplete = (courseSlug: string, moduleKey: string, title: string, daysAgo: number, time: string): ActivityEntry => ({
  id: `module-${courseSlug}-${moduleKey}`,
  type: "module_complete",
  title,
  xp: XP_PER_MODULE,
  courseSlug,
  daysAgo,
  time,
});

const courseComplete = (courseSlug: string, title: string, daysAgo: number, time: string): ActivityEntry => ({
  id: `course-complete-${courseSlug}`,
  type: "course_complete",
  title,
  xp: XP_PER_COURSE_COMPLETION,
  courseSlug,
  daysAgo,
  time,
});

const quiz = (courseSlug: string, title: string, challengeSlug: string, daysAgo: number, time: string): ActivityEntry => ({
  id: `quiz-${courseSlug}`,
  type: "quiz",
  title,
  xp: XP_PER_QUIZ,
  courseSlug,
  challengeSlug,
  daysAgo,
  time,
});

const challenge = (challengeSlug: string, title: string, daysAgo: number, time: string): ActivityEntry => ({
  id: `challenge-${challengeSlug}`,
  type: "challenge",
  title,
  xp: XP_PER_CHALLENGE,
  challengeSlug,
  daysAgo,
  time,
});

const achievement = (achievementId: string, title: string, daysAgo: number, time: string): ActivityEntry => ({
  id: `achievement-${achievementId}`,
  type: "achievement",
  title,
  xp: 0,
  achievementId,
  daysAgo,
  time,
});

const rankUp = (title: string, daysAgo: number, time: string): ActivityEntry => ({
  id: `rank-up-${title.toLowerCase()}`,
  type: "rank_up",
  title,
  xp: 0,
  daysAgo,
  time,
});

export const DUMMY_ACTIVITY: ActivityEntry[] = [
  lesson("qa-fundamentals", "apa-itu-quality-assurance", "Apa itu Quality Assurance?", 28, "19:10"),
  achievement("first-steps", "First Steps", 28, "19:11"),
  lesson("qa-fundamentals", "qa-vs-qc", "QA vs QC", 27, "20:05"),
  lesson("qa-fundamentals", "peran-qa-engineer", "Peran QA Engineer", 25, "19:30"),
  moduleComplete("qa-fundamentals", "modul-1", "Introduction to Quality Assurance", 25, "19:31"),
  lesson("bug-reporting", "apa-itu-bug", "Apa itu Bug?", 24, "21:00"),
  lesson("bug-reporting", "anatomi-bug-report", "Anatomi Bug Report", 22, "20:20"),
  lesson("bug-reporting", "langkah-reproduksi-yang-jelas", "Langkah Reproduksi yang Jelas", 20, "19:45"),
  moduleComplete("bug-reporting", "modul-1", "Anatomi Bug Report", 20, "19:46"),

  // Tujuh hari berturut-turut (hari ke-18 sampai ke-12) untuk Consistent Learner.
  lesson("bug-reporting", "severity-vs-priority", "Severity vs Priority", 18, "20:10"),
  lesson("bug-reporting", "bug-life-cycle", "Bug Life Cycle", 17, "19:55"),
  moduleComplete("bug-reporting", "modul-2", "Prioritas & Siklus", 17, "19:56"),
  lesson("bug-reporting", "mengumpulkan-bukti-screenshot-log", "Mengumpulkan Bukti: Screenshot & Log", 16, "20:30"),
  lesson("bug-reporting", "berkomunikasi-dengan-developer", "Berkomunikasi dengan Developer", 15, "19:40"),
  moduleComplete("bug-reporting", "modul-3", "Bukti & Komunikasi", 15, "19:41"),
  courseComplete("bug-reporting", "Bug Reporting & Defect Management", 15, "19:42"),
  achievement("course-finisher", "Course Finisher", 15, "19:43"),
  challenge("find-checkout-bug", "Find the Checkout Bug", 14, "20:15"),
  achievement("challenge-starter", "Challenge Starter", 14, "20:16"),
  achievement("bug-hunter", "Bug Hunter", 14, "20:17"),
  lesson("qa-fundamentals", "sdlc", "Software Development Life Cycle", 13, "19:25"),
  lesson("qa-fundamentals", "stlc", "Software Testing Life Cycle", 12, "20:00"),
  achievement("consistent-learner", "Consistent Learner", 12, "20:01"),

  lesson("qa-fundamentals", "agile-scrum", "Agile & Scrum untuk QA", 10, "19:35"),
  moduleComplete("qa-fundamentals", "modul-2", "Software Development Process", 10, "19:36"),
  lesson("qa-fundamentals", "jenis-software-testing", "Jenis-Jenis Software Testing", 9, "20:40"),
  quiz("qa-fundamentals", "QA Fundamental", "kuis-qa-fundamental", 7, "20:25"),
  achievement("quiz-master", "Quiz Master", 7, "20:26"),
  lesson("test-design", "test-scenario-vs-test-case", "Test Scenario vs Test Case", 6, "09:05"),

  // Lima hari terakhir berturut-turut, sama dengan streak yang tampil di dashboard.
  lesson("playwright", "apa-itu-playwright", "Apa itu Playwright?", 4, "20:50"),
  achievement("automation-starter", "Automation Starter", 4, "20:51"),
  lesson("playwright", "installation-setup", "Installation & Setup", 3, "19:15"),
  lesson("playwright", "first-test", "Membuat Test Pertama", 2, "20:15"),
  moduleComplete("playwright", "modul-1", "Introduction to Playwright", 2, "20:16"),
  quiz("playwright", "Playwright", "kuis-playwright", 2, "20:40"),
  // XP melewati 300 pada challenge ini, jadi diikuti kenaikan rank.
  challenge("playwright-locator", "Playwright Locator", 1, "19:50"),
  rankUp("Apprentice", 1, "19:51"),
  lesson("qa-fundamentals", "test-scenario", "Membuat Test Scenario", 0, "07:40"),
];
