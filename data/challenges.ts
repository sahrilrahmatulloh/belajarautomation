import {
  Bug,
  Code2,
  Crosshair,
  FileCheck2,
  Network,
  Sparkles,
} from "lucide-react";

import { Challenge } from "@/types/Challenge";

export const CHALLENGES: Challenge[] = [
  {
    id: 1,
    slug: "playwright-locator",
    title: "Playwright Locator",
    description:
      "Pilih locator Playwright terbaik untuk elemen yang tersedia.",
    category: "Web Automation",
    courseSlug: "playwright",
    type: "challenge",
    difficulty: "Beginner",
    duration: "5 menit",
    icon: Crosshair,
  },
  {
    id: 2,
    slug: "login-test-case",
    title: "Login Test Case",
    description:
      "Buat test scenario untuk fitur login berdasarkan requirement.",
    category: "Manual Testing",
    courseSlug: "test-design",
    type: "challenge",
    difficulty: "Beginner",
    duration: "10 menit",
    icon: FileCheck2,
  },
  {
    id: 3,
    slug: "find-checkout-bug",
    title: "Find the Checkout Bug",
    description:
      "Analisis alur checkout dan temukan bug yang tersembunyi.",
    category: "Manual Testing",
    courseSlug: "bug-reporting",
    type: "challenge",
    difficulty: "Intermediate",
    duration: "15 menit",
    icon: Bug,
  },
  {
    id: 4,
    slug: "api-response-validation",
    title: "API Response Validation",
    description:
      "Validasi status code dan response body dari sebuah API.",
    category: "Fundamental",
    courseSlug: "dasar-web-api",
    type: "challenge",
    difficulty: "Intermediate",
    duration: "15 menit",
    icon: Network,
  },
  {
    id: 5,
    slug: "playwright-login-test",
    title: "Build Login Automation",
    description:
      "Lengkapi script Playwright untuk mengotomatisasi proses login.",
    category: "Web Automation",
    courseSlug: "playwright",
    type: "challenge",
    difficulty: "Advanced",
    duration: "20 menit",
    icon: Code2,
  },
  {
    id: 6,
    slug: "ai-test-generation",
    title: "AI Test Generation",
    description:
      "Buat instruksi yang efektif untuk menghasilkan test scenario dengan AI.",
    category: "AI",
    courseSlug: "ai-for-testing",
    type: "challenge",
    difficulty: "Intermediate",
    duration: "15 menit",
    icon: Sparkles,
  },
];