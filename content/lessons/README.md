# Konten Lesson

Setiap lesson adalah satu file `content/lessons/<slug-course>/<slug-lesson>.mdx`. Judul, modul, urutan, dan durasi tetap di `data/courseDetails.ts`; file ini hanya berisi isinya. Lesson tanpa file tampil sebagai "Materi sedang ditulis".

Panduan lengkap untuk Admin ada di [docs/CONTENT_GUIDE.md](../../docs/CONTENT_GUIDE.md).

```yaml
---
status: draft # draft atau published. Draf hanya tampil di DEV.
author: "Nama Creator" # Opsional; bawaannya "Tim BelajarAutomation".
sources: # Opsional.
  - title: "Judul sumber"
    url: https://contoh.com
---
```

Komponen yang tersedia sama dengan artikel blog: `Tips`, `Peringatan`, `Gambar`, `Ajakan`, dan `VideoYouTube` (maksimal 3 per lesson, dan lesson wajib lengkap tanpa video).

Jalankan `npm run check:lessons` sebelum membuat pull request. Pengecekan ini juga berjalan otomatis sebelum build.
