# Panduan Admin: Menerbitkan Artikel

Creator menulis di Google Docs memakai template artikel resmi, dan tidak memerlukan akun GitHub (PRD FR-15). Dokumen ini adalah panduan **Admin** untuk mengubah dokumen yang sudah **Disetujui** menjadi artikel di website.

Panduan untuk Creator ada di halaman informasi Mode Creator di aplikasi.

Dokumen ini mencakup **artikel blog**, [lesson](#mengubah-dokumen-menjadi-lesson), dan [kuis](#mengubah-dokumen-menjadi-kuis). Alur dan checklistnya sama. Isi template untuk Google Docs ada di [docs/templates/](templates/).

## Sebelum mulai

- [ ] Reviewer sudah menyatakan setuju di dokumen.
- [ ] Sudah ada kesepakatan tertulis dengan Creator mengenai hak penggunaan konten dan pencantuman nama penulis. Ini wajib sebelum artikel pertamanya terbit (FR-15).

## Alur

| Tahap | Di mana | Oleh |
|---|---|---|
| Draf | Google Docs, memakai template | Creator |
| Menunggu Review | Dokumen dibagikan ke Reviewer dengan akses "Pemberi komentar" | Creator |
| Perlu Revisi | Komentar di dokumen, ditandai selesai oleh Creator setelah diperbaiki | Reviewer, Creator |
| Disetujui | Reviewer menyatakan setuju di dokumen | Reviewer |
| Terbit | Konversi ke MDX, pull request ke `develop`, lalu merge | Admin |

Mengubah artikel yang sudah terbit kembali melewati alur yang sama. Versi yang terbit tetap tayang sampai revisinya disetujui dan diterbitkan.

## Mengubah dokumen menjadi artikel

```bash
git switch develop
git pull
git switch -c konten/judul-artikel
```

1. **Buat file** `content/blog/<slug>.mdx`. Nama file harus sama dengan `slug`.
2. **Salin metadata** dari bagian Info Artikel ke frontmatter. `author` diisi nama Creator.
3. **Salin isi** ke MDX: heading, kode, Tips, Peringatan, dan tabel. Lihat [Komponen di dalam artikel](#komponen-di-dalam-artikel).
4. **Unduh gambar** dari dokumen, simpan PNG-nya di `public/covers/blog/`, lalu optimalkan dengan `npm run optimize:images`. Pakai teks alternatif dan keterangan dari dokumen.
5. **Pasang referensi video** bila ada di bagian Referensi Video. Lihat bagian Video di panduan ini.
6. **Periksa** dengan `npm run check:blog` dan `npm run dev`, lalu buka `/blog/<slug>`.
7. **Buat pull request** ke `develop` memakai template konten, dengan menambahkan `?template=konten.md` pada alamat pembuatan pull request.
8. Setelah CI lulus, ubah `status` menjadi `published` dan isi `publishedAt` dengan tanggal terbit, lalu merge.

## Format frontmatter

```yaml
---
title: "Judul Artikel"
slug: judul-artikel
excerpt: "Ringkasan satu kalimat."
category: Automation Testing
author: "Nama Creator"
publishedAt: "2026-11-01"
updatedAt: "2026-11-15"
cover: /covers/blog/judul-artikel.webp
status: draft
featured: false
cta:
  - type: course
    slug: playwright
  - type: practice
    slug: playwright-locator
sources:
  - title: "Playwright Docs: Locators"
    url: https://playwright.dev/docs/locators
---
```

| Kolom | Wajib | Keterangan |
|---|---|---|
| `title` | Ya | Judul artikel |
| `slug` | Ya | Sama dengan nama file, huruf kecil dan tanda hubung |
| `excerpt` | Ya | Ringkasan satu kalimat, dipakai di kartu dan pratinjau tautan |
| `category` | Ya | QA Fundamentals, Manual Testing, Automation Testing, API Testing, Programming, Career, atau Tools dan teknologi |
| `author` | Tidak | Nama Creator. Jika dikosongkan, memakai "Tim BelajarAutomation", yang hanya untuk tulisan pemilik produk atau tulisan bersama |
| `publishedAt` | Ya | Tanggal terbit, format `YYYY-MM-DD` |
| `updatedAt` | Tidak | Tanggal diperbarui, format `YYYY-MM-DD` |
| `cover` | Ya | Sampul di `public/`, simpan sampul khusus di `public/covers/blog/` |
| `status` | Ya | `draft` atau `published` |
| `featured` | Ya | `true` hanya untuk satu artikel unggulan |
| `cta` | Ya | Minimal satu tujuan: `course` yang tersedia, `practice`, atau `roadmap`. `roadmap` tanpa `slug` menuju halaman daftar roadmap |
| `sources` | Tidak | Daftar sumber `{ title, url }` |

`npm run check:blog` memeriksa semua ini, dan juga berjalan otomatis sebelum build. Build gagal jika ada yang tidak valid.

Waktu baca dihitung otomatis dari isi artikel.

## Komponen di dalam artikel

Heading memakai `##` dan `###`. Daftar isi dibuat otomatis dari heading `##`.

````mdx
```ts
await page.getByRole("button", { name: "Masuk" }).click();
```

<Tips>Isi tips.</Tips>

<Peringatan>Isi peringatan.</Peringatan>

<Gambar src="/covers/blog/contoh.webp" alt="Deskripsi gambar" keterangan="Keterangan di bawah gambar" />

<Ajakan type="course" slug="playwright" />
````

- Karakter `<` dan `{` di teks biasa harus ditulis di dalam backtick.
- Kotak ajakan di akhir artikel dibuat otomatis dari `cta`, jadi `<Ajakan>` hanya untuk ajakan di tengah artikel.
- Tabel memakai format Markdown.

## Pemeriksaan sebelum terbit

Sesuai PRD Bagian 16. Checklist ini juga ada di template pull request konten.

- [ ] Hasil konversi sama dengan dokumen yang disetujui.
- [ ] Contoh kode dapat dijalankan.
- [ ] Data seperti gaji mencantumkan sumber dan tahun, dan tidak ada lagi placeholder.
- [ ] Ajakan menuju course, latihan, atau roadmap yang sesuai dengan isi artikel.
- [ ] Gambar sudah dioptimalkan dan punya teks alternatif.
- [ ] Tampilan sudah diperiksa di mode terang dan gelap, serta di layar mobile.
- [ ] Penulis bukan orang yang sama dengan Reviewer.

## Video

Artikel boleh menyertakan referensi video YouTube sebagai pelengkap (PRD FR-02 bagian G, FR-07).

```mdx
<VideoYouTube id="ID_VIDEO" judul="Judul asli video" channel="Nama channel" durasi="12:34" bahasa="Inggris" />
```

| Prop | Wajib | Keterangan |
|---|---|---|
| `id` | Ya | ID video, 11 karakter. Mis. dari `youtube.com/watch?v=ID_VIDEO` |
| `judul` | Ya | Judul asli video |
| `channel` | Ya | Nama channel, sebagai kredit |
| `durasi` | Ya | Format `m:ss` atau `h:mm:ss` |
| `bahasa` | Tidak | Bawaannya `Indonesia`. Bahasa lain tampil sebagai label |
| `embed` | Tidak | Tulis `embed={false}` bila pemilik video menonaktifkan embed; video tampil sebagai tautan "Tonton di YouTube" |

Aturan:

- Maksimal 3 video per artikel. `npm run check:blog` menggagalkan build bila dilanggar, atau bila `id`, `judul`, `channel`, atau `durasi` tidak valid.
- Judul asli dan nama channel wajib dicantumkan sebagai kredit.
- Hanya embed resmi atau tautan. Video orang lain tidak boleh diunduh lalu diunggah ulang.
- Artikel wajib tetap bisa dipahami tanpa video.
- Video berbahasa Indonesia diutamakan.

Menjalankan `npm run check:youtube` memeriksa semua video di `content/blog`: yang dihapus atau dijadikan privat, serta yang embed-nya dimatikan. Pemeriksaan ini butuh jaringan, jadi tidak ikut build. Workflow `Cek Video YouTube` menjalankannya seminggu sekali, dan bisa juga dijalankan manual dari tab Actions.

## Mengubah dokumen menjadi lesson

Judul, modul, urutan, dan durasi lesson ada di `data/courseDetails.ts`. Lesson baru atau perubahan judul perlu diubah di sana, dan slug yang sudah terbit jangan diubah.

1. **Buat file** `content/lessons/<slug-course>/<slug-lesson>.mdx`. Slug harus cocok dengan `data/courseDetails.ts`, dan alamat lesson di aplikasi menunjukkan slug-nya.
2. **Isi frontmatter:** `status: draft`, `author` berisi nama Creator, dan `sources` bila ada. Formatnya ada di [content/lessons/README.md](../content/lessons/README.md).
3. **Salin isi** ke MDX. Komponennya sama dengan artikel: heading, kode, `Tips`, `Peringatan`, `Gambar`, tabel, dan `VideoYouTube`. Judul lesson tidak perlu ditulis lagi, karena sudah tampil di halaman.
4. **Periksa** dengan `npm run check:lessons` dan `npm run dev`, lalu buka `/learn/<slug-course>/<slug-lesson>`.
5. **Buat pull request** ke `develop` memakai template konten.
6. Setelah CI lulus, ubah `status` menjadi `published`, lalu merge.

Setelah seluruh lesson satu course terbit dan ditinjau, ubah `contentStatus` course itu menjadi `ready` di `data/courses.ts`. `npm run check:lessons` menggagalkan build bila course `ready` masih punya lesson yang belum terbit. Sebelum rilis, course `available` yang belum `ready` diubah menjadi `coming-soon` (PRD FR-02).

## Mengubah dokumen menjadi kuis

Kuis berisi kunci jawaban, jadi hanya disimpan di kode server.

- [ ] Reviewer sudah memverifikasi seluruh kunci jawaban.

1. **Tambah data kuis** di `data/challengeDetails.ts` dengan `type: "quiz"` dan `passingScore: 70`. Setiap soal berisi `question`, `options`, `correctIndex` (A = 0, B = 1, dan seterusnya), dan `explanation`.
2. **Tambah kartu kuis** di `data/challenges.ts`, dengan `slug` yang sama.
3. **Periksa** dengan `npm run check:challenges` dan `npm run dev`, lalu kerjakan kuisnya di `/playground/<slug>`.
4. **Buat pull request** ke `develop` memakai template konten, lalu merge setelah CI lulus.
