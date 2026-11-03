# Konten Blog

Setiap artikel adalah satu file `<slug>.mdx` di folder ini. Menambah artikel tidak perlu mengubah kode aplikasi (PRD FR-07).

## Menambah artikel

1. Buat `content/blog/<slug>.mdx`. Nama file harus sama dengan `slug`.
2. Isi frontmatter di bawah, lalu tulis isinya. Waktu baca dihitung otomatis.
3. Jalankan `npm run check:blog`. Pengecekan ini juga berjalan otomatis sebelum build.
4. Ubah `status` menjadi `published` setelah artikel ditinjau (PRD Bagian 16).

```yaml
---
title: "Judul Artikel"
slug: judul-artikel
excerpt: "Ringkasan satu kalimat."
category: Automation Testing
# author: bawaan "Tim BelajarAutomation"; isi hanya bila berbeda.
publishedAt: "2026-11-01"
# updatedAt: "2026-11-15"
cover: /covers/blog/judul-artikel.webp
status: draft
featured: false
cta:
  - type: course
    slug: playwright
  - type: practice
    slug: playwright-locator
  - type: roadmap
    slug: qa-automation-web
sources:
  - title: "Playwright Docs: Locators"
    url: https://playwright.dev/docs/locators
---
```

Kategori: QA Fundamentals, Manual Testing, Automation Testing, API Testing, Programming, Career, Tools dan teknologi.

- `cta` hanya boleh menuju course `available`, latihan, atau roadmap yang ada. `type: roadmap` tanpa `slug` menuju halaman daftar roadmap.
- Hanya satu artikel yang diberi `featured: true`.
- Data seperti gaji wajib menyebutkan sumber dan tahun. Selama belum ada, tulis `[isi data beserta sumber dan tahun]` dan biarkan berstatus `draft`.

## Sampul

Simpan sampul khusus di `public/covers/blog/`, lalu ubah `cover` pada frontmatter. Artikel rilis awal sementara memakai sampul course atau roadmap terkait.

## Komponen di dalam artikel

Blok kode ditulis dengan tiga backtick dan nama bahasanya, mis. `ts`. Tabel memakai format Markdown. Komponen lainnya:

```mdx
<Tips>Isi tips.</Tips>

<Peringatan>Isi peringatan.</Peringatan>

<Gambar src="/covers/blog/contoh.webp" alt="Deskripsi gambar" keterangan="Keterangan di bawah gambar" />

<Ajakan type="course" slug="playwright" />
```

Karakter `<` dan `{` di teks biasa harus ditulis di dalam backtick agar tidak dibaca sebagai komponen.

Kotak ajakan di akhir artikel dibuat otomatis dari `cta`, jadi `<Ajakan>` hanya untuk ajakan di tengah artikel.
