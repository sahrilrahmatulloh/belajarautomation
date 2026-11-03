# Panduan Kontribusi Konten

Panduan ini untuk Creator, Reviewer, dan Admin yang mengelola artikel blog. Selama backend belum tersedia, konten dikelola di repository ini lewat file MDX dan pull request (PRD FR-15).

Tahap saat ini baru **artikel blog**. Isi lesson dan soal latihan menyusul sesuai FR-15.

Sebelum mulai menulis, pastikan sudah ada kesepakatan tertulis mengenai hak penggunaan konten oleh platform dan pencantuman nama penulis (FR-15).

## Alur kerja

| Tahap | Yang dilakukan di GitHub | Oleh |
|---|---|---|
| Draf | Buat branch dari `develop`, lalu tulis file MDX | Creator |
| Menunggu Review | Buat pull request ke `develop` memakai template konten | Creator |
| Perlu Revisi | Reviewer meminta perubahan, Creator memperbaiki di branch yang sama | Reviewer, Creator |
| Disetujui | Reviewer menyetujui dan CI lulus | Reviewer |
| Terbit | Ubah `status` menjadi `published`, lalu merge | Admin |

Aturan peran:

- Creator tidak dapat menerbitkan sendiri, tidak dapat me-review kontennya sendiri, dan tidak melakukan merge sendiri.
- Reviewer tidak me-review konten yang ditulisnya sendiri.
- Mengubah artikel yang sudah terbit dilakukan lewat pull request baru. Versi yang terbit tetap tayang sampai revisinya disetujui dan diterbitkan.

## Membuat artikel

```bash
git switch develop
git pull
git switch -c konten/judul-artikel
```

1. Buat file `content/blog/<slug>.mdx`. Nama file harus sama dengan `slug`.
2. Isi frontmatter dan tulis isinya.
3. Jalankan `npm run check:blog` dan `npm run dev`, lalu periksa artikel di `/blog/<slug>`.
4. Buat pull request ke `develop`. Pilih template konten dengan menambahkan `?template=konten.md` pada alamat pembuatan pull request.

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
| `author` | Tidak | Nama penulis. Jika dikosongkan, memakai "Tim BelajarAutomation" |
| `publishedAt` | Ya | Tanggal terbit, format `YYYY-MM-DD` |
| `updatedAt` | Tidak | Tanggal diperbarui, format `YYYY-MM-DD` |
| `cover` | Ya | Sampul di `public/`, simpan sampul khusus di `public/covers/blog/` |
| `status` | Ya | `draft`, atau `published` yang hanya diubah oleh Admin |
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

## Aturan penulisan

- **Bahasa Indonesia** yang jelas dan mudah dipahami pemula. Istilah teknis yang umum boleh tetap dalam bahasa Inggris.
- **Contoh kode wajib diuji** dan dapat dijalankan (PRD Bagian 16).
- **Data wajib bersumber.** Gaji, statistik, dan angka lain wajib mencantumkan sumber dan tahun data. Selama belum ada, tulis `[isi data beserta sumber dan tahun]` dan biarkan artikel berstatus `draft`.
- **Klaim harus realistis.** Jangan menjanjikan hasil karier yang tidak dapat dijamin.
- **Ajakan hanya menuju konten yang tersedia,** bukan course berstatus Segera hadir.
- **Boleh dibantu AI,** tetapi materi teknis wajib diperiksa sebelum diterbitkan.

## Checklist review

Sesuai PRD Bagian 16. Checklist ini juga ada di template pull request konten.

- [ ] Materi akurat dan sesuai praktik terkini.
- [ ] Bahasa jelas dan mudah dipahami pemula.
- [ ] Contoh kode sudah diuji dan dapat dijalankan.
- [ ] Data seperti gaji mencantumkan sumber dan tahun, dan tidak ada lagi placeholder.
- [ ] Klaim realistis dan tidak menjanjikan hasil karier.
- [ ] Sumber dicantumkan untuk artikel yang memakai data atau rujukan.
- [ ] Ajakan menuju course, latihan, atau roadmap yang sesuai dengan isi artikel.
- [ ] Tidak ada konten yang melanggar hak cipta.
- [ ] Tampilan sudah diperiksa di mode terang dan gelap, serta di layar mobile.
- [ ] Penulis bukan orang yang sama dengan Reviewer.
