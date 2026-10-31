// DATA DUMMY — hapus sebelum rilis (PRD FR-01, aturan bisnis #16).
// Email disamarkan dan tidak ada detail pembayaran.

import { UserRole } from "@/types/Role";
import {
  AdminActivityLog,
  AdminRecentUser,
  AdminStats,
} from "@/types/RoleDashboard";

export const DUMMY_ADMIN_STATS: AdminStats = {
  totalUsers: 1248,
  premiumUsers: 86,
  publishedContent: 132,
  pendingReview: 5,
  transactionsThisMonth: 23,
  pendingTransactions: 2,
};

// Totalnya sama dengan totalUsers.
export const DUMMY_ROLE_DISTRIBUTION: Record<UserRole, number> = {
  user: 1226,
  creator: 14,
  reviewer: 6,
  admin: 2,
};

export const DUMMY_RECENT_USERS: AdminRecentUser[] = [
  {
    id: 1,
    name: "Dewi Anggraini",
    maskedEmail: "de***@mail.com",
    role: "user",
    isPremium: false,
    joinedAt: "2026-10-31",
  },
  {
    id: 2,
    name: "Galih Ramadhan",
    maskedEmail: "ga***@mail.com",
    role: "creator",
    isPremium: true,
    joinedAt: "2026-10-29",
  },
  {
    id: 3,
    name: "Yusuf Hidayat",
    maskedEmail: "yu***@mail.com",
    role: "user",
    isPremium: true,
    joinedAt: "2026-10-28",
  },
  {
    id: 4,
    name: "Bima Santoso",
    maskedEmail: "bi***@mail.com",
    role: "reviewer",
    isPremium: false,
    joinedAt: "2026-10-25",
  },
  {
    id: 5,
    name: "Lestari Wulandari",
    maskedEmail: "le***@mail.com",
    role: "user",
    isPremium: false,
    joinedAt: "2026-10-24",
  },
];

export const DUMMY_ADMIN_ACTIVITY: AdminActivityLog[] = [
  {
    id: 1,
    message: "Andi Pratama mengirim artikel “Panduan Menulis Bug Report” untuk review",
    time: "15 menit lalu",
  },
  {
    id: 2,
    message: "Admin mengubah role Galih Ramadhan menjadi Creator",
    time: "1 jam lalu",
  },
  {
    id: 3,
    message: "Pembayaran Premium #1045 berhasil",
    time: "2 jam lalu",
  },
  {
    id: 4,
    message: "Rahma Putri menyetujui modul “Modul Page Object Model”",
    time: "Kemarin, 16.20",
  },
  {
    id: 5,
    message: "Pengguna baru mendaftar: Dewi Anggraini",
    time: "Kemarin, 09.05",
  },
];
