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

export const USER_RANK = "Apprentice";

export const ACTIVE_AVATAR_NAME = "Kucing Oren";
export const ACTIVE_THEME_NAME = "Mountain Workspace";

export const OWN_USERNAME = "sobatqa";
export const PUBLIC_USER = { username: "rina-kartika-1", displayName: "Rina Kartika" };
export const PRIVATE_USERNAME = "intan-saputra-9";

export const AVAILABLE_COURSE_SLUGS = [
  "qa-fundamentals",
  "dasar-web-api",
  "test-design",
  "bug-reporting",
  "git-github",
  "javascript",
  "typescript",
  "playwright",
];

// Kunci jawaban untuk test, ditulis terpisah dari data/challengeDetails.ts.
// Latihan di sini belum lulus di riwayat akun demo, kecuali quiz.alreadyPassed.
export const CHALLENGE_KEYS = {
  quiz: {
    slug: "kuis-dasar-web-api",
    title: "Kuis Dasar Web & API",
    courseSlug: "dasar-web-api",
    answers: [1, 2, 0, 3, 1, 2, 0, 3],
    firstQuestion: "Pada arsitektur client-server, apa peran client?",
    firstCorrectOption: "Mengirim request dan menampilkan response dari server",
    firstExplanation: "Client, misalnya browser, mengirim request ke server",
    alreadyPassed: {
      slug: "kuis-qa-fundamental",
      answers: [1, 0, 2, 3, 1, 0, 2, 3, 1, 0],
    },
  },
  bugHunt: {
    slug: "bug-hunt-form-login",
    bugs: ["Tombol Masuk tetap aktif walau email kosong", "Pesan error password mengandung salah ketik"],
    bugExplanation: "Form seharusnya menolak pengiriman selama email kosong",
    decoy: "Kolom email tidak memiliki label",
    decoyExplanation: "Kolom email memiliki label yang terhubung dengan benar",
  },
  testCase: {
    slug: "login-test-case",
    sampleAnswerStart: "Judul: Login berhasil dengan email dan password yang benar",
    required: [
      "Judul test case menjelaskan skenario yang diuji",
      "Prasyarat menyebutkan akun yang sudah terdaftar",
      "Langkah ditulis berurutan dan dapat diikuti orang lain",
      "Skenario positif mengharapkan pengguna masuk ke dashboard",
    ],
    optional: ["Ada skenario negatif, misalnya password salah", "Ada skenario kolom email atau password kosong"],
  },
  locator: {
    slug: "locator-form-registrasi",
    target: "Kotak centang persetujuan syarat dan ketentuan.",
    css: 'input[name="syarat"]',
    xpath: '//input[@name="syarat"]',
    wrongSelector: "#registrasi-email",
    buttonCount: 2,
  },
  // visible: teks yang harus ada, agar HTML yang diperiksa memang memuat isi latihan.
  secretChecks: [
    {
      slug: "kuis-dasar-web-api",
      visible: "Pada arsitektur client-server, apa peran client?",
      secrets: ["Client, misalnya browser, mengirim request"],
    },
    {
      slug: "bug-hunt-form-login",
      visible: "Tombol Masuk tetap aktif walau email kosong",
      secrets: ["Form seharusnya menolak pengiriman", "Bukan bug."],
    },
    {
      slug: "login-test-case",
      visible: "Pengguna masuk memakai email dan password.",
      secrets: ["Login gagal dengan password yang salah", "Prasyarat menyebutkan akun"],
    },
    {
      slug: "playwright-locator",
      visible: "untuk mengirim form login",
      secrets: [],
    },
  ],
} as const;

// Notifikasi akun demo pada jam tetap: 16 November 2026 pukul 12.00 WIB (data/dummy/notifications.ts).
export const NOTIFICATIONS = {
  now: "2026-11-16T05:00:00Z",
  timezone: "Asia/Jakarta",
  preferencesKey: "belajarautomation-notification-preferences",
  unreadLabel: "9+",
  unreadWithoutContent: 5,
  entryCount: 11,
  transactionCount: 3,
  newestTitle: "Latihan baru tersedia",
  unavailableTitle: "Materi baru tersedia",
  announcement: { title: "Jadwal maintenance", bodyPart: "Progres belajarmu tetap aman" },
  merged: {
    title: "3 course baru tersedia",
    body: "Tersedia Playwright, Git & GitHub untuk QA, dan TypeScript untuk Tester.",
    item: "Git & GitHub untuk QA",
    href: "/learn/git-github",
  },
  targets: [
    { title: "Latihan baru tersedia", href: "/playground/kuis-playwright" },
    { title: "Pembayaran tertunda", href: "/membership" },
    { title: "Membership aktif", href: "/membership" },
    { title: "Lulus latihan", href: "/playground/playwright-locator" },
    { title: "Naik rank", href: "/profile" },
    { title: "Achievement diperoleh", href: "/profile?tab=pencapaian" },
    { title: "Selamat datang", href: "/learn" },
  ],
  times: [
    { title: "Latihan baru tersedia", time: "5 menit lalu" },
    { title: "Membership aktif", time: "2 jam lalu" },
    { title: "Lulus latihan", time: "16 jam lalu" },
    { title: "3 course baru tersedia", time: "Kemarin, 10.15" },
    { title: "Materi baru tersedia", time: "13 Nov, 14.22" },
    { title: "Selamat datang", time: "19 Okt, 19.00" },
  ],
  dayHeadings: ["Hari ini", "Kemarin", /13 November 2026/, /10 November 2026/, /9 November 2026/, /19 Oktober 2026/],
  roles: [
    { role: "creator", title: "Cara Menulis Bug Report", href: "/creator/revisi/konten-bug-report", count: 7 },
    { role: "reviewer", title: "Manual Testing vs Automation Testing", href: "/reviewer/review/konten-manual", count: 4 },
    { role: "admin", title: "Konten siap diterbitkan", href: "/admin/konten?status=disetujui", count: 1 },
  ],
} as const;

// Artikel di content/blog. Saat lingkungan DEV semua artikel tampil, termasuk draf.
export const BLOG = {
  articleCount: 10,
  featuredTitle: "Roadmap Jadi QA Automation Engineer dari Nol (2026)",
  newestCardTitle: "Apa Itu QA Engineer? Tugas, Skill, dan Gaji di Indonesia",
  oldestTitle: "Manual Testing vs Automation Testing: Kapan Pakai yang Mana?",
  outlineSlug: "severity-vs-priority",
  search: { keyword: "bug report", title: "Cara Menulis Bug Report yang Disukai Developer" },
  category: { name: "Manual Testing", slug: "manual-testing", count: 2 },
  visibleCategories: ["Semua", "QA Fundamentals", "Manual Testing", "Automation Testing", "Career", "Tools dan teknologi"],
  emptyCategories: ["API Testing", "Programming"],
  article: {
    slug: "locator-playwright-best-practice",
    title: "Best Practice Locator di Playwright",
    excerpt: "Panduan memilih locator Playwright agar test stabil, mudah dibaca, dan tidak mudah gagal saat tampilan berubah.",
    category: "Automation Testing",
    categorySlug: "automation-testing",
    date: "28 Okt 2026",
    cover: "/covers/courses/playwright.webp",
    bodyText: "Mengapa Locator Penting?",
    headings: [
      "Pendahuluan",
      "Mengapa Locator Penting?",
      "Jenis-Jenis Locator",
      "Best Practice Locator",
      "Contoh Implementasi",
      "Kesalahan Umum",
      "Kesimpulan",
    ],
    tocTarget: { title: "Kesalahan Umum", id: "kesalahan-umum" },
    firstCode: 'await page.getByLabel("Email").fill("qa@contoh.com");\nawait page.getByRole("button", { name: "Masuk" }).click();',
    courseHref: "/learn/playwright",
    practiceHref: "/playground/playwright-locator",
    sourceCount: 2,
    relatedFirst: "Playwright vs Selenium di 2026: Pilih yang Mana?",
  },
} as const;

// Konten dummy akun Creator (data/dummy/contents.ts).
export const CREATOR_DASHBOARD = {
  statLabels: ["Draf", "Menunggu Review", "Perlu Revisi", "Disetujui", "Terbit"],
  needsRevisionTitle: "Cara Menulis Bug Report",
  draftTitle: "Apa Itu Quality Assurance?",
  openRevisionCount: 2,
} as const;

// Pengalih mode dan tampilan per mode (PRD FR-15).
export const ROLE_MODE = {
  modes: [
    { role: "creator", modeLabel: "Mode Creator" },
    { role: "reviewer", modeLabel: "Mode Reviewer" },
    { role: "admin", modeLabel: "Mode Admin" },
  ],
  learnerPaths: ["/cart", "/membership", "/leaderboard", "/learn", "/playground", "/roadmap"],
  promptTitle: "Halaman ini untuk Mode Belajar",
  creatorStatLabels: ["Draf", "Menunggu Review", "Perlu Revisi", "Disetujui", "Terbit"],
  publishedTitle: "Best Practice Locator di Playwright",
  reviewerStats: [
    { label: "Direview", value: "18" },
    { label: "Disetujui", value: "14" },
    { label: "Diminta Revisi", value: "4" },
  ],
  adminTasks: ["Menerbitkan konten yang sudah disetujui", "Mengelola peran pengguna"],
  publicUsername: "sobatqa",
  notifications: {
    revision: { title: "Konten perlu revisi", href: "/creator/revisi/konten-bug-report", contentTitle: "Cara Menulis Bug Report" },
    approved: { title: "Konten disetujui", href: "/creator/konten/konten-login", contentTitle: "Contoh Test Case Login yang Lengkap" },
  },
  multiRoleEmail: "bima@demo.belajarautomation.com",
  googleDocsStages: ["Draf", "Menunggu Review", "Perlu Revisi", "Disetujui", "Terbit"],
  writingStepCount: 7,
  templateDisabledLabel: "Template sedang disiapkan. Hubungi Admin.",
  creatorPages: [
    { menu: "Konten Saya", path: "/creator/konten", title: "Konten Saya" },
    { menu: "Buat Konten", path: "/creator/buat", title: "Buat Konten" },
    { menu: "Catatan Revisi", path: "/creator/revisi", title: "Catatan Revisi" },
  ],
  guidePages: [
    { role: "reviewer", menuName: "Menu Reviewer", menu: "Antrean Review", path: "/reviewer/antrean", heading: "Sementara, review dilakukan di Google Docs" },
    { role: "reviewer", menuName: "Menu Reviewer", menu: "Riwayat Review", path: "/reviewer/riwayat", heading: "Sementara, review dilakukan di Google Docs" },
    { role: "reviewer", menuName: "Menu Reviewer", menu: "Panduan Review", path: "/reviewer/panduan", heading: "Sementara, review dilakukan di Google Docs" },
    { role: "admin", menuName: "Menu Admin", menu: "Pengguna & Role", path: "/admin/pengguna", heading: "Sementara, Admin menerbitkan lewat pull request" },
    { role: "admin", menuName: "Menu Admin", menu: "Konten", path: "/admin/konten", heading: "Sementara, Admin menerbitkan lewat pull request" },
    { role: "admin", menuName: "Menu Admin", menu: "Paket Membership", path: "/admin/paket", heading: "Sementara, Admin menerbitkan lewat pull request" },
    { role: "admin", menuName: "Menu Admin", menu: "Avatar & Tema", path: "/admin/avatar-tema", heading: "Sementara, Admin menerbitkan lewat pull request" },
    { role: "admin", menuName: "Menu Admin", menu: "Transaksi", path: "/admin/transaksi", heading: "Sementara, Admin menerbitkan lewat pull request" },
    { role: "admin", menuName: "Menu Admin", menu: "Pengaturan", path: "/admin/pengaturan", heading: "Sementara, Admin menerbitkan lewat pull request" },
  ],
} as const;

// Data dummy pada halaman pratinjau video (data/dummy/videoReferensi.ts).
export const VIDEO_REFERENSI = {
  embedded: { id: "dummyVideo1", judul: "Video Contoh Berbahasa Indonesia", channel: "Channel Contoh", durasi: "12:34" },
  english: { id: "dummyVideo2", judul: "Video Contoh Berbahasa Inggris" },
  linkOnly: { id: "dummyVideo3", judul: "Video Contoh Tanpa Embed", channel: "Channel Tanpa Embed" },
} as const;
// Warna tombol utama berteks putih (PRD 15.2).
export const COLORS = {
  primaryButton: "rgb(37, 99, 235)",
  white: "rgb(255, 255, 255)",
};

// Halaman yang diperiksa axe di luar MAIN_PAGES.
export const GUEST_PAGES = [
  { name: "Login", path: "/login" },
  { name: "Daftar", path: "/register" },
  { name: "Blog tamu", path: "/blog" },
  { name: "Artikel tamu", path: "/blog/locator-playwright-best-practice" },
  { name: "Artikel tidak ditemukan", path: "/blog/tidak-ada" },
];

export const LEARNER_PAGES = [
  { name: "Detail Course", path: "/learn/playwright" },
  { name: "Detail Roadmap", path: "/roadmap/qa-automation-web" },
  { name: "Membership", path: "/membership" },
  { name: "Keranjang", path: "/cart" },
  { name: "Pembayaran", path: "/checkout" },
  { name: "Profil kustomisasi", path: "/profile?tab=kustomisasi" },
];

// Ruang kerja Creator (data/dummy/contents.ts, akun creator@).
export const CREATOR_STUDIO = {
  contentCount: 7,
  pageSize: 5,
  columns: ["Judul", "Jenis", "Kategori", "Status", "Terakhir diubah", "Reviewer", "Aksi"],
  draftTitle: "Apa Itu Quality Assurance?",
  reviewTitle: "Mengenal Playwright untuk Pemula",
  revisionTitle: "Cara Menulis Bug Report",
  revisionId: "konten-bug-report",
  noteCount: 3,
  noteAnchorLabel: "Bagian: Pembahasan",
  noteAnchorHeading: "Pembahasan",
  approvedTitle: "Contoh Test Case Login yang Lengkap",
  publishedTitle: "Best Practice Locator di Playwright",
  actionsByStatus: [
    { title: "Apa Itu Quality Assurance?", actions: ["Edit", "Kirim untuk Review", "Hapus"] },
    { title: "Mengenal Playwright untuk Pemula", actions: ["Lihat", "Tarik kembali"] },
    { title: "Cara Menulis Bug Report", actions: ["Lihat catatan", "Edit"] },
    { title: "Contoh Test Case Login yang Lengkap", actions: ["Lihat"] },
    { title: "Best Practice Locator di Playwright", actions: ["Lihat di website", "Buat revisi"] },
  ],
  newArticle: { title: "Artikel Uji Ruang Kerja", excerpt: "Ringkasan uji.", category: "Career" },
  // Gambar PNG 1x1 yang valid.
  pngBase64: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
  videoIds: ["abcdefghij1", "abcdefghij2", "abcdefghij3"],
  axePaths: ["/creator/konten", "/creator/buat", "/creator/buat/artikel", "/creator/buat/artikel?konten=konten-qa", "/creator/revisi", "/creator/revisi/konten-bug-report", "/creator/konten/konten-pemula"],
} as const;
