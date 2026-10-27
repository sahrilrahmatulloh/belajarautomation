import { CourseDetail } from "@/types/CourseDetail";

export const COURSE_DETAILS: CourseDetail[] = [
  {
    courseSlug: "qa-fundamentals",
    overview:
      "Pelajari fundamental Quality Assurance sebagai fondasi sebelum masuk ke automation testing.",
    modules: [
      {
        id: 1,
        title: "Introduction to Quality Assurance",
        lessons: [
          {
            id: 1,
            slug: "apa-itu-quality-assurance",
            title: "Apa itu Quality Assurance?",
            duration: "5 menit",
            isCompleted: false,
            isLocked: false,
          },
          {
            id: 2,
            slug: "qa-vs-qc",
            title: "QA vs QC",
            duration: "7 menit",
            isCompleted: false,
            isLocked: false,
          },
          {
            id: 3,
            slug: "peran-qa-engineer",
            title: "Peran QA Engineer",
            duration: "8 menit",
            isCompleted: false,
            isLocked: false,
          },
        ],
      },
      {
        id: 2,
        title: "Software Development Process",
        lessons: [
          {
            id: 4,
            slug: "sdlc",
            title: "Software Development Life Cycle",
            duration: "10 menit",
            isCompleted: false,
            isLocked: false,
          },
          {
            id: 5,
            slug: "stlc",
            title: "Software Testing Life Cycle",
            duration: "10 menit",
            isCompleted: false,
            isLocked: false,
          },
          {
            id: 6,
            slug: "agile-scrum",
            title: "Agile & Scrum untuk QA",
            duration: "12 menit",
            isCompleted: false,
            isLocked: false,
          },
        ],
      },
      {
        id: 3,
        title: "Testing Fundamentals",
        lessons: [
          {
            id: 7,
            slug: "jenis-software-testing",
            title: "Jenis-Jenis Software Testing",
            duration: "12 menit",
            isCompleted: false,
            isLocked: false,
          },
          {
            id: 8,
            slug: "test-scenario",
            title: "Membuat Test Scenario",
            duration: "10 menit",
            isCompleted: false,
            isLocked: false,
          },
          {
            id: 9,
            slug: "test-case",
            title: "Membuat Test Case",
            duration: "15 menit",
            isCompleted: false,
            isLocked: false,
          },
          {
            id: 10,
            slug: "positive-negative-testing",
            title: "Positive & Negative Testing",
            duration: "8 menit",
            isCompleted: false,
            isLocked: false,
          },
        ],
      },
      {
        id: 4,
        title: "Bug Management",
        lessons: [
          {
            id: 11,
            slug: "apa-itu-bug",
            title: "Apa itu Bug?",
            duration: "6 menit",
            isCompleted: false,
            isLocked: false,
          },
          {
            id: 12,
            slug: "bug-report",
            title: "Membuat Bug Report",
            duration: "15 menit",
            isCompleted: false,
            isLocked: false,
          },
          {
            id: 13,
            slug: "severity-priority",
            title: "Severity vs Priority",
            duration: "10 menit",
            isCompleted: false,
            isLocked: false,
          },
          {
            id: 14,
            slug: "bug-life-cycle",
            title: "Bug Life Cycle",
            duration: "10 menit",
            isCompleted: false,
            isLocked: false,
          },
        ],
      },
      {
        id: 5,
        title: "QA in Real Projects",
        lessons: [
          {
            id: 15,
            slug: "testing-dalam-project",
            title: "Workflow Testing dalam Project",
            duration: "12 menit",
            isCompleted: false,
            isLocked: false,
          },
          {
            id: 16,
            slug: "qa-career-next-step",
            title: "Next Step sebagai QA Engineer",
            duration: "8 menit",
            isCompleted: false,
            isLocked: false,
          },
        ],
      },
    ],
  },

  {
    courseSlug: "playwright",
    overview:
      "Pelajari Playwright dari fundamental hingga mampu membangun automation testing untuk aplikasi web modern.",
    modules: [
      {
        id: 1,
        title: "Introduction to Playwright",
        lessons: [
          {
            id: 1,
            slug: "apa-itu-playwright",
            title: "Apa itu Playwright?",
            duration: "5 menit",
            isCompleted: true,
            isLocked: false,
          },
          {
            id: 2,
            slug: "installation-setup",
            title: "Installation & Setup",
            duration: "10 menit",
            isCompleted: false,
            isLocked: false,
          },
          {
            id: 3,
            slug: "first-test",
            title: "Membuat Test Pertama",
            duration: "12 menit",
            isCompleted: false,
            isLocked: false,
          },
        ],
      },
      {
        id: 2,
        title: "Working with Elements",
        lessons: [
          {
            id: 4,
            slug: "locator",
            title: "Memahami Locator",
            duration: "15 menit",
            isCompleted: false,
            isLocked: false,
          },
          {
            id: 5,
            slug: "user-actions",
            title: "User Actions",
            duration: "12 menit",
            isCompleted: false,
            isLocked: false,
          },
          {
            id: 6,
            slug: "assertions",
            title: "Assertions",
            duration: "15 menit",
            isCompleted: false,
            isLocked: false,
          },
        ],
      },
      {
        id: 3,
        title: "Advanced Playwright",
        lessons: [
          {
            id: 7,
            slug: "page-object-model",
            title: "Page Object Model",
            duration: "20 menit",
            isCompleted: false,
            isLocked: true,
          },
          {
            id: 8,
            slug: "api-testing",
            title: "API Testing dengan Playwright",
            duration: "20 menit",
            isCompleted: false,
            isLocked: true,
          },
        ],
      },
    ],
  },
];