// DATA DUMMY — hapus sebelum rilis (PRD FR-01, aturan bisnis #16).
// Akun demo untuk mencoba alur login per role. Bukan autentikasi sungguhan.

import { DummyAccount } from "@/types/Auth";

export const DUMMY_PASSWORD = "demo1234";

export const DUMMY_ACCOUNTS: DummyAccount[] = [
  { userId: "user-sobat", name: "Sobat QA", email: "user@demo.belajarautomation.com", role: "user", roles: ["user"] },
  { userId: "user-andi", name: "Andi Pratama", email: "creator@demo.belajarautomation.com", role: "creator", roles: ["user", "creator"] },
  { userId: "user-rahma", name: "Rahma Putri", email: "reviewer@demo.belajarautomation.com", role: "reviewer", roles: ["user", "reviewer"] },
  { userId: "user-admin", name: "Admin Belajar", email: "admin@demo.belajarautomation.com", role: "admin", roles: ["user", "admin"] },
  {
    userId: "user-bima",
    name: "Bima Santoso",
    email: "bima@demo.belajarautomation.com",
    role: "reviewer",
    roles: ["user", "reviewer", "creator"],
    label: "Reviewer + Creator",
  },
];
