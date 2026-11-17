# Panduan: Deploy ke DEV dan Database Alur Konten

**Status:** Bagian A sudah dijalankan pemilik (17 November 2026): `develop` di Vercel memakai Supabase DEV. Lima keputusan di B2 disetujui pemilik; Bagian B belum dibangun.
**Acuan:** PRD FR-15, FR-16, Bagian 6.3 dan 13.3; `docs/DATABASE.md` Fase 6.
Jika panduan ini bertentangan dengan PRD, PRD yang berlaku.

Panduan ini punya dua bagian:

- **Bagian A:** menjalankan website DEV (branch `develop` di Vercel) dengan database Supabase DEV. Dikerjakan pemilik di dashboard; tidak perlu mengubah kode.
- **Bagian B:** membangun database untuk alur Admin → Creator → Reviewer → Admin → terbit ke pengguna. Dikerjakan bertahap lewat beberapa PR.

Tanda di setiap langkah:

- 👤 dikerjakan pemilik (dashboard Vercel, Supabase, atau terminal).
- 🤖 dikerjakan Claude Code (kode, migrasi, test).

---

## Bagian A — Menjalankan website DEV dengan Supabase DEV

Sekarang `develop` di Vercel berjalan dengan data dummy karena variabel Supabase belum diisi. Setelah langkah ini, website DEV memakai database DEV yang sama dengan localhost.

### A1. 👤 Pastikan migrasi sudah masuk ke Supabase DEV

Repository sudah tertaut ke project `belajarautomation-dev` (`supabase/.temp`, tidak ikut di-commit).

```powershell
# Melihat migrasi mana yang sudah dan belum masuk ke database DEV
npx supabase migration list --remote

# Pratinjau tanpa mengubah apa pun
npm run db:push:dry

# Menjalankan migrasi yang belum masuk
npm run db:push
```

- Tanpa `--remote`, CLI mencoba database lokal (Docker) dan gagal dengan `ECONNREFUSED 127.0.0.1:54322`.
- Kolom **Local** dan **Remote** di `migration list` harus sama untuk setiap baris.
- Bila diminta password database: Supabase → Project Settings → Database → Database password (bisa di-reset di sana).
- Jangan membuat atau mengubah tabel lewat Table Editor dashboard. Semua perubahan skema lewat folder `supabase/migrations/`.

### A2. 👤 Ambil tiga nilai dari Supabase DEV

Di dashboard Supabase, project **belajarautomation-dev**:

| Nilai | Letaknya | Rahasia? |
|---|---|---|
| Project URL | Project Settings → Data API → Project URL (tanpa `/rest/v1/`) | Tidak |
| Publishable key (`sb_publishable_...`) | Project Settings → API Keys | Tidak |
| Secret key (`sb_secret_...`) | Project Settings → API Keys → Secret keys | **Ya** |

Nilai ini sama dengan yang ada di `.env.local` kamu. Jangan menempelkan secret key ke chat, issue, atau file yang di-commit.

### A3. 👤 Isi Environment Variables di Vercel khusus branch `develop`

1. Buka vercel.com → project **belajarautomation**.
2. Pilih tab **Settings** di bagian atas, lalu **Environment Variables** di menu kiri.
3. Untuk setiap variabel di tabel berikut, klik **Add New**:
   - **Environments:** centang **Preview** saja.
   - Pada pilihan **Branch** (muncul setelah Preview dicentang), isi `develop`. Dengan begitu nilai ini hanya dipakai branch `develop`, bukan branch fitur lain atau `uat`.

| Key | Value | Catatan |
|---|---|---|
| `NEXT_PUBLIC_APP_ENV` | `dev` | |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL dari A2 | |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Publishable key dari A2 | |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret key dari A2 | Aktifkan **Sensitive**. Jangan pernah diberi awalan `NEXT_PUBLIC_` |

`NEXT_PUBLIC_SITE_URL` dibiarkan kosong di DEV.

### A4. 👤 Daftarkan alamat DEV di Supabase Auth

Supabase → **Authentication** → **URL Configuration**:

- **Site URL:** biarkan `http://localhost:3000` untuk DEV.
- **Redirect URLs**, tambahkan:
  - `http://localhost:3000/**`
  - `https://belajarautomation-git-develop-sahrilrahmatulloh.vercel.app/**`

Tanpa langkah ini, link verifikasi email, reset password, dan login Google akan kembali ke localhost atau ditolak.

Login Google tidak perlu diubah di Google Cloud. Alamat redirect yang terdaftar di Google tetap alamat callback Supabase (`https://<ref>.supabase.co/auth/v1/callback`).

### A5. 👤 Deploy ulang `develop`

Variabel `NEXT_PUBLIC_*` disisipkan saat build, jadi deployment lama tidak ikut berubah.

1. Vercel → tab **Deployments** → filter branch `develop` → deployment teratas.
2. Klik **⋯** → **Redeploy**. Matikan **Use existing Build Cache** → **Redeploy**.

Setelah ini, setiap merge ke `develop` otomatis ter-deploy dengan nilai yang sama.

### A6. 👤 Cek hasilnya

Buka `https://belajarautomation-git-develop-sahrilrahmatulloh.vercel.app`:

- [ ] Label **DEV** tampil di pojok kiri bawah.
- [ ] Login dengan akun sungguhan berhasil, dan XP serta profil sama dengan di localhost.
- [ ] Akun Admin sungguhan diminta kode authenticator, lalu Panel Admin menampilkan data database (bukan data dummy).
- [ ] Daftar akun baru → email verifikasi masuk → link verifikasi membuka alamat DEV, bukan localhost.
- [ ] Akun demo (`admin@demo...`) tetap bisa dipakai di DEV untuk mencoba antarmuka dengan data dummy.

Jika login gagal, cek berurutan: (1) nilai variabel di A3 tidak berspasi dan tanpa tanda kutip, (2) deploy ulang sudah tanpa build cache, (3) Redirect URLs di A4.

---

## Bagian B — Database untuk alur konten sampai terbit

### B1. Gambaran alur

```
Admin                Creator                Reviewer                Admin              Pengguna
─────                ───────                ────────                ─────              ────────
beri peran Creator
dan Reviewer,
catat kesepakatan
Creator
        ───────►  tulis Draf
                  Kirim untuk Review
                        │
                  (Menunggu Review) ──►  Ambil, atau ditugaskan Admin
                                          beri catatan
                        ┌──────────────── Minta Revisi
                        ▼
                  (Perlu Revisi)
                  perbaiki, tandai catatan
                  Kirim ulang ──────────►  Setujui
                                               │
                                          (Disetujui) ──────►  Terbitkan
                                                                  │
                                                             (Terbit) ──────►  Blog publik
                                                             Tarik dari website ◄─┘
```

Satu arah: setiap langkah hanya bisa dilakukan peran yang berhak, dari status yang benar. Aturan ini ditegakkan di database, bukan hanya di tampilan (PRD FR-15).

| Dari | Aksi | Ke | Pelaku | Syarat |
|---|---|---|---|---|
| — | Buat | Draf | Creator | |
| Draf | Kirim untuk Review | Menunggu Review | Creator pemilik | Kolom wajib terisi, seluruh checklist dicentang |
| Draf | Hapus | — | Creator pemilik | Hanya draf |
| Menunggu Review | Tarik kembali | Draf | Creator pemilik | Belum ada keputusan Reviewer |
| Menunggu Review | Ambil | Menunggu Review | Reviewer | Belum ditugaskan, bukan tulisannya sendiri |
| Menunggu Review | Tugaskan | Menunggu Review | Admin | Reviewer bukan penulisnya |
| Menunggu Review | Minta Revisi | Perlu Revisi | Reviewer yang ditugaskan | Minimal satu catatan baru |
| Menunggu Review | Setujui | Disetujui | Reviewer yang ditugaskan | Seluruh checklist Reviewer dicentang |
| Perlu Revisi | Kirim ulang | Menunggu Review | Creator pemilik | Semua catatan ditandai "Sudah diperbaiki" |
| Disetujui | Terbitkan | Terbit | Admin | Creator punya kesepakatan tercatat |
| Terbit | Tarik dari website | Disetujui | Admin | Alasan wajib |
| Terbit | Buat revisi | (salinan baru) Draf | Creator pemilik | Versi terbit tetap tayang sampai revisinya diterbitkan |

### B2. Keputusan pemilik

Kelima rekomendasi berikut disetujui pemilik pada 17 November 2026.

| # | Keputusan | Rekomendasi |
|---|---|---|
| 1 | Jenis konten tahap pertama | **Artikel blog saja**, sesuai PRD FR-15. Lesson dan soal menyusul |
| 2 | Artikel MDX yang sudah ada di `content/blog/` | **Tetap sebagai file dulu.** Blog menampilkan gabungan artikel file dan artikel database. Impor ke database dikerjakan terpisah, karena perlu pengubah MDX ke format editor |
| 3 | Model revisi | **Satu tabel `content_items`**, revisi berupa baris baru dengan `revision_of`, sama dengan model di aplikasi. `docs/DATABASE.md` menyebut `articles` dan `article_revisions`; dokumen itu diperbarui |
| 4 | Antarmuka untuk akun sungguhan di UAT | **Tetap halaman informasi Google Docs** sampai seluruh alur lulus di DEV. Setelah itu baru dinyalakan untuk UAT |
| 5 | Gambar konten | **Bucket Storage `content-images`**: Creator mengunggah ke folder miliknya, gambar konten terbit dapat dibaca publik |

### B3. 🤖 Rancangan tabel (migrasi baru)

Satu file migrasi, mis. `supabase/migrations/2026111800000_content_workflow.sql`.

| Tabel | Isi utama | Catatan |
|---|---|---|
| `content_items` | `id`, `slug` (unik, tidak pernah berubah), `type`, `judul`, `ringkasan`, `kategori`, `sampul_path`, `ajakan` (jsonb), `sumber` (jsonb), `body` (jsonb, dokumen editor), `videos` (jsonb), `author_id`, `reviewer_id`, `status`, `submission_count`, `revision_of`, `submitted_at`, `published_at`, `created_at`, `updated_at` | Indeks `(author_id, status)`, `(status, submitted_at)`, `(reviewer_id, status)` |
| `content_review_notes` | `content_id`, `kind` (umum, bagian, video), `anchor`, `isi`, `reviewer_id`, `round`, `released`, `creator_reply`, `marked_fixed`, `resolved` | Catatan baru terlihat Creator setelah Minta Revisi |
| `content_status_events` | `content_id`, `action`, `from_status`, `to_status`, `actor_id`, `target_user_id`, `reason`, `created_at` | Hanya bisa ditambah |
| `creator_agreements` | `user_id`, `signed_on`, `document`, `recorded_by` | Syarat terbit |
| `admin_audit_logs` | sudah ada | Ditambah aksi tugaskan, terbitkan, tarik, peran, kesepakatan |

Nilai `status` memakai id yang sama dengan aplikasi (`draf`, `menunggu-review`, `perlu-revisi`, `disetujui`, `terbit`), supaya tidak perlu diterjemahkan.

### B4. 🤖 Aturan akses (RLS)

Semua tabel ditolak secara bawaan, lalu dibuka per kebijakan:

| Siapa | Boleh membaca |
|---|---|
| Creator | Konten miliknya, catatan yang sudah dirilis untuk kontennya |
| Reviewer | Konten Menunggu Review yang belum ditugaskan (kecuali tulisannya sendiri), konten yang ditugaskan kepadanya, dan catatannya |
| Admin (sesi `aal2`) | Semua |
| Siapa pun, termasuk tamu | Konten berstatus Terbit, lewat view `published_articles` tanpa kolom `videos.alasan` |

Penulisan tidak pernah langsung ke tabel. Semua lewat fungsi database (RPC) yang memeriksa peran, pemilik, dan status dalam satu transaksi, lalu mencatat `content_status_events` (dan `admin_audit_logs` untuk aksi Admin):

- **Creator:** `content_create_draft`, `content_update_draft`, `content_delete_draft`, `content_submit`, `content_withdraw`, `content_resubmit`, `content_reply_note`, `content_mark_note_fixed`, `content_create_revision`.
- **Reviewer:** `review_claim`, `review_add_note`, `review_remove_note`, `review_request_revision`, `review_approve`.
- **Admin:** `admin_assign_reviewer`, `admin_publish`, `admin_takedown`, `admin_set_role`, `admin_record_agreement`.

Pesan error dari fungsi berupa kode (mis. `bukan_pemilik`, `status_tidak_sesuai`, `kesepakatan_belum_ada`) yang diterjemahkan ke Bahasa Indonesia di aplikasi, sama seperti `lib/adminApi.ts`.

### B5. 🤖 Perubahan di aplikasi

- **`lib/content/supabaseRepository.ts`:** implementasi `ContentRepository` yang memanggil RPC di atas. Komponen halaman tidak berubah.
- **`lib/content/index.ts`:** memilih repository Supabase untuk akun sungguhan (`session.source === "supabase"`) dan tetap dummy untuk akun demo DEV. Bagian yang belum punya backend (transaksi, produk, pengumuman, maintenance) tetap dummy sampai fasenya.
- **Pembaruan data:** setelah setiap aksi, data dimuat ulang. Supabase Realtime dipertimbangkan nanti bila perlu.
- **Upload gambar:** `lib/content/imageUpload.ts` mengunggah ke Storage `content-images/<user_id>/<content_id>/...`.
- **Blog publik:** `lib/blog.ts` menggabungkan artikel file dan artikel `published_articles`. Data database diambil di server dengan `'use cache'` dan `cacheTag("blog")`, lalu Server Action Terbitkan dan Tarik memanggil `revalidateTag("blog", "max")` agar hanya halaman blog yang diperbarui. Pembaca tidak memicu kueri database (PRD 8.2).
- **Slug:** dibuat dari judul saat pertama kali diterbitkan, dicek unik terhadap artikel file maupun database, dan tidak pernah berubah.

### B6. Urutan pengerjaan (setiap baris satu PR ke `develop`)

| PR | 🤖 Isi | 👤 Setelah di-merge |
|---|---|---|
| 1 | Migrasi tabel, RLS, RPC, bucket Storage, dan test SQL lintas akun | `npm run db:push` ke DEV, lalu cek di Table Editor bahwa tabel ada dan RLS aktif |
| 2 | Admin: kelola peran dan catat kesepakatan Creator untuk akun sungguhan | Beri peran Creator dan Reviewer ke akun uji, catat kesepakatan Creator |
| 3 | Creator: draf, upload gambar, kirim, tarik kembali, hapus, catatan revisi, kirim ulang, buat revisi | Login sebagai Creator uji, buat dan kirim satu artikel |
| 4 | Reviewer: antrean, ambil, catatan, minta revisi, setujui | Login sebagai Reviewer uji, minta revisi lalu setujui |
| 5 | Admin: tugaskan reviewer, terbitkan, tarik; blog membaca artikel database dan revalidasi | Login sebagai Admin, terbitkan, lalu buka `/blog` sebagai tamu |
| 6 | Test e2e alur penuh dengan mock Supabase, pembaruan PRD dan `docs/DATABASE.md` | Jalankan skenario B8 di website DEV |

Setiap PR: lint, build, dan spec terkait lulus di lokal, CI lulus, dan pemilik me-review sebelum merge.

### B7. 👤 Siapkan akun uji di DEV

Butuh empat akun sungguhan di Supabase DEV. Peran harus dipisah, karena Creator tidak boleh me-review tulisannya sendiri.

| Akun | Peran | Saran email |
|---|---|---|
| Admin | Pelajar + Admin, dengan authenticator | Akun utama kamu |
| Creator uji | Pelajar + Creator | Alamat Gmail kamu dengan tambahan `+creator` sebelum `@` |
| Reviewer uji | Pelajar + Reviewer | Alamat Gmail kamu dengan tambahan `+reviewer` |
| Pembaca | Pelajar | Alamat Gmail kamu dengan tambahan `+pembaca`, atau tanpa login (tamu) |

Gmail mengirim email `nama+apa-saja@gmail.com` ke kotak masuk yang sama, jadi tidak perlu membuat email baru.

Daftarkan ketiganya lewat `/register` di website DEV. Sampai PR 2 selesai, peran diberikan lewat **SQL Editor** Supabase DEV:

```sql
-- Ganti alamat email di bawah dengan alamat akun uji.
insert into public.user_roles (user_id, role)
select id, 'creator' from auth.users where email = 'ALAMAT_CREATOR_UJI'
on conflict do nothing;

insert into public.user_roles (user_id, role)
select id, 'reviewer' from auth.users where email = 'ALAMAT_REVIEWER_UJI'
on conflict do nothing;

-- Cek hasilnya
select u.email, r.role
from public.user_roles r join auth.users u on u.id = r.user_id
order by u.email, r.role;
```

### B8. 👤 Skenario uji di website DEV (setelah PR 6)

Pakai dua browser atau jendela penyamaran agar bisa login dua akun sekaligus.

1. **Admin:** catat kesepakatan untuk Creator uji. Cek Log Aktivitas Admin mencatatnya.
2. **Creator:** buat artikel dengan sampul dan satu gambar di isi. Simpan Draf. Muat ulang: isi tetap ada.
3. **Creator:** Kirim untuk Review. Status menjadi Menunggu Review, dan tombol Edit hilang.
4. **Reviewer:** artikel tampil di tab Belum ditugaskan. Klik **Ambil**.
5. **Reviewer:** tambah satu catatan umum dan satu catatan bagian, lalu **Minta Revisi**.
6. **Creator:** artikel berstatus Perlu Revisi dengan dua catatan. Balas, tandai keduanya "Sudah diperbaiki", ubah isi, **Kirim ulang**.
7. **Reviewer:** artikel tampil sebagai kiriman ke-2 beserta balasan Creator. Centang checklist, **Setujui**.
8. **Admin:** di Semua Konten, artikel berstatus Disetujui. **Terbitkan**.
9. **Tamu** (jendela penyamaran, tanpa login): buka `/blog`. Artikel tampil dengan nama Creator, sampul, dan gambar.
10. **Admin:** **Tarik dari website** dengan alasan. Muat ulang `/blog` sebagai tamu: artikel hilang.
11. **Uji pelanggaran:** Creator uji mencoba membuka halaman review, dan Reviewer uji mencoba membuka Semua Konten Admin. Keduanya harus ditolak.

### B9. Yang tetap memakai data dummy sesudah Bagian B

Transaksi dan pembayaran (Fase 5 Midtrans), produk digital, pengumuman, mode maintenance, moderasi otomatis, dan notifikasi peran (Fase 7). Di DEV, akun demo tetap memakai data dummy untuk semua bagian.

### B10. Risiko dan pencegahannya

| Risiko | Pencegahan |
|---|---|
| RLS bocor: Creator membaca konten orang lain | Test SQL dengan dua akun yang saling mencoba membaca dan mengubah; dijalankan di PR 1 |
| Status melompat (mis. Draf langsung Terbit) | Transisi hanya lewat RPC yang memeriksa status asal |
| Slug bentrok dengan artikel file | RPC Terbitkan menolak slug yang sudah dipakai; daftar slug artikel file dicek saat build |
| Blog tidak ikut berubah setelah terbit | `revalidateTag("blog", "max")` di Server Action, ditambah test e2e |
| Gambar terlalu besar | Validasi 2 MB dan JPG, PNG, atau WebP di aplikasi, ditambah batas ukuran bucket |
| Secret key bocor | Hanya di `.env.local` dan Vercel (Sensitive); dibaca dari modul `server-only` |
