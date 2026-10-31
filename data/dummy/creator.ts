// DATA DUMMY — hapus sebelum rilis (PRD FR-01, aturan bisnis #16).

import { CreatorContent, RevisionNote } from "@/types/RoleDashboard";

export const DUMMY_CREATOR_NAME = "Andi Pratama";

// Mencerminkan alur: Draft → Menunggu Review → Perlu Revisi / Disetujui → Terbit.
export const DUMMY_CREATOR_CONTENTS: CreatorContent[] = [
  {
    id: 1,
    title: "Soal: Boundary Value Analysis",
    type: "Soal Latihan",
    status: "draft",
    updatedAt: "2026-10-31",
  },
  {
    id: 2,
    title: "Panduan Menulis Bug Report",
    type: "Artikel",
    status: "in-review",
    updatedAt: "2026-10-30",
  },
  {
    id: 3,
    title: "Soal: Validasi Status Code API",
    type: "Soal Latihan",
    status: "needs-revision",
    updatedAt: "2026-10-29",
  },
  {
    id: 4,
    title: "Dasar Assertion di Cypress",
    type: "Materi",
    status: "in-review",
    updatedAt: "2026-10-28",
  },
  {
    id: 5,
    title: "Modul Page Object Model",
    type: "Modul",
    status: "approved",
    updatedAt: "2026-10-27",
  },
  {
    id: 6,
    title: "Locator Strategy di Playwright",
    type: "Materi",
    status: "published",
    updatedAt: "2026-10-12",
  },
];

export const DUMMY_REVISION_NOTES: RevisionNote[] = [
  {
    id: 1,
    contentTitle: "Soal: Validasi Status Code API",
    reviewerName: "Rahma Putri",
    summary:
      "Kunci jawaban belum sesuai penjelasan. Jelaskan kapan API mengembalikan 201, bukan 200.",
    date: "2026-10-29",
  },
  {
    id: 2,
    contentTitle: "Modul Page Object Model",
    reviewerName: "Bima Santoso",
    summary:
      "Struktur sudah baik. Tambahkan contoh struktur folder project sebelum diterbitkan.",
    date: "2026-10-26",
  },
  {
    id: 3,
    contentTitle: "Locator Strategy di Playwright",
    reviewerName: "Rahma Putri",
    summary:
      "Ganti contoh XPath panjang dengan getByRole agar konsisten dengan materi lain.",
    date: "2026-10-08",
  },
];
