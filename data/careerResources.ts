import {
  BriefcaseBusiness,
  FileText,
  FolderGit2,
  MessageSquareCode,
  Search,
  UserRoundCheck,
} from "lucide-react";

import { CareerResource } from "@/types/CareerResource";

export const CAREER_RESOURCES: CareerResource[] = [
  {
    id: 1,
    slug: "cv-qa-automation",
    title: "CV QA Automation",
    description:
      "Pelajari cara menyusun CV QA Automation yang jelas, relevan, dan mudah dipahami recruiter.",
    category: "CV & Resume",
    icon: FileText,
    href: "/career/cv-qa-automation",
    status: "available",
    sections: [
      {
        title: "Struktur CV",
        description:
          "Susun informasi penting agar recruiter dapat memahami profilmu dengan cepat.",
        items: [
          "Professional Summary",
          "Technical Skills",
          "Work Experience",
          "Automation Projects",
          "Education & Certification",
        ],
      },
      {
        title: "Technical Skills",
        description:
          "Tampilkan skill yang relevan dengan posisi QA Automation.",
        items: [
          "Programming Language",
          "Automation Tools",
          "API Testing",
          "Git & CI/CD",
          "Database",
        ],
      },
    ],
  },
  {
    id: 2,
    slug: "portfolio-github",
    title: "Portfolio & GitHub",
    description:
      "Bangun portfolio automation dan optimalkan GitHub untuk menunjukkan kemampuan teknis.",
    category: "Portfolio",
    icon: FolderGit2,
    href: "/career/portfolio-github",
    status: "available",
    sections: [
      {
        title: "Project Portfolio",
        description:
          "Buat project yang menunjukkan kemampuan automation secara nyata.",
        items: [
          "Web Automation Project",
          "API Automation Project",
          "Mobile Automation Project",
          "README yang lengkap",
          "Test Report",
        ],
      },
      {
        title: "Optimasi GitHub",
        description:
          "Pastikan repository mudah dipahami oleh recruiter dan interviewer.",
        items: [
          "Struktur repository yang rapi",
          "README project",
          "Installation guide",
          "Cara menjalankan test",
          "Screenshot atau test report",
        ],
      },
    ],
  },
  {
    id: 3,
    slug: "technical-interview",
    title: "Technical Interview",
    description:
      "Persiapkan pertanyaan teknis seputar QA, programming, API, dan automation testing.",
    category: "Interview",
    icon: MessageSquareCode,
    href: "/career/technical-interview",
    status: "available",
    sections: [
      {
        title: "QA Fundamentals",
        description:
          "Persiapkan konsep fundamental yang sering ditanyakan.",
        items: [
          "SDLC dan STLC",
          "Test Scenario vs Test Case",
          "Severity vs Priority",
          "Regression Testing",
          "Testing Strategy",
        ],
      },
      {
        title: "Automation Interview",
        description:
          "Pahami konsep teknis automation dan framework.",
        items: [
          "Locator Strategy",
          "Wait & Synchronization",
          "Page Object Model",
          "Flaky Test",
          "CI/CD Integration",
        ],
      },
    ],
  },
  {
    id: 4,
    slug: "mock-interview",
    title: "Mock Interview",
    description:
      "Latihan simulasi interview untuk meningkatkan kesiapan menghadapi proses rekrutmen.",
    category: "Practice",
    icon: UserRoundCheck,
    href: "/career/mock-interview",
    status: "coming-soon",
    sections: [],
  },
  {
    id: 5,
    slug: "job-search",
    title: "Job Search Strategy",
    description:
      "Pelajari strategi mencari lowongan QA Automation dan membaca requirement pekerjaan.",
    category: "Job Search",
    icon: Search,
    href: "/career/job-search",
    status: "available",
    sections: [
      {
        title: "Membaca Job Description",
        description:
          "Identifikasi requirement utama sebelum melamar.",
        items: [
          "Mandatory skills",
          "Nice-to-have skills",
          "Automation tools",
          "Programming language",
          "Experience requirement",
        ],
      },
      {
        title: "Strategi Melamar",
        description:
          "Fokus pada posisi yang sesuai dengan kemampuan dan target karier.",
        items: [
          "Sesuaikan CV dengan posisi",
          "Prioritaskan lowongan relevan",
          "Siapkan portfolio",
          "Catat application progress",
          "Evaluasi hasil interview",
        ],
      },
    ],
  },
  {
    id: 6,
    slug: "preparation",
    title: "Career Preparation",
    description:
      "Checklist persiapan sebelum mulai melamar posisi QA Automation Engineer.",
    category: "Preparation",
    icon: BriefcaseBusiness,
    href: "/career/preparation",
    status: "available",
    sections: [
      {
        title: "Technical Readiness",
        description:
          "Pastikan fundamental teknis utama sudah siap.",
        items: [
          "QA Fundamentals",
          "Programming Fundamentals",
          "Automation Testing",
          "API Testing",
          "Git",
        ],
      },
      {
        title: "Application Readiness",
        description:
          "Persiapkan semua kebutuhan sebelum mulai melamar.",
        items: [
          "CV terbaru",
          "GitHub aktif",
          "Portfolio project",
          "Interview preparation",
          "Target perusahaan",
        ],
      },
    ],
  },
];