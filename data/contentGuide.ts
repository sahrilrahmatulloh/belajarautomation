// Panduan Admin untuk mengubah dokumen yang disetujui menjadi artikel (PRD FR-15).
export const CONTENT_GUIDE_URL =
  "https://github.com/sahrilrahmatulloh/belajarautomation/blob/develop/docs/CONTENT_GUIDE.md";

// Link template artikel di Google Docs. Pemilik produk akan mengisinya; selama kosong,
// tombol template di halaman Creator nonaktif.
export const ARTICLE_TEMPLATE_URL: string = "";

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
