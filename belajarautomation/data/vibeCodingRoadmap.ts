import {
  BookOpenCheck,
  Bot,
  MessageSquareCode,
  Code2,
  TestTube2,
  SearchCode,
  Workflow,
  FolderKanban,
} from "lucide-react";

import { RoadmapStep } from "@/types/RoadmapDetail";

export const VIBE_CODING_STEPS: RoadmapStep[] = [
  {
    id: 1,
    title: "QA Automation Fundamentals",
    description:
      "Pahami konsep automation testing sebelum menggunakan AI untuk menghasilkan kode.",
    icon: BookOpenCheck,
    status: "completed",
  },
  {
    id: 2,
    title: "AI Coding Workflow",
    description:
      "Pelajari workflow membangun automation dengan bantuan AI coding tools dan agents.",
    icon: Bot,
    status: "current",
  },
  {
    id: 3,
    title: "Prompt & Context Engineering",
    description:
      "Berikan requirement, context, constraint, dan instruction yang efektif kepada AI.",
    icon: MessageSquareCode,
    status: "locked",
  },
  {
    id: 4,
    title: "AI-Assisted Test Generation",
    description:
      "Gunakan AI untuk membantu menghasilkan test scenario dan automation code.",
    icon: TestTube2,
    status: "locked",
  },
  {
    id: 5,
    title: "Build Automation with AI",
    description:
      "Bangun automation project menggunakan AI-assisted development workflow.",
    icon: Code2,
    status: "locked",
  },
  {
    id: 6,
    title: "Review & Debug AI Code",
    description:
      "Validasi, review, debug, dan perbaiki kode automation yang dihasilkan AI.",
    icon: SearchCode,
    status: "locked",
  },
  {
    id: 7,
    title: "AI Automation Workflow",
    description:
      "Bangun workflow automation yang tetap maintainable dan memiliki engineering standards.",
    icon: Workflow,
    status: "locked",
  },
  {
    id: 8,
    title: "Vibe Coding QA Project",
    description:
      "Bangun automation project end-to-end menggunakan AI sebagai development partner.",
    icon: FolderKanban,
    status: "locked",
  },
];