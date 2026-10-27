import {
  Bot,
  Globe,
  Smartphone,
  Sparkles,
  Watch,
} from "lucide-react";

import { Roadmap } from "@/types/Roadmap";

export const ROADMAPS: Roadmap[] = [
  {
    id: "qa-automation-engineer",
    title: "QA Automation Engineer",
    description:
      "Jalur lengkap untuk menguasai QA Automation dari fundamental hingga membangun automation framework.",
    icon: Bot,
    level: "Beginner to Advanced",
    modules: 10,
    duration: "4–6 Bulan",
    status: "active",
    featured: true,
  },
  {
    id: "web-automation-engineer",
    title: "Web Automation Engineer",
    description:
      "Fokus menguasai automation testing untuk aplikasi web menggunakan tools modern.",
    icon: Globe,
    level: "Beginner to Advanced",
    modules: 8,
    duration: "3–4 Bulan",
    status: "active",
  },
  {
    id: "mobile-automation-engineer",
    title: "Mobile Automation Engineer",
    description:
      "Pelajari automation testing untuk aplikasi Android dan iOS hingga integrasi device farm.",
    icon: Smartphone,
    level: "Intermediate",
    modules: 8,
    duration: "3–4 Bulan",
    status: "active",
  },
  {
    id: "vibe-coding-qa-engineer",
    title: "Vibe Coding QA Engineer",
    description:
      "Bangun dan kembangkan test automation dengan bantuan AI coding tools dan coding agents.",
    icon: Sparkles,
    level: "Intermediate",
    modules: 7,
    duration: "2–3 Bulan",
    status: "active",
  },
  {
    id: "smartwatch-automation-engineer",
    title: "Smartwatch Automation Engineer",
    description:
      "Jalur khusus untuk automation testing pada aplikasi dan perangkat smartwatch.",
    icon: Watch,
    level: "Specialization",
    modules: 0,
    duration: "Coming Soon",
    status: "coming-soon",
  },
];