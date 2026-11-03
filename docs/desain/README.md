# Mockup yang Disetujui

**Mockup adalah acuan visual. Jika berbeda dengan docs/PRD.md, PRD yang berlaku.**

Aturan penyimpanan ada di PRD Bagian 13.2: hanya mockup yang sudah disetujui yang disimpan di sini, dalam format WebP terkompresi dengan nama file per fitur. Jika desain berubah, mockup lama diganti atau dihapus.

Menambah mockup: simpan PNG di folder ini dengan nama fiturnya, lalu jalankan `npm run optimize:images -- mockups`. File PNG diubah menjadi WebP dan yang aslinya dihapus.

| Nama file | Fitur | Bagian PRD terkait | Tanggal disetujui | Perbedaan yang diketahui terhadap PRD |
|---|---|---|---|---|
| `creator-mode.webp` | Mode Creator: Konten Saya, Buat Artikel, Catatan Revisi, Sisipkan Video YouTube, Upload Gambar | FR-15, FR-02 bagian G | perlu diisi pemilik | Lihat di bawah |

## Perbedaan `creator-mode.webp`

- Mockup Creator dibangun **setelah backend tersedia**. Belum diimplementasikan sekarang.
- Header aplikasi yang sudah ada tetap dipakai, termasuk ikon pengatur tema terang/gelap yang tidak tampil di mockup.
- "Sudah diperbaiki" adalah tanda dari Creator. Catatan baru selesai setelah Reviewer mengonfirmasi.
- Badge status memakai satu komponen yang sama di semua halaman, dengan kontras minimal 4,5:1.
- Ikon kecil di samping nama channel pada kartu video mirip badge verified, yang ditolak PRD. Tampilkan nama channel saja, sesuai FR-02 bagian G.
- Mockup hanya memuat kartu video di dalam editor. Tampilan kartu setelah diputar dan kartu video yang tidak bisa di-embed mengikuti FR-02 bagian G.
