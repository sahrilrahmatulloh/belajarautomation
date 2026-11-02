// DATA DUMMY — hapus sebelum rilis (PRD FR-13, aturan bisnis #16).
// Riwayat aktivitas akun demo, dari yang terlama ke yang terbaru. Inilah sumber
// total XP, challenge selesai, dan streak (lib/activity.ts). Kesesuaiannya dengan
// katalog dan riwayat belajar diperiksa oleh npm run check:activity.
//
// XP mengikuti data/xp.ts. Achievement dan kenaikan rank bernilai 0 XP.
// Total 420 XP dipertahankan agar rank dan posisi leaderboard tetap sama
// (data/dummy/leaderboard.ts).
import {
  XP_PER_CHALLENGE,
  XP_PER_COURSE_COMPLETION,
  XP_PER_LESSON,
  XP_PER_QUIZ,
} from "@/data/xp";
import { ActivityEntry } from "@/types/Activity";

const lesson = (courseSlug: string, lessonSlug: string, title: string, daysAgo: number, time: string): ActivityEntry => ({
  id: `lesson-${courseSlug}-${lessonSlug}`,
  type: "lesson",
  title,
  xp: XP_PER_LESSON,
  courseSlug,
  lessonSlug,
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
  lesson("bug-reporting", "apa-itu-bug", "Apa itu Bug?", 24, "21:00"),
  lesson("bug-reporting", "anatomi-bug-report", "Anatomi Bug Report", 22, "20:20"),
  lesson("bug-reporting", "langkah-reproduksi-yang-jelas", "Langkah Reproduksi yang Jelas", 20, "19:45"),

  // Tujuh hari berturut-turut (hari ke-18 sampai ke-12) untuk Consistent Learner.
  lesson("bug-reporting", "severity-vs-priority", "Severity vs Priority", 18, "20:10"),
  lesson("bug-reporting", "bug-life-cycle", "Bug Life Cycle", 17, "19:55"),
  lesson("bug-reporting", "mengumpulkan-bukti-screenshot-log", "Mengumpulkan Bukti: Screenshot & Log", 16, "20:30"),
  lesson("bug-reporting", "berkomunikasi-dengan-developer", "Berkomunikasi dengan Developer", 15, "19:40"),
  courseComplete("bug-reporting", "Bug Reporting & Defect Management", 15, "19:41"),
  achievement("course-finisher", "Course Finisher", 15, "19:42"),
  challenge("find-checkout-bug", "Find the Checkout Bug", 14, "20:15"),
  achievement("challenge-starter", "Challenge Starter", 14, "20:16"),
  achievement("bug-hunter", "Bug Hunter", 14, "20:17"),
  lesson("qa-fundamentals", "sdlc", "Software Development Life Cycle", 13, "19:25"),
  lesson("qa-fundamentals", "stlc", "Software Testing Life Cycle", 12, "20:00"),
  achievement("consistent-learner", "Consistent Learner", 12, "20:01"),

  lesson("qa-fundamentals", "agile-scrum", "Agile & Scrum untuk QA", 10, "19:35"),
  lesson("qa-fundamentals", "jenis-software-testing", "Jenis-Jenis Software Testing", 9, "20:40"),
  quiz("qa-fundamentals", "QA Fundamental", "kuis-qa-fundamental", 7, "20:25"),
  achievement("quiz-master", "Quiz Master", 7, "20:26"),
  // XP melewati 300 pada lesson ini, jadi diikuti kenaikan rank.
  lesson("test-design", "test-scenario-vs-test-case", "Test Scenario vs Test Case", 6, "09:05"),
  rankUp("Apprentice", 6, "09:06"),

  // Lima hari terakhir berturut-turut, sama dengan streak yang tampil di dashboard.
  lesson("playwright", "apa-itu-playwright", "Apa itu Playwright?", 4, "20:50"),
  achievement("automation-starter", "Automation Starter", 4, "20:51"),
  lesson("playwright", "installation-setup", "Installation & Setup", 3, "19:15"),
  lesson("playwright", "first-test", "Membuat Test Pertama", 2, "20:15"),
  challenge("playwright-locator", "Playwright Locator", 1, "19:50"),
  lesson("qa-fundamentals", "test-scenario", "Membuat Test Scenario", 0, "07:40"),
];
