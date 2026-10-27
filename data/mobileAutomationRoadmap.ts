import {
  BookOpenCheck,
  Code2,
  GitBranch,
  Smartphone,
  Network,
  Cloud,
  Workflow,
  Container,
  FolderKanban,
} from "lucide-react";

import { RoadmapStep } from "@/types/RoadmapDetail";

export const MOBILE_AUTOMATION_STEPS: RoadmapStep[] = [
  {
    id: 1,
    title: "Mobile Testing Fundamentals",
    description:
      "Pelajari karakteristik mobile testing, Android, iOS, emulator, simulator, dan real device.",
    icon: BookOpenCheck,
    status: "completed",
  },
  {
    id: 2,
    title: "Programming Fundamentals",
    description:
      "Bangun fondasi programming untuk membuat mobile automation.",
    icon: Code2,
    status: "current",
  },
  {
    id: 3,
    title: "Git & GitHub",
    description:
      "Kelola automation project menggunakan version control.",
    icon: GitBranch,
    status: "locked",
  },
  {
    id: 4,
    title: "Appium Automation",
    description:
      "Pelajari Appium, locator, capabilities, gestures, dan mobile test execution.",
    icon: Smartphone,
    status: "locked",
  },
  {
    id: 5,
    title: "API Testing",
    description:
      "Gunakan API testing untuk mendukung mobile end-to-end testing.",
    icon: Network,
    status: "locked",
  },
  {
    id: 6,
    title: "Device Farm",
    description:
      "Jalankan automation pada berbagai device dan environment.",
    icon: Cloud,
    status: "locked",
  },
  {
    id: 7,
    title: "Mobile Automation Framework",
    description:
      "Bangun framework yang scalable, reusable, dan maintainable.",
    icon: Workflow,
    status: "locked",
  },
  {
    id: 8,
    title: "CI/CD",
    description:
      "Integrasikan mobile automation ke automation pipeline.",
    icon: Container,
    status: "locked",
  },
  {
    id: 9,
    title: "Mobile Industry Project",
    description:
      "Bangun project mobile automation berdasarkan simulasi workflow perusahaan.",
    icon: FolderKanban,
    status: "locked",
  },
];