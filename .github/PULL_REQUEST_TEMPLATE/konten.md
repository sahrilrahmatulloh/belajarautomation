## Konten

Dipakai Admin saat menerbitkan artikel yang sudah disetujui di Google Docs.

- **Judul:**
- **Kategori:**
- **Jenis perubahan:** artikel baru / revisi artikel terbit
- **Dokumen Google Docs:**
- **Creator:**
- **Reviewer:**

Panduan: [docs/CONTENT_GUIDE.md](https://github.com/sahrilrahmatulloh/belajarautomation/blob/develop/docs/CONTENT_GUIDE.md)

## Checklist Admin

- [ ] Reviewer sudah menyatakan setuju di dokumen.
- [ ] Sudah ada kesepakatan tertulis dengan Creator.
- [ ] `author` berisi nama Creator.
- [ ] Hasil konversi sama dengan dokumen yang disetujui.
- [ ] `npm run check:blog` lulus.
- [ ] Artikel sudah diperiksa di `npm run dev`, di mode terang dan gelap, serta di layar mobile.
- [ ] Gambar sudah dioptimalkan dan punya teks alternatif.
- [ ] Data seperti gaji mencantumkan sumber dan tahun, dan tidak ada lagi placeholder.

## Checklist video

Lewati bila artikel tidak memakai video.

- [ ] Maksimal 3 video.
- [ ] Reviewer sudah memeriksa: relevan, tidak bertentangan dengan isi, versi tool masih sesuai, dan pantas.
- [ ] Hanya embed resmi atau tautan, tanpa mengunggah ulang video orang lain.
- [ ] Judul asli dan nama channel tercantum.
- [ ] Artikel tetap bisa dipahami tanpa video.

## Saat menerbitkan

- [ ] CI lulus.
- [ ] `status` diubah menjadi `published`, dan `publishedAt` berisi tanggal terbit.
