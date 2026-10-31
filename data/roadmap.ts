import {
  BookOpenCheck,
  Braces,
  Bug,
  ClipboardCheck,
  ClipboardList,
  Code2,
  Container,
  Crosshair,
  FileCheck2,
  FolderKanban,
  Gauge,
  GitBranch,
  Globe,
  Layers3,
  Network,
  Play,
  Repeat,
  Search,
  Server,
  Smartphone,
  Workflow,
} from "lucide-react";

import { Roadmap } from "@/types/Roadmap";

// Jalur roadmap sesuai PRD (FR-03). Status step selalu "not-started"
// sampai ada data progress pengguna nyata.
export const ROADMAPS: Roadmap[] = [
  {
    id: "fundamental",
    title: "Fundamental",
    description:
      "Fondasi wajib QA sebelum memilih jalur manual, automation, atau API testing.",
    icon: BookOpenCheck,
    level: "Beginner",
    duration: "1–2 Bulan",
    status: "active",
    featured: true,
    goals: [
      "Memahami peran QA dalam siklus pengembangan software",
      "Mampu menulis test scenario, test case, dan bug report",
      "Siap melanjutkan ke jalur spesialisasi",
    ],
    skills: [
      "SDLC & STLC",
      "Test Case Design",
      "Bug Reporting",
      "Agile & Scrum",
      "Git Dasar",
    ],
    prerequisites: [
      "Tidak ada prasyarat khusus, cocok untuk pemula",
    ],
    steps: [
      {
        id: "qa-basics",
        title: "Dasar Quality Assurance",
        description:
          "Kenali peran QA, perbedaan QA dan QC, serta tanggung jawab QA Engineer.",
        icon: BookOpenCheck,
        courseSlug: "qa-fundamentals",
        prerequisites: [],
        status: "not-started",
      },
      {
        id: "sdlc-stlc",
        title: "SDLC, STLC & Agile",
        description:
          "Pahami alur pengembangan software dan posisi testing di dalamnya.",
        icon: Workflow,
        courseSlug: "qa-fundamentals",
        prerequisites: ["qa-basics"],
        status: "not-started",
      },
      {
        id: "test-design",
        title: "Test Scenario & Test Case",
        description:
          "Tulis test scenario dan test case positif maupun negatif.",
        icon: FileCheck2,
        courseSlug: "qa-fundamentals",
        prerequisites: ["sdlc-stlc"],
        status: "not-started",
      },
      {
        id: "bug-management",
        title: "Bug Report & Bug Life Cycle",
        description:
          "Laporkan bug dengan severity dan priority yang tepat.",
        icon: Bug,
        courseSlug: "qa-fundamentals",
        prerequisites: ["test-design"],
        status: "not-started",
      },
      {
        id: "git",
        title: "Git & GitHub",
        description:
          "Kelola dokumen dan kode test dengan version control.",
        icon: GitBranch,
        courseSlug: "git-github",
        prerequisites: ["qa-basics"],
        status: "not-started",
      },
    ],
  },
  {
    id: "qa-manual-engineer",
    title: "QA Manual Engineer",
    description:
      "Jalur untuk menjadi QA yang kuat dalam analisis requirement, desain test, dan exploratory testing.",
    icon: ClipboardCheck,
    level: "Beginner – Intermediate",
    duration: "2–3 Bulan",
    status: "active",
    goals: [
      "Menerjemahkan requirement menjadi test scenario",
      "Menerapkan teknik desain test yang sistematis",
      "Menjalankan exploratory dan regression testing dalam sprint",
    ],
    skills: [
      "Requirement Analysis",
      "Test Design Technique",
      "Exploratory Testing",
      "Regression Testing",
      "Test Management",
    ],
    prerequisites: [
      "Menyelesaikan jalur Fundamental",
    ],
    steps: [
      {
        id: "qa-fundamentals",
        title: "QA Fundamentals",
        description:
          "Pastikan fondasi QA, test case, dan bug report sudah kuat.",
        icon: BookOpenCheck,
        courseSlug: "qa-fundamentals",
        prerequisites: [],
        status: "not-started",
      },
      {
        id: "requirement-analysis",
        title: "Analisis Requirement",
        description:
          "Baca user story dan acceptance criteria untuk menemukan skenario dan risiko.",
        icon: Search,
        prerequisites: ["qa-fundamentals"],
        status: "not-started",
      },
      {
        id: "test-design-technique",
        title: "Teknik Desain Test",
        description:
          "Equivalence partitioning, boundary value analysis, dan decision table.",
        icon: ClipboardList,
        prerequisites: ["requirement-analysis"],
        status: "not-started",
      },
      {
        id: "exploratory",
        title: "Exploratory Testing",
        description:
          "Temukan bug di luar skenario tertulis dengan sesi eksplorasi terarah.",
        icon: Crosshair,
        prerequisites: ["test-design-technique"],
        status: "not-started",
      },
      {
        id: "regression",
        title: "Regression & Smoke Testing",
        description:
          "Susun regression suite dan smoke test untuk setiap rilis.",
        icon: Repeat,
        prerequisites: ["test-design-technique"],
        status: "not-started",
      },
      {
        id: "test-management",
        title: "Test Management",
        description:
          "Kelola test case, eksekusi, dan laporan test dalam sprint Agile.",
        icon: Layers3,
        prerequisites: ["regression"],
        status: "not-started",
      },
    ],
  },
  {
    id: "qa-automation-web",
    title: "QA Automation Web",
    description:
      "Kuasai automation testing untuk aplikasi web menggunakan Playwright atau Selenium hingga terintegrasi CI/CD.",
    icon: Globe,
    level: "Beginner – Advanced",
    duration: "3–4 Bulan",
    status: "active",
    goals: [
      "Membangun automated test web yang stabil",
      "Menerapkan Page Object Model dan struktur framework",
      "Menjalankan test otomatis di pipeline CI/CD",
    ],
    skills: [
      "JavaScript",
      "Playwright",
      "Selenium",
      "Page Object Model",
      "BDD",
      "CI/CD",
    ],
    prerequisites: [
      "Menyelesaikan jalur Fundamental",
      "Memahami dasar pemrograman",
    ],
    steps: [
      {
        id: "qa-fundamentals",
        title: "QA Fundamentals",
        description:
          "Fondasi QA sebelum menulis automated test.",
        icon: BookOpenCheck,
        courseSlug: "qa-fundamentals",
        prerequisites: [],
        status: "not-started",
      },
      {
        id: "programming",
        title: "JavaScript untuk Automation",
        description:
          "Function, async/await, dan module sebagai bekal Playwright.",
        icon: Braces,
        courseSlug: "javascript",
        prerequisites: ["qa-fundamentals"],
        status: "not-started",
      },
      {
        id: "git",
        title: "Git & GitHub",
        description:
          "Kelola kode automation dan berkolaborasi lewat pull request.",
        icon: GitBranch,
        courseSlug: "git-github",
        prerequisites: ["programming"],
        status: "not-started",
      },
      {
        id: "playwright",
        title: "Playwright",
        description:
          "Locator, assertion, dan Page Object Model dengan Playwright.",
        icon: Play,
        courseSlug: "playwright",
        prerequisites: ["programming", "git"],
        status: "not-started",
      },
      {
        id: "selenium",
        title: "Selenium WebDriver",
        description:
          "Alternatif berbasis Java yang banyak dipakai di perusahaan.",
        icon: Globe,
        courseSlug: "selenium",
        prerequisites: ["git"],
        status: "not-started",
      },
      {
        id: "bdd",
        title: "BDD dengan Cucumber",
        description:
          "Tulis skenario Gherkin yang mudah dipahami seluruh tim.",
        icon: Workflow,
        courseSlug: "cucumber",
        prerequisites: ["selenium"],
        status: "not-started",
      },
      {
        id: "cicd",
        title: "CI/CD & Docker",
        description:
          "Jalankan automated test di pipeline dan container.",
        icon: Container,
        prerequisites: ["playwright"],
        status: "not-started",
      },
      {
        id: "project",
        title: "Web Automation Project",
        description:
          "Bangun project end-to-end seperti workflow di perusahaan.",
        icon: FolderKanban,
        prerequisites: ["cicd"],
        status: "not-started",
      },
    ],
  },
  {
    id: "qa-automation-mobile",
    title: "QA Automation Mobile",
    description:
      "Pelajari automation testing untuk aplikasi Android dan iOS hingga eksekusi di device farm.",
    icon: Smartphone,
    level: "Intermediate",
    duration: "3–4 Bulan",
    status: "active",
    goals: [
      "Memahami karakteristik mobile testing",
      "Membuat automated test mobile dengan Appium",
      "Menjalankan test di berbagai device",
    ],
    skills: [
      "Mobile Testing",
      "Java",
      "Appium",
      "Device Farm",
      "CI/CD",
    ],
    prerequisites: [
      "Menyelesaikan jalur Fundamental",
      "Memahami dasar pemrograman",
    ],
    steps: [
      {
        id: "qa-fundamentals",
        title: "QA Fundamentals",
        description:
          "Fondasi QA sebelum masuk ke mobile testing.",
        icon: BookOpenCheck,
        courseSlug: "qa-fundamentals",
        prerequisites: [],
        status: "not-started",
      },
      {
        id: "mobile-basics",
        title: "Mobile Testing Fundamentals",
        description:
          "Android, iOS, emulator, simulator, dan real device.",
        icon: Smartphone,
        prerequisites: ["qa-fundamentals"],
        status: "not-started",
      },
      {
        id: "programming",
        title: "Java",
        description:
          "Fondasi pemrograman untuk menulis test Appium.",
        icon: Code2,
        courseSlug: "java",
        prerequisites: ["qa-fundamentals"],
        status: "not-started",
      },
      {
        id: "git",
        title: "Git & GitHub",
        description:
          "Kelola project mobile automation dengan version control.",
        icon: GitBranch,
        courseSlug: "git-github",
        prerequisites: ["programming"],
        status: "not-started",
      },
      {
        id: "appium",
        title: "Appium",
        description:
          "Locator, capabilities, gesture, dan eksekusi test mobile.",
        icon: Play,
        prerequisites: ["mobile-basics", "programming"],
        status: "not-started",
      },
      {
        id: "device-farm",
        title: "Device Farm",
        description:
          "Jalankan test di berbagai device dan versi OS.",
        icon: Server,
        prerequisites: ["appium"],
        status: "not-started",
      },
      {
        id: "cicd",
        title: "CI/CD",
        description:
          "Integrasikan mobile automation ke pipeline.",
        icon: Container,
        prerequisites: ["device-farm", "git"],
        status: "not-started",
      },
    ],
  },
  {
    id: "api-test-engineer",
    title: "API Test Engineer",
    description:
      "Fokus menguji REST API secara manual dan otomatis, termasuk validasi schema dan performa dasar.",
    icon: Network,
    level: "Beginner – Intermediate",
    duration: "2–3 Bulan",
    status: "active",
    goals: [
      "Memahami HTTP dan desain REST API",
      "Menguji API secara manual dan otomatis",
      "Memvalidasi schema, contract, dan performa dasar",
    ],
    skills: [
      "HTTP & REST",
      "Postman",
      "API Automation",
      "Schema Validation",
      "Performance Testing",
    ],
    prerequisites: [
      "Menyelesaikan jalur Fundamental",
    ],
    steps: [
      {
        id: "qa-fundamentals",
        title: "QA Fundamentals",
        description:
          "Fondasi QA sebelum fokus ke API.",
        icon: BookOpenCheck,
        courseSlug: "qa-fundamentals",
        prerequisites: [],
        status: "not-started",
      },
      {
        id: "http-rest",
        title: "HTTP & REST API",
        description:
          "Method, status code, header, dan format JSON.",
        icon: Network,
        prerequisites: ["qa-fundamentals"],
        status: "not-started",
      },
      {
        id: "manual-api",
        title: "Manual API Testing",
        description:
          "Uji endpoint dengan Postman: request, environment, dan assertion.",
        icon: ClipboardList,
        prerequisites: ["http-rest"],
        status: "not-started",
      },
      {
        id: "programming",
        title: "JavaScript",
        description:
          "Bekal menulis API test secara otomatis.",
        icon: Braces,
        courseSlug: "javascript",
        prerequisites: ["qa-fundamentals"],
        status: "not-started",
      },
      {
        id: "api-automation",
        title: "API Automation dengan Playwright",
        description:
          "Tulis API test otomatis menggunakan request context Playwright.",
        icon: Play,
        courseSlug: "playwright",
        prerequisites: ["manual-api", "programming"],
        status: "not-started",
      },
      {
        id: "schema",
        title: "Schema & Contract Testing",
        description:
          "Pastikan struktur response sesuai kontrak antar tim.",
        icon: FileCheck2,
        prerequisites: ["api-automation"],
        status: "not-started",
      },
      {
        id: "performance",
        title: "Performance Testing Dasar",
        description:
          "Ukur response time dan beban dasar sebuah API.",
        icon: Gauge,
        prerequisites: ["api-automation"],
        status: "not-started",
      },
    ],
  },
  {
    id: "programming",
    title: "Programming",
    description:
      "Fondasi pemrograman untuk automation: pilih satu bahasa utama lalu kelola kode dengan Git.",
    icon: Code2,
    level: "Beginner",
    duration: "1–2 Bulan",
    status: "active",
    goals: [
      "Menguasai satu bahasa pemrograman untuk automation",
      "Mengelola kode dengan Git dan GitHub",
      "Siap mempelajari framework automation",
    ],
    skills: [
      "JavaScript",
      "Python",
      "Java",
      "Git",
    ],
    prerequisites: [
      "Tidak perlu pengalaman pemrograman sebelumnya",
    ],
    steps: [
      {
        id: "git",
        title: "Git & GitHub",
        description:
          "Mulai dengan version control agar setiap latihan tersimpan rapi.",
        icon: GitBranch,
        courseSlug: "git-github",
        prerequisites: [],
        status: "not-started",
      },
      {
        id: "javascript",
        title: "JavaScript",
        description:
          "Pilihan utama untuk Playwright dan Cypress.",
        icon: Braces,
        courseSlug: "javascript",
        prerequisites: ["git"],
        status: "not-started",
      },
      {
        id: "python",
        title: "Python",
        description:
          "Pilihan untuk pytest dan Robot Framework.",
        icon: Code2,
        courseSlug: "python",
        prerequisites: ["git"],
        status: "not-started",
      },
      {
        id: "java",
        title: "Java",
        description:
          "Pilihan untuk Selenium dan Appium di lingkungan enterprise.",
        icon: Code2,
        courseSlug: "java",
        prerequisites: ["git"],
        status: "not-started",
      },
    ],
  },
];
