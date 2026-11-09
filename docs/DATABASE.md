# Rancangan Database dan Backend

**Status:** Keputusan arsitektur disetujui pemilik (audit backend, PRD v2.21). Belum ada yang dibangun.
**Acuan:** PRD Bagian 4.4, 6, 7, 8, 10, FR-10, FR-15, dan FR-16.

Dokumen ini menjelaskan cara data belajarautomation.com disimpan setelah backend tersedia, dan cara menjaga situs tetap cepat saat dipakai banyak orang. Aturan produk tetap mengikuti PRD. Jika dokumen ini bertentangan dengan PRD, PRD yang berlaku.

## 1. Teknologi

| Kebutuhan | Pilihan |
|---|---|
| Database | PostgreSQL lewat Supabase, region Singapura (`ap-southeast-1`) |
| Auth | Supabase Auth: email dan password, verifikasi email, reset password, Google OAuth. Integrasi Next.js lewat `@supabase/ssr` dan `proxy.ts` (nama baru `middleware` di Next.js 16) |
| File | Supabase Storage: gambar konten, sampul, dan file produk berbayar (signed URL) |
| Pembayaran | Midtrans Snap: QRIS dan Virtual Account |
| Email | Resend: SMTP untuk Supabase Auth, API untuk email transaksi |
| Hosting | Vercel (halaman statis dari CDN, fungsi server, Cron) |

Alasan memilih Postgres:
- Data kita sangat relasional: pengguna, peran, progres, XP, transaksi, hak akses, kredit, dan konten saling terkait.
- Transaksi dan klaim kredit wajib aman dari duplikasi dan tidak boleh melebihi kuota (PRD 8.4). Postgres punya transaksi ACID, constraint, dan penguncian baris.
- Row Level Security (RLS) menegakkan hak akses langsung di database (PRD 6.4).
- Untuk 1 juta pengguna terdaftar, yang menentukan kecepatan adalah cara memakainya: indeks, cache, dan pola kueri (Bagian 3).

Alternatif yang tidak dipilih:

| Pilihan | Alasan |
|---|---|
| MySQL atau PlanetScale | Setara untuk skala ini, tetapi tidak punya RLS, dan Auth serta Storage harus dirangkai sendiri |
| MongoDB | Kurang cocok untuk data relasional dan transaksi uang |
| Firebase Firestore | Kueri agregat (leaderboard, laporan) mahal dan terbatas |
| DynamoDB | Rumit untuk tim kecil dan laporan Admin |

## 2. Lingkungan

| Lingkungan | Paket Supabase | Midtrans | Catatan |
|---|---|---|---|
| DEV | Free | Sandbox | Data uji. Antarmuka Creator, Reviewer, dan Admin aktif |
| UAT | Free | Sandbox | Berhenti otomatis bila tidak dipakai sekitar seminggu; diaktifkan kembali dari dashboard sebelum pengujian. Batas 2 project Free per organisasi terpakai oleh DEV dan UAT |
| Production | Pro, compute Micro | Produksi | Backup harian. Compute ditambah berdasarkan metrik |

Read replica tidak dipakai sebelum ada metrik yang menunjukkan kebutuhannya.

### Variabel lingkungan

| Nama | Dipakai di | Rahasia |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Browser dan server | Tidak |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser dan server | Tidak (dibatasi RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server saja: webhook, job | Ya |
| `MIDTRANS_SERVER_KEY` | Server saja | Ya |
| `MIDTRANS_CLIENT_KEY` | Snap di browser, dikirim dari server | Tidak |
| `MIDTRANS_IS_PRODUCTION` | Server | Tidak |
| `RESEND_API_KEY` | Server saja | Ya |
| `RESEND_FROM_EMAIL` | Server | Tidak |
| `CRON_SECRET` | Server saja: melindungi endpoint job | Ya |

Aturan:
- Nilai rahasia diisi pemilik di Vercel dan dashboard vendor, tidak pernah di repository atau chat.
- Variabel rahasia tidak pernah memakai awalan `NEXT_PUBLIC_`.
- `SUPABASE_SERVICE_ROLE_KEY` dan `MIDTRANS_SERVER_KEY` hanya diimpor dari modul bertanda `server-only`.
- `.env.example` hanya berisi nama variabel tanpa nilai.

## 3. Perkiraan beban

| Ukuran | Perkiraan |
|---|---|
| Pengguna terdaftar | 1.000.000 |
| Pengguna aktif harian | 30.000–50.000 (3–5%) |
| Lesson selesai per hari | 150.000–250.000 (5 lesson per pengguna aktif) |
| Baris XP baru per tahun | sekitar 55–90 juta |
| Skenario stres | 5.000 pengguna bersamaan dan 500.000 lesson selesai per hari |

Uji beban (Fase 8) memakai skenario stres, bukan angka harian.

Kesimpulannya:
- Sebagian besar kunjungan adalah membaca materi, blog, dan katalog. Halaman-halaman itu statis dan disajikan dari CDN, tanpa menyentuh database.
- Database hanya melayani data pribadi (progres, XP, transaksi) dan aksi (menyelesaikan lesson, mengirim jawaban, membeli).
- Tabel yang terus bertambah (XP, log, notifikasi) dipartisi atau dibersihkan berkala.

## 4. Strategi agar tetap cepat

### 4.1 Halaman publik statis dari CDN
- Isi course, lesson, soal kuis, dan artikel disimpan di database (PRD 6.3), tetapi halamannya dibuat saat build dari database dan disajikan dari CDN Vercel.
- Saat konten diterbitkan atau ditarik, hanya halaman itu yang dibangun ulang (`revalidateTag` per slug), bukan seluruh situs.
- Isi lesson disimpan sebagai teks MDX dan diubah menjadi HTML saat halaman dibangun, sama seperti sekarang.
- Data pribadi di halaman tersebut (progres, tombol "Lanjutkan") diambil terpisah setelah halaman tampil.

### 4.2 Database
- **Connection pooler** (Supavisor, mode transaksi) untuk semua koneksi dari server.
- **Indeks** untuk setiap kolom yang dipakai di filter, urutan, join, dan kebijakan RLS (Bagian 7).
- **RLS yang efisien**: `(select auth.uid())` agar dihitung sekali per kueri, dan peran dibaca lewat fungsi `has_role()` bertipe `security definer stable`.
- **Pagination berbasis kursor** (keyset), bukan `OFFSET`, untuk daftar panjang.
- **Ringkasan disimpan, bukan dihitung ulang**: total XP, rank, dan jumlah lesson selesai disimpan di `user_xp_summary` dan diperbarui di transaksi yang sama saat XP bertambah.
- **Leaderboard dari snapshot** (PRD 7.9): dihitung ulang berkala ke `leaderboard_snapshots`, lalu dibaca per halaman.
- **Partisi bulanan** untuk `xp_transactions`, `audit_logs`, dan `notifications`. Notifikasi lebih dari 90 hari dihapus (PRD 4.4).

### 4.3 Aplikasi
- Aturan bisnis dijalankan di fungsi database (RPC) dalam satu transaksi, agar satu aksi cukup satu kali bolak-balik ke database.
- Proses berat (leaderboard, email, rekonsiliasi pembayaran, penanda moderasi, jadwal pengumuman dan maintenance) berjalan di job terjadwal (Vercel Cron), bukan saat pengguna menunggu.

### 4.4 Target
Mengikuti PRD 8.2: LCP ≤ 2,5 detik, halaman statis ≤ 100 ms, API p95 ≤ 300 ms, kueri database p95 ≤ 50 ms, dan JavaScript halaman publik ≤ 250 KB terkompres.

## 5. Tabel

Semua tabel memakai `id uuid`, `created_at`, dan `updated_at`, kecuali tabel log yang hanya bisa ditambah. Slug disimpan unik dan tidak pernah diubah.

| Kelompok | Tabel | Entitas PRD |
|---|---|---|
| Akun | `profiles` (username unik, nama, bio, status akun), `user_roles`, `user_settings`, `user_appearance`, `cosmetic_entitlements` | 7.1, 7.2, 7.19, 7.20 |
| Katalog dan isi | `courses`, `lessons` (isi MDX, status, tingkat akses), `quizzes`, `quiz_questions`, `quiz_options`, `playground_challenges`, `content_video_references` | 7.3 |
| Kunci jawaban | `private.quiz_answer_keys`, `private.challenge_answer_keys` | 7.3 |
| Belajar | `lesson_progress`, `quiz_attempts` (jawaban per soal, sisa waktu, status tertunda), `challenge_attempts`, `challenge_drafts` | 7.4–7.6 |
| XP dan pencapaian | `xp_transactions` (partisi), `user_xp_summary`, `leaderboard_snapshots`, `achievements`, `user_achievements` | 7.7–7.9, 7.21, 7.22 |
| Bisnis | `products` (eBook, project, paket membership, avatar, tema), `orders`, `order_items`, `payments`, `refunds`, `user_entitlements`, `benefit_claims` | 7.10–7.16 |
| Pembayaran (internal) | `private.payment_webhook_events` | 7.13 |
| Konten Creator | `articles`, `article_revisions`, `content_reviews`, `content_review_comments`, `creator_agreements` | 7.3, 7.24 |
| Platform | `notifications` (partisi), `notification_reads`, `notification_preferences`, `announcements`, `maintenance_windows`, `moderation_flags`, `moderation_actions` | 7.25–7.27 |
| Email (internal) | `private.email_outbox` | 4.4 |
| Audit | `audit_logs` (partisi, hanya bisa ditambah) | 7.23 |

Catatan:
- **Peran:** `user_roles(user_id, role)` unik, dengan nilai `student`, `creator`, `reviewer`, `admin`. Baris `student` dibuat otomatis saat akun dibuat. Membership disimpan di `user_entitlements`, bukan di `user_roles`.
- **Tanpa `enrollments`:** progres course dihitung dari `lesson_progress` (PRD FR-02).
- **Kunci jawaban** disimpan di schema `private` yang tidak terekspos ke API Supabase. Hanya fungsi penilaian di server yang membacanya.
- **Hak akses** (`user_entitlements`) mencatat sumbernya: order, klaim kredit, atau pemberian Admin. Pemberian dan pencabutan oleh Admin wajib alasan dan tercatat di `audit_logs` (FR-16 E).
- **Kredit** (`benefit_claims`): Pro 1 eBook dan 1 project, Premium 3 dan 3 (FR-10). Klaim memakai penguncian baris agar tidak melebihi kuota.
- **`email_outbox`**: `id`, `user_id`, `email_type`, `recipient`, `template_id`, `payload`, `status`, `attempt_count`, `provider_message_id`, `sent_at`, `created_at`, dengan unik `(email_type, reference_id)` agar email yang sama tidak terkirim dua kali.
- **Admin** wajib verifikasi dua langkah (Supabase MFA, PRD 8.3). Kebijakan Admin memeriksa tingkat sesi `aal2`.

## 6. Aturan akses (Row Level Security)

- Semua tabel di schema `public` memakai RLS dan ditolak secara bawaan. Izin dibuka per kebijakan.
- Pengguna hanya membaca dan mengubah data miliknya: progres, draf jawaban, pengaturan, notifikasi, transaksi, dan hak akses.
- Profil publik hanya menampilkan kolom publik (FR-13), lewat view khusus, dan hanya untuk pengguna yang login.
- Isi lesson premium hanya dapat dibaca pengguna yang punya hak akses. Halaman statis lesson premium hanya berisi cuplikan; isi lengkap diambil setelah hak akses diperiksa.
- Penulisan penting hanya lewat fungsi database (RPC) yang memeriksa aturan dalam satu transaksi, misalnya `complete_lesson`, `submit_quiz`, `submit_challenge`, `claim_benefit`, aksi Admin beserta audit log, dan perubahan status konten. Pengguna tidak punya izin `insert` langsung ke `xp_transactions`, `payments`, atau `user_entitlements`.
- Tahap saat ini (migrasi `20261109090000_xp_progress.sql`): `lesson_progress`, `challenge_attempts`, dan `xp_transactions` memakai slug course, lesson, dan latihan karena konten belum diimpor ke database, dan `xp_transactions` belum dipartisi. XP dicatat Server Action Next.js setelah menilai jawaban, lewat `record_lesson_completion` dan `record_challenge_attempt` yang hanya dapat dijalankan `service_role`. Browser membaca progres lewat `get_my_progress`. Kolom slug diganti id konten dan partisi ditambahkan saat konten pindah ke database.
- Migrasi `20261109120000_admin_xp_membership.sql`: koreksi XP sebagai transaksi `correction` (boleh negatif, beralasan, mencatat Admin), tabel `membership_grants` (sumber `manual` atau `payment`, pencabutan mengisi `revoked_at`), dan `admin_audit_logs`. Fungsi `admin_*` memeriksa `has_role('admin')` sehingga hanya sesi `aal2` yang bisa menjalankannya. `get_my_account` mengembalikan membership yang berlaku, dan `set_appearance` membuka item berbayar sesuai membership.
- Status pembayaran hanya ditulis webhook Midtrans lewat service role. Admin tidak bisa mengubahnya (FR-16 E).
- `audit_logs` tidak punya izin ubah atau hapus untuk siapa pun.
- Creator hanya mengubah konten miliknya pada status yang diizinkan. Reviewer hanya mengakses konten yang ditugaskan kepadanya (FR-15).
- Selama maintenance Aktif, fungsi server menolak permintaan selain dari Admin (FR-16 K).
- Setiap kebijakan diuji dengan dua akun uji yang saling mencoba membaca dan mengubah data pihak lain, terhadap database DEV.

## 7. Indeks utama

| Tabel | Indeks | Untuk |
|---|---|---|
| `profiles` | `username` (unik), `lower(email)` | Profil publik, pencarian Admin |
| `user_roles` | `(user_id, role)` unik | RLS dan pemeriksaan peran |
| `lessons` | `(course_id, position)`, `slug` unik per course | Daftar lesson, halaman lesson |
| `lesson_progress` | `(user_id, course_id)`, unik `(user_id, lesson_id)` | Progres course, mencegah XP ganda |
| `xp_transactions` | `(user_id, created_at desc)`, unik `(user_id, source_type, source_id)` | Riwayat XP, mencegah XP ganda (PRD 8.4) |
| `leaderboard_snapshots` | `(period, category, rank)` | Halaman leaderboard |
| `orders` | `(user_id, created_at desc)`, `(status, created_at)` | Riwayat, Admin, rekonsiliasi |
| `payments` | unik `midtrans_order_id` | Webhook idempoten |
| `user_entitlements` | `(user_id, product_id)` dengan kondisi aktif | Cek hak akses |
| `articles` | `(author_id, status)`, `(status, submitted_at)`, `(reviewer_id, status)` | Konten Saya, antrean review |
| `notifications` | `(user_id, created_at desc)` | Lonceng dan halaman notifikasi |
| `email_outbox` | `(status, created_at)`, unik `(email_type, reference_id)` | Job pengiriman, cegah ganda |
| `audit_logs` | `(created_at desc)`, `(actor_id, created_at desc)`, `(action, created_at desc)` | Filter log |

## 8. Midtrans

1. **Membuat order:** server membuat `orders` berstatus `pending` dengan harga dari database, lalu meminta token Snap. Browser hanya menerima token dan `MIDTRANS_CLIENT_KEY`.
2. **Webhook** `app/api/payments/midtrans/route.ts` (Node runtime):
   - verifikasi `signature_key` = SHA512(`order_id` + `status_code` + `gross_amount` + Server Key);
   - cocokkan nominal dan order;
   - simpan event mentah ke `private.payment_webhook_events` dengan kunci unik agar event yang sama diproses sekali;
   - perbarui `payments` dan `orders`, beri hak akses, tulis notifikasi dan `email_outbox`, semuanya dalam satu transaksi.
3. **Halaman selesai bayar** hanya menampilkan status dari database. Redirect Midtrans tidak pernah memberi hak akses.
4. **Rekonsiliasi:** job terjadwal memanggil API status Midtrans untuk order `pending` yang lebih lama dari 15 menit dan order yang kedaluwarsa.
5. **Refund:** Admin mengajukan refund dengan alasan wajib. Server memanggil Refund API, mencatat `refunds`, mencabut hak akses terkait, dan menulis `audit_logs`.
   - ⚠️ Dukungan Refund API untuk QRIS dan Virtual Account perlu dikonfirmasi ke Midtrans. Untuk metode yang tidak didukung, refund dilakukan manual di dashboard Midtrans, lalu dicatat sebagai refund manual dengan bukti dan alasan.
6. **Test:** sandbox Midtrans, ditambah test webhook dengan signature salah, nominal salah, event ganda, dan urutan event terbalik.

## 9. Resend

- **Email akun** (verifikasi, reset password): Supabase Auth memakai SMTP kustom Resend, dengan template berbahasa Indonesia.
- **Email transaksi** (pembayaran berhasil, gagal, refund, klaim): aplikasi menulis ke `private.email_outbox` di transaksi yang sama dengan kejadiannya. Job mengirim lewat API Resend dengan percobaan ulang bertahap, lalu mencatat `provider_message_id` dan `sent_at`.
- **Webhook Resend** mencatat bounce dan komplain, lalu menghentikan pengiriman ke alamat tersebut.
- **Domain:** email dikirim dari subdomain khusus (mis. `mail.belajarautomation.com`) dengan SPF, DKIM, dan DMARC. Pengumuman massal nantinya memakai subdomain terpisah.
- **Kuota:** paket Free Resend kecil. Di awal, pengumuman hanya di dalam aplikasi; email pengumuman menyusul setelah paket dan reputasi pengirim siap.

## 10. Tahapan pembangunan

Antarmuka sudah memakai satu pintu data (`lib/content/repository.ts`). Setiap fase mengganti implementasi dummy dengan Supabase tanpa mengubah desain halaman. Modul yang masih langsung memakai localStorage (`lessonProgress`, `notifications`, `cart`, dan lainnya) dibungkus antarmuka lebih dulu.

| Minggu | Fase | Isi | Menggantikan |
|---|---|---|---|
| 1 | 2a. Fondasi | Project DEV dan UAT, `@supabase/ssr`, `proxy.ts`, migrasi, variabel lingkungan, RLS dasar | — |
| 2–3 | 2b. Auth | Email, verifikasi, reset, Google, `profiles`, `user_roles`, verifikasi dua langkah Admin, test RLS | Sesi dan akun demo |
| 4–5 | 3. Belajar | Tabel konten, skrip impor MDX, halaman statis dari database, progres lesson, penilaian kuis dan latihan di server, draf jawaban, akses premium | `data/courses`, `content/`, `lessonProgress`, `challengeAttempts`, `challengeDrafts` |
| 6 | 4. Gamifikasi | Ledger XP, ringkasan, rank, achievement, snapshot leaderboard, profil publik | Data dummy leaderboard dan profil |
| 7–9 | 6. Manajemen konten | Creator: buat, edit, hapus, kirim review, tarik kembali. Reviewer: catatan revisi, setujui. Admin: terbitkan, tarik, tugaskan reviewer, peran, kesepakatan Creator, nonaktifkan akun, katalog, produk, moderasi, pengumuman, maintenance di server, audit log. Upload gambar ke Storage, revalidasi halaman saat terbit | Repository konten dummy, alur Google Docs |
| 10 | 7. Email dan notifikasi | Resend untuk email akun, `email_outbox`, notifikasi sistem dan konten | Notifikasi dummy |
| 11–13 | 5. Commerce | Produk, order, Midtrans sandbox, webhook, rekonsiliasi, refund, hak akses, klaim kredit, file berbayar, email transaksi | Keranjang, transaksi dummy, "Simulasi gateway" |
| 14 | 8. Kesiapan | UAT, test keamanan dan RLS, uji beban skenario stres, backup dan restore, monitoring | — |
| 15 | Rilis | Production dan cadangan waktu. Hanya jika merchant Midtrans sudah terverifikasi; jika belum, rilis mundur sampai siap (PRD FR-10) | — |

Pembayaran dikerjakan paling akhir. Sampai Fase 5, checkout di DEV tetap memakai simulasi pembayaran, dan pemberian hak akses premium hanya lewat Admin dengan alasan wajib dan audit log.

Setiap fase:
- Migrasi dan RLS ditulis lebih dulu.
- Test e2e dijalankan terhadap database DEV.
- Data dummy terkait baru dihapus setelah pengganti backend berfungsi dan lulus test.
- Laporan fase berisi fitur, file, migrasi, variabel lingkungan, setup manual, test, hasil, risiko, dan langkah berikutnya.

## 11. Risiko utama

| Fase | Risiko | Mitigasi |
|---|---|---|
| 2 | Sesi SSR salah konfigurasi, RLS bocor | Test lintas akun, review kebijakan per tabel |
| 3 | Isi konten berbeda antara repo dan database | Skrip impor idempoten per slug, pemeriksaan `check:*` dijalankan pada hasil impor |
| 4 | XP ganda, beban leaderboard | Unik per sumber XP, snapshot berkala |
| 5 | Webhook hilang atau ganda, refund QRIS/VA, verifikasi merchant lama | Event idempoten, rekonsiliasi, daftar merchant sejak awal |
| 7 | Email masuk spam, kuota Free | SPF/DKIM/DMARC, subdomain khusus, pengumuman di aplikasi dulu |
| 8 | Waktu habis untuk temuan keamanan | Keamanan diuji di setiap fase, bukan hanya di akhir |

## 12. Yang perlu disiapkan pemilik

1. Organisasi Supabase, project DEV dan UAT (Free, region Singapura), lalu project Production (Pro) menjelang Fase 8. Tentukan pemegang akses Owner.
2. Project Google Cloud untuk login Google: layar persetujuan OAuth, Client ID dan Secret, alamat redirect DEV, UAT, dan Production (PRD 4.5).
3. Pendaftaran merchant Midtrans sejak awal, karena rilis menunggu verifikasinya, serta konfirmasi dukungan refund untuk QRIS dan Virtual Account. Akun sandbox sudah cukup untuk pengembangan Fase 5.
4. Akun Resend dan akses DNS domain untuk SPF, DKIM, dan DMARC.
5. Pengisian semua nilai rahasia di Vercel dan dashboard vendor.
