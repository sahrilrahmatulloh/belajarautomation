# Instruksi Proyek

## Acuan
- Selalu baca `docs/PRD.md` dan `docs/CURRICULUM.md` sebelum mengerjakan fitur. Jika bertentangan dengan prompt, tanyakan dulu.
- Mockup desain bukan requirement (PRD Bagian 13.2). Jika mockup bertentangan dengan PRD, PRD yang berlaku.
- Next.js 16: cek `node_modules/next/dist/docs/` bila ragu.

## Alur branch
Mengikuti PRD Bagian 13.3:
- Buat branch dari `develop`.
- Buat pull request hanya ke `develop`.
- Jangan pernah push ke `uat` atau `main`.

## Sebelum membuat PR
Selalu jalankan `npm run lint` dan `npm run build`.

## Aturan kode
- Data dummy hanya di `data/dummy/`, dengan komentar `DATA DUMMY — hapus sebelum rilis`.
- Label antarmuka dalam Bahasa Indonesia.
