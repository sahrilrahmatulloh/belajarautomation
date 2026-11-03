// DATA DUMMY — hapus sebelum rilis (PRD FR-01, aturan bisnis #16).

import { ArticleDraft, CreatorContent, RevisionNote, RevisionThread } from "@/types/RoleDashboard";

export const DUMMY_CREATOR_NAME = "Andi Pratama";

const SAMPLE_ARTICLE: ArticleDraft = {
  excerpt: "Ringkasan contoh untuk prototipe.",
  cover: "contoh-sampul.webp",
  cta: "",
  sources: "",
  body: "## Pendahuluan\n\nIsi contoh untuk prototipe Mode Creator.\n\n## Kesimpulan\n\nBagian penutup contoh.",
  videos: [],
};

// Mencerminkan alur: Draft → Menunggu Review → Perlu Revisi / Disetujui → Terbit.
export const DUMMY_CREATOR_CONTENTS: CreatorContent[] = [
  {
    id: 1,
    title: "Soal: Boundary Value Analysis",
    type: "Soal Latihan",
    status: "draft",
    updatedAt: "2026-10-31",
    category: "Manual Testing",
    article: { ...SAMPLE_ARTICLE, excerpt: "" },
  },
  {
    id: 2,
    title: "Panduan Menulis Bug Report",
    type: "Artikel",
    status: "in-review",
    updatedAt: "2026-10-30",
    category: "Manual Testing",
    article: SAMPLE_ARTICLE,
  },
  {
    id: 3,
    title: "Soal: Validasi Status Code API",
    type: "Soal Latihan",
    status: "needs-revision",
    updatedAt: "2026-10-29",
    category: "API Testing",
    reviewerName: "Rahma Putri",
    article: SAMPLE_ARTICLE,
  },
  {
    id: 4,
    title: "Dasar Assertion di Cypress",
    type: "Materi",
    status: "in-review",
    updatedAt: "2026-10-28",
    category: "Automation Testing",
    article: SAMPLE_ARTICLE,
  },
  {
    id: 5,
    title: "Modul Page Object Model",
    type: "Modul",
    status: "approved",
    updatedAt: "2026-10-27",
    category: "Automation Testing",
    reviewerName: "Bima Santoso",
    article: SAMPLE_ARTICLE,
  },
  {
    id: 6,
    title: "Locator Strategy di Playwright",
    type: "Materi",
    status: "published",
    updatedAt: "2026-10-12",
    category: "Automation Testing",
    reviewerName: "Rahma Putri",
    publicHref: "/blog/locator-playwright-best-practice",
    article: SAMPLE_ARTICLE,
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

// Catatan revisi per konten untuk prototipe Catatan Revisi. Mengikuti konten di atas.
export const DUMMY_REVISION_THREADS: RevisionThread[] = [
  {
    contentId: 3,
    reviewerName: "Rahma Putri",
    date: "2026-10-29",
    notes: [
      {
        id: "revisi-3-umum",
        section: "Catatan Umum",
        message: "Secara keseluruhan sudah baik. Mohon perbaiki bagian berikut dan perbarui referensi videonya.",
      },
      {
        id: "revisi-3-kunci",
        section: "Bagian: Kunci Jawaban",
        message: "Kunci jawaban belum sesuai penjelasan. Jelaskan kapan API mengembalikan 201, bukan 200.",
      },
      {
        id: "revisi-3-video",
        section: "Video Referensi #1",
        message: "Video ini memakai versi tool yang sudah lama. Ganti dengan versi yang lebih baru.",
      },
    ],
  },
  {
    contentId: 5,
    reviewerName: "Bima Santoso",
    date: "2026-10-26",
    notes: [
      {
        id: "revisi-5-umum",
        section: "Catatan Umum",
        message: "Struktur sudah baik. Tambahkan contoh struktur folder project sebelum diterbitkan.",
      },
    ],
  },
];
