// DATA DUMMY — hapus sebelum rilis (PRD FR-01, aturan bisnis #16).
// Akun demo untuk mencoba alur login per role. Bukan autentikasi sungguhan.

import { DummyAccount } from "@/types/Auth";

export const DUMMY_PASSWORD = "demo1234";

export const DUMMY_ACCOUNTS: DummyAccount[] = [
  {
    name: "Sobat QA",
    email: "user@demo.belajarautomation.com",
    role: "user",
  },
  {
    name: "Andi Pratama",
    email: "creator@demo.belajarautomation.com",
    role: "creator",
  },
  {
    name: "Rahma Putri",
    email: "reviewer@demo.belajarautomation.com",
    role: "reviewer",
  },
  {
    name: "Admin Belajar",
    email: "admin@demo.belajarautomation.com",
    role: "admin",
  },
];
