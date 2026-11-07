# Instruksi Proyek

## Acuan
- Selalu baca `docs/PRD.md` dan `docs/CURRICULUM.md` sebelum mengerjakan fitur. Jika bertentangan dengan prompt, tanyakan dulu.
- Mockup desain bukan requirement (PRD Bagian 13.2). Jika mockup bertentangan dengan PRD, PRD yang berlaku.
- Acuan visual ada di `docs/desain/`, dan PRD tetap yang berlaku.
- Next.js 16: cek `node_modules/next/dist/docs/` bila ragu.

## Alur branch
Mengikuti PRD Bagian 13.3:
- Buat branch dari `develop`.
- Buat pull request hanya ke `develop`.
- Jangan pernah push ke `uat` atau `main`.

## Test
Mengikuti PRD Bagian 13.4; cara menjalankan dan aturan menulis test ada di bagian Testing pada `README.md`.
- Setiap fitur baru atau perubahan perilaku wajib menambah atau memperbarui test end-to-end di `tests/e2e/`.

## Sebelum membuat PR
Mengikuti PRD Bagian 13.4 (tahap development):
- Jalankan `npm run lint`, `npm run build`, dan hanya file test yang berhubungan dengan perubahan, mis. `npx playwright test tests/e2e/specs/profile.spec.ts`. Buat PR hanya jika semuanya lulus.
- Jangan menjalankan full `npm run test:e2e` di lokal saat development. Full e2e dan non-DEV dijalankan otomatis oleh CI GitHub di setiap PR.
- Full `npm run test:e2e` dan `npm run test:e2e:non-dev` di lokal hanya sebelum naik ke UAT dan untuk regresi, atau bila pemilik memintanya.

## Aturan kode
- Data dummy hanya di `data/dummy/`, dengan komentar `DATA DUMMY — hapus sebelum rilis`.
- Label antarmuka dalam Bahasa Indonesia.
