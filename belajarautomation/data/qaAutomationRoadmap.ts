import {
  BookOpenCheck,
  Code2,
  GitBranch,
  Network,
  GitFork,
  Workflow,
  Container,
  FolderKanban,
  BriefcaseBusiness,
  Globe,
  Smartphone,
} from "lucide-react";

import {
  RoadmapStep,
  RoadmapTrack,
} from "@/types/RoadmapDetail";

export const QA_AUTOMATION_STEPS: RoadmapStep[] = [
  {
    id: 1,
    title: "QA Fundamentals",
    description:
      "Pelajari dasar QA, SDLC, STLC, test case, bug report, dan testing methodology.",
    icon: BookOpenCheck,
    status: "completed",
  },
  {
    id: 2,
    title: "Programming Fundamentals",
    description:
      "Pilih bahasa pemrograman utama: Java, JavaScript, atau Python.",
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
    title: "API Testing",
    description:
      "Pelajari REST API, request, response, authentication, dan API automation.",
    icon: Network,
    status: "locked",
  },
];

export const QA_AUTOMATION_TRACKS: RoadmapTrack[] = [
  {
    id: "web",
    title: "Web Automation Track",
    description:
      "Fokus membangun automation testing untuk aplikasi web.",
    icon: Globe,
    steps: [
      "Web Testing Fundamentals",
      "Playwright / Selenium",
      "Page Object Model",
      "Web Automation Project",
    ],
  },
  {
    id: "mobile",
    title: "Mobile Automation Track",
    description:
      "Fokus automation testing untuk aplikasi Android dan iOS.",
    icon: Smartphone,
    steps: [
      "Mobile Testing Fundamentals",
      "Appium",
      "Android & iOS Automation",
      "Mobile Automation Project",
    ],
  },
];

export const QA_AUTOMATION_FINAL_STEPS: RoadmapStep[] = [
  {
    id: 5,
    title: "Automation Framework",
    description:
      "Bangun struktur automation framework yang scalable dan maintainable.",
    icon: Workflow,
    status: "locked",
  },
  {
    id: 6,
    title: "CI/CD & Docker",
    description:
      "Integrasikan automation testing ke dalam pipeline dan container.",
    icon: Container,
    status: "locked",
  },
  {
    id: 7,
    title: "Industry Project",
    description:
      "Kerjakan simulasi automation project berdasarkan workflow perusahaan.",
    icon: FolderKanban,
    status: "locked",
  },
  {
    id: 8,
    title: "Career Preparation",
    description:
      "Persiapkan portfolio, CV, technical interview, dan automation assessment.",
    icon: BriefcaseBusiness,
    status: "locked",
  },
];