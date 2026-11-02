import { Challenge } from "@/types/Challenge";

// 10 latihan dummy tahap pengembangan (PRD FR-04): 4 Kuis, 2 Bug Hunt,
// 2 Test Case Writing, dan 2 Locator Challenge. Isinya ada di data/challengeDetails.ts.
export const CHALLENGES: Challenge[] = [
  {
    slug: "kuis-qa-fundamental",
    title: "Kuis QA Fundamental",
    description:
      "Uji pemahaman tentang peran QA, SDLC, STLC, Agile, jenis testing, test case, dan bug report.",
    type: "quiz",
    category: "Fundamental",
    courseSlug: "qa-fundamentals",
    difficulty: "Beginner",
    duration: "10 menit",
    questionCount: 10,
  },
  {
    slug: "kuis-dasar-web-api",
    title: "Kuis Dasar Web & API",
    description:
      "Uji pemahaman tentang client-server, HTTP method, status code, DOM, JSON, dan DevTools.",
    type: "quiz",
    category: "Fundamental",
    courseSlug: "dasar-web-api",
    difficulty: "Beginner",
    duration: "8 menit",
    questionCount: 8,
  },
  {
    slug: "kuis-git-github",
    title: "Kuis Git & GitHub",
    description:
      "Uji pemahaman tentang commit, branch, merge, konflik, pull request, dan code review.",
    type: "quiz",
    category: "Programming",
    courseSlug: "git-github",
    difficulty: "Beginner",
    duration: "8 menit",
    questionCount: 8,
  },
  {
    slug: "kuis-playwright",
    title: "Kuis Playwright",
    description:
      "Uji pemahaman tentang locator, auto-waiting, assertion, fixture, Page Object Model, dan report.",
    type: "quiz",
    category: "Web Automation",
    courseSlug: "playwright",
    difficulty: "Intermediate",
    duration: "10 menit",
    questionCount: 10,
  },
  {
    slug: "find-checkout-bug",
    title: "Find the Checkout Bug",
    description:
      "Jelajahi halaman checkout tiruan, lalu tandai semua bug yang kamu temukan.",
    type: "bug-hunt",
    category: "Manual Testing",
    courseSlug: "bug-reporting",
    difficulty: "Intermediate",
    duration: "10 menit",
  },
  {
    slug: "bug-hunt-form-login",
    title: "Bug Hunt Form Login",
    description:
      "Coba form login tiruan dengan berbagai isian, lalu tandai bug yang kamu temukan.",
    type: "bug-hunt",
    category: "Manual Testing",
    courseSlug: "bug-reporting",
    difficulty: "Beginner",
    duration: "5 menit",
  },
  {
    slug: "login-test-case",
    title: "Login Test Case",
    description:
      "Tulis test case untuk fitur login berdasarkan kebutuhan yang diberikan.",
    type: "test-case",
    category: "Manual Testing",
    courseSlug: "test-design",
    difficulty: "Beginner",
    duration: "10 menit",
  },
  {
    slug: "test-case-pencarian-produk",
    title: "Test Case Pencarian Produk",
    description:
      "Tulis test case untuk fitur pencarian produk yang memiliki filter kategori dan harga.",
    type: "test-case",
    category: "Manual Testing",
    courseSlug: "test-design",
    difficulty: "Intermediate",
    duration: "15 menit",
  },
  {
    slug: "playwright-locator",
    title: "Playwright Locator",
    description:
      "Tulis selector CSS atau XPath yang tepat mengenai satu elemen di halaman login tiruan.",
    type: "locator",
    category: "Web Automation",
    courseSlug: "playwright",
    difficulty: "Beginner",
    duration: "5 menit",
  },
  {
    slug: "locator-form-registrasi",
    title: "Locator Form Registrasi",
    description:
      "Tulis selector yang tepat untuk elemen di form registrasi tiruan yang lebih kompleks.",
    type: "locator",
    category: "Web Automation",
    courseSlug: "playwright",
    difficulty: "Intermediate",
    duration: "10 menit",
  },
];
