// DATA DUMMY — hapus sebelum rilis (PRD FR-15).
// Konten, catatan, dan riwayat status untuk tahap antarmuka dengan data dummy. Waktu dihitung
// dari saat ini agar lama menunggu review tetap masuk akal.
import {
  AdminAuditLog,
  ContentItem,
  ContentKind,
  ContentNode,
  ContentStatusId,
  ContentUser,
  ContentVideo,
  CreatorAgreement,
  ReviewNote,
  RoleChangeEvent,
  StatusAction,
  StatusEvent,
} from "@/types/ContentWorkflow";

import { VIDEO_NODE } from "@/lib/content/document";
import { CreditClaim, Entitlement, Product, Transaction } from "@/types/Commerce";

import { DUMMY_COMMERCE } from "./commerce";
import { DUMMY_USERS } from "./users";

export interface DummyContentState {
  users: ContentUser[];
  contents: ContentItem[];
  notes: ReviewNote[];
  statusEvents: StatusEvent[];
  roleEvents: RoleChangeEvent[];
  agreements: CreatorAgreement[];
  auditLog: AdminAuditLog[];
  transactions: Transaction[];
  entitlements: Entitlement[];
  claims: CreditClaim[];
  products: Product[];
  // Konten terbit yang sudah digantikan revisinya.
  supersededIds: string[];
  nextId: number;
}

const daysAgo = (days: number) => new Date(Date.now() - days * 86_400_000).toISOString();

const text = (value: string): ContentNode => ({ type: "text", text: value });
const heading = (level: 2 | 3, value: string): ContentNode => ({ type: "heading", attrs: { level }, content: [text(value)] });
const paragraph = (value: string): ContentNode => ({ type: "paragraph", content: [text(value)] });
const code = (value: string): ContentNode => ({ type: "codeBlock", attrs: { language: "ts" }, content: [text(value)] });
const callout = (type: "tips" | "peringatan", value: string): ContentNode => ({ type, content: [paragraph(value)] });

const articleBody = (topic: string, videos: ContentVideo[]): ContentNode => ({
  type: "doc",
  content: [
    heading(2, "Pendahuluan"),
    paragraph(`Bagian ini memperkenalkan ${topic} dan menjelaskan mengapa topik ini penting bagi QA.`),
    heading(2, "Pembahasan"),
    paragraph(`Contoh penerapan ${topic} dalam pekerjaan sehari-hari.`),
    code('await page.getByRole("button", { name: "Masuk" }).click();'),
    callout("tips", "Mulai dari contoh kecil, lalu kembangkan sesuai kebutuhan."),
    ...videos.map((video): ContentNode => ({ type: VIDEO_NODE, attrs: { ...video } })),
    heading(2, "Kesimpulan"),
    paragraph(`Ringkasan hal terpenting tentang ${topic}.`),
  ],
});

const VIDEO_PLAYWRIGHT: ContentVideo = {
  id: "dummyVideo1",
  judul: "Mengenal Locator di Playwright",
  channel: "Channel Contoh",
  durasi: "12:34",
  bahasa: "Inggris",
  embed: true,
  alasan: "Menjelaskan dasar penggunaan locator secara visual.",
};

interface ContentSeed {
  id: string;
  judul: string;
  ringkasan?: string;
  kategori: string;
  authorId: string;
  reviewerId?: string;
  status: ContentStatusId;
  submissionCount?: number;
  videos?: ContentVideo[];
  publicPath?: string;
  sampul?: string;
  // Hari sejak kiriman terakhir.
  submittedDaysAgo?: number;
  updatedDaysAgo: number;
  type?: ContentKind;
}

const SEEDS: ContentSeed[] = [
  { id: "konten-locator", judul: "Best Practice Locator di Playwright", kategori: "Automation Testing", authorId: "user-andi", reviewerId: "user-rahma", status: "terbit", submissionCount: 1, publicPath: "/blog/locator-playwright-best-practice", submittedDaysAgo: 20, updatedDaysAgo: 15 },
  { id: "konten-selenium", judul: "Playwright vs Selenium di 2026", kategori: "Automation Testing", authorId: "user-galih", reviewerId: "user-bima", status: "terbit", submissionCount: 1, publicPath: "/blog/playwright-vs-selenium", submittedDaysAgo: 25, updatedDaysAgo: 18 },
  { id: "konten-login", judul: "Contoh Test Case Login yang Lengkap", kategori: "Manual Testing", authorId: "user-andi", reviewerId: "user-rahma", status: "disetujui", submissionCount: 1, submittedDaysAgo: 4, updatedDaysAgo: 1 },
  { id: "konten-bug-report", judul: "Cara Menulis Bug Report", kategori: "Manual Testing", authorId: "user-andi", reviewerId: "user-rahma", status: "perlu-revisi", submissionCount: 1, videos: [VIDEO_PLAYWRIGHT], submittedDaysAgo: 3, updatedDaysAgo: 1 },
  { id: "konten-severity", judul: "Severity vs Priority", kategori: "QA Fundamentals", authorId: "user-andi", reviewerId: "user-bima", status: "perlu-revisi", submissionCount: 2, submittedDaysAgo: 2, updatedDaysAgo: 1 },
  { id: "konten-pemula", judul: "Mengenal Playwright untuk Pemula", kategori: "Automation Testing", authorId: "user-andi", reviewerId: "user-rahma", status: "menunggu-review", submissionCount: 2, videos: [VIDEO_PLAYWRIGHT], submittedDaysAgo: 1, updatedDaysAgo: 1 },
  { id: "konten-api", judul: "Pengenalan API Testing dengan Postman", kategori: "API Testing", authorId: "user-galih", status: "menunggu-review", submissionCount: 1, submittedDaysAgo: 5, updatedDaysAgo: 5 },
  { id: "konten-regression", judul: "Strategi Regression Testing", kategori: "QA Fundamentals", authorId: "user-bima", status: "menunggu-review", submissionCount: 1, submittedDaysAgo: 1, updatedDaysAgo: 1 },
  { id: "konten-manual", judul: "Manual Testing vs Automation Testing", kategori: "QA Fundamentals", authorId: "user-galih", reviewerId: "user-rahma", status: "menunggu-review", submissionCount: 1, submittedDaysAgo: 4, updatedDaysAgo: 4 },
  { id: "konten-qa", judul: "Apa Itu Quality Assurance?", kategori: "QA Fundamentals", authorId: "user-andi", status: "draf", updatedDaysAgo: 2 },
  { id: "konten-chatgpt", judul: "Memakai ChatGPT untuk Membuat Test Case", ringkasan: "", kategori: "Tools dan teknologi", authorId: "user-andi", status: "draf", sampul: "", updatedDaysAgo: 3 },
  { id: "konten-portfolio", judul: "Cara Membangun Portfolio QA Automation", kategori: "Career", authorId: "user-galih", status: "draf", updatedDaysAgo: 6 },
];

function toContent(seed: ContentSeed): ContentItem {
  const updatedAt = daysAgo(seed.updatedDaysAgo);
  return {
    id: seed.id,
    type: seed.type ?? "artikel",
    judul: seed.judul,
    ringkasan: seed.ringkasan ?? `Ringkasan singkat tentang ${seed.judul.toLowerCase()}.`,
    kategori: seed.kategori,
    sampul: seed.sampul ?? "/covers/courses/playwright.webp",
    ajakan: { type: "course", slug: "playwright" },
    sumber: [{ title: "Playwright Docs", url: "https://playwright.dev/docs/intro" }],
    body: articleBody(seed.judul, seed.videos ?? []),
    videos: seed.videos ?? [],
    authorId: seed.authorId,
    reviewerId: seed.reviewerId ?? null,
    status: seed.status,
    submissionCount: seed.submissionCount ?? 0,
    revisionOf: null,
    publicPath: seed.publicPath ?? null,
    submittedAt: seed.submittedDaysAgo === undefined ? null : daysAgo(seed.submittedDaysAgo),
    createdAt: daysAgo(seed.updatedDaysAgo + 10),
    updatedAt,
  };
}

const NOTE_DEFAULTS = { released: true, creatorReply: "", markedFixed: false, resolved: false };

const NOTES: ReviewNote[] = [
  { ...NOTE_DEFAULTS, id: "catatan-bug-umum", contentId: "konten-bug-report", kind: "umum", anchor: null, isi: "Secara keseluruhan sudah baik. Mohon perbaiki bagian berikut dan perbarui referensi videonya.", reviewerId: "user-rahma", round: 1, createdAt: daysAgo(1) },
  { ...NOTE_DEFAULTS, id: "catatan-bug-bagian", contentId: "konten-bug-report", kind: "bagian", anchor: "pembahasan", isi: "Tambahkan contoh bug report yang lengkap dengan langkah reproduksi.", reviewerId: "user-rahma", round: 1, createdAt: daysAgo(1) },
  { ...NOTE_DEFAULTS, id: "catatan-bug-video", contentId: "konten-bug-report", kind: "video", anchor: "dummyVideo1", isi: "Video ini memakai versi tool yang sudah lama. Ganti dengan versi yang lebih baru.", reviewerId: "user-rahma", round: 1, createdAt: daysAgo(1) },
  { ...NOTE_DEFAULTS, id: "catatan-severity-1", contentId: "konten-severity", kind: "umum", anchor: null, isi: "Bedakan severity dan priority dengan contoh yang lebih jelas.", reviewerId: "user-bima", round: 1, creatorReply: "Sudah saya tambahkan contohnya.", markedFixed: true, createdAt: daysAgo(4) },
  { ...NOTE_DEFAULTS, id: "catatan-severity-2", contentId: "konten-severity", kind: "bagian", anchor: "kesimpulan", isi: "Kesimpulan masih terlalu panjang. Ringkas menjadi satu paragraf.", reviewerId: "user-bima", round: 2, createdAt: daysAgo(1) },
  { ...NOTE_DEFAULTS, id: "catatan-pemula-1", contentId: "konten-pemula", kind: "bagian", anchor: "pendahuluan", isi: "Jelaskan dulu apa itu Playwright sebelum masuk ke instalasi.", reviewerId: "user-rahma", round: 1, creatorReply: "Sudah saya tambahkan penjelasannya.", markedFixed: true, createdAt: daysAgo(3) },
  { ...NOTE_DEFAULTS, id: "catatan-login-1", contentId: "konten-login", kind: "umum", anchor: null, isi: "Tambahkan skenario untuk akun yang terkunci.", reviewerId: "user-rahma", round: 1, creatorReply: "", markedFixed: true, resolved: true, createdAt: daysAgo(3) },
];

function event(id: string, contentId: string, action: StatusAction, from: ContentStatusId | null, to: ContentStatusId, actorId: string, days: number, targetUserId: string | null = null): StatusEvent {
  return { id, contentId, action, from, to, actorId, targetUserId, alasan: null, at: daysAgo(days) };
}

const EVENTS: StatusEvent[] = [
  event("event-1", "konten-locator", "kirim", "draf", "menunggu-review", "user-andi", 20),
  event("event-2", "konten-locator", "ambil", "menunggu-review", "menunggu-review", "user-rahma", 19, "user-rahma"),
  event("event-3", "konten-locator", "setujui", "menunggu-review", "disetujui", "user-rahma", 17),
  event("event-4", "konten-locator", "terbitkan", "disetujui", "terbit", "user-admin", 15),
  event("event-5", "konten-selenium", "kirim", "draf", "menunggu-review", "user-galih", 25),
  event("event-6", "konten-selenium", "ambil", "menunggu-review", "menunggu-review", "user-bima", 24, "user-bima"),
  event("event-7", "konten-selenium", "setujui", "menunggu-review", "disetujui", "user-bima", 20),
  event("event-8", "konten-selenium", "terbitkan", "disetujui", "terbit", "user-admin", 18),
  event("event-9", "konten-login", "kirim", "draf", "menunggu-review", "user-andi", 4),
  event("event-10", "konten-login", "tugaskan", "menunggu-review", "menunggu-review", "user-admin", 3, "user-rahma"),
  event("event-11", "konten-login", "setujui", "menunggu-review", "disetujui", "user-rahma", 1),
  event("event-12", "konten-bug-report", "kirim", "draf", "menunggu-review", "user-andi", 3),
  event("event-13", "konten-bug-report", "ambil", "menunggu-review", "menunggu-review", "user-rahma", 2, "user-rahma"),
  event("event-14", "konten-bug-report", "minta-revisi", "menunggu-review", "perlu-revisi", "user-rahma", 1),
  event("event-15", "konten-severity", "kirim", "draf", "menunggu-review", "user-andi", 6),
  event("event-16", "konten-severity", "ambil", "menunggu-review", "menunggu-review", "user-bima", 5, "user-bima"),
  event("event-17", "konten-severity", "minta-revisi", "menunggu-review", "perlu-revisi", "user-bima", 4),
  event("event-18", "konten-severity", "kirim-ulang", "perlu-revisi", "menunggu-review", "user-andi", 2),
  event("event-19", "konten-severity", "minta-revisi", "menunggu-review", "perlu-revisi", "user-bima", 1),
  event("event-20", "konten-pemula", "kirim", "draf", "menunggu-review", "user-andi", 5),
  event("event-21", "konten-pemula", "tugaskan", "menunggu-review", "menunggu-review", "user-admin", 4, "user-rahma"),
  event("event-22", "konten-pemula", "minta-revisi", "menunggu-review", "perlu-revisi", "user-rahma", 3),
  event("event-23", "konten-pemula", "kirim-ulang", "perlu-revisi", "menunggu-review", "user-andi", 1),
  event("event-24", "konten-api", "kirim", "draf", "menunggu-review", "user-galih", 5),
  event("event-25", "konten-regression", "kirim", "draf", "menunggu-review", "user-bima", 1),
  event("event-26", "konten-manual", "kirim", "draf", "menunggu-review", "user-galih", 4),
  event("event-27", "konten-manual", "tugaskan", "menunggu-review", "menunggu-review", "user-admin", 3, "user-rahma"),
];

// Andi sengaja belum punya kesepakatan, agar kunci Terbitkan bisa dicoba (PRD FR-16 B).
const AGREEMENTS: CreatorAgreement[] = [
  { id: "kesepakatan-galih", userId: "user-galih", tanggal: "2026-10-01", dokumen: "Dokumen kesepakatan contoh Galih", recordedBy: "user-admin", recordedAt: daysAgo(30) },
  { id: "kesepakatan-bima", userId: "user-bima", tanggal: "2026-10-05", dokumen: "Dokumen kesepakatan contoh Bima", recordedBy: "user-admin", recordedAt: daysAgo(28) },
];

// Selalu salinan baru, agar perubahan di state tidak mengubah data awal.
export function createDummyContentState(): DummyContentState {
  return structuredClone({
    users: DUMMY_USERS,
    contents: SEEDS.map(toContent),
    notes: NOTES,
    statusEvents: EVENTS,
    roleEvents: [],
    agreements: AGREEMENTS,
    auditLog: [],
    ...DUMMY_COMMERCE,
    supersededIds: [],
    nextId: 1000,
  });
}
