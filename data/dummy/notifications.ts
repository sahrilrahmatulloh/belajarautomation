// DATA DUMMY — hapus sebelum rilis (PRD 4.4).
// Waktu dihitung dari saat ini agar notifikasi selalu tampak baru, sama seperti
// riwayat aktivitas (data/dummy/activity.ts). Progres mengikuti riwayat itu.
import { Notification } from "@/types/Notification";

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();

// Jam tertentu pada N hari lalu, menurut zona waktu browser.
const daysAgoAt = (days: number, time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
};

export const DUMMY_NOTIFICATIONS: Notification[] = [
  {
    id: "latihan-kuis-playwright",
    group: "content",
    title: "Latihan baru tersedia",
    body: "Kuis Playwright sekarang bisa dicoba di Playground.",
    href: "/playground/kuis-playwright",
    createdAt: minutesAgo(5),
    read: false,
  },
  {
    id: "pembayaran-tertunda",
    group: "transaction",
    title: "Pembayaran tertunda",
    body: "Pembayaran eBook Playwright from Zero to Hero menunggu konfirmasi.",
    href: "/membership",
    createdAt: minutesAgo(45),
    read: false,
  },
  {
    id: "membership-aktif",
    group: "transaction",
    title: "Membership aktif",
    body: "Membership Premium aktif. Kamu dapat mengakses materi premium yang termasuk dalam paketmu.",
    href: "/membership",
    createdAt: minutesAgo(120),
    read: false,
  },
  {
    id: "pembayaran-berhasil",
    group: "transaction",
    title: "Pembayaran berhasil",
    body: "Pembayaran Membership Premium sudah kami terima.",
    href: "/membership",
    createdAt: minutesAgo(122),
    read: false,
  },
  {
    id: "maintenance",
    group: "system",
    title: "Jadwal maintenance",
    body: "Website tidak dapat diakses pada Minggu pukul 01.00–03.00 WIB karena pemeliharaan server. Progres belajarmu tetap aman, jadi kamu bisa melanjutkan setelah pemeliharaan selesai.",
    createdAt: minutesAgo(180),
    read: false,
  },
  {
    id: "lulus-playwright-locator",
    group: "progress",
    title: "Lulus latihan",
    body: "Kamu lulus Playwright Locator untuk pertama kalinya.",
    href: "/playground/playwright-locator",
    createdAt: daysAgoAt(1, "19:50"),
    read: false,
  },
  {
    id: "course-playwright",
    group: "content",
    title: "Course baru tersedia",
    body: "Playwright",
    href: "/learn/playwright",
    createdAt: daysAgoAt(1, "10:15"),
    read: false,
  },
  {
    id: "course-git-github",
    group: "content",
    title: "Course baru tersedia",
    body: "Git & GitHub untuk QA",
    href: "/learn/git-github",
    createdAt: daysAgoAt(1, "10:10"),
    read: false,
  },
  {
    id: "course-typescript",
    group: "content",
    title: "Course baru tersedia",
    body: "TypeScript untuk Tester",
    href: "/learn/typescript",
    createdAt: daysAgoAt(1, "10:05"),
    read: false,
  },
  {
    id: "konten-dihapus",
    group: "content",
    title: "Materi baru tersedia",
    body: "Course Selenium Lanjutan sudah bisa dipelajari.",
    href: "/learn/selenium-lanjutan",
    createdAt: daysAgoAt(3, "14:22"),
    read: false,
  },
  {
    id: "naik-rank-apprentice",
    group: "progress",
    title: "Naik rank",
    body: "Selamat, kamu naik ke rank Apprentice.",
    href: "/profile",
    createdAt: daysAgoAt(6, "09:06"),
    read: true,
  },
  {
    id: "achievement-quiz-master",
    group: "progress",
    title: "Achievement diperoleh",
    body: "Kamu mendapat achievement Quiz Master. Lihat di tab Pencapaian.",
    href: "/profile?tab=pencapaian",
    createdAt: daysAgoAt(7, "20:26"),
    read: true,
  },
  {
    id: "selamat-datang",
    group: "system",
    title: "Selamat datang",
    body: "Selamat datang di belajarautomation.com. Mulai perjalanan QA Automation kamu dari menu Belajar.",
    href: "/learn",
    createdAt: daysAgoAt(28, "19:00"),
    read: true,
  },
  {
    id: "creator-perlu-revisi",
    group: "role",
    role: "creator",
    title: "Konten perlu revisi",
    body: "Reviewer memberi catatan pada Soal: Validasi Status Code API.",
    href: "/creator?konten=3",
    createdAt: minutesAgo(30),
    read: false,
  },
  {
    id: "creator-disetujui",
    group: "role",
    role: "creator",
    title: "Konten disetujui",
    body: "Modul Page Object Model sudah disetujui dan menunggu diterbitkan Admin.",
    href: "/creator?konten=5",
    createdAt: minutesAgo(90),
    read: false,
  },
  {
    id: "reviewer-antrean",
    group: "role",
    role: "reviewer",
    title: "Konten baru di antrean",
    body: "Ada lesson baru pada course Dasar Web & API untuk QA yang menunggu review.",
    href: "/reviewer",
    createdAt: minutesAgo(30),
    read: false,
  },
  {
    id: "admin-transaksi-tertunda",
    group: "role",
    role: "admin",
    title: "Transaksi tertunda",
    body: "Ada transaksi yang menunggu pemeriksaan.",
    href: "/admin",
    createdAt: minutesAgo(30),
    read: false,
  },
];
