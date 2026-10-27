import {
  BookOpenCheck,
  Code2,
  GitBranch,
  Globe,
  Network,
  Workflow,
  Container,
  FolderKanban,
  BriefcaseBusiness,
} from "lucide-react";

import { RoadmapStep } from "@/types/RoadmapDetail";

export const WEB_AUTOMATION_STEPS: RoadmapStep[] = [
  {
    id: 1,
    title: "QA & Web Testing Fundamentals",
    description:
      "Pelajari dasar QA, web testing, browser, DOM, HTTP, dan strategi pengujian aplikasi web.",
    icon: BookOpenCheck,
    status: "completed",
  },
  {
    id: 2,
    title: "Programming Fundamentals",
    description:
      "Pelajari JavaScript, TypeScript, atau Java sebagai fondasi web automation.",
    icon: Code2,
    status: "current",
  },
  {
    id: 3,
    title: "Git & GitHub",
    description:
      "Pelajari version control, branching, pull request, dan collaboration workflow.",
    icon: GitBranch,
    status: "locked",
  },
  {
    id: 4,
    title: "Web Automation",
    description:
      "Bangun automated test menggunakan Playwright atau Selenium.",
    icon: Globe,
    status: "locked",
  },
  {
    id: 5,
    title: "API Testing",
    description:
      "Integrasikan API testing untuk mendukung end-to-end automation.",
    icon: Network,
    status: "locked",
  },
  {
    id: 6,
    title: "Automation Framework",
    description:
      "Pelajari Page Object Model, fixtures, test data, reporting, dan reusable architecture.",
    icon: Workflow,
    status: "locked",
  },
  {
    id: 7,
    title: "CI/CD & Docker",
    description:
      "Jalankan automated test melalui pipeline dan container environment.",
    icon: Container,
    status: "locked",
  },
  {
    id: 8,
    title: "Web Automation Project",
    description:
      "Bangun automation project end-to-end seperti workflow di perusahaan.",
    icon: FolderKanban,
    status: "locked",
  },
  {
    id: 9,
    title: "Career Preparation",
    description:
      "Persiapkan portfolio, GitHub, CV, dan technical interview.",
    icon: BriefcaseBusiness,
    status: "locked",
  },
];