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
    category: "Locator",
    difficulty: "Beginner",
    rp: 50,
    duration: "5 min",
    completed: false,
    icon: Crosshair,
  },
  {
    id: 2,
    slug: "login-test-case",
    title: "Login Test Case",
    description:
      "Buat test scenario untuk fitur login berdasarkan requirement.",
    category: "Test Case",
    difficulty: "Beginner",
    rp: 60,
    duration: "10 min",
    completed: false,
    icon: FileCheck2,
  },
  {
    id: 3,
    slug: "find-checkout-bug",
    title: "Find the Checkout Bug",
    description:
      "Analisis alur checkout dan temukan bug yang tersembunyi.",
    category: "Bug Hunt",
    difficulty: "Intermediate",
    rp: 100,
    duration: "15 min",
    completed: false,
    icon: Bug,
  },
  {
    id: 4,
    slug: "api-response-validation",
    title: "API Response Validation",
    description:
      "Validasi status code dan response body dari sebuah API.",
    category: "API",
    difficulty: "Intermediate",
    rp: 100,
    duration: "15 min",
    completed: false,
    icon: Network,
  },
  {
    id: 5,
    slug: "playwright-login-test",
    title: "Build Login Automation",
    description:
      "Lengkapi script Playwright untuk mengotomatisasi proses login.",
    category: "Automation",
    difficulty: "Advanced",
    rp: 150,
    duration: "20 min",
    completed: false,
    icon: Code2,
  },
  {
    id: 6,
    slug: "ai-test-generation",
    title: "AI Test Generation",
    description:
      "Buat instruksi yang efektif untuk menghasilkan test scenario dengan AI.",
    category: "AI",
    difficulty: "Intermediate",
    rp: 120,
    duration: "15 min",
    completed: false,
    icon: Sparkles,
  },
];