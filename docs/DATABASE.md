# Rancangan Database dan Backend

**Status:** Rancangan, menunggu persetujuan pemilik. Belum ada yang dibangun.
**Acuan:** PRD Bagian 6, 7, 8, dan 10.

Dokumen ini menjelaskan cara data belajarautomation.com disimpan setelah backend tersedia, dan cara menjaga situs tetap cepat saat dipakai banyak orang. Aturan produk tetap mengikuti PRD. Jika dokumen ini bertentangan dengan PRD, PRD yang berlaku.

## 1. Pilihan database

**PostgreSQL lewat Supabase** (sudah diputuskan di PRD 6.3), di region Singapura (`ap-southeast-1`), yang paling dekat dengan pengguna Indonesia.

Alasan:
- Data kita sangat relasional: pengguna, peran, progres, XP, transaksi, hak akses, kredit, dan konten saling terkait. Postgres kuat untuk data seperti ini.
- Transaksi dan klaim kredit wajib aman dari duplikasi dan tidak boleh melebihi kuota (PRD 8.4). Postgres punya transaksi ACID, constraint, dan penguncian baris untuk menjamin hal itu.
- Row Level Security (RLS) menegakkan hak akses langsung di database, jadi aturan tidak bergantung pada tampilan (PRD 6.4).
- Supabase menyediakan Auth (termasuk login Google, PRD 4.5), Storage, connection pooler, backup, dan read replica dalam satu layanan.
- Postgres dipakai banyak layanan dengan puluhan juta pengguna. Untuk 1 juta pengguna terdaftar, yang menentukan kecepatan bukan jenis database, tetapi cara memakainya: indeks, cache, dan pola kueri (Bagian 3).

Alternatif yang dipertimbangkan dan alasan tidak dipilih:

| Pilihan | Alasan tidak dipilih |
|---|---|
| MySQL atau PlanetScale | Setara untuk skala ini, tetapi tidak punya RLS, dan Auth serta Storage harus dirangkai sendiri |
| MongoDB | Kurang cocok untuk data relasional dan transaksi uang yang butuh konsistensi ketat |
| Firebase Firestore | Kueri agregat (leaderboard, laporan) mahal dan terbatas, dan sulit dipindah ke layanan lain |
| DynamoDB | Kuat untuk skala sangat besar, tetapi rumit untuk tim kecil dan laporan Admin |

## 2. Perkiraan beban

Perkiraan awal untuk perencanaan. Angka ini perlu dikoreksi pemilik.

| Ukuran | Perkiraan |
|---|---|
| Pengguna terdaftar | 1.000.000 |
| Pengguna aktif harian | 100.000 (10%) |
| Pengguna bersamaan saat puncak | 5.000 |
| Lesson selesai per hari | 500.000 (5 lesson per pengguna aktif) |
| Baris XP baru per tahun | sekitar 180 juta |

Kesimpulannya:
- Sebagian besar kunjungan adalah membaca materi, blog, dan katalog. Halaman-halaman itu harus statis dan disajikan dari CDN, tanpa menyentuh database.
- Database hanya melayani data pribadi (progres, XP, transaksi) dan aksi (menyelesaikan lesson, mengirim jawaban, membeli).
- Tabel yang terus bertambah (XP, aktivitas, log, notifikasi) harus dipartisi atau dibersihkan berkala.

## 3. Strategi agar tetap cepat

### 3.1 Halaman publik statis dari CDN
- Blog, katalog course, detail course, lesson, roadmap, dan detail latihan disiapkan saat build dan disajikan dari CDN Vercel. Waktu respons sekitar 10 ms, berapa pun jumlah pengunjungnya.
- Konten yang diterbitkan Admin memperbarui halamannya saat itu juga (on-demand revalidation), bukan dengan build ulang seluruh situs.
- Data pribadi di halaman tersebut (progres, tombol "Lanjutkan") diambil terpisah setelah halaman tampil, supaya halaman tetap bisa di-cache.

### 3.2 Database
- **Connection pooler** (Supavisor, mode transaksi) untuk semua koneksi dari server. Fungsi serverless tidak membuka koneksi langsung.
- **Indeks** untuk setiap kolom yang dipakai di filter, urutan, join, dan kebijakan RLS (Bagian 6).
- **Kebijakan RLS yang efisien**: memakai `(select auth.uid())` agar dihitung sekali per kueri, dan peran pengguna dibaca dari fungsi `security definer` yang di-cache, bukan join berulang.
- **Pagination berbasis kursor** (keyset), bukan `OFFSET`, untuk daftar panjang seperti Log Aktivitas Admin, transaksi, dan notifikasi.
- **Ringkasan disimpan, bukan dihitung ulang**: total XP, rank, dan jumlah lesson selesai disimpan di `user_stats` dan diperbarui di transaksi yang sama saat XP bertambah. Halaman tidak menjumlahkan jutaan baris XP setiap kali dibuka.
- **Leaderboard dari snapshot** (PRD 7.9): peringkat dihitung ulang berkala (mis. tiap 5 menit) ke tabel `leaderboard_snapshots`, lalu dibaca per halaman. Leaderboard tidak pernah mengurutkan seluruh pengguna saat dibuka.
- **Partisi bulanan** untuk tabel yang terus bertambah: `xp_transactions`, `activity_events`, `admin_audit_log`, dan `notifications`. Notifikasi lebih dari 90 hari dihapus (PRD 4.4).
- **Read replica** ditambahkan bila beban baca laporan Admin mulai mengganggu.

### 3.3 Aplikasi
- Validasi dan aturan bisnis dijalankan di fungsi database atau server dalam satu transaksi, agar satu aksi cukup satu kali bolak-balik ke database.
- Permintaan yang sama dari banyak pengguna (mis. katalog produk, daftar course) di-cache di server.
- Gambar dan file produk disajikan lewat CDN Supabase Storage, dengan signed URL untuk file berbayar (PRD 8.3).
- Proses berat (hitung leaderboard, penanda moderasi, kirim email, jadwal pengumuman dan maintenance) berjalan di job terjadwal, bukan saat pengguna menunggu.

### 3.4 Target
Target ini ditambahkan ke PRD 8.2:

| Ukuran | Target |
|---|---|
| LCP halaman publik (HP kelas menengah, 4G) | ≤ 2,5 detik |
| Waktu respons halaman statis | ≤ 100 ms dari CDN |
| Respons API (p95) | ≤ 300 ms |
| Kueri database (p95) | ≤ 50 ms |
| JavaScript halaman publik (terkompres) | ≤ 250 KB |

## 4. Kelompok tabel

Nama tabel mengikuti entitas di PRD Bagian 7. Semua tabel memakai `id uuid`, `created_at`, dan `updated_at` (kecuali tabel log yang hanya ditambah).

| Kelompok | Tabel | Entitas PRD |
|---|---|---|
| Akun | `profiles` (username unik, nama, bio, status akun), `user_roles`, `user_preferences`, `user_appearance` | 7.1, 7.2, 7.19 |
| Konten | `contents`, `content_revisions`, `review_notes`, `status_events`, `creator_agreements` | 7.3, 7.24 |
| Belajar | `lesson_progress`, `quiz_attempts`, `quiz_answers`, `challenge_submissions`, `challenge_drafts` | 7.4, 7.5, 7.6 |
| XP dan rank | `xp_transactions` (partisi), `user_stats`, `rank_definitions`, `leaderboard_snapshots` | 7.7, 7.8, 7.9 |
| Pencapaian | `achievement_definitions`, `user_achievements`, `avatar_definitions`, `theme_definitions`, `cosmetic_entitlements` | 7.17, 7.18, 7.20 to 7.22 |
| Bisnis | `products`, `membership_packages`, `purchases`, `purchase_status_events`, `entitlements`, `benefit_claims`, `payment_webhook_events` | 7.10 to 7.16 |
| Platform | `notifications` (partisi), `announcements`, `maintenance_windows`, `moderation_flags`, `moderation_actions`, `activity_events` (partisi) | 7.25 to 7.27 |
| Admin | `admin_audit_log` (partisi, hanya bisa ditambah) | 7.23 |

Isi lesson dan artikel resmi tetap berupa file MDX di repository agar halamannya statis. Tabel `contents` menyimpan artikel yang ditulis Creator lewat aplikasi (PRD FR-15).

## 5. Aturan akses (Row Level Security)

- Pengguna hanya membaca dan mengubah data miliknya: progres, draf jawaban, preferensi, notifikasi, transaksi, dan hak akses.
- Profil publik hanya menampilkan kolom publik (PRD FR-13), lewat view khusus.
- XP, rank, dan hasil kuis hanya ditulis fungsi server. Pengguna tidak bisa menulis XP sendiri.
- Status pembayaran hanya ditulis webhook payment gateway lewat service role. Admin tidak bisa mengubahnya (PRD FR-16).
- `admin_audit_log` tidak punya izin ubah atau hapus untuk siapa pun. Setiap aksi Admin dan catatan log-nya ditulis dalam satu transaksi.
- Creator hanya mengubah konten miliknya pada status yang diizinkan. Reviewer hanya mengakses konten yang ditugaskan kepadanya (PRD FR-15).
- Selama maintenance Aktif, fungsi server menolak permintaan selain dari Admin (PRD FR-16 K).

## 6. Indeks utama

| Tabel | Indeks | Untuk |
|---|---|---|
| `profiles` | `username` (unik), `lower(email)` | Profil publik, pencarian Admin |
| `user_roles` | `(user_id, role)` unik | RLS dan pemeriksaan peran |
| `lesson_progress` | `(user_id, course_slug)`, unik `(user_id, lesson_slug)` | Progres course, mencegah XP ganda |
| `xp_transactions` | `(user_id, created_at desc)`, unik `(user_id, source_type, source_id)` | Riwayat XP, mencegah XP ganda (PRD 8.4) |
| `leaderboard_snapshots` | `(period, category, rank)` | Halaman leaderboard |
| `purchases` | `(user_id, created_at desc)`, `(status, created_at)`, unik `gateway_reference` | Riwayat, Admin, webhook idempoten |
| `entitlements` | `(user_id, item_type, item_id)` dengan kondisi aktif | Cek hak akses |
| `contents` | `(author_id, status)`, `(status, submitted_at)`, `(reviewer_id, status)` | Konten Saya, antrean review |
| `notifications` | `(user_id, created_at desc)`, `(user_id) where read = false` | Lonceng dan halaman notifikasi |
| `admin_audit_log` | `(created_at desc)`, `(admin_id, created_at desc)`, `(action, created_at desc)` | Filter log |

## 7. Tahapan pembangunan

Antarmuka sudah memakai satu pintu data (`lib/content/repository.ts`). Setiap tahap mengganti implementasi dummy dengan Supabase, tanpa mengubah halaman.

| Tahap | Isi | Menggantikan |
|---|---|---|
| B1. Fondasi | Project Supabase (DEV, UAT, Production), migrasi, Auth email dan Google, `profiles`, `user_roles`, verifikasi dua langkah Admin | Sesi dan akun demo di browser |
| B2. Belajar | Progres lesson, XP, `user_stats`, rank, kuis dan latihan (penilaian di server), draf jawaban | `lessonProgress`, `challengeAttempts`, `challengeDrafts` di localStorage |
| B3. Komunitas | Leaderboard snapshot, profil publik, achievement, notifikasi | Data dummy leaderboard dan notifikasi |
| B4. Konten | Alur Creator, Reviewer, dan Admin, upload gambar ke Storage, terbit ke blog dengan revalidation | Repository konten dummy |
| B5. Bisnis | Payment gateway, webhook, hak akses, kredit, file produk berbayar | Transaksi dummy dan "Simulasi gateway" |
| B6. Operasional | Pengumuman, maintenance di server (kode 503), moderasi otomatis, laporan, backup, dan monitoring | Simulasi Admin di browser |

Setiap tahap: migrasi dan RLS ditulis lebih dulu, lalu test e2e dijalankan terhadap database DEV, dan data dummy terkait dihapus.

## 8. Yang perlu diputuskan pemilik

1. Perkiraan beban di Bagian 2 sudah sesuai harapan?
2. Paket Supabase: mulai dari Free untuk DEV, lalu Pro (sekitar US$25 per bulan per project, belum termasuk tambahan compute) untuk UAT dan Production?
3. Payment gateway: Midtrans, Xendit, atau lainnya?
4. Layanan email untuk verifikasi dan notifikasi transaksi.
5. Siapa yang memegang akses Owner di Supabase dan Google Cloud.
