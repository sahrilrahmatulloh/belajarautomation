import {
  BookOpenCheck,
  ClipboardCheck,
  Code2,
  Globe,
  Network,
  Smartphone,
} from "lucide-react";

import { Roadmap, RoadmapCourseNode } from "@/types/Roadmap";

// Jalur roadmap sesuai docs/CURRICULUM.md (PRD FR-03).
// Setiap node wajib menunjuk ke course di katalog; dicek oleh npm run check:roadmaps.
// Tidak ada status progress di node sampai ada data pengguna nyata.

const course = (
  courseSlug: string,
  optional = false
): RoadmapCourseNode => ({
  type: "course",
  courseSlug,
  ...(optional && { optional }),
});

export const ROADMAPS: Roadmap[] = [
  {
    id: "fundamental",
    title: "Fundamental",
    description:
      "Fondasi untuk semua jalur: konsep quality assurance, cara kerja web dan API, serta pengenalan AI.",
    icon: BookOpenCheck,
    level: "Beginner",
    duration: "1–2 Bulan",
    cover: "/covers/roadmaps/fundamental.webp",
    status: "active",
    featured: true,
    goals: [
      "Memahami peran QA, SDLC, STLC, dan jenis testing",
      "Memahami cara kerja web, HTTP, dan API",
      "Mengenal dasar AI dan LLM untuk mendukung pekerjaan QA",
    ],
    skills: [
      "Quality Assurance",
      "SDLC & STLC",
      "HTTP & REST",
      "JSON",
      "DevTools",
      "Dasar AI & LLM",
    ],
    prerequisites: [
      "Tidak ada prasyarat khusus, cocok untuk pemula",
    ],
    nodes: [
      course("qa-fundamentals"),
      course("dasar-web-api"),
      course("dasar-ai-llm", true),
    ],
  },
  {
    id: "qa-manual-engineer",
    title: "QA Manual Engineer",
    description:
      "Jalur QA manual: merancang test case, melaporkan bug, mengelola pengujian, dan memvalidasi data dengan SQL.",
    icon: ClipboardCheck,
    level: "Beginner – Intermediate",
    duration: "2–3 Bulan",
    cover: "/covers/roadmaps/qa-manual-engineer.webp",
    status: "active",
    goals: [
      "Merancang test case dengan teknik desain test yang sistematis",
      "Melaporkan dan mengelola bug bersama tim",
      "Mengelola test case dan test run dengan Jira dan TestRail",
      "Memvalidasi data aplikasi dengan SQL",
    ],
    skills: [
      "Test Design",
      "Bug Reporting",
      "Jira & TestRail",
      "SQL",
      "AI for Testing",
    ],
    prerequisites: [
      "Tidak ada prasyarat khusus; jalur ini dimulai dari QA Fundamental",
    ],
    nodes: [
      course("qa-fundamentals"),
      course("test-design"),
      course("bug-reporting"),
      course("test-management"),
      course("sql-untuk-qa"),
      course("ai-for-testing", true),
    ],
  },
  {
    id: "programming",
    title: "Programming",
    description:
      "Kuasai Git lalu pilih satu bahasa untuk automation. JavaScript dilanjutkan TypeScript direkomendasikan untuk Playwright.",
    icon: Code2,
    level: "Beginner",
    duration: "1–2 Bulan",
    cover: "/covers/roadmaps/programming.webp",
    status: "active",
    goals: [
      "Mengelola kode dengan Git dan GitHub",
      "Menguasai satu bahasa pemrograman untuk automation",
      "Siap mempelajari framework automation",
    ],
    skills: [
      "Git & GitHub",
      "JavaScript",
      "TypeScript",
      "Java",
      "Python",
    ],
    prerequisites: [
      "Tidak perlu pengalaman pemrograman sebelumnya",
    ],
    nodes: [
      course("git-github"),
      {
        type: "branch",
        options: [
          {
            label: "JavaScript",
            recommended: true,
            nodes: [course("javascript"), course("typescript")],
          },
          { label: "Java", nodes: [course("java")] },
          { label: "Python", nodes: [course("python")] },
        ],
      },
    ],
  },
  {
    id: "qa-automation-web",
    title: "QA Automation Web",
    description:
      "Bangun automation testing web dengan framework pilihanmu, Playwright direkomendasikan, hingga berjalan di CI/CD dan dibantu AI.",
    icon: Globe,
    level: "Beginner – Advanced",
    duration: "3–4 Bulan",
    cover: "/covers/roadmaps/qa-automation-web.webp",
    status: "active",
    goals: [
      "Merancang test case sebelum diotomasi",
      "Membangun automated test web dengan framework pilihan",
      "Menjalankan test otomatis di pipeline CI/CD",
      "Memanfaatkan AI untuk mempercepat pembuatan dan perawatan test",
    ],
    skills: [
      "Test Design",
      "Git & GitHub",
      "TypeScript",
      "Playwright",
      "Cypress",
      "Selenium",
      "Robot Framework",
      "Katalon",
      "CI/CD",
      "AI for Testing",
    ],
    prerequisites: [
      "Tidak ada prasyarat khusus; jalur ini dimulai dari QA Fundamental",
      "Bahasa pemrograman dipelajari di dalam cabang yang kamu pilih",
    ],
    nodes: [
      course("qa-fundamentals"),
      course("test-design"),
      course("git-github"),
      {
        type: "branch",
        options: [
          {
            label: "TypeScript",
            recommended: true,
            nodes: [course("typescript"), course("playwright")],
          },
          {
            label: "JavaScript",
            nodes: [course("javascript"), course("cypress")],
          },
          {
            label: "Java",
            nodes: [course("java"), course("selenium"), course("cucumber")],
          },
          {
            label: "Python",
            nodes: [course("python"), course("robot-framework")],
          },
          { label: "Low-code", nodes: [course("katalon")] },
        ],
      },
      course("cicd-testing"),
      course("ai-for-testing"),
    ],
  },
  {
    id: "api-test-engineer",
    title: "API Test Engineer",
    description:
      "Uji API secara manual dan otomatis, validasi data dengan SQL, hingga mengukur performa dengan JMeter dan K6.",
    icon: Network,
    level: "Beginner – Intermediate",
    duration: "2–3 Bulan",
    cover: "/covers/roadmaps/api-test-engineer.webp",
    status: "active",
    goals: [
      "Memahami HTTP dan REST API",
      "Menguji API secara manual dengan Postman",
      "Mengotomasi API test dengan Playwright dan REST Assured",
      "Mengukur performa API dengan JMeter dan K6",
    ],
    skills: [
      "HTTP & REST",
      "Postman",
      "SQL",
      "API Automation",
      "REST Assured",
      "JMeter & K6",
      "AI for Testing",
    ],
    prerequisites: [
      "Tidak ada prasyarat khusus; jalur ini dimulai dari QA Fundamental",
    ],
    nodes: [
      course("qa-fundamentals"),
      course("dasar-web-api"),
      course("postman"),
      course("sql-untuk-qa"),
      course("api-automation"),
      course("performance-testing"),
      course("ai-for-testing"),
    ],
  },
  {
    id: "qa-automation-mobile",
    title: "QA Automation Mobile",
    description:
      "Pahami mobile testing Android lalu otomasi dengan Appium atau Katalon, hingga berjalan di CI/CD.",
    icon: Smartphone,
    level: "Intermediate",
    duration: "3–4 Bulan",
    cover: "/covers/roadmaps/qa-automation-mobile.webp",
    status: "active",
    goals: [
      "Memahami karakteristik mobile testing di Android",
      "Mengotomasi aplikasi mobile dengan Appium atau Katalon",
      "Menjalankan test mobile di pipeline CI/CD",
    ],
    skills: [
      "Mobile Testing",
      "Android",
      "Java",
      "Appium",
      "Katalon",
      "CI/CD",
      "AI for Testing",
    ],
    prerequisites: [
      "Tidak ada prasyarat khusus; jalur ini dimulai dari QA Fundamental",
    ],
    nodes: [
      course("qa-fundamentals"),
      course("mobile-testing-dasar"),
      {
        type: "branch",
        options: [
          {
            label: "Java",
            recommended: true,
            nodes: [course("java"), course("appium")],
          },
          { label: "Low-code", nodes: [course("katalon")] },
        ],
      },
      course("cicd-testing"),
      course("ai-for-testing"),
    ],
  },
];
