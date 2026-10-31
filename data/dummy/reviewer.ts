// DATA DUMMY — hapus sebelum rilis (PRD FR-01, aturan bisnis #16).

import { ReviewActivity, ReviewQueueItem } from "@/types/RoleDashboard";

// Reviewer tidak me-review kontennya sendiri: nama ini tidak boleh
// muncul sebagai creatorName di antrean.
export const DUMMY_REVIEWER_NAME = "Rahma Putri";

// Tanggal acuan untuk menghitung lama menunggu agar data dummy stabil.
export const DUMMY_REFERENCE_DATE = "2026-10-31";

export const DUMMY_REVIEWER_STATS = {
  inReview: 1,
  approvedThisMonth: 14,
  returnedThisMonth: 4,
};

export const DUMMY_REVIEW_QUEUE: ReviewQueueItem[] = [
  {
    id: 1,
    title: "Panduan Menulis Bug Report",
    type: "Artikel",
    creatorName: "Andi Pratama",
    submittedAt: "2026-10-30",
    priority: "Sedang",
  },
  {
    id: 2,
    title: "Soal: HTTP Method & Idempotensi",
    type: "Soal Latihan",
    creatorName: "Sinta Maharani",
    submittedAt: "2026-10-24",
    priority: "Tinggi",
  },
  {
    id: 3,
    title: "Dasar Assertion di Cypress",
    type: "Materi",
    creatorName: "Andi Pratama",
    submittedAt: "2026-10-28",
    priority: "Sedang",
  },
  {
    id: 4,
    title: "Modul Appium untuk Pemula",
    type: "Modul",
    creatorName: "Galih Ramadhan",
    submittedAt: "2026-10-26",
    priority: "Tinggi",
  },
  {
    id: 5,
    title: "Exploratory Testing dalam Sprint",
    type: "Artikel",
    creatorName: "Sinta Maharani",
    submittedAt: "2026-10-29",
    priority: "Rendah",
  },
];

export const DUMMY_REVIEW_ACTIVITIES: ReviewActivity[] = [
  {
    id: 1,
    title: "Soal: Validasi Status Code API",
    creatorName: "Andi Pratama",
    result: "needs-revision",
    date: "2026-10-29",
  },
  {
    id: 2,
    title: "Modul Page Object Model",
    creatorName: "Andi Pratama",
    result: "approved",
    date: "2026-10-27",
  },
  {
    id: 3,
    title: "Mengenal Smoke Testing",
    creatorName: "Sinta Maharani",
    result: "approved",
    date: "2026-10-25",
  },
  {
    id: 4,
    title: "Soal: Equivalence Partitioning",
    creatorName: "Galih Ramadhan",
    result: "needs-revision",
    date: "2026-10-23",
  },
  {
    id: 5,
    title: "Setup Appium Inspector",
    creatorName: "Galih Ramadhan",
    result: "approved",
    date: "2026-10-21",
  },
];
