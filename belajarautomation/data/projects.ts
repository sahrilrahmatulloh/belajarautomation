import {
  Bot,
  Globe,
  Network,
  Smartphone,
  Workflow,
  ShoppingCart,
} from "lucide-react";

import { Project } from "@/types/Project";

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "E-Commerce Web Automation",
    description:
      "Bangun end-to-end automation untuk alur login, product, cart, dan checkout.",
    category: "Web Automation",
    difficulty: "Beginner",
    techStack: [
      "Playwright",
      "TypeScript",
    ],
    icon: ShoppingCart,
    status: "locked",
  },
  {
    id: 2,
    title: "SauceDemo Automation Framework",
    description:
      "Bangun automation framework web dengan struktur yang scalable dan maintainable.",
    category: "Web Automation",
    difficulty: "Intermediate",
    techStack: [
      "Selenium",
      "Java",
      "TestNG",
    ],
    icon: Globe,
    status: "locked",
  },
  {
    id: 3,
    title: "REST API Automation",
    description:
      "Bangun automated API testing untuk authentication, CRUD, dan response validation.",
    category: "API Automation",
    difficulty: "Intermediate",
    techStack: [
      "Postman",
      "Newman",
      "JavaScript",
    ],
    icon: Network,
    status: "locked",
  },
  {
    id: 4,
    title: "Mobile App Automation",
    description:
      "Bangun automation testing untuk aplikasi Android menggunakan Appium.",
    category: "Mobile Automation",
    difficulty: "Intermediate",
    techStack: [
      "Appium",
      "WebdriverIO",
      "TypeScript",
    ],
    icon: Smartphone,
    status: "locked",
  },
  {
    id: 5,
    title: "CI/CD Automation Pipeline",
    description:
      "Integrasikan automated test ke dalam pipeline untuk menjalankan regression secara otomatis.",
    category: "DevOps",
    difficulty: "Advanced",
    techStack: [
      "GitHub Actions",
      "Docker",
      "Playwright",
    ],
    icon: Workflow,
    status: "locked",
  },
  {
    id: 6,
    title: "AI-Assisted QA Automation",
    description:
      "Bangun automation project menggunakan AI-assisted coding workflow dari requirement hingga review.",
    category: "AI Automation",
    difficulty: "Advanced",
    techStack: [
      "AI Coding",
      "Playwright",
      "TypeScript",
    ],
    icon: Bot,
    status: "locked",
  },
];