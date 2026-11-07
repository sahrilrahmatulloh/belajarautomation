This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Lingkungan dan Alur Rilis

Mengacu pada `docs/PRD.md` Bagian 13.3.

| Lingkungan | Branch | `NEXT_PUBLIC_APP_ENV` | Fungsi |
|---|---|---|---|
| DEV | `develop` | `dev` | Tempat menggabungkan hasil pengembangan; boleh berisi data dummy dan alat bantu pengembangan |
| UAT | `uat` | `uat` | Pengujian penerimaan oleh pemilik produk (PRD Bagian 11) |
| Production | `main` | `production` | Website untuk pengguna; **belum dipakai** sampai backend, autentikasi, dan pembayaran siap serta data dummy dihapus |

Aturan alur:

- Branch fitur dibuat dari `develop`, dan pull request hanya ditujukan ke `develop`.
- Perubahan naik berurutan: `develop` → `uat` → `main`. Tidak boleh melompati tahap.
- Tidak ada perbaikan langsung di `uat` maupun `main`; semua perbaikan dimulai dari `develop`.
- Hanya pemilik produk yang menaikkan perubahan ke `uat` dan `main`.
- Selama domain belum tersedia, setiap lingkungan memakai alamat bawaan Vercel.

Pengaturan lingkungan:

- Salin `.env.example` menjadi `.env.local`. Jika `NEXT_PUBLIC_APP_ENV` kosong, aplikasi memakai `dev`.
- Fitur bantu pengembangan (mis. badge "Draf" pada course) hanya aktif di `dev`; cek lewat `isDev` dari `lib/env.ts`, bukan `NODE_ENV`.
- Label lingkungan tampil di pojok kiri bawah: "DEV" (oranye) dan "UAT" (ungu). Tidak tampil di `production`.
- `NEXT_PUBLIC_SITE_URL` berisi alamat situs untuk Open Graph dan sitemap. Isi di Production saat domain sudah pasti; jika kosong, memakai alamat dari Vercel.
- Di Vercel, isi `NEXT_PUBLIC_APP_ENV` per lingkungan (mis. per branch `develop` dan `uat`). Nilainya disisipkan saat build, jadi perubahan baru berlaku setelah deploy ulang.

## Database (Supabase)

Rancangan dan tahapan ada di [`docs/DATABASE.md`](docs/DATABASE.md).

| Lingkungan | Project Supabase |
|---|---|
| DEV | `belajarautomation-dev` |
| UAT | `belajarautomation-uat` |
| Production | Dibuat menjelang rilis |

Struktur kode:

- `lib/supabase/client.ts`: klien untuk komponen klien.
- `lib/supabase/server.ts`: klien untuk Server Component, Server Action, dan Route Handler (`server-only`).
- `proxy.ts`: menyegarkan sesi. Tamu tanpa cookie sesi tidak memicu panggilan ke Supabase.
- `supabase/migrations/`: seluruh perubahan skema. Tabel tidak dibuat atau diubah lewat dashboard.

Mengisi `.env.local`:

- Isi `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` (publishable key) dari project DEV.
- Tanpa kedua variabel itu, aplikasi tetap berjalan dengan data dummy.

Menjalankan migrasi (oleh pemilik akses Supabase):

```bash
npx supabase login          # sekali, token tersimpan di komputer sendiri
npm run db:link             # pilih project yang dituju (DEV atau UAT)
npm run db:push:dry         # melihat migrasi yang akan diterapkan, tanpa menerapkan
npm run db:push             # menerapkan migrasi ke project yang di-link
npm run db:types            # memperbarui types/supabase.ts dari skema
```

Aturan:

- Kunci rahasia (secret key atau service_role) tidak pernah ditulis di repository, `.env.example`, atau variabel berawalan `NEXT_PUBLIC_`.
- Migrasi yang sudah diterapkan tidak diubah. Perubahan berikutnya ditulis sebagai file migrasi baru.
- Migrasi diterapkan ke DEV lebih dulu, lalu UAT, lalu Production.

## Blog

Artikel disimpan sebagai file MDX di `content/blog/`, dan menambah artikel tidak perlu mengubah kode aplikasi. Panduannya ada di [`docs/CONTENT_GUIDE.md`](docs/CONTENT_GUIDE.md).

## Testing

Test end-to-end memakai [Playwright](https://playwright.dev) dan berjalan di dua project: `desktop-chromium` dan `mobile-chromium` (Pixel 7). CI GitHub Actions menjalankan lint, build, dan test ini pada setiap pull request dan push ke `develop`.

Menjalankan di lokal:

```bash
npx playwright install chromium   # sekali saja, setelah npm install
npm run test:e2e                  # semua test
npm run test:e2e:non-dev          # perilaku di luar DEV, dengan build UAT sendiri
npm run test:e2e:ui               # mode UI untuk men-debug test
npm run test:e2e:report           # membuka laporan HTML test terakhir
```

- `npm run test:e2e` menjalankan `npm run build && npm run start` di port 3000, kecuali sudah ada server di port itu.
- Bila server dev sedang berjalan, test akan memakai server dev tersebut. Untuk menguji hasil build, pakai port lain: `PORT=3100 npm run test:e2e` (Git Bash) atau `$env:PORT=3100; npm run test:e2e` (PowerShell).
- Test label "DEV" mengharapkan `NEXT_PUBLIC_APP_ENV` bernilai `dev`.
- Perilaku yang berbeda di luar DEV, mis. akun demo dan artikel draf, ditulis di `tests/e2e/non-dev/`.
- Build test diarahkan ke Supabase tiruan (`https://supabase-uji.invalid`), bukan project dari `.env.local`. Test yang memakai Supabase memanggil `mockSupabase(page)` dari `fixtures/supabaseMock.ts`, jadi tidak ada data atau email sungguhan yang tersentuh. Build non-DEV dijalankan tanpa Supabase agar akun demo tetap dapat dipakai.
- Bila test memakai server dev yang sudah berjalan, server itu membaca `.env.local` dan memakai Supabase DEV sungguhan. Untuk hasil yang konsisten, jalankan test di port lain.

Struktur folder:

```text
tests/e2e/
├── fixtures/   # auth.ts (login per role), testData.ts (data test), mainPages.ts (halaman utama), supabaseMock.ts (Supabase tiruan)
├── pages/      # Page Object, satu kelas per halaman
└── specs/      # skenario test per fitur
```

Aturan menulis test:

- Pakai `test` dan `expect` dari `fixtures/auth.ts`. Test yang butuh login memakai `test.use({ role: "user" })`; role lainnya `creator`, `reviewer`, dan `admin`.
- Locator mengutamakan `getByRole`, `getByLabel`, dan `getByText`. `data-testid` hanya bila elemen tidak bisa dijangkau dengan cara lain.
- Tidak memakai `waitForTimeout`; gunakan assertion `expect` yang menunggu otomatis.
- Data test, termasuk kunci jawaban challenge, ditulis di `fixtures/testData.ts`. Jangan mengimpor file `server-only`.
- Nama test dalam Bahasa Indonesia.

Laporan CI tersedia sebagai artifact `playwright-report` selama 14 hari di halaman run GitHub Actions. Setelah diunduh dan diekstrak, buka dengan `npx playwright show-report <folder>`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
