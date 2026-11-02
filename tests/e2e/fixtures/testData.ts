// Data test ditulis terpisah dari kode aplikasi: nilai yang diharapkan tidak
// boleh ikut berubah bila data aplikasi berubah, dan kunci jawaban challenge di
// data/challengeDetails.ts bersifat server-only sehingga tidak boleh diimpor.

export type Role = "user" | "creator" | "reviewer" | "admin";

export const DEMO_PASSWORD = "demo1234";

export const ACCOUNTS: Record<Role, { name: string; email: string; home: string }> = {
  user: { name: "Sobat QA", email: "user@demo.belajarautomation.com", home: "/" },
  creator: { name: "Andi Pratama", email: "creator@demo.belajarautomation.com", home: "/creator" },
  reviewer: { name: "Rahma Putri", email: "reviewer@demo.belajarautomation.com", home: "/reviewer" },
  admin: { name: "Admin Belajar", email: "admin@demo.belajarautomation.com", home: "/admin" },
};

export const ROLES = Object.keys(ACCOUNTS) as Role[];

// Penanda sessionStorage bahwa splash sudah tampil (lib/splash.ts).
export const SPLASH_SEEN_KEY = "belajarautomation-splash-seen";

export const CHALLENGE_ANSWERS = {
  "playwright-locator": 'page.getByRole("button", { name: "Login" })',
  "login-test-case": "dashboard",
  "find-checkout-bug": "shipping",
  "api-response-validation": "200",
  "playwright-login-test": "dashboard",
  "ai-test-generation": "scenario",
} as const;

export const WRONG_CHALLENGE_ANSWER = "jawaban yang pasti salah";
