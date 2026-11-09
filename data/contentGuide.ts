// Panduan Admin untuk mengubah dokumen yang disetujui menjadi artikel (PRD FR-15).
export const CONTENT_GUIDE_URL =
  "https://github.com/sahrilrahmatulloh/belajarautomation/blob/develop/docs/CONTENT_GUIDE.md";

// Link template artikel di Google Docs. Pemilik produk akan mengisinya; selama kosong,
// tombol template di halaman Creator nonaktif.
export const ARTICLE_TEMPLATE_URL: string = "";

// Link template lesson dan kuis di Google Docs (isi template: docs/templates/).
export const LESSON_TEMPLATE_URL: string = "";
export const QUIZ_TEMPLATE_URL: string = "";

// Panduan menulis lesson dan kuis untuk Creator, tanpa istilah Git (PRD FR-02, FR-04, dan FR-15).
export const LESSON_WRITING_TIPS = [
  "Tulis satu dokumen untuk setiap lesson, sesuai judul dan modul di daftar course.",
  "Teks adalah isi utama. Lesson harus bisa dipahami lengkap tanpa video.",
  "Video YouTube bersifat opsional, maksimal 3 per lesson, dan cantumkan judul serta nama channel.",
  "Kirim ke Reviewer lewat alur yang sama dengan artikel.",
];

export const QUIZ_WRITING_TIPS = [
  "Satu kuis mencakup satu course dan tampil di Playground.",
  "Buat 5–10 soal pilihan ganda dengan satu jawaban benar dan penjelasannya. Peserta lulus bila skornya minimal 70%.",
  "Dokumen kuis memuat kunci jawaban, jadi bagikan hanya ke Reviewer dan Admin.",
  "Reviewer wajib memverifikasi seluruh kunci jawaban sebelum kuis terbit.",
];

// Alur konten sebelum backend tersedia, dari sisi Creator (PRD FR-15).
export const GOOGLE_DOCS_FLOW = [
  { stage: "Draf", action: "Menulis di Google Docs dengan template artikel resmi" },
  { stage: "Menunggu Review", action: 'Bagikan dokumen ke Reviewer dengan akses "Pemberi komentar"' },
  { stage: "Perlu Revisi", action: "Reviewer memberi komentar, Creator memperbaiki lalu menandai komentar selesai" },
  { stage: "Disetujui", action: "Reviewer menyatakan setuju di dokumen" },
  { stage: "Terbit", action: "Admin menerbitkan artikel di website" },
];

// Bahasa sederhana untuk Creator, tanpa istilah Git (PRD FR-15).
export const WRITING_STEPS = [
  "Salin template (File → Buat salinan), lalu beri judul dokumen sesuai judul artikel.",
  "Isi bagian Info Artikel: judul, ringkasan, kategori, sampul, ajakan, dan sumber.",
  "Tulis isi memakai gaya heading di Google Docs. Kode ditulis di kotak kode sesuai contoh di template.",
  "Gambar: tempel langsung di dokumen, beri keterangan, dan tulis teks alternatif (deskripsi singkat isi gambar).",
  "Video YouTube (opsional, maksimal 3): tulis link, nama channel, posisi, dan alasan memilihnya di bagian Referensi Video. Artikel harus tetap bisa dipahami tanpa video. Jangan mengunduh lalu mengunggah ulang video orang lain.",
  "Cek checklist: contoh kode sudah diuji, data punya sumber, bahasa sudah diperiksa, dan konten bisa dipahami tanpa video.",
  'Bagikan dokumen ke Reviewer dengan akses "Pemberi komentar".',
];

// Tugas Reviewer dan Admin sebelum backend tersedia (PRD FR-15).
export const ROLE_GUIDES = {
  reviewer: {
    flowTitle: "Sementara, review dilakukan di Google Docs",
    intro: "Antrean di aplikasi tersedia setelah backend siap. Untuk saat ini, review berlangsung di dokumen yang dibagikan Creator kepadamu:",
    flow: [
      { stage: "Menunggu Review", action: 'Buka dokumen yang dibagikan Creator dengan akses "Pemberi komentar"' },
      { stage: "Perlu Revisi", action: "Beri komentar di dokumen. Creator memperbaiki lalu menandai komentarnya selesai" },
      { stage: "Disetujui", action: "Nyatakan setuju di dokumen, lalu Admin menerbitkannya" },
    ],
    checklistTitle: "Yang perlu diperiksa",
    checklist: [
      "Materi akurat, jelas, dan mudah dipahami pemula.",
      "Contoh kode sudah diuji dan dapat dijalankan.",
      "Data seperti gaji mencantumkan sumber dan tahun.",
      "Referensi video relevan dengan isinya.",
      "Referensi video tidak bertentangan dengan isi konten.",
      "Versi tool pada referensi video masih sesuai.",
      "Referensi video pantas ditampilkan.",
      "Konten tetap bisa dipahami tanpa video.",
    ],
  },
  admin: {
    flowTitle: "Sementara, Admin menerbitkan lewat pull request",
    intro: "Fitur di aplikasi tersedia setelah backend siap. Untuk saat ini, Creator dan Reviewer bekerja di Google Docs, lalu Admin menerbitkan dokumen yang sudah disetujui:",
    flow: [
      { stage: "Konversi", action: "Ubah dokumen yang sudah Disetujui menjadi artikel MDX, termasuk gambar dan referensi video" },
      { stage: "Pull request", action: "Buat pull request ke develop memakai template konten, lalu tunggu CI lulus" },
      { stage: "Terbit", action: "Ubah status artikel menjadi published, lalu lakukan merge" },
    ],
    checklistTitle: "Sebelum menerbitkan",
    checklist: [
      "Reviewer sudah menyatakan setuju di dokumen.",
      "Sudah ada kesepakatan tertulis dengan Creator untuk artikel pertamanya.",
      "Nama penulis di artikel adalah nama Creator.",
    ],
  },
};
