import {
  BookOpenCheck,
  Braces,
  Code2,
  GitBranch,
  Globe,
  Play,
  TestTube2,
  Workflow,
  Bot,
  Blocks,
} from "lucide-react";

import { Course } from "@/types/Course";

export const COURSES: Course[] = [
  {
    id: 1,
    slug: "qa-fundamentals",
    title: "QA Fundamentals",
    description:
      "Dasar-dasar QA, SDLC, STLC, test case, bug report, dan jenis testing.",
    category: "Fundamental",
    level: "Beginner",
    lessons: 16,
    estimatedDuration: "2 jam 40 menit",
    icon: BookOpenCheck,
  },
  {
    id: 2,
    slug: "java",
    title: "Java",
    description:
      "Belajar Java dari dasar hingga OOP untuk automation testing.",
    category: "Programming",
    level: "Beginner",
    lessons: 12,
    estimatedDuration: "2 jam 30 menit",
    icon: Code2,
  },
  {
    id: 3,
    slug: "javascript",
    title: "JavaScript",
    description:
      "Dasar JavaScript hingga ES6+ untuk automation modern.",
    category: "Programming",
    level: "Beginner",
    lessons: 10,
    estimatedDuration: "2 jam",
    icon: Braces,
  },
  {
    id: 4,
    slug: "python",
    title: "Python",
    description:
      "Belajar Python untuk automation, scripting, dan test framework.",
    category: "Programming",
    level: "Beginner",
    lessons: 10,
    estimatedDuration: "2 jam",
    icon: Code2,
  },
  {
    id: 5,
    slug: "git-github",
    title: "Git & GitHub",
    description:
      "Version control dengan Git dan kolaborasi project di GitHub.",
    category: "Programming",
    level: "Beginner",
    lessons: 9,
    estimatedDuration: "1 jam 35 menit",
    icon: GitBranch,
  },
  {
    id: 6,
    slug: "playwright",
    title: "Playwright",
    description:
      "Modern end-to-end testing dengan Playwright untuk web automation.",
    category: "Web Automation",
    level: "Advanced",
    lessons: 8,
    estimatedDuration: "1 jam 50 menit",
    icon: Play,
  },
  {
    id: 7,
    slug: "selenium",
    title: "Selenium",
    description:
      "Web automation menggunakan Selenium WebDriver dari dasar hingga advanced.",
    category: "Web Automation",
    level: "Advanced",
    lessons: 11,
    estimatedDuration: "2 jam 20 menit",
    icon: Globe,
  },
  {
    id: 8,
    slug: "cypress",
    title: "Cypress",
    description:
      "End-to-end testing modern untuk aplikasi web dengan Cypress.",
    category: "Web Automation",
    level: "Advanced",
    lessons: 9,
    estimatedDuration: "1 jam 40 menit",
    icon: TestTube2,
  },
  {
    id: 9,
    slug: "cucumber",
    title: "Cucumber",
    description:
      "BDD automation menggunakan Cucumber dan Gherkin syntax.",
    category: "Web Automation",
    level: "Intermediate",
    lessons: 9,
    estimatedDuration: "1 jam 45 menit",
    icon: Workflow,
  },
  {
    id: 10,
    slug: "katalon",
    title: "Katalon Studio",
    description:
      "Low-code automation untuk web, API, dan mobile testing.",
    category: "Web Automation",
    level: "Beginner",
    lessons: 9,
    estimatedDuration: "1 jam 45 menit",
    icon: Blocks,
  },
  {
    id: 11,
    slug: "robot-framework",
    title: "Robot Framework",
    description:
      "Keyword-driven test automation menggunakan Robot Framework.",
    category: "Web Automation",
    level: "Advanced",
    lessons: 9,
    estimatedDuration: "1 jam 35 menit",
    icon: Bot,
  },
];
