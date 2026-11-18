# BELAJARAUTOMATION.COM
## Product Requirements Document (PRD)
**Versi:** 2.50  
**Status:** Draft — Acuan Pengembangan Produk  
**Platform:** Web Application  
**Target Pengguna:** Pemula hingga praktisi QA, Software Testing, dan Programming

### Perubahan di Versi 2.50
- Setiap jenis kucing punya nama panggilan: Mochi (Kucing Putih), Oyen (Kucing Oren), Kopi (Kucing Hitam), Domino (Kucing Tuxedo), Mendung (Kucing Abu-abu), Karamel (Kucing Coklat), Belang (Kucing Corak Tiga), dan Latte (Kucing Siam). Nama avatar memakai nama panggilan, mis. "Oyen Wizard", dengan jenis kucing sebagai keterangan di koleksi. Maskot resmi bernama **Kimi Cat** (FR-12).
- Kostum Wizard tersedia untuk kedelapan jenis kucing, sehingga koleksi avatar berisi 32 avatar. Terbuka di Pro dan Premium (FR-12).
- Gaya avatar menjadi 7: Driver Formula berganti nama menjadi Driver Racing, Space Explorer menjadi Astronot, serta Ninja dan Knight dihapus. Master Chef tetap (FR-12, FR-13).
- Id dan nama file avatar memakai nama panggilan, mis. `mochi` dan `oyen-wizard`. Avatar pilihan pengguna yang tersimpan dengan id lama dipindahkan otomatis ke id baru (FR-12).

### Perubahan di Versi 2.49
- Seluruh tanggal di Panel Admin memakai WIB, termasuk filter tanggal dan "hari ini" (FR-16).
- Sidebar Panel Admin: kelompok menu berupa dropdown, dan di layar lebar sidebar selalu tampil tanpa tombol sembunyikan (FR-16).
- Dashboard Admin dirapikan: empat angka utama, grafik Pertumbuhan Pengguna dan Pendapatan per Minggu, Konten per Status, Perlu Perhatian, Sebaran Rank, dan Aksi Admin Terbaru (FR-16 A).
- Profil Admin dan Pengaturan Admin terpisah dari profil pelajar, tanpa foto profil: inisial nama, status verifikasi dua langkah, ringkasan kerja, keamanan akun, dan notifikasi Admin (FR-16 L).
- Dashboard Creator diperbarui: empat angka utama, grafik Alur Konten dan Konten Dibuat per Minggu, Perlu Dikerjakan, dan Konten Terbaru; ikon jenis konten dan judul halaman berikon; tampilan mobile Konten Saya dengan aksi bertulisan (FR-15).
- Dashboard Reviewer lebih interaktif: antrean yang dapat disaring dan diambil langsung, Hasil Review, Keputusan per Minggu, dan checklist panduan yang dapat dibuka-tutup; Profil dan Pengaturan Creator dan Reviewer tanpa foto (FR-15).

### Perubahan di Versi 2.48
- Tombol "Masuk dengan Google" dan "Daftar dengan Google" dipindah ke bawah tombol utama form email, dipisah garis "atau" (4.5).

### Perubahan di Versi 2.47
- XP materi diberikan per modul (10 XP saat seluruh lesson dalam satu modul selesai), bukan per lesson. Bonus course, kuis, dan challenge tidak berubah (FR-05).
- Batas XP rank disesuaikan: Practitioner 900, Specialist 1.900, Expert 3.100, Master 4.400, sehingga Master tetap dapat dicapai dari konten gratis dan rank awal membutuhkan porsi konten lebih banyak (FR-05).
- XP akun lama disesuaikan lewat transaksi koreksi tanpa mengubah riwayat (FR-05).
- Banner Playground hanya menampilkan latar tema, tanpa avatar kucing (FR-04, FR-12).
- Banner sampul bertema yang sama dengan Playground dipakai di halaman Belajar, Roadmap, Leaderboard, eBook, dan Project. Blog tidak memakainya karena terbuka untuk publik (FR-12).
- Deskripsi fitur di banner sampul dibuka dari tombol ikon (i) berupa popup, termasuk keterangan yang sebelumnya tampil terpisah di halaman, mis. kotak "Tempat latihan" di Playground (FR-12).
- Ajakan "Tidak tahu mulai dari mana?" di halaman Belajar tertutup secara bawaan dan dibuka dengan tombol panah (FR-02).
- Pratinjau Kustomisasi tampil di atas koleksi pada layar kecil dan hanya berisi banner, avatar, dan nama, tanpa rank dan XP (FR-13).

### Perubahan di Versi 2.46
- Welcome Banner dashboard hanya menampilkan latar tema, tanpa avatar kucing (FR-01, FR-12).
- Kartu Rank & XP di dashboard memakai latar gradasi warna identitas rank (FR-01).
- Ringkasan profil berisi empat kartu berukuran sama: Progres XP, Achievement, Progress Rank, dan Aktivitas Terbaru. Kartu statistik dihapus dari Ringkasan profil sendiri; profil publik tetap menampilkannya (FR-13).
- Grafik Progres XP memiliki tinggi tetap di semua ukuran layar (FR-13).
- Di layar kecil, tombol aksi banner profil diringkas ke dalam tombol menu (FR-13).

### Perubahan di Versi 2.45
- Kucing 3D di banner profil dihapus sementara konsep visualnya dirancang ulang. Banner profil cukup menampilkan avatar aktif (foto profil) pengguna (FR-12, FR-13).

### Perubahan di Versi 2.44
- Kucing 3D di banner profil bergerak paling banyak 30 bingkai per detik, dan tampil sebagai pose diam di perangkat tanpa akselerasi grafis (FR-12).

### Perubahan di Versi 2.43
- Halaman profil mengikuti mockup `docs/desain/profil.webp`: tombol aksi di banner, kucing 3D di sisi kanan banner, dan Ringkasan berisi kartu statistik, Progres XP, Achievement, Progress Rank, serta Aktivitas Terbaru (FR-13).
- Profil memiliki 3 tab: Ringkasan, Aktivitas, dan Pencapaian. Kustomisasi tidak lagi menjadi tab dan dibuka dari ikon pensil pada avatar (FR-13).
- Progress per kategori materi dan progress roadmap dihapus dari Ringkasan; progres tetap terlihat di halaman Belajar dan Roadmap (FR-13).
- Model 3D maskot dan avatar kucing diperbolehkan khusus di banner profil, mengikuti jenis kucing avatar aktif (FR-12).
- Menambahkan tema **Padang Rumput** (gratis, diam) sebagai tema bawaan pengguna baru; Penerbangan Fuji tetap tersedia sebagai pilihan (FR-12).

### Perubahan di Versi 2.42
- Kostum Bug Hunter dan Cyberpunk tersedia untuk kedelapan jenis kucing, sehingga koleksi avatar berisi 24 avatar. Semua kostum terbuka di Pro dan Premium (FR-12).

### Perubahan di Versi 2.41
- Menu Admin "Ringkasan" berganti nama menjadi "Dashboard". Untuk Admin akun sungguhan, Dashboard memakai data asli (pengguna, membership, sebaran rank, aksi Admin terbaru), dan bagian yang belum punya backend memakai angka contoh berlabel "Data contoh" di DEV dan UAT (FR-16 A).

### Perubahan di Versi 2.40
- Koreksi XP dan pemberian membership manual untuk akun sungguhan tersedia di halaman Admin Pengguna, dengan alasan wajib dan riwayat (FR-16 D dan E).
- Avatar dan tema berbayar terbuka sesuai membership yang tercatat di database (FR-12).

### Perubahan di Versi 2.39
- Verifikasi dua langkah Admin untuk akun sungguhan: pendaftaran aplikasi authenticator lewat kode QR, lalu kode 6 digit setiap sesi sebelum halaman Admin terbuka (Bagian 8.3).

### Perubahan di Versi 2.38
- Lesson dan course berstatus draf tampil dan dapat diselesaikan di DEV dan UAT, dengan label "Draf", agar alur belajar dan XP dapat diuji saat UAT. Di Production tetap tersembunyi (Bagian 13.3).

### Perubahan di Versi 2.37
- Popup naik rank dibuat meriah (confetti, sinar, animasi emblem) dan tampil di halaman mana pun, sekali per rank (FR-05).
- Pencapaian naik rank dapat dibagikan dari popup: kartu gambar persegi yang bisa diunduh atau dibagikan, serta tautan profil ke media sosial (FR-05).
- Ilustrasi perayaan kucing dengan tameng per rank ditetapkan terpisah dari emblem rank; emblem di tempat lain tetap tanpa maskot (FR-05).

### Perubahan di Versi 2.36
- Lesson ditandai selesai saat pengguna mengklik "Berikutnya", menggantikan tombol "Tandai selesai". Lesson terakhir diselesaikan dengan tombol "Selesaikan course" yang kembali ke halaman course (FR-05).

### Perubahan di Versi 2.35
- Batas waktu pengerjaan latihan: Kuis 15 menit, Bug Hunt, Test Case Writing, dan Locator Challenge 30 menit, dengan teks sisa waktu. Saat waktu habis, jawaban dikirim otomatis (FR-04).

### Perubahan di Versi 2.34
- Aturan penyelesaian aktivitas ditetapkan: lesson ditandai selesai setelah isinya digulir sampai akhir, kuis dan challenge boleh diulang tanpa batas, dan Test Case Writing tercatat selesai tanpa XP karena dinilai sendiri (FR-05).
- Naik rank menampilkan popup perayaan dan menambah notifikasi di kelompok Progres (FR-05).
- Total XP, materi selesai, dan challenge selesai akun sungguhan dihitung dari database dan dicatat oleh server (FR-05).

### Perubahan di Versi 2.33
- Email verifikasi pendaftaran berbahasa Indonesia dengan tampilan belajarautomation.com (Bagian 4.5).
- Leaderboard akun sungguhan: setiap baris dapat diklik untuk membuka profil publik pengguna tersebut (FR-06, FR-13).
- Profil publik akun sungguhan diambil dari database; username yang tidak ada menampilkan "Profil tidak ditemukan" (FR-13).
- Avatar di kartu Bagikan profil memakai bingkai bulat, sama dengan header profil (FR-13).

### Perubahan di Versi 2.32
- Sertifikat kelulusan dicatat sebagai fitur yang direncanakan (Bagian 12).
- Slide pertama panel promosi berupa poster utuh; panel berbingkai potret 3:4 yang mengikuti tinggi layar (Bagian 4.5).
- Daftar akun demo tidak lagi ditampilkan di halaman masuk; dipindah ke README (Bagian 4.5).
- Menambahkan popup promosi di tengah layar setelah login, dengan pilihan "Nanti saja" dan "Jangan tampilkan lagi" (Bagian 4.7).

### Perubahan di Versi 2.31
- Halaman masuk dan daftar (desktop) menampilkan panel promosi berisi 3 slide yang bergeser otomatis atau digeser: sambutan, koleksi avatar kucing, dan eBook (Bagian 4.5).

### Perubahan di Versi 2.30
- Menambahkan alert singkat di atas layar untuk hasil aksi (simpan, buat, ubah, hapus) dan status koneksi internet, berlaku di semua halaman (Bagian 4.6).

### Perubahan di Versi 2.29
- Menambahkan halaman **Rank & XP** (`/rank`) berisi Tingkatan Rank dan Cara Mendapatkan XP; keduanya dipindah dari halaman Leaderboard (FR-05, FR-06).
- Tombol di kartu Rank & XP dashboard menjadi "Lihat detail rank" yang membuka halaman Rank & XP (FR-01).

### Perubahan di Versi 2.28
- Leaderboard menampilkan 50 peringkat teratas dalam 5 halaman berisi 10 baris, dengan navigasi halaman dan tombol "Lompat ke posisiku" (FR-06).

### Perubahan di Versi 2.27
- Menambahkan tema **Neon Night** (gratis, bergerak): kota cyberpunk malam dengan kucing abu-abu di depan laptop (FR-12).
- Aset tema disimpan satu folder per tema di `public/banner/<id-tema>/` (FR-12).

### Perubahan di Versi 2.26
- Tema bawaan diganti menjadi **Penerbangan Fuji** (gratis): kabin pesawat dengan jendela menghadap Gunung Fuji, dalam versi bergerak. Tema Mountain Workspace dihapus (FR-12).
- Menambahkan aturan tema bergerak: video tanpa suara yang berulang di atas gambar diam, dan gambar diam untuk pengguna yang mengaktifkan "kurangi gerakan" (FR-12).

### Perubahan di Versi 2.25
- Tombol "Simpan Pilihan" di Kustomisasi menyimpan avatar dan tema ke akun; pilihan tampil di semua halaman. Akun baru memakai Kucing Putih dan tema bawaan (FR-12, FR-13).
- Katalog avatar dan tema disimpan di database, dan hak pakainya diperiksa di server. Sampai hak akses paket tersedia (Fase 5), item berbayar tidak dapat dipakai akun sungguhan (FR-12).

### Perubahan di Versi 2.24
- Menambahkan pengaturan Informasi Profil: nama tampilan, Tentang saya (maksimal 160 karakter, tautan http/https dapat diklik), username dengan jeda 30 hari, dan ganti email dengan konfirmasi ke email lama dan baru (FR-13).
- Foto profil diganti lewat tab Kustomisasi; isian "Role" teks bebas di Pengaturan dihapus (FR-13).

### Perubahan di Versi 2.23
- Rilis awal avatar menjadi 8 kucing gaya Basic: Kucing Putih dan Kucing Oren gratis; Hitam, Tuxedo, Abu-abu, Coklat, Corak Tiga, dan Siam terbuka di Pro dan Premium (FR-12).
- Kucing Putih menjadi avatar bawaan pengguna baru (FR-12).
- Koleksi avatar dikelompokkan per gaya dengan chip; gaya yang belum punya gambar tampil "Segera hadir" (FR-13).
- Filter kepemilikan di Kustomisasi menjadi tombol ikon dengan dropdown (FR-13).
- Bingkai avatar di header profil dan pratinjau berbentuk bulat (FR-13).
- Saat development, pemeriksaan lokal cukup lint, build, dan test terkait; seluruh test end-to-end dijalankan CI, sebelum UAT, dan untuk regresi (Bagian 13.4).
- Bagian "Digunakan saat ini" di Kustomisasi dihapus; pilihan aktif ditandai pada kartu koleksi dan tombol simpan berada di bawah pratinjau (FR-13).
- Menetapkan 9 gaya avatar: Basic, Bug Hunter, Cyberpunk, Wizard, Driver Formula, Space Explorer, Ninja, Knight, dan Master Chef. Gaya kostum berlaku untuk semua jenis kucing dan terbuka di Pro dan Premium (FR-12).

### Perubahan di Versi 2.22
- Menetapkan aturan username: 3–20 karakter, huruf kecil, angka, dan garis bawah, tidak diawali angka, bukan nama cadangan, dan dapat diganti dengan jeda 30 hari (FR-13).
- Pendaftar dengan email mengisi username di form daftar; akun aktif setelah email diverifikasi (Bagian 4.5).
- Menambahkan lupa password dan reset password lewat tautan email (Bagian 4.5).
- Akun demo hanya dapat dipakai di DEV, atau selama Supabase belum dipasang di lingkungan tersebut (Bagian 4.5).

### Perubahan di Versi 2.21
- Setelah backend tersedia, isi course, lesson, dan soal kuis disimpan di database dan menjadi sumber kebenaran katalog. Halamannya tetap statis dan diperbarui per halaman saat konten diterbitkan (Bagian 6.3, 8.2, FR-16 G).
- Konten yang sudah ada dipindahkan ke database lewat skrip impor. Alur Creator, Reviewer, dan Admin di aplikasi sudah aktif di UAT dan Production saat rilis (FR-15).
- Urutan pembangunan backend: semua aksi selain pembayaran dibangun lebih dulu, dan pembayaran dikerjakan paling akhir (`docs/DATABASE.md` Bagian 10).
- Peran dasar setiap akun bernama `student` dengan label "Pelajar". Membership adalah hak akses, bukan peran (FR-15).
- Progres course dihitung dari progres lesson, tanpa langkah "daftar course" (FR-02).
- Pembayaran memakai Midtrans Snap dengan QRIS dan Virtual Account. Production baru dirilis setelah pembayaran Midtrans siap; simulasi pembayaran tidak pernah aktif di UAT maupun Production (FR-10).
- Email dikirim lewat Resend: email akun dari Supabase Auth dan email transaksi dari antrean di database (Bagian 4.4).
- Lingkungan Supabase: DEV dan UAT memakai paket Free, Production memakai Pro (Bagian 6.3).

### Perubahan di Versi 2.20
- Menetapkan PostgreSQL lewat Supabase di region Singapura, dengan rancangan tabel, indeks, Row Level Security, dan tahapan pembangunan di `docs/DATABASE.md` (Bagian 6.3).
- Menambahkan target performa dan aturan agar situs tetap cepat untuk 1 juta pengguna terdaftar (Bagian 8.2).

### Perubahan di Versi 2.19
- Menambahkan masuk dan daftar dengan Google (Bagian 4.5). Tombol tampil sekarang dengan keterangan "Segera hadir" dan aktif setelah backend Supabase Auth tersedia.

### Perubahan di Versi 2.18
- Popup maintenance untuk pengguna selain Admin yang sudah login, pada tahap Terjadwal dan Persiapan (FR-16 K).
- Mengubah dan membatalkan jadwal maintenance juga mengirim pengumuman ke semua pengguna (FR-16 K).

### Perubahan di Versi 2.17
- Menambahkan Mode Maintenance di Panel Admin: tahap Terjadwal, Persiapan, Aktif, dan Selesai, dengan lama Persiapan yang diatur Admin (FR-16 K).
- Selama maintenance aktif, seluruh situs tertutup dan hanya Admin yang dapat login; Creator dan Reviewer ikut tertutup (FR-16 K).
- Menetapkan perlindungan pekerjaan pengguna: jawaban tersimpan per soal, kiriman tertunda, waktu kuis dibekukan, percobaan tidak dihitung, dan dapat dilanjutkan (FR-16 K).
- Menambahkan entitas MaintenanceWindow (7.27) dan pemeriksaan status maintenance di server (8.3).

### Perubahan di Versi 2.16
- Menambahkan FR-16 Panel Admin: Ringkasan, Konten, Pengguna dan Peran, Kesepakatan Creator, Transaksi dan Hak Akses, Produk Digital, Katalog Belajar, Moderasi, Pengumuman, Laporan, dan Log Aktivitas Admin.
- Seluruh Panel Admin dibangun sekarang dengan data dummy dan hanya tampil di DEV, seperti mode Creator dan Reviewer.
- Tombol Terbitkan terkunci untuk Creator yang belum memiliki kesepakatan tertulis tercatat (FR-15, FR-16).
- Setiap aksi Admin wajib tercatat di Log Aktivitas Admin; akun Admin wajib memakai verifikasi dua langkah saat backend tersedia (8.3).

### Perubahan di Versi 2.15
- Antarmuka lengkap Creator, Reviewer, dan Admin dibangun sekarang dengan data dummy, hanya tampil di DEV; UAT dan Production tetap menampilkan alur Google Docs sampai backend tersedia (FR-15).
- Menetapkan fitur Reviewer (Antrian Review dan Halaman Review) dan Admin (Ringkasan, Semua Konten, Tugaskan Reviewer, Terbitkan dan Tarik, Kelola Peran) (FR-15).
- Reviewer tidak mengedit isi konten secara langsung; perbaikan selalu lewat catatan revisi (FR-15).
- Catatan revisi dinyatakan selesai saat Reviewer menyetujui konten (FR-15).
- Backend memakai Supabase (Auth, Postgres, Storage) (Bagian 6 dan 12).
- Batas upload gambar editor: JPG, PNG, atau WebP, maksimal 2 MB (FR-15).

### Perubahan di Versi 2.14
- Menetapkan aturan penyimpanan mockup yang disetujui di `docs/desain/` (Bagian 13.2).
- Mockup Mode Creator (Konten Saya, Buat Konten, Catatan Revisi) dan kartu video referensi disetujui sebagai acuan visual (FR-15).
- Menegaskan bahwa "Sudah diperbaiki" adalah tanda dari Creator; catatan dinyatakan selesai setelah dikonfirmasi Reviewer (FR-15).

### Perubahan di Versi 2.13
- Menetapkan format isi lesson: teks sebagai format utama; Creator hanya menulis teks (FR-02).
- Lesson dan artikel boleh menyertakan referensi video YouTube sebagai pelengkap, dengan aturan embed, kredit, dan pengecekan Reviewer (FR-02, FR-07, FR-15).
- Video buatan sendiri tidak termasuk rilis awal (Bagian 12).

### Perubahan di Versi 2.12
- Tahap sebelum backend diubah: Creator menulis di Google Docs, bukan lewat GitHub, karena tidak semua Creator memahami GitHub (FR-15).
- Menetapkan rancangan fitur Konten Saya, Buat Konten, dan Catatan Revisi untuk tahap setelah backend, termasuk upload gambar (FR-15).
- Backend diprioritaskan agar Creator dapat menulis langsung di aplikasi.

### Perubahan di Versi 2.11
- Merinci perilaku mode peran: halaman yang menampilkan ajakan beralih mode, mode bawaan saat login, dan pengaturan di mode peran (FR-15).
- Menetapkan standar kontras minimal 4,5:1 dan warna tombol utama di mode gelap (Bagian 8.6, 15.2).

### Perubahan di Versi 2.10
- Tampilan mengikuti mode: Mode Creator, Reviewer, dan Admin tanpa keranjang, membership, serta data pelajar; profil per mode; notifikasi per mode (FR-15, Bagian 4.4).
- Admin juga memiliki Mode Belajar.

### Perubahan di Versi 2.9
- Menambahkan peran Creator, Reviewer, dan Admin beserta alur penerbitan konten (FR-15).
- Sebelum backend tersedia, konten dikelola lewat GitHub (file MDX dan pull request).
- Satu akun dapat memiliki beberapa peran, dengan pengalih mode Belajar dan Creator.

### Perubahan di Versi 2.8
- Menetapkan Blog: dapat dibaca tanpa login, format halaman daftar dan artikel, format konten, status draf, serta SEO (FR-07).
- Daftar 10 artikel rilis awal ditetapkan di `docs/CURRICULUM.md` Bagian 6.

### Perubahan di Versi 2.7
- Menambahkan acuan tampilan notifikasi: ikon dan warna per kelompok, format waktu, dan teks notifikasi membership (Bagian 4.4).

### Perubahan di Versi 2.6
- Menetapkan sistem notifikasi: 5 kelompok, popover lonceng, halaman arsip, tujuan klik, dan preferensi (Bagian 4.4).

### Perubahan di Versi 2.5
- Playground memiliki 4 jenis latihan: Kuis, Bug Hunt, Test Case Writing, dan Locator Challenge, beserta halaman latihan untuk Bug Hunt dan Locator Challenge (FR-04).
- Kuis per course berada di Playground; Playground tidak memiliki forum diskusi.

### Perubahan di Versi 2.4
- Menambahkan test otomatis end-to-end dan quality gate CI (Bagian 13.4).

### Perubahan di Versi 2.3
- Bagian "Rekomendasi untukmu" dihapus dari dashboard (FR-01).

### Perubahan di Versi 2.2
- Menambahkan lingkungan DEV, UAT, dan Production beserta alur rilis (Bagian 13.3).

### Perubahan di Versi 2.1
- Sistem skin diganti menjadi dua koleksi terpisah: **avatar kucing** (beberapa jenis kucing) dan **tema banner** (FR-12).
- Kucing putih tetap maskot resmi brand; pengguna dapat memilih avatar dari beberapa jenis kucing.
- Rilis awal: 5 avatar dan 5 tema banner.
- Menambahkan Profil Pengguna (FR-13) dengan 4 tab dan profil publik.
- Menambahkan Achievement (FR-14) yang hanya ditampilkan di profil dan tidak memberikan XP.
- Rank tidak memiliki level maupun sub-tingkat.
- Menambahkan peran dalam pengembangan dan status mockup desain (Bagian 13).

### Perubahan di Versi 2.0
- **Prinsip utama berubah:** materi dasar gratis, sebagian materi lanjutan menjadi materi premium (1.3, FR-02).
- Membership tiga tingkat: Basic (gratis), Pro, dan Premium, seluruhnya model Lifetime (FR-10).
- Kredit produk: Pro 1 eBook + 1 project, Premium 3 eBook + 3 project (FR-10).
- XP dari materi premium dihitung untuk rank dan leaderboard, dengan syarat rank Master tetap dapat dicapai hanya dari materi gratis (FR-05).
- Skin bertema menjadi benefit Pro dan Premium (FR-12).
- Domain ditetapkan: www.belajarautomation.com.
- Menambahkan brand guideline, karakter pendamping, prinsip kualitas konten, dan arah pemasaran (Bagian 15–17).

### Perubahan di Versi 1.10
- Leaderboard hanya memiliki 2 tab: Global dan tab rank pengguna sendiri, berlabel nama rank beserta emblemnya. Periode Mingguan dan Sepanjang Waktu dihapus; peringkat menggunakan total XP (FR-06).

### Perubahan di Versi 1.8
- Daftar course, level, target lesson, dan urutan roadmap dirinci di `docs/CURRICULUM.md` (FR-02, FR-03).
- Menambahkan status konten course (`ready`/`draft`); course yang tersedia saat rilis wajib berstatus ready (FR-02).
- Satu course dapat memiliki lebih dari satu bahasa pemrograman (FR-02).
- Penyelesaian roadmap dihitung dari node wajib yang sudah tersedia (FR-03).
- Kategori Security Testing dicadangkan dan tidak ditampilkan di filter sampai ada course-nya (FR-02).

### Perubahan di Versi 1.7
- Desain emblem rank ditetapkan: tameng klasik dengan cap kaki kucing, jumlah bintang bertahap, dan ornamen sayap daun (FR-05).

### Perubahan di Versi 1.6
- Kutipan motivasi dihapus dari Welcome Banner (FR-01).
- Ajakan "Tidak tahu mulai dari mana?" menuju Roadmap ditempatkan di bagian atas halaman Belajar (FR-02).
- Filter Learning Center dirapikan: satu baris kategori, panel filter tambahan, dan filter tersimpan di URL (FR-02).
- Sumber XP, nilai awal XP, dan batas XP rank ditetapkan sebagai konfigurasi awal (FR-05).
- Leaderboard menggunakan periode Mingguan dan Sepanjang Waktu, 50 teratas, posisi pengguna disematkan, dan opsi privasi (FR-06).

### Perubahan di Versi 1.5
- Emblem rank menggunakan bentuk tameng yang sederhana, menggantikan permata (FR-05).
- Data pengguna dummy diperbolehkan selama tahap pengembangan tanpa database, dengan syarat dikelola terpusat dan dihapus sebelum rilis.

### Perubahan di Versi 1.4
- Emblem rank tidak lagi memakai maskot; setiap rank menggunakan emblem tameng sesuai warna identitas rank (FR-05).
- Maskot kucing digunakan untuk halaman profil, foto profil (avatar), karakter di dashboard, dan latar belakang Welcome Banner (FR-12).
- Rilis awal menyediakan 5 skin: Basic Cat (gratis) dan 4 skin Premium (FR-12).

### Perubahan di Versi 1.3
- Rank dan skin dipisahkan menjadi dua sistem: emblem rank adalah maskot yang berevolusi sesuai rank, sedangkan skin adalah kostum bertema yang dapat dipilih bebas (FR-05, FR-12).
- Skin tidak lagi terikat pada rank; skin Basic gratis, skin bertema lainnya melalui Premium.
- Tema skin berlaku di dalam Welcome Banner, termasuk latar, ornamen, dan warna aksen banner; bagian website lainnya tetap biru dan putih.
- Skin tidak boleh memakai kombinasi warna identitas rank.
- Emblem rank dan leaderboard tidak dipengaruhi skin.

### Perubahan di Versi 1.2
- Menambahkan maskot kucing putih sebagai identitas karakter platform (FR-12).
- Emblem rank dibuat dari maskot yang berevolusi sesuai rank (FR-05).
- Menambahkan sistem skin maskot: skin Basic gratis, skin lainnya melalui Premium (FR-12).
- Skin aktif ditampilkan pada Welcome Banner dashboard (FR-01).
- Warna website ditetapkan biru dan putih; pengguna hanya memilih mode terang atau gelap.
- Benefit Premium "tema visual" dan "warna aksen tambahan" diganti dengan akses skin maskot (FR-10).

---

# 1. Ringkasan Produk

## 1.1 Deskripsi Produk

BelajarAutomation.com adalah platform pembelajaran digital yang berfokus pada Software Quality Assurance (QA), Software Testing, QA Automation, dan Programming.

Platform ini dirancang untuk membantu pengguna mempelajari materi secara terstruktur, menguji pemahaman melalui kuis dan challenge, membangun keterampilan praktis, serta memantau perkembangan belajar melalui sistem XP dan rank.

BelajarAutomation menggabungkan tiga pendekatan utama:

1. **Learn** — mempelajari materi secara mandiri.
2. **Practice** — menguji pemahaman melalui kuis dan challenge.
3. **Build** — menerapkan pengetahuan melalui proyek praktis.

Platform menggunakan gamifikasi untuk meningkatkan motivasi belajar tanpa menjadikan pembayaran sebagai cara membeli rank.

Website: **www.belajarautomation.com**

## 1.2 Visi Produk

Menjadi platform pembelajaran QA dan Automation yang membantu siapa pun membangun keterampilan teknis secara bertahap, terarah, dan terjangkau.

## 1.3 Prinsip Utama

> Belajar dasar secara gratis, berkembang secara adil, dan membayar untuk materi lanjutan serta benefit tambahan yang jelas.

Penjelasan:
- Pengguna Basic (gratis) tetap dapat belajar dari dasar, mengikuti roadmap, berlatih, mengumpulkan XP, dan mencapai rank tertinggi.
- Membership berbayar memberikan akses materi premium dan benefit tambahan, tetapi tidak membeli rank secara langsung.
- Rank menunjukkan perkembangan belajar; membership menunjukkan benefit yang dimiliki. Keduanya terpisah.

Prinsip ini menjadi dasar pengambilan keputusan terkait fitur, monetisasi, gamifikasi, dan akses pengguna.

## 1.4 Tujuan Produk

- Menyediakan materi QA dan Programming dalam satu platform.
- Membantu pengguna menemukan materi sesuai kebutuhan dan minat.
- Menyediakan latihan berbasis kuis dan challenge.
- Memberikan indikator perkembangan belajar melalui XP, rank, dan statistik.
- Menyediakan produk digital berupa eBook dan proyek praktis.
- Menyediakan membership Basic, Pro, dan Premium dengan model Lifetime dan benefit yang transparan.
- Membangun komunitas pembelajar QA Automation.
- Membangun identitas platform yang mudah dikenali melalui maskot kucing putih.
- Membangun fondasi platform yang dapat dikembangkan tanpa harus merombak arsitektur secara keseluruhan.

## 1.5 Target Pengguna

### A. Beginner
Pengguna yang baru mempelajari software testing atau programming.

### B. Aspiring QA Engineer
Pengguna yang ingin memulai karier di bidang QA.

### C. Manual QA Engineer
Pengguna yang ingin meningkatkan kemampuan pengujian manual.

### D. QA Automation Engineer
Pengguna yang ingin mempelajari dan memperdalam automation testing.

### E. Software Developer
Pengguna yang ingin meningkatkan kemampuan programming dan memahami kualitas perangkat lunak.

### F. Career Switcher
Pengguna yang ingin beralih ke bidang QA, automation, atau programming.

---

# 2. Struktur Navigasi Utama

Navigasi utama platform terdiri dari:

1. Dashboard
2. Belajar
3. Roadmap
4. Playground
5. Leaderboard
6. Blog
7. eBook
8. Project
9. Career — tahap pengembangan berikutnya
10. Membership

Struktur navigasi harus konsisten di seluruh halaman.

## 2.1 Navigasi Pendukung

Fitur berikut tersedia melalui elemen antarmuka yang sesuai, bukan sebagai menu utama tambahan di sidebar:

- Profil pengguna.
- Pengaturan akun.
- Preferensi tampilan (mode terang/gelap).
- Pemilihan avatar kucing dan tema banner.
- Notifikasi.

Header dapat menyediakan tombol untuk menyembunyikan atau menampilkan sidebar, kontrol mode terang/gelap, notifikasi, dan avatar pengguna.

Fitur pencarian global di header tidak menjadi prioritas desain saat ini. Pencarian materi ditempatkan pada halaman Belajar.

---

# 3. Functional Requirements

## FR-01 — Dashboard

### Tujuan
Memberikan gambaran ringkas mengenai aktivitas belajar dan perkembangan pengguna.

### Komponen utama

**A. Header**
- Tombol toggle sidebar.
- Kontrol mode terang/gelap.
- Notifikasi.
- Avatar kucing aktif pengguna.

**B. Welcome Banner**
- Sapaan kepada pengguna.
- Deskripsi singkat platform.
- Latar banner sesuai tema banner aktif pengguna (FR-12).
- Welcome Banner tidak menampilkan avatar; avatar aktif tetap tampil di header, profil, dan leaderboard.
- Pengguna baru melihat tema gratis bawaan (Padang Rumput).

Ketentuan Welcome Banner:
- Tema banner hanya berlaku di Welcome Banner, banner sampul halaman fitur (FR-12), dan banner profil; bagian website lainnya mengikuti brand guideline.
- Struktur konten banner (tagline, sapaan, deskripsi) dan posisinya tetap sama di semua tema.
- Welcome Banner tidak menampilkan kutipan motivasi.
- Teks banner harus tetap terbaca dengan kontras memadai pada semua tema, di mode terang maupun gelap.

**C. Rank & XP**
- Emblem tameng rank saat ini (lihat FR-05). Emblem tidak dipengaruhi avatar atau tema.
- Nama rank.
- Total XP.
- Progress menuju rank berikutnya.
- Persentase progress.
- Informasi rank berikutnya.
- Tombol "Lihat detail rank" menuju halaman Rank & XP (FR-05).
- Latar kartu berupa gradasi warna identitas rank saat ini (FR-05) di atas dasar gelap, sehingga kartu ikut berubah saat naik rank. Teks tetap terbaca dengan kontras memadai di semua rank.

**D. Kalender Belajar**
- Tampilan kalender bulanan.
- Navigasi bulan sebelumnya dan berikutnya.
- Penanda tanggal aktivitas belajar.
- Akses ke riwayat aktivitas belajar.

Kalender harus menampilkan data aktivitas yang benar-benar tersimpan. Kalender tidak boleh menampilkan aktivitas seolah-olah sudah terjadi apabila datanya belum tersedia.

**E. Statistik Belajar**

Empat kartu statistik:
- Total XP.
- Materi Selesai.
- Challenge Selesai.
- Streak Belajar.

**F. Lanjutkan Belajar**
- Menampilkan materi atau modul terakhir yang dipelajari.
- Menampilkan progress materi.
- Menyediakan tombol untuk melanjutkan belajar.
- Dapat menggunakan carousel jika terdapat beberapa materi relevan.

### Aturan
- Dashboard harus responsif.
- Informasi berasal dari data pengguna.
- Jika data belum tersedia, tampilkan empty state yang informatif.
- Jangan menggunakan angka dummy seolah-olah merupakan data pengguna sebenarnya di lingkungan produksi.
- Selama tahap pengembangan tanpa database, data pengguna dummy boleh digunakan untuk keperluan desain dan demo, dengan syarat dikelola di satu tempat (misalnya satu file data dummy) sehingga mudah diganti dengan data asli, dan wajib dihapus sebelum rilis.

---

## FR-02 — Learning Center (Belajar)

### Tujuan
Menjadi pusat katalog seluruh materi pembelajaran.

### Fitur utama

**Ajakan Roadmap**
- Bagian atas halaman Belajar, di antara header dan filter, menampilkan ajakan "Tidak tahu mulai dari mana?". Ajakan tertutup secara bawaan: hanya satu baris berisi ikon, teks ajakan, dan ikon panah bawah. Menekannya membuka penjelasan singkat dan tombol "Lihat Roadmap" menuju halaman Roadmap; menekannya lagi menutup kembali.
- Ajakan ini ringkas agar katalog course tetap terlihat tanpa banyak scroll.

**A. Pencarian Materi**
- Pengguna dapat mencari berdasarkan judul materi.
- Pencarian dapat diperluas ke deskripsi, kategori, dan teknologi.

**B. Filter dan Kategori**
Contoh kategori:
- Fundamental.
- Manual Testing.
- Web Automation.
- Mobile Testing.
- API Testing.
- Performance Testing.
- Security Testing.
- Programming.

Kategori dapat berkembang sesuai kebutuhan konten. Kategori saat ini juga mencakup AI dan Low-Code. Kategori yang belum memiliki course (saat ini Security Testing) tidak ditampilkan di filter.

Daftar lengkap course, kategori, bahasa, level, dan target lesson ditetapkan di `docs/CURRICULUM.md`.

**Status course:**
- Status katalog: `available` (dapat dipelajari) atau `coming-soon` (tampil dengan badge Segera hadir, halaman detail tetap dapat dibuka).
- Status konten: `ready` (seluruh lesson sudah ditulis dan ditinjau) atau `draft`.
- Tingkat akses: `free` atau `premium`.
- Sebelum rilis, setiap course `available` wajib berstatus `ready`; course yang belum siap diubah menjadi `coming-soon`.
- Satu course dapat memiliki lebih dari satu bahasa pemrograman, dan filter bahasa menampilkan course yang memuat bahasa tersebut.

Ketentuan tampilan filter:
- Kategori ditampilkan dalam satu baris chip; di layar kecil dapat digeser horizontal.
- Filter tambahan (bahasa pemrograman, tingkat kesulitan, status) ditempatkan di panel "Filter": sheet di mobile, dropdown atau panel di desktop.
- Tersedia toggle "Hanya yang tersedia" untuk menyembunyikan course berstatus Segera hadir.
- Jumlah hasil ditampilkan, beserta tombol untuk mereset semua filter.
- Pencarian dan filter aktif tersimpan di URL agar dapat dibagikan dan tetap ada saat pengguna kembali dari halaman detail.
- Jika tidak ada hasil, tampilkan empty state dengan tombol reset filter.

**C. Daftar Materi**
Setiap kartu materi dapat menampilkan:
- Sampul atau thumbnail.
- Judul materi.
- Kategori.
- Deskripsi singkat.
- Jumlah modul.
- Estimasi waktu belajar.
- Tingkat kesulitan.
- Progress pengguna, jika tersedia.
- Tombol untuk membuka materi.

**D. Detail Materi**
Halaman detail dapat menampilkan:
- Deskripsi lengkap.
- Tujuan pembelajaran.
- Prasyarat.
- Daftar modul.
- Estimasi waktu.
- Tingkat kesulitan.
- Progress belajar.
- Tombol mulai atau lanjutkan belajar.

**E. Modul Pembelajaran**
- Materi disusun menjadi modul.
- Pengguna dapat berpindah antarbagian.
- Status penyelesaian modul disimpan.
- Progress diperbarui berdasarkan aktivitas yang valid.

**F. Format isi lesson**
Teks adalah format utama lesson. Creator hanya menulis teks; platform tidak memproduksi video sendiri pada rilis awal.

Isi lesson dapat memuat:
- Teks dengan heading.
- Blok kode yang dapat disalin.
- Gambar, screenshot, atau GIF dengan teks alternatif dan keterangan.
- Kotak Tips dan Peringatan.
- Tabel.
- Kuis singkat di akhir lesson (opsional).
- Referensi video YouTube (opsional).

**G. Referensi video YouTube**
Video dari YouTube boleh disertakan sebagai bahan pelengkap, terutama untuk materi yang butuh demo visual (instalasi tool, demo antarmuka, debugging).

Aturan:
- Lesson wajib dapat dipelajari lengkap tanpa video. Jika video dihapus atau dijadikan privat, lesson tetap utuh.
- Video hanya ditampilkan melalui embed resmi YouTube atau tautan. Video orang lain tidak boleh diunduh lalu diunggah ulang.
- Video yang pemiliknya menonaktifkan embed hanya ditampilkan sebagai tautan.
- Setiap video mencantumkan judul asli dan nama channel sebagai kredit.
- Maksimal 3 video per lesson, ditempatkan di bagian "Referensi Video" atau tepat di bawah bagian yang dijelaskan.
- Video berbahasa Indonesia diutamakan; video berbahasa lain diberi label bahasa.
- Kartu video menampilkan judul, nama channel, durasi, dan bahasa.

Ketentuan teknis:
- Mode klik untuk memutar: awalnya hanya thumbnail yang tampil, dan player YouTube baru dimuat saat diklik.
- Embed memakai domain `youtube-nocookie.com`.
- Pengecekan link berkala mendeteksi video yang dihapus, dijadikan privat, atau tidak dapat di-embed, lalu melaporkannya ke Admin untuk diganti atau dihapus.

### Aturan akses
Setiap course memiliki tingkat akses:
- **Gratis:** dapat dipelajari semua pengguna, termasuk Basic.
- **Premium:** dapat dipelajari pengguna Pro dan Premium yang memiliki hak akses ke course tersebut.

Ketentuan:
- Materi dasar dan fondasi wajib tersedia gratis, sehingga pengguna Basic tetap dapat belajar dari nol dan menuntaskan jalur belajar dasar.
- Daftar course gratis dan premium ditetapkan di `docs/CURRICULUM.md`.
- Pengguna Basic tetap dapat melihat katalog, sampul, deskripsi, daftar modul, dan cuplikan course premium, dengan penanda "Premium" dan ajakan untuk upgrade.
- Hak akses course premium mengikuti model Lifetime di FR-10: pengguna memperoleh akses permanen ke materi premium yang tersedia pada saat pembelian.
- Course yang sudah dinyatakan gratis tidak boleh diubah menjadi premium bagi pengguna yang sudah mulai mempelajarinya.
- Hak akses course premium diverifikasi oleh backend.
- Tidak ada langkah "daftar course". Course dianggap dimulai saat pengguna membuka lesson pertamanya, dan progres course dihitung dari progres lesson.

Pengguna Basic tidak harus membayar untuk:
- Mempelajari course gratis.
- Mengikuti kuis dan challenge pada course gratis.
- Mendapatkan XP yang valid.
- Menaikkan rank hingga Master.

---

## FR-03 — Roadmap

### Tujuan
Memberikan jalur belajar terstruktur agar pengguna memahami urutan materi yang perlu dipelajari.

Roadmap bukan pengganti Learning Center. Roadmap berfungsi sebagai panduan, sedangkan materi tetap dibuka dan dipelajari melalui halaman Belajar.

### Daftar jalur awal

1. Fundamental.
2. QA Manual Engineer.
3. QA Automation Web.
4. QA Automation Mobile.
5. API Test Engineer.
6. Programming.

Jalur QA Automation Smartwatch dan jalur QA Automation Engineer tersendiri tidak termasuk dalam scope awal yang telah disepakati.

### Struktur Roadmap

Setiap jalur memiliki:

**A. Informasi Jalur**
- Nama jalur.
- Deskripsi.
- Tujuan pembelajaran.
- Skill yang akan dipelajari.
- Materi prasyarat.

**B. Visualisasi Jalur**
- Materi disusun sebagai rangkaian node.
- Node dihubungkan dengan garis untuk memperlihatkan urutan belajar.
- Materi dapat memiliki hubungan prasyarat.
- Status materi dapat dibedakan menjadi belum dimulai, sedang dipelajari, selesai, atau terkunci karena prasyarat.

**C. Aksi Materi**
Setiap node memiliki tombol **Lihat Materi** yang mengarahkan pengguna ke halaman materi terkait di Learning Center.

**D. Skill yang Dipelajari**
Daftar kompetensi yang ditargetkan dari jalur tersebut.

### Ketentuan desain
- Visualisasi menggunakan garis dan node materi.
- Tidak menggunakan tampilan roadmap yang hanya berupa kumpulan kartu tanpa hubungan antar-materi.
- Informasi jalur dan skill ditempatkan sebelum visualisasi roadmap.
- Bagian progress roadmap bukan fokus utama desain awal.
- Rekomendasi materi terpisah dari visualisasi jalur.

### Aturan
- Roadmap membantu pengguna memilih urutan belajar.
- Pengguna tetap dapat membuka katalog Learning Center secara langsung.
- Status roadmap tidak boleh mengunci seluruh materi gratis secara sewenang-wenang.
- Hubungan prasyarat harus didefinisikan oleh pengelola konten.
- Setiap node roadmap wajib terhubung ke satu course di katalog; urutan roadmap ditetapkan di `docs/CURRICULUM.md`.
- Roadmap dapat memiliki cabang (memilih salah satu jalur) dan node opsional.
- Penyelesaian roadmap dihitung dari node wajib berstatus `available` pada jalur yang dipilih. Node opsional dan node `coming-soon` tidak menghalangi roadmap dianggap tuntas; setelah course tersebut dirilis, course itu ikut diperhitungkan.

---

## FR-04 — Playground

### Tujuan
Menyediakan tempat untuk menguji pemahaman melalui kuis dan challenge.

### Konsep utama
Kuis dan challenge berada dalam satu pengalaman latihan. Keduanya tidak perlu menjadi menu utama yang terpisah.

### Daftar latihan

Pengguna dapat melihat daftar latihan yang memuat:
- Judul latihan.
- Kategori.
- Topik.
- Tingkat kesulitan.
- Jumlah soal.
- Estimasi waktu.
- Status latihan.
- Nilai atau hasil sebelumnya, jika tersedia.

### Jenis latihan

| Jenis | Bentuk | Penilaian | XP (penyelesaian pertama) |
|---|---|---|---|
| **Kuis** | 5–10 soal pilihan ganda tentang satu course | Otomatis; lulus jika skor minimal 70% | 30 XP (kuis lulus) |
| **Bug Hunt** | Pengguna menjelajahi halaman latihan yang sengaja berisi bug, lalu menandai bug yang ditemukan dari daftar pilihan | Otomatis; dicocokkan dengan daftar bug yang sudah ditentukan; lulus jika seluruh bug ditemukan tanpa salah tandai melebihi batas | 75 XP |
| **Test Case Writing** | Pengguna menulis test case untuk sebuah fitur berdasarkan deskripsi kebutuhan | Self-check: setelah mengirim, pengguna membandingkan jawabannya dengan contoh jawaban dan checklist, lalu mencentang poin yang terpenuhi; lulus jika poin wajib terpenuhi | 75 XP |
| **Locator Challenge** | Pengguna menulis selector CSS atau XPath untuk elemen tertentu di halaman latihan | Otomatis; selector dijalankan di halaman latihan dan lulus jika tepat mengenai elemen target saja | 75 XP |

Ketentuan:
- Kuis per course ditempatkan di Playground, bukan di akhir lesson, agar semua latihan terkumpul di satu tempat.
- Penilaian penulisan kode yang dijalankan di server (mis. menjalankan test Playwright milik pengguna) tidak termasuk rilis awal karena membutuhkan sandbox yang aman.

### Halaman latihan
- Bug Hunt dan Locator Challenge memakai halaman latihan berupa aplikasi tiruan di dalam BelajarAutomation, misalnya form login dan halaman checkout.
- Halaman latihan diberi tanda jelas sebagai halaman latihan, bukan fitur sungguhan.
- Practice Site yang lengkap, yang juga dapat diotomasi pengguna dari komputer mereka sendiri, direncanakan untuk fase berikutnya.

### Alur pengerjaan

1. Pengguna memilih latihan.
2. Sistem menampilkan informasi latihan: jenis, course terkait, tingkat kesulitan, jumlah soal, dan estimasi waktu.
3. Pengguna memulai sesi.
4. Pengguna mengerjakan seluruh soal atau tugas.
5. Pengguna mengirim jawaban.
6. Sistem memvalidasi jawaban.
7. Sistem menampilkan skor atau hasil, lalu pembahasan. Pada Kuis, pembahasan ditampilkan setelah seluruh soal dikirim, bukan per soal.
8. XP diberikan jika lulus dan merupakan penyelesaian pertama.
9. Hasil tersimpan pada riwayat aktivitas pengguna.

### Aturan
- Jumlah soal ditentukan oleh konfigurasi latihan.
- Tidak semua latihan harus memiliki komposisi soal yang sama.
- Mengulang latihan diperbolehkan, tetapi tidak memberikan XP lagi.
- Soal, kunci jawaban, daftar bug, dan hasil penilaian diproses di server dan tidak dikirim ke browser sebelum jawaban dikirim.
- Latihan yang terkait course gratis dapat diakses semua pengguna. Latihan yang terkait course premium mengikuti hak akses course tersebut.
- Playground tidak memiliki forum diskusi.

### Batas waktu

| Jenis latihan | Batas waktu |
|---|---|
| Kuis (pilihan ganda) | 15 menit |
| Bug Hunt | 30 menit |
| Test Case Writing | 30 menit |
| Locator Challenge | 30 menit |

- Waktu mulai berjalan saat halaman latihan dibuka dan tetap berjalan bila halaman dimuat ulang atau ditinggalkan.
- Sisa waktu ditampilkan dalam format menit:detik, menempel di bagian atas saat halaman digulir. Satu menit terakhir ditandai warna merah dan alert "Sisa waktu 1 menit."
- Saat waktu habis, jawaban yang sudah diisi langsung dikirim dan dinilai seperti biasa, disertai alert "Waktu habis. Jawabanmu dikirim otomatis."
  - Kuis: soal yang belum dijawab dihitung salah dan tampil "Tidak dijawab" di pembahasan.
  - Bug Hunt: temuan yang sudah dicentang dikirim.
  - Locator Challenge: selector yang tertulis dikirim; selector kosong atau tidak valid dinilai tidak mengenai elemen apa pun.
  - Test Case Writing: batas waktu hanya untuk menulis jawaban. Jawaban yang tertulis dikirim, lalu penilaian mandiri dengan checklist dikerjakan tanpa batas waktu.
- Mengulang latihan memulai waktu penuh dari awal.
- Pengerjaan yang waktunya habis tanpa jawaban tersimpan dimulai ulang saat dibuka kembali, bukan dikirim kosong.
- Waktu berhenti selama maintenance Aktif (FR-16 K).

### Konten awal
- Tahap pengembangan memakai 10 latihan dummy: 4 Kuis, 2 Bug Hunt, 2 Test Case Writing, dan 2 Locator Challenge, yang terhubung ke course yang tersedia.
- Target saat rilis: minimal satu Kuis untuk setiap course yang tersedia.

---

## FR-05 — Gamification: XP dan Rank

### Tujuan
Memberikan indikator perkembangan belajar yang konsisten dan memotivasi.

### Daftar rank awal

1. Trainee.
2. Apprentice.
3. Practitioner.
4. Specialist.
5. Expert.
6. Master.

Setiap rank memiliki identitas visual atau emblem tersendiri.

### Emblem rank berbasis tameng
Setiap rank menggunakan emblem tameng klasik dengan warna sesuai identitas rank. Emblem rank tidak menggunakan ilustrasi maskot; keterkaitan dengan maskot ditunjukkan melalui simbol cap kaki kucing.

Desain yang disepakati (gaya "Perisai Klasik — Elegan & Profesional"):

| Rank | Warna tameng | Simbol tengah | Bintang | Ornamen |
|---|---|---|---|---|
| Trainee | Bronze/oranye | Cap kaki kucing | 1 | Sayap daun bronze, permata kecil di ujung bawah |
| Apprentice | Silver | Cap kaki kucing | 2 | Sayap daun silver, permata kecil di ujung bawah |
| Practitioner | Gold | Cap kaki kucing | 3 | Sayap daun gold, permata kecil di ujung bawah |
| Specialist | Emerald | Cap kaki kucing | 4 | Sayap daun emerald, permata kecil di ujung bawah |
| Expert | Purple | Cap kaki kucing | 5 | Sayap daun ungu, permata kecil di ujung bawah |
| Master | Crimson dengan aksen gold | Cap kaki kucing | Rangkaian bintang gold melengkung | Sayap daun gold yang lebih besar, permata merah di ujung bawah |

Ketentuan emblem:
- Bentuk tameng, posisi cap kaki, dan komposisi ornamen konsisten di seluruh rank sehingga terasa sebagai satu set.
- Jumlah bintang menjadi penanda tingkat selain warna, agar rank tetap dapat dibedakan oleh pengguna dengan keterbatasan membedakan warna.
- Master menjadi satu-satunya rank dengan tameng crimson dan ornamen gold dominan.
- Aset emblem disimpan per rank dengan latar transparan dan tanpa teks; nama rank ditampilkan oleh aplikasi.
- Tersedia dua varian ukuran:
  - Varian penuh (tameng, cap kaki, bintang, ornamen) untuk ukuran 48px ke atas, misalnya kartu Rank & XP dan profil.
  - Varian ringkas (tameng dan cap kaki, dengan atau tanpa bintang) untuk ukuran kecil sekitar 24–32px, misalnya baris leaderboard, agar tetap terbaca.
- Aset emblem dioptimalkan ukurannya (SVG, atau PNG/WebP terkompresi sesuai ukuran tampil).
- Emblem rank sama untuk semua pengguna di rank yang sama, apa pun tingkat membership-nya, dan tidak berubah karena avatar atau tema.

### Identitas visual
- Trainee: bronze/oranye.
- Apprentice: silver.
- Practitioner: gold.
- Specialist: emerald green.
- Expert: purple.
- Master: crimson red dengan aksen gold.

Warna dan emblem rank merupakan identitas tetap. Mengubah mode terang/gelap, avatar, atau tema tidak boleh mengubah emblem maupun warna identitas rank.

### Sistem XP

XP diberikan atas aktivitas belajar yang valid, misalnya:
- Menyelesaikan materi sesuai aturan.
- Menyelesaikan kuis yang memenuhi syarat.
- Menyelesaikan challenge yang telah divalidasi.

Nilai XP dan batas rank dikelola melalui konfigurasi sistem. Nilai awal yang disepakati:

| Aktivitas | XP |
|---|---|
| Menyelesaikan seluruh lesson dalam satu modul | 10 |
| Bonus menyelesaikan seluruh lesson dalam satu course | 50 |
| Lulus kuis | 30 |
| Menyelesaikan challenge yang tervalidasi | 75 |

XP hanya diberikan saat aktivitas tersebut diselesaikan pertama kali. Pengguna boleh mengulang lesson, kuis, atau challenge tanpa memperoleh XP lagi.

Menyelesaikan satu lesson tidak memberi XP sendiri. XP materi diberikan per modul, agar kenaikan rank mencerminkan penguasaan satu topik utuh dan tidak terlalu cepat.

### Aturan penyelesaian aktivitas

| Aktivitas | Dianggap selesai saat | XP | Catatan |
|---|---|---|---|
| Lesson | Pengguna mengklik "Berikutnya" ke lesson selanjutnya. Pada lesson terakhir course, pengguna menekan "Selesaikan course" | 0 | Hanya tercatat bila isi lesson sudah digulir sampai akhir; navigasi tetap bisa dipakai kapan saja, dengan keterangan bila lesson belum tercatat. Lesson yang belum punya isi tidak bisa diselesaikan. Lesson selesai tetap dihitung di statistik "Materi selesai" dan tampil di riwayat aktivitas tanpa XP. |
| Modul | Seluruh lesson dalam modul selesai, dalam urutan apa pun | 10 | Diberikan otomatis bersama lesson terakhir modul yang diselesaikan. Tombol "Berikutnya" pada lesson yang menuntaskan modul menampilkan XP yang akan diperoleh. Pengguna melihat pemberitahuan "Modul [nama] selesai, +10 XP." dan riwayat aktivitas mencatat "Modul selesai". |
| Course | Seluruh lesson dalam course selesai | 50 (bonus) | Diberikan otomatis bersama lesson terakhir yang diselesaikan. Pengguna melihat pemberitahuan "Course [nama] tuntas!", lalu kembali ke halaman course. |
| Kuis | Lulus dengan skor minimal 70% | 30 | Percobaan tidak dibatasi. |
| Bug Hunt dan Locator Challenge | Lulus penilaian otomatis | 75 | Percobaan tidak dibatasi. |
| Test Case Writing | Semua poin wajib checklist tercentang | 0 | Dinilai sendiri oleh pengguna sehingga tidak tervalidasi; tetap terhitung sebagai challenge selesai. |

Ketentuan perhitungan:
- **Total XP** adalah jumlah seluruh XP yang pernah diperoleh. Setiap aktivitas hanya dapat memberi XP satu kali, termasuk bila jawaban dikirim berulang.
- **Materi selesai** adalah jumlah lesson yang sudah ditandai selesai.
- **Challenge selesai** adalah jumlah kuis dan challenge yang pernah lulus, masing-masing dihitung sekali.
- **Rank** ditentukan dari total XP sesuai tabel batas XP rank di bawah.
- XP dihitung dan dicatat oleh server setelah jawaban dinilai. Browser tidak menentukan jumlah XP.
- Saat total XP melewati batas rank yang belum pernah dirayakan, aplikasi menampilkan popup perayaan di halaman mana pun yang sedang dibuka, termasuk bila XP bertambah dari perangkat lain atau koreksi Admin. Popup tampil sekali per rank dan menambah notifikasi "Naik rank ke [nama rank]" di kelompok Progres.
  - Isi: logo, ilustrasi perayaan, label "Rank Up!", "Selamat! Kamu telah naik ke rank", nama rank, rank berikutnya beserta batas XP-nya (rank tertinggi memakai pesan khusus), tombol "Lihat Progress Rank" (halaman Rank & XP) dan "Lanjut Belajar" (menutup popup).
  - Tampilan meriah: confetti, sinar berputar dan cahaya berwarna identitas rank, emblem yang muncul memantul, dan bintang berkelip. Seluruh animasi nonaktif bila pengguna memilih mengurangi animasi di perangkatnya.
  - Ilustrasi perayaan berupa kucing dengan tameng rank, dibuat pemilik produk per rank di `public/rank-up/<rank>.webp` (Apprentice sampai Master), persegi, latar transparan, tanpa teks. Ilustrasi ini khusus popup perayaan dan terpisah dari emblem rank; emblem di dashboard, profil, dan leaderboard tetap tameng tanpa maskot. Selama ilustrasi belum tersedia, popup memakai emblem rank.
  - Perangkat yang baru pertama kali dibuka mencatat rank saat ini tanpa menampilkan popup.
  - Tombol bagikan di pojok kanan atas membuka tampilan "Bagikan Pencapaian": kartu PNG 1080×1080 berisi logo, ilustrasi, "Rank Up!", nama tampilan, rank baru, username, dan total XP. Kartu dapat diunduh, dibagikan lewat menu bawaan perangkat bila didukung, dan tautan profil dapat dibagikan ke WhatsApp, X, Facebook, LinkedIn, Telegram, atau disalin. Kartu hanya memuat data publik.
- Hingga hak akses membership tersambung ke backend, XP dari course premium belum dicatat untuk akun sungguhan.

### Batas XP rank
| Rank | Minimal XP | Gambaran pencapaian |
|---|---|---|
| Trainee | 0 | Baru mulai belajar |
| Apprentice | 300 | Menyelesaikan roadmap Fundamental |
| Practitioner | 900 | Menyelesaikan satu roadmap lengkap |
| Specialist | 1.900 | Menyelesaikan sekitar dua roadmap |
| Expert | 3.100 | Menyelesaikan sebagian besar jalur automation |
| Master | 4.400 | Menyelesaikan hampir seluruh konten dan challenge |

Batas ini dihitung dari perkiraan total XP konten yang direncanakan (sekitar 5.300 XP dengan XP materi per modul: sekitar 77 modul, 25 bonus course, serta kuis dan challenge) dan wajib ditinjau ulang setiap kali jumlah konten atau pembagian course gratis dan premium berubah, agar rank Master tetap dapat dicapai hanya dari konten gratis. Master membutuhkan sekitar 84% dari total XP konten.

Perubahan aturan XP untuk akun yang sudah ada:
- Saat aturan XP berubah dari per lesson ke per modul (v2.47), XP akun lama disesuaikan lewat transaksi koreksi baru: koreksi negatif sebesar seluruh XP lesson lama, ditambah XP untuk setiap modul yang seluruh lesson-nya sudah selesai. Riwayat XP lama tidak diubah atau dihapus.
- Penyesuaian dicatat di riwayat aktivitas sebagai "Penyesuaian aturan XP per modul" dan hanya terjadi sekali per akun.
- Rank yang sudah dirayakan tidak dirayakan ulang. Bila total XP turun di bawah batas rank sebelumnya, rank mengikuti total XP yang baru.

### Halaman Rank & XP
- Alamat `/rank`, dibuka dari kartu Rank & XP di dashboard dan dari tautan "Lihat tingkatan rank" di kartu posisi leaderboard.
- Berisi **Tingkatan Rank**: enam rank berjajar dari Trainee ke Master dengan emblem, minimal XP, gambaran pencapaian, dan status (Rank kamu dengan progres, Tercapai, atau XP yang masih dibutuhkan).
- Berisi **Cara Mendapatkan XP**: daftar aktivitas dan XP-nya, serta ketentuan XP hanya diberikan sekali per aktivitas.
- Memiliki tombol "Lihat leaderboard".
- Halaman khusus Mode Belajar; di mode peran menampilkan ajakan beralih mode (FR-15).

### Progress Rank
Sistem menampilkan:
- Total XP.
- Rank saat ini.
- XP yang dibutuhkan untuk rank berikutnya.
- Progress menuju rank berikutnya.

### Anti-abuse
- XP tidak boleh diperoleh hanya dengan mengulang aksi tanpa batas.
- Transaksi XP harus dapat dilacak.
- Pengiriman jawaban berulang harus divalidasi.
- Perubahan XP tidak boleh dipercayakan hanya kepada frontend.
- Aktivitas yang sudah dihitung harus dapat dideteksi.

### XP dari materi premium
- Course dan latihan premium memberikan XP dengan aturan yang sama seperti materi gratis.
- **Batas XP setiap rank, termasuk Master, wajib dapat dicapai hanya dari materi dan latihan gratis.** Saat menghitung atau meninjau batas rank, gunakan total XP dari konten gratis sebagai acuan.
- Konsekuensi yang disadari: pengguna Pro dan Premium memiliki lebih banyak sumber XP sehingga dapat naik rank lebih cepat. Hal ini diterima selama pengguna Basic tetap dapat mencapai rank tertinggi.

### Prinsip keadilan
- Semua tingkat membership menggunakan aturan XP yang sama per aktivitas.
- Pembelian membership, eBook, atau project tidak memberikan XP secara langsung.
- Membership tidak memberikan bonus XP, pengganda XP, atau rank secara langsung.
- Pengguna Basic tetap dapat mencapai rank tertinggi.

Rank adalah indikator perkembangan belajar di platform, bukan sertifikasi profesional.

---

## FR-06 — Leaderboard

### Tujuan
Menampilkan peringkat pengguna berdasarkan aktivitas belajar yang valid.

### Informasi dasar
- Posisi pengguna.
- Avatar kucing aktif pengguna.
- Nama atau username.
- Emblem tameng rank sesuai rank pengguna. Emblem tidak dipengaruhi avatar atau tema.
- Total XP.

### Aturan
- Semua tingkat membership tampil di leaderboard yang sama dengan aturan XP yang sama.
- XP harus berasal dari aktivitas yang valid.
- Pembelian membership, eBook, atau project tidak menambah XP secara langsung.
- XP dari materi premium ikut dihitung sesuai FR-05.
- Avatar bersifat kosmetik dan tidak menggantikan emblem tameng rank di leaderboard.
- Sistem perlu memiliki perlindungan terhadap farming XP.
- Informasi pribadi pengguna tidak boleh ditampilkan tanpa dasar dan izin yang sesuai.

### Kategori leaderboard
Leaderboard memiliki 2 tab:

| Tab | Label | Isi |
|---|---|---|
| Global | "Global" | Seluruh pengguna dari semua rank |
| Rank pengguna | Nama rank pengguna beserta emblem kecilnya, mis. "Apprentice" | Hanya pengguna dengan rank yang sama dengan pengguna yang sedang login |

Ketentuan:
- Kedua tab diurutkan berdasarkan total XP.
- Tidak ada periode mingguan atau bulanan; peringkat bersifat sepanjang waktu.
- Rank pengguna ditentukan dari total XP sesuai batas di FR-05. Saat pengguna naik rank, label dan isi tab rank otomatis berubah ke rank baru.
- Tab rank memberi kesempatan bersaing yang adil dengan pengguna di tahap belajar yang sama.
- Tab rank memakai warna dan emblem identitas rank pengguna.

### Tampilan
- Saat leaderboard dibuka, tab yang aktif pertama kali adalah tab rank pengguna.
- Setiap tab menampilkan 50 peringkat teratas, dibagi 10 baris per halaman (halaman 1–5) dengan navigasi nomor halaman, tombol sebelumnya, dan berikutnya. Nomor halaman tersimpan di URL; berpindah tab kembali ke halaman 1.
- Bila posisi pengguna termasuk 50 teratas tetapi berada di halaman lain, kartu posisi menampilkan tombol "Lompat ke posisiku" yang membuka halaman itu dan menyorot barisnya.
- Posisi pengguna yang sedang login selalu ditampilkan (disematkan) di kedua tab, termasuk jika berada di luar 50 besar:
  - Tab Global: posisi di antara seluruh pengguna.
  - Tab rank: posisi di antara sesama rank.
- Tab rank menampilkan informasi rank berikutnya, mis. "Butuh 320 XP lagi untuk naik ke Practitioner". Pengguna Master melihat keterangan bahwa rank tertinggi telah tercapai.
- Setiap baris menampilkan posisi, avatar kucing aktif, nama tampilan, emblem tameng rank, dan total XP.
- Setiap baris dapat diklik untuk membuka profil publik pengguna tersebut (FR-13). Hanya pengguna yang sudah memiliki username yang tampil.
- Tiga posisi teratas di setiap tab boleh diberi penekanan visual.
- Halaman leaderboard hanya memuat peringkat. Tingkatan rank dan cara mendapatkan XP ada di halaman Rank & XP (FR-05); kartu posisi memberi tautan "Lihat tingkatan rank".

### Privasi
- Pengguna dapat memilih untuk tidak ditampilkan di leaderboard melalui pengaturan.
- Pengguna yang memilih tidak tampil tetap dapat melihat posisinya sendiri.
- Leaderboard hanya menampilkan nama tampilan, bukan email atau data pribadi lain.

---

## FR-07 — Blog

### Tujuan
Menyediakan artikel edukasi seputar QA, testing, automation, dan programming, sekaligus menjadi pintu masuk pengguna baru dari mesin pencari menuju course, roadmap, dan latihan.

### Akses
- Blog (halaman daftar dan halaman artikel) **dapat dibaca tanpa login**, agar artikel dapat diindeks mesin pencari dan dibagikan.
- Pengunjung yang belum login melihat header dengan tombol "Masuk" dan "Daftar".
- Kotak ajakan di artikel tetap ditampilkan; jika tujuannya membutuhkan login, pengunjung diarahkan ke halaman login lalu kembali ke tujuan setelah berhasil masuk.

### Halaman daftar artikel (`/blog`)
- Judul "Blog" dan deskripsi singkat.
- Pencarian artikel (judul dan ringkasan).
- Chip kategori; kategori tanpa artikel terbit disembunyikan otomatis.
- Satu artikel unggulan dengan sampul besar dan tombol "Baca Artikel".
- Daftar "Artikel Terbaru" dalam grid kartu: sampul, kategori, judul, ringkasan maksimal 2 baris, tanggal, dan waktu baca. Pengurutan bawaan: terbaru.
- Pencarian dan filter tersimpan di URL.
- Empty state jika tidak ada hasil.

### Halaman artikel (`/blog/[slug]`)
**Bagian atas**
- Breadcrumb: Blog › Kategori.
- Badge kategori, judul, dan ringkasan satu kalimat.
- Penulis, tanggal terbit, tanggal diperbarui (jika ada), dan waktu baca.
- Tombol "Bagikan".
- Sampul artikel.

**Isi**
- Daftar isi dari heading artikel: menempel di samping saat scroll di desktop, dapat dilipat di mobile, dan menandai bagian yang sedang dibaca.
- Format konten: heading, paragraf, daftar, blok kode dengan penanda bahasa, nomor baris, dan tombol "Salin" (font JetBrains Mono), kotak Tips, kotak Peringatan, gambar dengan keterangan, dan tabel.
- Kotak ajakan menuju course atau latihan, dapat ditempatkan di tengah dan di akhir artikel.

**Bagian bawah**
- Sumber, untuk artikel yang memakai data atau rujukan.
- Bagikan: salin tautan, WhatsApp, dan LinkedIn. Di mobile, tombol "Bagikan" membuka panel dari bawah layar.
- Tiga artikel terkait, diutamakan dari kategori yang sama.

### Penulis
- Nama penulis bawaan: "Tim BelajarAutomation".
- Setelah peran Creator aktif, artikel dapat menampilkan nama Creator yang menulisnya.

### Format konten
- Sebelum backend, setiap artikel disimpan sebagai satu file konten (mis. MDX); setelah backend, artikel disimpan di database (Bagian 6.3). Keduanya memakai metadata: slug, judul, ringkasan, kategori, penulis, tanggal terbit, tanggal diperbarui, sampul, status, artikel unggulan, ajakan (course atau latihan tujuan), dan sumber.
- Waktu baca dihitung otomatis dari isi artikel.
- Status artikel: `draft` atau `published`. Artikel `draft` hanya tampil di lingkungan DEV dengan badge "Draf"; UAT dan Production hanya menampilkan artikel `published`.
- Ajakan hanya boleh menuju course atau latihan yang tersedia; pengecekan otomatis menggagalkan build jika tujuan tidak valid.
- Menambah artikel baru cukup dengan menambah file konten, tanpa mengubah kode aplikasi.
- Artikel boleh menyertakan referensi video YouTube dengan aturan yang sama seperti lesson (FR-02 bagian G).

### SEO
- Setiap artikel memiliki judul halaman, deskripsi, dan gambar pratinjau (Open Graph) dari metadata.
- Tersedia sitemap untuk artikel yang terbit.
- Lingkungan DEV dan UAT tidak boleh diindeks mesin pencari (`noindex`); hanya Production yang dapat diindeks.

### Kategori
QA Fundamentals, Manual Testing, Automation Testing, API Testing, Programming, Career, dan Tools dan teknologi.

### Aturan
- Artikel yang terbit dapat dibaca gratis oleh siapa pun.
- Tidak ada kolom komentar.
- Tidak ada fitur menyimpan artikel (bookmark) pada tahap ini; dapat dipertimbangkan di fase berikutnya.
- Konten mengikuti prinsip kualitas di Bagian 16; data seperti gaji wajib mencantumkan sumber dan tahun data.
- Daftar artikel rilis awal ditetapkan di `docs/CURRICULUM.md` Bagian 6.

---

## FR-08 — eBook

### Tujuan
Menyediakan produk digital berbayar berupa eBook dan materi pembelajaran premium.

### Katalog
Pengguna dapat melihat:
- Sampul produk.
- Judul.
- Deskripsi.
- Kategori.
- Harga.
- Informasi lisensi.
- Preview atau cuplikan isi.

### Detail Produk
Menampilkan:
- Deskripsi lengkap.
- Materi yang diperoleh.
- Format produk.
- Ketentuan lisensi.
- Harga.
- Status kepemilikan.
- Tombol pembelian atau akses.

### Akses produk
eBook dapat diperoleh melalui:
1. Pembelian individual.
2. Klaim menggunakan kredit eBook dari membership Pro atau Premium.

### Aturan
- Katalog dan preview dapat diakses gratis.
- Isi lengkap hanya dapat diakses pengguna yang memiliki entitlement atau hak akses yang valid.
- Produk yang telah dibeli dengan lisensi permanen tetap dapat diakses sesuai ketentuan lisensinya.
- Pembelian eBook tidak memberikan XP atau rank.
- Pengguna Basic tetap dapat membeli eBook secara terpisah.
- Hak akses harus diverifikasi oleh backend.
- URL file atau mekanisme distribusi tidak boleh menjadi satu-satunya lapisan perlindungan akses.

---

## FR-09 — Project

### Tujuan
Menyediakan proyek praktis yang dapat digunakan pengguna untuk belajar dan membangun portofolio.

### Katalog
Menampilkan:
- Sampul atau thumbnail.
- Nama project.
- Deskripsi.
- Kategori.
- Tingkat kesulitan.
- Teknologi yang digunakan.
- Harga.
- Preview.
- Ketentuan lisensi.

### Detail Project
Dapat mencakup:
- Latar belakang kasus.
- Tujuan proyek.
- Kebutuhan teknis.
- Struktur atau materi proyek.
- Instruksi penggunaan.
- File atau aset yang disertakan.
- Lisensi penggunaan.

### Akses
Project dapat diperoleh melalui:
1. Pembelian individual.
2. Klaim menggunakan kredit project dari membership Pro atau Premium.

### Aturan
- Katalog dan preview dapat dilihat tanpa pembayaran.
- Konten lengkap membutuhkan hak akses yang valid.
- Pembelian project tidak memberikan XP atau rank.
- Pengguna Basic tetap dapat membeli project secara terpisah.
- Project wajib memiliki dokumentasi yang memadai dan kode yang berfungsi (lihat Bagian 16).
- Hak akses mengikuti lisensi produk.
- File produk harus dilindungi melalui mekanisme akses yang sesuai.

---

## FR-10 — Membership (Basic, Pro, Premium)

### Tujuan
Menyediakan tingkat membership yang memberi akses materi premium dan benefit tambahan, tanpa mengorbankan kesempatan pengguna gratis untuk belajar dan berkembang.

### Tingkat membership

| Benefit | Basic | Pro | Premium |
|---|---|---|---|
| Harga | Gratis | Berbayar, sekali bayar | Berbayar, sekali bayar |
| Course gratis | Ya | Ya | Ya |
| Course premium yang tersedia saat pembelian | Tidak | Ya | Ya |
| Kuis dan challenge course gratis | Ya | Ya | Ya |
| Kuis dan challenge course premium | Tidak | Ya | Ya |
| Avatar dan tema banner gratis | Ya | Ya | Ya |
| Avatar dan tema banner berbayar | Tidak | Sesuai paket | Sesuai paket |
| Kredit eBook | 0 | 1 | 3 |
| Kredit project | 0 | 1 | 3 |
| XP, rank, dan leaderboard | Ya | Ya | Ya |
| Pembelian eBook dan project terpisah | Ya | Ya | Ya |

### Harga simulasi
| Paket | Harga simulasi |
|---|---:|
| Basic | Gratis |
| Pro Lifetime | Rp199.000 |
| Premium Lifetime | Rp399.000 |

Harga belum final dan masih perlu diuji berdasarkan biaya, nilai produk, dan kesediaan pengguna untuk membayar.

### Model Lifetime
Pro dan Premium menggunakan model **Lifetime Access untuk materi yang tersedia pada saat pembelian**, bukan langganan bulanan atau tahunan.

Artinya:
- Pengguna memperoleh akses permanen ke course premium yang tersedia pada saat pembelian.
- Course premium baru yang terbit setelah pembelian tidak otomatis termasuk.
- Perbaikan bug, koreksi, dan pembaruan pada course atau produk yang sama diberikan tanpa biaya tambahan.
- Produk baru atau versi yang berbeda secara substansial dapat dijual terpisah.
- Ketentuan ini wajib dijelaskan secara transparan sebelum transaksi, termasuk daftar course premium yang termasuk dalam pembelian.

### Upgrade
- Pengguna Pro dapat meningkatkan ke Premium. Kebijakan harga upgrade masih perlu ditentukan.
- Saat upgrade, kredit yang belum dipakai dan hak akses yang sudah dimiliki tetap berlaku.

Benefit yang sebenarnya harus ditampilkan dengan jelas pada detail paket sebelum pembayaran.

### Avatar dan Tema Banner
- Paket Pro dan Premium membuka avatar dan tema banner berbayar yang tercantum di dalamnya (FR-12).
- Akses tidak bergantung pada rank pengguna.
- Pemilik paket memilih satu avatar dan satu tema aktif dari yang tersedia.
- Avatar dan tema tidak mengubah emblem rank maupun warna identitas rank.
- Hak akses mengikuti benefit yang tercantum pada paket; tidak boleh diasumsikan semua item otomatis termasuk.
- Cakupan avatar dan tema pada paket (apakah termasuk item yang dirilis setelah pembelian) harus dinyatakan jelas sebelum pembayaran.

### Kredit produk

| Paket | Kredit eBook | Kredit project |
|---|---:|---:|
| Basic | 0 | 0 |
| Pro | 1 | 1 |
| Premium | 3 | 3 |

Kredit bukan uang tunai, tidak dapat ditukar dengan uang, dan tidak dapat dipindahtangankan.

Setiap klaim digunakan untuk memilih satu produk yang memenuhi syarat.

Kredit tersebut:
- Berlaku satu kali untuk setiap paket yang dibeli.
- Bukan kuota berulang bulanan atau tahunan.
- Tidak diisi ulang otomatis.
- Tidak dapat di-reset dengan logout, login ulang, mengganti browser, atau mengganti perangkat.
- Tidak dapat digunakan lebih dari satu kali untuk klaim yang sama.
- Hanya berlaku pada produk yang memenuhi ketentuan paket.

Setelah klaim berhasil, pengguna memperoleh entitlement produk sesuai lisensi yang berlaku.

### Alur klaim

1. Pengguna membuka benefit membership yang dimiliki.
2. Pengguna melihat kredit yang tersisa.
3. Pengguna memilih produk yang memenuhi syarat.
4. Sistem menampilkan konfirmasi.
5. Pengguna mengonfirmasi klaim.
6. Backend memvalidasi hak paket dan kredit.
7. Backend mencatat klaim secara permanen.
8. Sistem memberikan entitlement produk.
9. Kredit tersisa diperbarui.

### Pembelian paket baru
- Setiap paket memiliki identitas dan versi yang jelas.
- Pembelian paket baru adalah transaksi baru.
- Benefit paket baru tidak otomatis diberikan kepada pemilik paket sebelumnya.
- Membeli paket versi 2 tidak boleh dianggap sebagai hak otomatis bagi seluruh pemilik versi 1.
- Benefit yang telah dijanjikan pada paket lama tetap harus dihormati.
- Benefit baru dapat disediakan melalui paket baru atau penawaran terpisah.
- Kebijakan upgrade dan diskon untuk pemilik paket sebelumnya masih perlu ditentukan.

### Batasan membership
Pro dan Premium tidak boleh:
- Memberikan bonus XP, pengganda XP, atau XP hanya karena status membership.
- Menaikkan rank secara langsung.
- Mengunci course yang sudah dinyatakan gratis.
- Membuat rank Master tidak dapat dicapai oleh pengguna Basic.
- Mengubah emblem rank atau membuat pengguna terlihat memiliki rank lebih tinggi.
- Menghapus hak produk yang sudah diperoleh secara sah.

### Pembayaran
Sistem pembayaran harus:
- Menampilkan harga dan benefit sebelum transaksi.
- Memverifikasi status pembayaran.
- Mencegah aktivasi benefit hanya berdasarkan respons frontend.
- Menangani transaksi gagal atau tertunda.
- Mencatat riwayat pembelian.
- Memiliki kebijakan refund yang jelas sebelum peluncuran komersial.
- Tidak menjanjikan hasil karier yang tidak dapat dijamin (lihat Bagian 16).

Payment gateway: **Midtrans Snap**, dengan metode QRIS dan Virtual Account. DEV dan UAT memakai sandbox; Production memakai kunci produksi.
- Production baru dirilis setelah pembayaran Midtrans siap: merchant terverifikasi dan alur pembayaran lulus pengujian di UAT. Jika verifikasi merchant terlambat, rilis ikut mundur.
- Simulasi pembayaran hanya ada di DEV dan tidak pernah aktif di UAT maupun Production.
- Harga dihitung di server dari database, bukan dari data yang dikirim browser.
- Hak akses diberikan hanya setelah notifikasi Midtrans terverifikasi (signature dan nominal cocok). Halaman "pembayaran berhasil" bukan bukti pembayaran.
- Notifikasi yang sama diproses sekali saja, dan transaksi tertunda dicek ulang berkala ke Midtrans.
- Status pembayaran tidak dapat diubah manual oleh Admin (FR-16 E).
- Refund lewat Refund API Midtrans untuk metode yang mendukungnya. Dukungan refund untuk QRIS dan Virtual Account perlu dikonfirmasi ke Midtrans sebelum peluncuran.

Harga paket final belum ditetapkan.

---

## FR-11 — Career

### Status
Tahap pengembangan berikutnya.

### Tujuan
Menyediakan informasi yang membantu pengguna mempersiapkan karier di bidang QA dan teknologi.

### Potensi fitur
- Panduan karier QA.
- Persiapan wawancara.
- Panduan pembuatan CV.
- Panduan portofolio.
- Informasi skill berdasarkan posisi.
- Panduan mencari pekerjaan.

Fitur ini tidak menjadi prioritas implementasi awal sebelum fondasi pembelajaran, XP, autentikasi, dan akses produk stabil.

---

## FR-12 — Maskot, Avatar, dan Tema Banner

### Tujuan
Memberikan identitas brand yang mudah dikenali dan sarana ekspresi diri pengguna tanpa memengaruhi keadilan sistem belajar.

### Maskot resmi
- Maskot resmi BelajarAutomation adalah **kucing putih** bernama **Kimi Cat**.
- Nama Kimi Cat khusus untuk maskot. Avatar Kucing Putih yang dipilih pengguna tetap bernama Mochi, karena avatar adalah identitas pengguna, bukan maskot.
- Desain mengikuti desain asli yang sudah digunakan di Instagram pembuat. Bentuk dasar dan ciri khasnya tidak diubah, dan tidak diubah menjadi karakter fotorealistis.
- Filosofi: kucing putih melambangkan ilmu yang dimiliki, dipelajari, dan dibagikan kepada orang lain.
- Maskot resmi dipakai sebagai identitas brand: empty state, halaman 404, hasil latihan di Playground, halaman Tentang, dan materi pemasaran.
- Logo dan warna brand tetap menjadi identitas utama platform; maskot berperan sebagai karakter pendamping.

### Ekspresi maskot resmi
- Menyapa, untuk sapaan.
- Bingung atau mencari, untuk empty state dan halaman 404.
- Senang, untuk jawaban benar.
- Berpikir atau semangat, untuk jawaban salah; tetap bernada positif.
- Membaca, untuk Learning Center dan eBook.
- Merayakan, untuk kenaikan rank.

### Tiga sistem visual yang terpisah

| | Emblem Rank | Avatar Kucing | Tema Banner |
|---|---|---|---|
| Bentuk | Tameng berwarna identitas rank (FR-05) | Ilustrasi kucing dari beberapa jenis dan gaya | Ilustrasi latar banner |
| Cara memperoleh | Naik rank melalui XP yang valid | Gratis atau melalui Pro/Premium | Gratis atau melalui Pro/Premium |
| Dipilih pengguna | Tidak; mengikuti rank | Ya, satu avatar aktif | Ya, satu tema aktif |
| Tampil di | Kartu Rank & XP, profil, leaderboard | Foto profil, header, leaderboard, profil | Welcome Banner, banner sampul halaman fitur, dan banner profil |
| Memengaruhi XP, rank, leaderboard | Tidak | Tidak | Tidak |

### Avatar kucing
- Avatar adalah foto profil pengguna berupa ilustrasi kucing.
- Tersedia beberapa **jenis kucing** agar pilihan tidak monoton (daftarnya di Rilis awal). Setiap jenis dapat memiliki beberapa **gaya**.
- Avatar = satu jenis kucing dengan satu gaya, mis. "Domino Astronot".
- Setiap jenis kucing punya **nama panggilan**. Nama avatar adalah nama panggilan untuk gaya Basic (mis. "Oyen") dan nama panggilan diikuti gaya untuk kostum (mis. "Oyen Wizard"). Di koleksi, jenis kucingnya (mis. "Kucing Oren") tampil sebagai keterangan di bawah nama.
- Nama panggilan hanya untuk avatar. Maskot resmi bernama Kimi Cat (lihat Maskot resmi).
- Kucing putih Basic menjadi avatar bawaan setiap pengguna baru.
- Semua avatar memakai gaya ilustrasi yang sama dengan maskot resmi agar terasa satu keluarga.
- Avatar tampil di header, halaman profil, dan leaderboard. Welcome Banner tidak menampilkan avatar.
- Avatar tidak menggantikan emblem rank.

### Gaya avatar
Tujuh gaya berikut berlaku untuk semua jenis kucing:

| Gaya | Ciri kostum | Akses |
|---|---|---|
| Basic | Tanpa kostum | Mengikuti jenis kucing (lihat Rilis awal) |
| Bug Hunter | Topi detektif, kaca pembesar, dan jaring serangga | Pro dan Premium |
| Cyberpunk | Visor dan hoodie bercahaya neon | Pro dan Premium |
| Wizard | Topi dan jubah penyihir berbintang | Pro dan Premium |
| Driver Racing | Helm dan baju balap | Pro dan Premium |
| Astronot | Helm dan baju astronot | Pro dan Premium |
| Master Chef | Topi dan seragam koki | Pro dan Premium |

Ketentuan:
- Semua gaya kostum berbayar, termasuk untuk Kucing Putih dan Kucing Oren yang gaya Basic-nya gratis.
- Gambar ditambahkan bertahap. Koleksi hanya menampilkan kombinasi jenis dan gaya yang gambarnya sudah tersedia.
- Kostum tetap mengikuti Aturan desain di bawah, termasuk tidak memakai kombinasi warna identitas rank (mis. crimson dengan gold milik Master).
- Nama gaya ditulis dalam bentuk di atas di seluruh antarmuka.

Setiap avatar memiliki:
- ID unik, nama, jenis kucing, dan gaya.
- Aset ukuran kecil (32–48px, untuk header dan leaderboard) dan ukuran besar (untuk profil).
- Tingkat akses: gratis atau berbayar (Pro/Premium).

### Tema banner
- Tema adalah ilustrasi latar untuk **Welcome Banner dashboard**, **banner sampul halaman fitur**, dan **banner halaman profil**.
- Banner sampul halaman fitur tampil di bagian atas halaman Belajar, Roadmap, Playground, Leaderboard, eBook, dan Project. Isinya ikon fitur, judul halaman (heading utama), dan tombol ikon (i) dengan nama aksesibel "Tentang [judul]" di samping judul, di atas latar tema aktif, tanpa avatar. Deskripsi singkat fitur tidak tampil langsung; menekan tombol (i) membuka popup berisi judul dan deskripsi tersebut, yang ditutup dengan klik di luar popup atau tombol Escape. Semua keterangan fitur di halaman tersebut (mis. aturan XP latihan di Playground, cara peringkat dihitung di Leaderboard, dan ketersediaan project) berada di popup ini; halaman tidak menampilkan kotak atau paragraf keterangan terpisah. Struktur dan posisi teksnya sama di semua tema, dan teks tetap terbaca di mode terang maupun gelap.
- Blog tidak memakai banner sampul karena dapat dibuka publik tanpa login (FR-07); halaman Blog tetap mengikuti brand guideline.
- Tema tidak mengubah warna website. Warna website tetap mengikuti brand guideline (Bagian 15), dengan pilihan mode terang atau gelap.
- Setiap tema memiliki versi mode terang dan gelap, atau satu versi yang tetap terbaca di keduanya.
- Area teks pada banner harus tetap terbaca dengan kontras memadai di setiap tema.

Setiap tema memiliki:
- ID unik dan nama.
- Aset latar (mode terang dan gelap bila diperlukan) dan thumbnail.
- Opsional: video untuk tema bergerak.
- Tingkat akses: gratis atau berbayar (Pro/Premium).

### Tema bergerak
- Tema dapat berupa video pendek tanpa suara yang diputar berulang (MP4), di atas gambar diam tema.
- Gambar diam tampil lebih dulu dan menjadi patokan kecepatan halaman; video diputar setelah halaman siap.
- Pengguna yang mengaktifkan "kurangi gerakan" di perangkatnya hanya melihat gambar diam.
- Gerakan pelan dan halus, tanpa kedip atau goyangan kamera, agar tidak mengganggu belajar.
- Video tidak memuat teks dan tidak menutupi area teks banner.
- Ukuran video sebaiknya di bawah 1 MB, dengan resolusi yang cukup untuk banner lebar (minimal sekitar 1.600 piksel).
- Avatar tidak ditampilkan di atas ilustrasi tema pada banner mana pun (Welcome Banner, banner sampul halaman fitur). Pada banner profil, avatar berada di bingkai bulat terpisah, sehingga tema yang ilustrasinya sudah memuat karakter kucing tetap dapat dipakai.

### Model 3D kucing
- Belum dipakai. Kucing 3D di banner profil dihapus pada v2.45 dan konsep visualnya sedang dirancang ulang. Sampai konsep baru disetujui, banner profil hanya menampilkan avatar aktif pengguna, dan tidak ada model 3D yang dimuat.

### Rilis awal
- **32 avatar** dan 3 tema banner:

| Tema | Akses | Catatan |
|---|---|---|
| Padang Rumput (bawaan) | Gratis | Diam; padang rumput hijau di bawah langit biru, tanpa karakter kucing |
| Penerbangan Fuji | Gratis | Bergerak; kabin pesawat dengan jendela menghadap Gunung Fuji |
| Neon Night | Gratis | Bergerak; kota cyberpunk malam |

- Pengguna yang sudah menyimpan tema lain tetap memakai tema pilihannya. Tema bawaan hanya berlaku untuk pengguna yang belum pernah memilih tema.

- Target rilis awal tetap 5 tema; tema lain menyusul.
- Avatar:

| Jenis kucing | Nama panggilan | Akses gaya Basic |
|---|---|---|
| Kucing Putih (bawaan) | Mochi | Gratis |
| Kucing Oren | Oyen | Gratis |
| Kucing Hitam | Kopi | Pro dan Premium |
| Kucing Tuxedo | Domino | Pro dan Premium |
| Kucing Abu-abu | Mendung | Pro dan Premium |
| Kucing Coklat | Karamel | Pro dan Premium |
| Kucing Corak Tiga | Belang | Pro dan Premium |
| Kucing Siam | Latte | Pro dan Premium |

| Kostum | Akses |
|---|---|
| Bug Hunter untuk kedelapan jenis kucing, mis. "Oyen Bug Hunter" | Pro dan Premium |
| Cyberpunk untuk kedelapan jenis kucing, mis. "Latte Cyberpunk" | Pro dan Premium |
| Wizard untuk kedelapan jenis kucing, mis. "Kopi Wizard" | Pro dan Premium |

- Gaya kostum lain (Driver Racing, Astronot, dan Master Chef) tampil "Segera hadir" sampai gambarnya tersedia.

- Komposisi gratis dan berbayar untuk tema ditetapkan di Bagian 12. Minimal 1 avatar dan 1 tema tersedia gratis.
- Jumlah ini adalah rilis awal, bukan batas permanen.

### Akses
- Pengguna Basic memakai avatar dan tema yang berstatus gratis.
- Pengguna Pro dan Premium dapat memakai avatar dan tema berbayar sesuai benefit paket (FR-10).
- Avatar dan tema yang terkunci tetap ditampilkan di koleksi dengan indikator terkunci.
- Hak penggunaan avatar dan tema diverifikasi oleh backend.
- Jika avatar atau tema aktif tidak lagi valid, sistem kembali ke avatar Kucing Putih Basic dan tema gratis bawaan. Hak yang sudah diperoleh secara sah tidak boleh dicabut secara sepihak.

### Aturan desain
- Avatar dan tema tidak boleh memakai kombinasi warna identitas rank, terutama crimson dengan gold milik Master, agar tidak disangka sebagai rank.
- Avatar dan tema gratis harus tetap menarik; versi berbayar terasa sebagai bonus, bukan penebus kekurangan versi gratis.
- Avatar harus terbaca jelas pada ukuran kecil.
- Hindari animasi atau efek berlebihan yang mengganggu pengalaman belajar.

### Aturan
- Avatar dan tema bersifat kosmetik dan tidak memengaruhi XP, rank, maupun posisi leaderboard.
- Mengganti avatar atau tema tidak mengubah progress, XP, rank, atau entitlement.
- Pilihan avatar dan tema tersimpan sebagai preferensi pengguna dan konsisten di semua halaman.
- Selama database belum tersedia, pilihan boleh disimulasikan dengan data dummy.

---

## FR-13 — Profil Pengguna

### Tujuan
Menampilkan identitas, perkembangan belajar, dan pencapaian pengguna, serta tempat mengatur tampilan diri.

Acuan visual: `docs/desain/profil.webp` (Bagian 13.2).

### Header profil
Banner tampil di atas semua tab dan berisi:
- Latar sesuai tema aktif pengguna (FR-12).
- Avatar kucing aktif dalam bingkai bulat. Pada profil sendiri, avatar diberi ikon pensil kecil yang membuka Kustomisasi.
- Nama tampilan, username (`@username`), dan bio singkat.
- Emblem tameng dan nama rank (FR-05).
- Total XP, bar progres, dan keterangan menuju rank berikutnya, mis. "580 XP lagi ke Practitioner (17%)". Pengguna Master melihat keterangan rank tertinggi telah tercapai.
- Tombol aksi bulat yang tersusun vertikal di kanan banner, **hanya pada profil sendiri**:

| Ikon | Nama aksesibel | Aksi |
|---|---|---|
| Pensil | Edit profil | Membuka Pengaturan bagian Informasi Profil |
| Bagikan | Bagikan profil | Membuka dialog Bagikan profil |
| Roda gigi | Pengaturan | Membuka halaman Pengaturan |
| Mata | Lihat sebagai publik | Membuka profil publik `/u/username` milik sendiri; tidak tampil bila username belum ada |

Ketentuan:
- Tidak ada sistem level. Perkembangan hanya ditunjukkan oleh rank dan XP (FR-05).
- Rank tidak memiliki sub-tingkat (mis. tidak ada "Apprentice II").
- Tidak ada lencana verifikasi atau penanda status membership di samping nama.
- Profil publik (`/u/username`) memakai banner yang sama tanpa ikon pensil pada avatar dan tanpa tombol aksi.
- Teks banner tetap terbaca dengan kontras memadai di semua tema, di mode terang maupun gelap.
- Di layar kecil, isi banner tersusun ke bawah dan keempat tombol aksi diringkas ke dalam satu tombol menu (ikon garis tiga, nama aksesibel "Aksi profil") di kanan atas banner. Menekan tombol menu menampilkan keempat tombol aksi dalam satu baris di bawah isi banner, tanpa menutupi teks; menekannya lagi, menekan Escape, atau mengklik di luar menu menutupnya.
- Setiap tombol ikon memiliki nama aksesibel dan tooltip.

### Tab profil

| Tab | Isi |
|---|---|
| **Ringkasan** | Lihat bagian Ringkasan di bawah |
| **Aktivitas** | Riwayat aktivitas yang dikelompokkan per tanggal beserta XP yang diperoleh; filter jenis aktivitas (materi, challenge, kuis, achievement, rank) dan periode; ringkasan periode; grafik XP harian dan heatmap konsistensi belajar |
| **Pencapaian** | Achievement yang sudah diperoleh dan yang sedang dalam progres, dikelompokkan per kategori (FR-14) |

Ketentuan:
- Profil memiliki 3 tab, ditampilkan sebagai satu baris tombol tab selebar konten dengan ikon dan label.
- Nama tab dan seluruh label dalam Bahasa Indonesia.
- Nilai XP pada riwayat mengikuti konfigurasi XP di FR-05.
- Progress per kategori materi dan progress roadmap tidak ditampilkan di profil; progres tersebut ada di halaman Belajar (FR-02) dan Roadmap (FR-03).

### Ringkasan
Empat kartu berukuran sama: dua kolom × dua baris di layar lebar, bertumpuk satu kolom di layar kecil. Urutannya:

1. **Progres XP** — grafik garis total XP kumulatif per hari dengan pilihan periode 7 Hari, 30 Hari (bawaan), dan 90 Hari. Titik terakhir diberi label total XP saat ini. Grafik memiliki ringkasan teks untuk pembaca layar. Jika belum ada aktivitas di periode tersebut, tampil empty state. Tinggi grafik tetap sama di semua ukuran layar dan lebarnya mengikuti kartu, sehingga grafik tidak membesar di desktop atau mengecil di mobile.
2. **Achievement** — diagram cincin persentase achievement yang tercapai dari seluruh achievement, jumlah "Tercapai" dan "Belum Tercapai", serta "Achievement Terbaru": paling banyak 3 badge terbaru dan penanda sisa (mis. "+4"). Kartu dapat diklik menuju tab Pencapaian.
3. **Progress Rank** — emblem rank saat ini (Saat ini) dan rank berikutnya (Berikutnya), bar progres, XP saat ini terhadap batas rank berikutnya (mis. "320 / 900 XP"), dan sisa XP. Pengguna Master melihat emblem Master dengan keterangan rank tertinggi. Kartu memiliki tautan ke halaman Rank & XP (FR-05).
4. **Aktivitas Terbaru** — tiga aktivitas terakhir: ikon jenis aktivitas, judul, keterangan (course atau jenis challenge), XP yang diperoleh, dan waktu relatif. Tautan "Lihat semua" membuka tab Aktivitas.

Ketentuan:
- Ringkasan profil sendiri tidak memuat kartu statistik; angka Materi Selesai, Challenge Selesai, dan Total XP ada di dashboard (FR-01).
- Emblem pada Progress Rank memakai emblem tameng dengan warna identitas rank masing-masing (FR-05), bukan warna seragam.
- Profil publik menampilkan kartu statistik (Materi Selesai, Challenge Selesai, Achievement, dan Total XP; arti angka mengikuti FR-05), Achievement, dan Progress Rank. Grafik Progres XP dan Aktivitas Terbaru tidak ditampilkan karena riwayat aktivitas detail hanya terlihat oleh pemilik profil.

### Kustomisasi
- Dibuka dari ikon pensil pada avatar di banner profil sendiri. Kustomisasi bukan tab, memiliki alamat sendiri sehingga dapat dibuka langsung, dan menyediakan tombol "Kembali ke profil".
- Hanya dapat dibuka oleh pemilik profil.
- Dua bagian: **Avatar** dan **Tema Banner**.
- Filter koleksi (Semua, Dimiliki, Terkunci) berupa tombol ikon filter di kanan judul koleksi, yang membuka dropdown. Tombol diberi penanda titik saat filter selain Semua aktif.
- Avatar dikelompokkan per **gaya** (FR-12) dengan chip yang dapat digeser: Basic, Bug Hunter, Cyberpunk, Wizard, Driver Racing, Astronot, dan Master Chef. Chip awal adalah gaya avatar yang sedang dipakai.
- Setiap gaya menampilkan grid jenis kucing yang gambarnya sudah tersedia. Gaya yang belum punya gambar tetap tampil dengan keterangan "Segera hadir".
- Filter Semua, Dimiliki, dan Terkunci berlaku di dalam gaya yang dipilih.
- Preview profil memperlihatkan hasil pilihan sebelum disimpan: banner tema, avatar, dan nama tampilan saja, tanpa rank dan XP.
- "Simpan Pilihan" menyimpan avatar dan tema ke akun. Setelah disimpan, avatar tampil di header profil, menu profil, dan kartu "Posisi kamu" di leaderboard, sedangkan tema tampil di Welcome Banner, banner Playground, dan banner profil. Akun demo di DEV hanya melihat pratinjau.
- Avatar dan tema yang sedang dipakai ditandai "Digunakan" pada kartu koleksi. Tombol "Simpan Pilihan" berada di bawah pratinjau profil.
- Pratinjau profil beserta tombol "Simpan Pilihan" tampil di atas koleksi pada layar kecil, agar hasil pilihan langsung terlihat; di layar lebar berada di kolom kiri yang tetap terlihat saat koleksi digulir.
- Item terkunci menampilkan cara memperolehnya (mis. "Tersedia di Pro dan Premium").

### Username
- 3–20 karakter: huruf kecil, angka, dan garis bawah (_). Tidak boleh diawali angka.
- Unik tanpa membedakan huruf besar dan kecil.
- Nama cadangan tidak dapat dipakai, mis. nama merek (belajarautomation), nama peran (admin, creator, reviewer), dan nama halaman aplikasi (login, settings, blog). Daftar lengkapnya dikelola di database.
- Pendaftar dengan email mengisi username di form daftar; pendaftar dengan Google memilihnya sekali setelah login (4.5).
- Username dapat diganti dengan jeda minimal 30 hari sejak penggantian terakhir. Tautan profil dengan username lama tidak lagi berlaku.
- Aturan ini ditegakkan di database, bukan hanya di form.

### Informasi Profil (Pengaturan)
| Isian | Aturan |
|---|---|
| Nama tampilan | Wajib, maksimal 100 karakter |
| Username | Mengikuti aturan Username di atas; menampilkan tanggal paling cepat untuk mengganti lagi |
| Tentang saya | Opsional, maksimal 160 karakter dengan penghitung karakter. Tautan yang diawali http:// atau https:// dapat diklik di profil, dibuka di tab baru, dan diberi rel "nofollow ugc"; bentuk lain tetap teks biasa |
| Email | Tautan konfirmasi dikirim ke email lama dan email baru. Email baru berlaku setelah keduanya dikonfirmasi; selama itu tampil keterangan "Menunggu konfirmasi" |

Ketentuan:
- Foto profil adalah avatar kucing dan diganti di Kustomisasi (FR-12); tidak ada unggah foto.
- Perubahan langsung tampil di header profil, menu profil, dan bagian lain yang memakai nama atau username.
- Akun demo di DEV dapat melihat isian tetapi tidak dapat menyimpan.
- Aturan panjang, jeda username, dan status akun ditegakkan di database.

### Profil publik
- Profil dapat dilihat oleh pengguna lain yang sudah login, di alamat `/u/username`.
- Username yang tidak ada atau milik akun nonaktif menampilkan "Profil tidak ditemukan".
- Yang terlihat publik: banner, avatar, nama tampilan, username, bio, rank, total XP, ringkasan statistik, dan achievement.
- Yang tidak terlihat publik: Kustomisasi, tombol aksi banner, email, data pembelian, dan membership.
- Riwayat aktivitas detail hanya terlihat oleh pemilik profil, kecuali pengguna memilih membukanya.
- Pengguna yang memilih tidak tampil di leaderboard tetap dapat memilih apakah profilnya dapat dilihat publik.
- Fitur melihat profil pengguna lain dari leaderboard dan ruang chat komunitas direncanakan untuk tahap berikutnya (Phase 7).

---

## FR-14 — Achievement

### Tujuan
Memberikan pengakuan atas pencapaian belajar sebagai motivasi tambahan.

### Ketentuan
- Achievement **hanya ditampilkan di halaman profil** (kartu Achievement di tab Ringkasan, dan tab Pencapaian). Achievement tidak ditampilkan di dashboard.
- Achievement **tidak memberikan XP** agar XP tetap murni berasal dari aktivitas belajar.
- Achievement diperoleh dari aktivitas belajar yang valid dan tidak dapat dibeli.
- Kategori awal: Belajar, Testing, Automation, Challenge, Konsistensi, dan Milestone.
- Setiap achievement memiliki: ID, nama, deskripsi syarat, kategori, ikon, dan target progres jika bertahap (mis. "Selesaikan 50 materi").
- Achievement bertahap menampilkan progres, mis. "28 / 50".
- Tanggal diperoleh dicatat dan ditampilkan.

### Desain
- Badge achievement memakai bentuk yang berbeda dari emblem rank (mis. heksagon), dan tidak memakai bentuk tameng bersayap, agar tidak tertukar dengan rank.
- Badge yang belum diperoleh ditampilkan abu-abu.

### Contoh achievement awal
| Achievement | Syarat |
|---|---|
| First Steps | Menyelesaikan materi pertama |
| Bug Hunter | Menyelesaikan challenge kategori bug |
| Automation Starter | Menyelesaikan materi automation pertama |
| Quiz Master | Mencapai skor minimal 90% di sebuah kuis |
| Consistent Learner | Aktif belajar 7 hari berturut-turut |
| Roadmap Finisher | Menuntaskan satu roadmap |
| Grand Learner | Mencapai rank Master |

Daftar final achievement ditetapkan kemudian (Bagian 12).

---

## FR-15 — Peran Konten dan Alur Penerbitan

### Tujuan
Memungkinkan konten ditulis oleh lebih dari satu orang dengan kualitas yang tetap terjaga melalui proses review.

### Peran
| Peran | Tugas | Batasan |
|---|---|---|
| **Creator** | Menulis dan merevisi konten | Tidak dapat menerbitkan sendiri dan tidak dapat me-review kontennya sendiri |
| **Reviewer** | Memeriksa akurasi, kejelasan, contoh kode, referensi video, dan kunci jawaban; menyetujui atau meminta revisi | Tidak me-review konten yang ditulisnya sendiri dan tidak mengedit isi konten secara langsung |
| **Admin** | Menugaskan reviewer, menerbitkan dan menarik konten, mengelola peran pengguna, dan tugas lain di Panel Admin (FR-16) | Tidak dapat mencabut peran Admin dari dirinya sendiri jika ia satu-satunya Admin |

- Setiap akun memiliki peran dasar **Pelajar** (nilai di database: `student`). Creator, Reviewer, dan Admin adalah peran tambahan.
- Membership (Basic, Pro, Premium) adalah hak akses, bukan peran.
- Satu akun dapat memiliki beberapa peran. Selama tim masih kecil, pemilik produk dapat merangkap Reviewer dan Admin.
- Creator, Reviewer, dan Admin tetap dapat belajar: XP, rank, profil pelajar, dan membership tetap berlaku di **Mode Belajar**.
- Pengguna dengan peran tambahan memiliki pengalih **"Mode Belajar"** dan **"Mode Creator"**, **"Mode Reviewer"**, atau **"Mode Admin"** di menu profil. Mode tersimpan dan bertahan saat berpindah halaman.
- Identitas (nama, avatar, dan email) sama di semua mode.

### Tampilan per mode
| Elemen | Mode Belajar | Mode Creator / Reviewer / Admin |
|---|---|---|
| Sidebar dan dashboard | Menu pelajar | Menu sesuai peran |
| Keranjang | Ya | Tidak |
| Membership (menu, halaman, dan info di profil) | Ya | Tidak |
| XP, rank, achievement, leaderboard | Ya | Tidak ditampilkan |
| Notifikasi | Progres belajar, Konten baru, Transaksi, Akun dan sistem | Khusus role, Akun dan sistem |

Perilaku mode peran:
- Halaman yang memuat XP, progres, atau pembelian menampilkan ajakan "Beralih ke Mode Belajar" saat dibuka di mode peran: Belajar, Roadmap, Playground, Leaderboard, eBook, Project, Karier, Membership, Keranjang, dan Checkout. Setelah beralih, halaman yang dituju langsung terbuka.
- Blog dapat dibuka di semua mode.
- Saat login, akun dengan peran tambahan mulai di mode perannya.
- Membuka halaman peran (mis. `/creator`) dari Mode Belajar otomatis mengembalikan ke mode peran tersebut.
- Di mode peran, pengaturan Privasi (leaderboard dan profil publik) disembunyikan.
- Di Mode Belajar, label akun menunjukkan peran dan mode, mis. "Creator · Mode Belajar".

### Profil per mode
- **Mode Belajar:** profil pelajar sesuai FR-13.
- **Mode peran:** nama, avatar, email, dan peran, tanpa XP, rank, achievement, maupun membership. Isi khusus:

| Peran | Isi profil |
|---|---|
| Creator | Profil Creator di `/creator/profil` tanpa foto: info akun, jumlah konten per status, dan daftar konten yang sudah terbit |
| Reviewer | Profil Reviewer di `/reviewer/profil` tanpa foto: info akun, jumlah konten yang direview, disetujui, diminta revisi, dan sedang ditugaskan, serta keputusan terakhir (lihat Profil dan Pengaturan Reviewer) |
| Admin | Profil Admin di `/admin/profil`: info akun, status verifikasi dua langkah, dan ringkasan kerja, tanpa foto (FR-16 L) |

- Profil publik (FR-13) tetap menampilkan profil pelajar.

### Dashboard Creator
- Header berisi sapaan dan tombol "Buat Konten Baru" (selebar layar di layar kecil).
- Empat angka utama yang membuka Konten Saya dengan filter status: Total Konten, Perlu Revisi, Menunggu Review, dan Terbit.
- **Alur Konten:** batang tersegmen yang menunjukkan porsi konten di setiap tahap (Draf, Menunggu Review, Perlu Revisi, Disetujui, Terbit), dengan legenda berikon dan berangka; setiap tahap membuka Konten Saya dengan filter tahap tersebut. Warna setiap tahap divalidasi agar dapat dibedakan pengguna buta warna, dengan tingkat warna sendiri untuk mode gelap.
- **Konten Dibuat per Minggu:** grafik batang 8 minggu terakhir, dengan tooltip dan tabel data untuk pembaca layar.
- **Perlu Dikerjakan:** konten Perlu Revisi beserta jumlah catatan yang sudah ditandai, lalu draf yang belum dikirim; setiap baris membuka Catatan Revisi atau editor.
- **Konten Terbaru:** lima konten yang terakhir diperbarui, dengan ikon jenis konten, status, dan tanggal; setiap baris membuka detail konten.
- Ikon jenis konten dipakai konsisten di Dashboard, Konten Saya, dan Buat Konten: Artikel (koran), Lesson (topi wisuda), dan Soal (papan klip). Halaman Konten Saya, Buat Konten, dan Catatan Revisi memakai judul berikon yang sama dengan menu sidebar.
- Filter status Konten Saya tersimpan di alamat halaman (`?status=`).
- Di layar kecil, aksi pada kartu Konten Saya ditampilkan dengan ikon dan teks; di layar lebar berupa ikon dengan tooltip.

### Dashboard Reviewer
- Header berisi sapaan dan tombol "Buka Antrean".
- Empat angka utama yang dapat diklik: Ditugaskan ke Saya, Belum Ditugaskan (membuka Antrean Review tab Belum ditugaskan, `?tab=belum`), Disetujui, dan Diminta Revisi (membuka Riwayat Review).
- **Antrean Review** dengan saringan Semua, Ditugaskan ke saya, dan Belum ditugaskan. Setiap baris memuat ikon jenis konten, judul, Creator, dan lama menunggu; konten yang menunggu lebih dari 3 hari ditandai. Konten yang ditugaskan dibuka dengan tombol "Review"; konten yang belum ditugaskan dapat langsung diambil dengan tombol "Ambil", kecuali konten tulisannya sendiri.
- **Hasil Review:** batang perbandingan Disetujui dan Diminta Revisi beserta jumlah dan persentasenya. Warnanya sama dengan tahap Disetujui dan Perlu Revisi di Dashboard Creator dan dapat dibedakan pengguna buta warna.
- **Keputusan per Minggu:** grafik batang 8 minggu terakhir, dengan rincian disetujui dan diminta revisi di tooltip serta tabel data untuk pembaca layar.
- **Aktivitas Review Terakhir** dan **Checklist Panduan Review** yang dapat dibuka-tutup, dengan tautan ke Riwayat Review dan Panduan Review.

### Profil dan Pengaturan Creator dan Reviewer
- Di semua mode peran (Creator, Reviewer, Admin), header dan menu profil menampilkan inisial nama, bukan avatar kucing (FR-16 L). Avatar kucing hanya dipakai di Mode Belajar.
- Menu profil membuka Profil dan Pengaturan perannya: `/creator/profil` dan `/creator/pengaturan`, `/reviewer/profil` dan `/reviewer/pengaturan`. Membuka `/profile` di mode peran juga menampilkan profil perannya. Halaman `/settings` tetap ada untuk pengaturan grup notifikasi dan data dummy DEV.
- Pengaturan Reviewer memuat Informasi Akun (nama dapat diubah, email hanya dibaca), Keamanan (ganti password dan keluar dari semua perangkat; tanpa verifikasi dua langkah wajib), Notifikasi Reviewer (konten baru ditugaskan, kiriman ulang dari Creator, dan antrean belum ditugaskan), serta Tampilan. Bagian khusus pelajar tidak ditampilkan.
- Pengaturan Creator memuat Informasi Akun, Keamanan, Notifikasi Creator (konten diminta revisi, disetujui, diterbitkan, dan ditarik), serta Tampilan.

### Jenis konten yang dapat dibuat Creator (bertahap)
1. **Artikel blog** — tahap pertama.
2. **Isi lesson** — setelah sistem konten lesson tersedia.
3. **Soal latihan** — terakhir, karena memuat kunci jawaban; kunci jawaban wajib diverifikasi Reviewer.

### Alur penerbitan
`Draf` → `Menunggu Review` → `Perlu Revisi` atau `Disetujui` → `Terbit`

- Konten yang sudah terbit lalu diubah dibuat sebagai revisi baru yang kembali melewati review. Versi yang terbit tetap tayang sampai revisinya disetujui dan diterbitkan.
- Setiap konten mencatat penulis, reviewer, dan tanggal setiap perubahan status.
- Reviewer ikut memeriksa setiap referensi video: relevan, tidak bertentangan dengan isi konten, versi tool masih sesuai, dan bebas konten yang tidak pantas.

### Tahap sebelum backend: menulis di Google Docs
Karena tidak semua Creator memahami GitHub, selama backend belum tersedia:

| Tahap alur | Bentuk |
|---|---|
| Draf | Creator menulis di Google Docs memakai template artikel resmi |
| Menunggu Review | Creator membagikan dokumen ke Reviewer dengan akses komentar |
| Perlu Revisi | Reviewer memberi komentar di dokumen; Creator memperbaiki dan menandai komentar selesai |
| Disetujui | Reviewer menyatakan setuju di dokumen |
| Terbit | Admin mengubah dokumen menjadi file MDX melalui pull request ke `develop`; setelah CI lulus dan di-merge, status artikel diubah menjadi `published` |

Ketentuan:
- Template Google Docs berisi kolom metadata (judul, ringkasan, kategori, sampul, ajakan, sumber) dan contoh format isi (heading, blok kode, Tips, Peringatan, gambar dengan keterangan, tabel).
- Template juga berisi kolom opsional "Referensi Video": link YouTube, nama channel, posisi di dalam konten, dan alasan memilih video tersebut.
- Panduan untuk Creator ditulis dalam bahasa sederhana tanpa istilah Git, dan dapat diakses dari halaman informasi di Mode Creator.
- Panduan teknis konversi dan pull request (`docs/CONTENT_GUIDE.md`) ditujukan untuk Admin.
- Gambar dari dokumen dioptimalkan dan disimpan di repository saat konversi.
- Creator tidak memerlukan akun atau akses GitHub.
- Halaman Konten Saya, Buat Konten, dan Catatan Revisi di aplikasi tetap berupa halaman informasi yang menautkan ke template dan panduan.

### Peralihan ke database
Isi course, lesson, soal kuis, dan artikel disimpan di database (Bagian 6.3). Alur Creator, Reviewer, dan Admin di aplikasi sudah aktif di UAT dan Production saat rilis.
- Seluruh konten yang sudah ada dipindahkan ke database lewat skrip impor.
- Skrip impor aman dijalankan berulang: konten dengan slug yang sama diperbarui, bukan diduplikasi, dan slug tidak pernah berubah.
- Sampai alur di aplikasi aktif di suatu lingkungan, konten baru di lingkungan itu tetap ditulis lewat Google Docs dan dimasukkan dengan skrip impor.

### Tahap antarmuka dengan data dummy
Agar alur ketiga peran dapat dicoba dan diuji sebelum backend tersedia, seluruh antarmuka Creator, Reviewer, dan Admin dibangun sekarang dengan data dummy.

- Antarmuka lengkap hanya tampil di lingkungan DEV. UAT dan Production tetap menampilkan halaman informasi alur Google Docs sampai backend tersedia.
- Data dummy konten, catatan, dan riwayat status dipusatkan di `data/dummy/` dan dapat direset dari DEV.
- Akses data melalui satu lapisan repository (antarmuka) agar implementasi dummy dapat diganti Supabase tanpa mengubah komponen halaman.
- Aksi yang membutuhkan backend (menerbitkan ke blog publik, unggah gambar permanen) disimulasikan dan diberi keterangan "Simulasi" di DEV.
- Aturan alur status dan batasan peran diterapkan di lapisan data, bukan hanya disembunyikan di tampilan.

### Tahap setelah backend: menulis di aplikasi
Backend diprioritaskan agar Creator dapat menulis langsung di aplikasi tanpa alat tambahan.

**Konten Saya**
- Tab status dengan jumlah: Semua, Draf, Menunggu Review, Perlu Revisi, Disetujui, Terbit.
- Kolom: judul, jenis konten, kategori atau course terkait, status, terakhir diubah, dan reviewer.
- Pencarian dan filter jenis konten.
- Aksi mengikuti status:

| Status | Aksi |
|---|---|
| Draf | Edit, Kirim untuk Review, Hapus |
| Menunggu Review | Lihat, Tarik kembali (kembali menjadi Draf) |
| Perlu Revisi | Lihat catatan, Edit |
| Disetujui | Lihat (menunggu diterbitkan Admin) |
| Terbit | Lihat di website, Buat revisi |

- Empty state untuk Creator baru dengan ajakan menulis konten pertama.

**Buat Konten**
- Langkah 1, pilih jenis konten: Artikel blog (aktif); Isi lesson dan Soal latihan ditampilkan terkunci sampai tahapnya tiba.
- Langkah 2, editor:
  - Panel info: judul, ringkasan, kategori, sampul, ajakan ke course atau latihan, dan sumber.
  - Editor isi dengan toolbar: heading, tebal, daftar, blok kode, kotak Tips, kotak Peringatan, gambar, dan tabel.
  - **Upload gambar** langsung dari editor, dengan teks alternatif (wajib) dan keterangan (opsional); format JPG, PNG, atau WebP, maksimal 2 MB; gambar dioptimalkan otomatis.
  - Sisipkan referensi video YouTube dengan menempelkan link; judul dan nama channel diisi otomatis bila tersedia, sedangkan durasi, bahasa, dan alasan memilih video diisi Creator.
  - Pratinjau yang menampilkan konten persis seperti di halaman publik.
  - Simpan otomatis sebagai draf, jumlah kata, dan perkiraan waktu baca.
  - Checklist sebelum kirim sesuai Bagian 16: contoh kode diuji, data bersumber, bahasa diperiksa.
  - Tombol "Simpan Draf" dan "Kirim untuk Review"; kirim hanya aktif jika kolom wajib terisi dan seluruh checklist dicentang.

**Catatan Revisi**
- Dikelompokkan per konten, dengan nama reviewer dan tanggal.
- Dua jenis catatan: **catatan umum** untuk keseluruhan konten, dan **catatan per bagian** yang terhubung ke heading tertentu.
- Creator dapat membalas singkat dan menandai catatan "Sudah diperbaiki".
- Filter: Perlu ditangani dan Selesai.
- Tombol "Kirim ulang untuk Review" nonaktif selama masih ada catatan yang belum ditandai, dengan teks bantuan jumlah catatan yang sudah selesai (mis. "2 dari 3 selesai").
- "Sudah diperbaiki" adalah tanda dari Creator, bukan persetujuan. Seluruh catatan dinyatakan selesai saat Reviewer menyetujui konten. Jika perbaikan belum cukup, Reviewer meminta revisi lagi dengan catatan baru.
- Acuan visual: `docs/desain/` (Bagian 13.2).

**Antrian Review (Reviewer)**
- Tab: Ditugaskan ke saya, Belum ditugaskan, dan Riwayat (konten yang pernah direview).
- Kolom: judul, jenis konten, Creator, tanggal dikirim, kiriman ke berapa (pertama atau ulang), dan lama menunggu.
- Konten "Belum ditugaskan" dapat diambil sendiri oleh Reviewer ("Ambil untuk review"), kecuali konten tulisannya sendiri.
- Pencarian dan filter jenis konten.

**Halaman Review (Reviewer)**
- Pratinjau konten persis seperti halaman publik, beserta panel info (metadata, sumber, ajakan).
- Panel catatan: tambah catatan umum, catatan per bagian (pilih heading), dan catatan per referensi video.
- Untuk kiriman ulang: catatan sebelumnya tampil beserta balasan Creator dan tanda "Sudah diperbaiki".
- Daftar referensi video beserta alasan Creator memilihnya.
- Checklist Reviewer sesuai Bagian 16: akurasi, contoh kode, sumber data, bahasa, dan kelayakan referensi video.
- Keputusan: **Minta Revisi** (wajib minimal satu catatan baru) atau **Setujui** (wajib seluruh checklist Reviewer dicentang).
- Reviewer tidak mengedit isi konten secara langsung.

**Tugas Admin**
Dashboard, Semua Konten (tugaskan reviewer, terbitkan, tarik), dan Kelola Peran diatur di FR-16.

**Notifikasi peran (grup Khusus role, Bagian 4.4)**
- Creator: konten diminta revisi, disetujui, diterbitkan, atau ditarik.
- Reviewer: konten baru ditugaskan kepadanya, dan kiriman ulang dari konten yang pernah ia review.
- Admin: konten baru Disetujui dan siap diterbitkan.

**Fase berikutnya**
- Riwayat versi dan perbandingan antarversi.
- Catatan per paragraf bebas.

### Penulis dan kepemilikan
- Artikel menampilkan nama Creator yang menulisnya; "Tim BelajarAutomation" dipakai untuk tulisan pemilik produk atau tulisan bersama.
- Sebelum Creator mulai menulis, wajib ada kesepakatan tertulis sederhana mengenai hak penggunaan konten oleh platform dan pencantuman nama penulis.
- Kesepakatan dicatat Admin (FR-16). Konten dari Creator yang belum memiliki kesepakatan tercatat tidak dapat diterbitkan.
- Apakah Creator mendapat imbalan masih belum ditentukan (Bagian 12).

---

## FR-16 — Panel Admin

### Tujuan
Menyediakan alat bagi Admin untuk mengelola konten, pengguna, transaksi, katalog, dan operasional platform secara aman dan tercatat.

### Prinsip
- Setiap aksi Admin tercatat di Log Aktivitas Admin: siapa, kapan, aksi, target, dan alasan.
- Aksi yang mengubah hak akses, XP, status akun, atau uang wajib disertai alasan dan dialog konfirmasi.
- Aturan ditegakkan di backend, bukan hanya dengan menyembunyikan tombol.
- Admin tidak pernah melihat kata sandi pengguna dan tidak dapat mengubah status pembayaran yang berasal dari payment gateway.
- Data historis (transaksi, XP, riwayat status) tidak dihapus; perubahan dilakukan dengan catatan koreksi.
- Seluruh tanggal dan jam di Panel Admin, termasuk filter rentang tanggal, "hari ini", dan pengelompokan di Laporan, memakai zona waktu WIB (Asia/Jakarta).
- Seluruh Panel Admin dibangun sekarang dengan data dummy dan hanya tampil di DEV (FR-15 "Tahap antarmuka dengan data dummy"). Aksi yang membutuhkan backend atau payment gateway diberi keterangan "Simulasi".

### Navigasi
| Kelompok | Menu |
|---|---|
| Konten | Dashboard, Semua Konten |
| Pengguna | Pengguna dan Peran, Moderasi |
| Bisnis | Transaksi, Produk Digital |
| Platform | Katalog Belajar, Pengumuman, Mode Maintenance |
| Laporan | Laporan, Log Aktivitas Admin |

- Di sidebar, setiap kelompok menu (Konten, Pengguna, Bisnis, Platform, Laporan) berupa tombol dropdown yang membuka dan menutup daftar menunya. Kelompok yang memuat halaman yang sedang dibuka selalu terbuka, dan pilihan buka atau tutup diingat per browser.
- Di layar lebar, sidebar Panel Admin selalu tampil penuh tanpa tombol sembunyikan sidebar. Di layar kecil, sidebar tetap dibuka dari tombol menu di header.

### A. Dashboard
- Konten: jumlah per status, Menunggu Review yang belum ditugaskan, review yang menunggu lebih dari 3 hari, dan konten Disetujui yang siap diterbitkan.
- Pengguna: total pengguna dan akun aktif, pengguna baru 7 hari terakhir, membership aktif (Pro dan Premium), total XP terkumpul, sebaran pengguna per rank, dan akun yang ditandai Moderasi.
- Aksi Admin terbaru: lima aksi terakhir dari Log Aktivitas Admin.
- Bagian yang belum punya data asli di backend memakai angka contoh dengan label "Data contoh" yang jelas, tidak dapat diklik, dan hanya tampil di DEV dan UAT. Di Production, label dan angka contoh tidak boleh ada.
- Transaksi: transaksi hari ini, transaksi menunggu pembayaran, dan permintaan refund.
- Setiap angka dapat diklik menuju daftar yang sudah terfilter.

### B. Semua Konten
- Seluruh konten dari semua Creator dengan tab status, pencarian, dan filter jenis, Creator, serta Reviewer.
- **Tugaskan Reviewer** untuk konten Menunggu Review; penulis konten tidak dapat dipilih.
- **Terbitkan** konten Disetujui. Terkunci jika Creator belum memiliki kesepakatan tercatat, dengan keterangan penyebabnya.
- **Tarik dari website** konten Terbit dengan alasan wajib; konten kembali menjadi Draf milik Creator dan alasannya tampil sebagai catatan umum.
- Riwayat status setiap konten.

### C. Pengguna dan Peran
- Daftar pengguna dengan pencarian (nama, username, email) dan filter peran, membership, dan status akun.
- Detail pengguna: nama, username, email, tanggal daftar, terakhir aktif, peran, membership dan hak akses, ringkasan belajar (XP, rank, course), riwayat transaksi, dan status akun.
- **Kelola peran:** menambah atau mencabut peran Creator, Reviewer, dan Admin. Admin tidak dapat mencabut peran Admin dari dirinya sendiri jika ia satu-satunya Admin.
- **Nonaktifkan akun** dengan alasan wajib: akun tidak dapat login, tidak tampil di leaderboard maupun profil publik, dan datanya tidak dihapus. Akun dapat diaktifkan kembali. Admin tidak dapat menonaktifkan akunnya sendiri.
- **Kesepakatan Creator:** untuk pengguna berperan Creator, Admin mencatat tanggal kesepakatan dan tautan atau keterangan dokumennya. Daftar pengguna dapat difilter "Creator tanpa kesepakatan".

### D. Moderasi
- Daftar akun yang ditandai otomatis karena pola XP tidak wajar, misalnya lonjakan XP harian di atas batas atau penyelesaian lesson yang terlalu cepat. Batas ditetapkan di Bagian 12.
- Tindakan: **Abaikan**, **Koreksi XP** (alasan wajib; dicatat sebagai transaksi XP koreksi, bukan mengubah riwayat), atau **Sembunyikan dari leaderboard**.
- Koreksi XP juga tersedia di detail pengguna (Pengguna dan Peran): jumlah positif menambah, negatif mengurangi, maksimal 100.000 per koreksi, dan total XP tidak boleh kurang dari 0. Rank, leaderboard, dan profil mengikuti total baru; naik rank karena koreksi tetap memunculkan popup perayaan (FR-05).
- Riwayat tindakan moderasi per akun.

### E. Transaksi dan Hak Akses
- Daftar transaksi: ID, pengguna, paket atau produk, nominal, metode, tanggal, dan status (Menunggu Pembayaran, Berhasil, Gagal, Kedaluwarsa, Refund).
- Pencarian, filter status, dan rentang tanggal.
- Detail transaksi dengan timeline status. Status pembayaran hanya berubah dari payment gateway.
- **Refund** dengan alasan wajib: transaksi berstatus Refund dan hak akses dari transaksi tersebut dicabut. Kebijakan refund ditetapkan di Bagian 12.
- **Berikan hak akses manual** (membership, eBook, atau project) dengan alasan wajib, mis. kompensasi atau hadiah. Tercatat sebagai sumber "Pemberian manual" tanpa transaksi pembayaran.
  - Membership manual: paket Pro atau Premium dengan durasi 30 hari, 90 hari, 1 tahun, atau tanpa batas. Pemberian manual baru menggantikan pemberian manual yang masih berlaku. Alasan minimal 5 karakter.
- **Cabut hak akses manual** dengan alasan wajib. Membership dari pembayaran tidak dicabut lewat aksi ini, melainkan lewat refund.
- Membership yang berlaku langsung menentukan akses avatar dan tema berbayar, diperiksa di database saat pengguna menyimpan pilihan (FR-12).
- Riwayat klaim kredit eBook dan project per pengguna.

### F. Produk Digital
- Daftar eBook dan project dengan status Draf atau Terbit.
- Tambah dan ubah: judul, deskripsi, sampul, harga, file produk, dan status.
- Perubahan harga tidak memengaruhi transaksi yang sudah terjadi.
- File produk hanya dapat diunduh pengguna yang memiliki hak akses (8.3).

### G. Katalog Belajar
- Daftar course dengan status katalog (`available` atau `coming-soon`), status konten (`ready` atau `draft`), dan tingkat akses (`free` atau `premium`).
- Mengubah status dan tingkat akses dengan aturan:
  - Course tidak dapat dijadikan `available` di UAT dan Production jika belum `ready`.
  - Course `free` tidak dapat diubah menjadi `premium` setelah ada pengguna yang mempelajarinya.
  - Perubahan yang membuat total XP dari materi gratis kurang dari batas rank Master ditolak.
- Indikator total XP dari materi gratis dibandingkan batas rank Master.
- Daftar roadmap dan latihan Playground beserta statusnya.
- Selama belum ada backend, sumber kebenaran katalog tetap file data di repository dan `docs/CURRICULUM.md`; perubahan di Panel Admin DEV bersifat simulasi.
- Setelah backend tersedia, sumber kebenaran katalog, isi lesson, dan soal kuis adalah database. `docs/CURRICULUM.md` tetap menjadi acuan rencana kurikulum.

### H. Pengumuman
- Membuat notifikasi untuk pengguna: judul, isi, tautan tujuan, grup notifikasi (Konten baru atau Akun dan sistem), dan target (semua pengguna, pemilik membership tertentu, atau peran tertentu).
- Kirim sekarang atau jadwalkan. Pengumuman terjadwal dapat dibatalkan sebelum terkirim.
- Pratinjau sebelum dikirim dan riwayat pengumuman (Draf, Terjadwal, Terkirim, Dibatalkan).
- Pengumuman tunduk pada preferensi notifikasi pengguna (Bagian 4.4).

### I. Laporan
- Pengguna baru, pengguna aktif 7 dan 30 hari, penjualan per paket dan produk, course yang paling banyak dimulai dan diselesaikan, serta konten terbit.
- Filter rentang tanggal dan ekspor CSV.

### J. Log Aktivitas Admin
- Seluruh aksi Admin: waktu, Admin, aksi, target, dan alasan.
- Pencarian dan filter Admin, jenis aksi, dan rentang tanggal.
- Log tidak dapat diubah atau dihapus.

### K. Mode Maintenance
Menutup situs sementara untuk perbaikan tanpa membuat pengguna kehilangan pekerjaan. Maintenance tidak pernah dimulai mendadak: selalu didahului tahap Persiapan.

**Tahap**

| Tahap | Halaman login | Pengguna yang sedang login |
|---|---|---|
| Terjadwal | Banner berisi jadwal maintenance | Pengumuman grup Akun dan sistem terkirim otomatis saat maintenance dijadwalkan, dan banner jadwal tampil di atas halaman |
| Persiapan | Login masih dapat dilakukan, dengan banner hitung mundur | Banner hitung mundur di semua halaman. Kuis dan latihan baru tidak dapat dimulai; yang sedang dikerjakan boleh diselesaikan. Satu menit sebelum Aktif, tampil peringatan yang lebih menonjol dan jawaban serta draf disimpan otomatis |
| Aktif | Banner maintenance tampil otomatis. Hanya Admin yang dapat login; peran lain ditolak dengan pesan maintenance | Pengguna selain Admin diarahkan ke halaman maintenance |
| Selesai | Banner hilang | Ajakan melanjutkan pekerjaan yang tertunda, mis. "Lanjutkan kuis" |

- Pengguna selain Admin (User, Creator, Reviewer) yang sudah login juga melihat popup maintenance pada tahap Terjadwal dan Persiapan. Popup muncul sekali per tahap dan muncul lagi bila jadwal diubah. Admin hanya melihat banner.
- Mengubah atau membatalkan jadwal juga mengirim pengumuman ke semua pengguna, agar jadwal yang sudah diumumkan tidak menyesatkan.

**Pengaturan Admin**
- Admin menentukan waktu mulai, perkiraan selesai, pesan untuk pengguna, dan lama tahap Persiapan: 5, 10, 20, 30, atau 60 menit (bawaan 30 menit).
- Waktu mulai paling cepat adalah saat ini ditambah lama tahap Persiapan.
- Jadwal dapat diubah atau dibatalkan sebelum maintenance Aktif.
- Admin mengakhiri maintenance secara manual; perkiraan selesai hanya informasi bagi pengguna.
- Menjadwalkan, mengubah, membatalkan, dan mengakhiri maintenance memakai dialog konfirmasi dengan alasan wajib dan tercatat di Log Aktivitas Admin.

**Cakupan**
- Selama Aktif, seluruh halaman tertutup, termasuk halaman publik seperti beranda, blog, dan katalog. Pengecualian: halaman login dan halaman maintenance.
- Hanya Admin yang dapat login dan membuka seluruh situs untuk memeriksa perbaikan. Creator, Reviewer, dan User ikut tertutup.
- Halaman yang tertutup dijawab server dengan kode 503 beserta perkiraan waktu kembali, agar mesin pencari menganggap penutupan bersifat sementara.

**Perlindungan pekerjaan pengguna**
- Jawaban kuis dan latihan tersimpan setiap kali satu soal dijawab, bukan hanya saat dikirim.
- Jawaban yang dikirim saat maintenance Aktif disimpan di perangkat dan dikirim otomatis setelah maintenance selesai, dengan pesan "Jawabanmu aman dan akan dikirim setelah maintenance selesai."
- Batas waktu kuis berhenti selama maintenance; sisa waktu tetap sama saat dilanjutkan.
- Percobaan yang terpotong maintenance tidak dihitung sebagai percobaan, tidak tercatat gagal, dan tidak mengurangi XP.
- Setelah maintenance selesai, pengguna melanjutkan dari soal terakhir, tidak mengulang dari awal.
- Halaman maintenance menyebut pekerjaan yang tersimpan, mis. "Jawabanmu sampai soal 7 tersimpan."
- Draf Creator disimpan otomatis sebelum maintenance Aktif; perubahan yang belum terkirim dikirim setelah situs kembali.

**Tahap data dummy**
- Dibangun sekarang sebagai simulasi DEV seperti bagian Panel Admin lainnya: status maintenance tersimpan per browser, sehingga Admin dan pengguna dicoba di browser yang sama.
- Perlindungan kuis diterapkan saat format kuis dibangun; sebelum itu berlaku untuk latihan Playground dan draf Creator.
- Pemeriksaan status di server, kode 503, dan antrean kiriman ke server menunggu backend.

### L. Profil dan Pengaturan Admin
Di mode Admin, akun bekerja sebagai petugas, bukan pelajar, sehingga profil dan pengaturannya dipisah dari profil pelajar (FR-13). Profil pelajar, avatar, XP, dan rank tetap ada di Mode Belajar.

**Identitas**
- Di mode Admin, header dan menu profil menampilkan inisial nama dalam lingkaran, bukan avatar kucing. Avatar kucing kembali saat beralih ke Mode Belajar.
- Menu profil di mode Admin membuka Profil Admin (`/admin/profil`) dan Pengaturan Admin (`/admin/pengaturan`).

**Profil Admin**
- Nama, email, tanggal bergabung, dan seluruh peran yang dimiliki.
- Status verifikasi dua langkah (aktif atau belum, beserta tanggal aktif bila tersedia).
- Ringkasan kerja: jumlah aksi Admin 30 hari terakhir dan tautan ke Log Aktivitas Admin yang tersaring ke Admin tersebut.
- Tanpa XP, rank, banner, kustomisasi, maupun profil publik.

**Pengaturan Admin**

| Bagian | Isi |
|---|---|
| Informasi Akun | Nama tampilan dapat diubah; email hanya dibaca |
| Keamanan | Ganti password (minimal 8 karakter, dengan konfirmasi); status verifikasi dua langkah dan tombol atur ulang authenticator (dengan konfirmasi; Admin langsung keluar dan wajib memindai kode QR baru saat masuk lagi ke halaman Admin); keluar dari semua perangkat |
| Notifikasi Admin | Akun ditandai Moderasi, review menunggu lebih dari 3 hari, dan transaksi menunggu pembayaran |
| Tampilan | Mode terang, gelap, atau mengikuti sistem |

- Pengaturan khusus pelajar tidak ditampilkan: privasi profil publik, preferensi belajar, kustomisasi avatar, dan hapus akun. Akun Admin tidak dapat menghapus dirinya sendiri.
- Akun demo DEV melihat seluruh bagian, tetapi aksi yang membutuhkan backend (nama, password, verifikasi dua langkah, keluar dari semua perangkat) tidak dapat dijalankan dan diberi keterangan. Pilihan notifikasi tersimpan per browser sampai backend tersedia.

---

# 4. Profil, Preferensi, dan Pengaturan

## 4.1 Profil
Ketentuan profil pengguna diatur di FR-13. Informasi sensitif tidak boleh ditampilkan secara publik tanpa alasan dan persetujuan yang sesuai.

## 4.2 Preferensi Tampilan
Warna website mengikuti brand guideline untuk semua pengguna. Tema banner hanya berlaku untuk Welcome Banner, banner sampul halaman fitur, dan banner profil.

Pengguna dapat mengatur:
- Mode terang atau gelap.
- Avatar kucing aktif, sesuai hak yang dimiliki (FR-12).
- Tema banner aktif, sesuai hak yang dimiliki (FR-12).
- Tampil atau tidak di leaderboard (FR-06).
- Profil dapat dilihat publik atau tidak (FR-13).

## 4.3 Konsistensi Tampilan
Perubahan mode tampilan, avatar, dan tema harus:
- Tidak mengubah data belajar.
- Tidak mengubah XP atau rank.
- Tidak mengubah entitlement produk.
- Tidak menghapus hak avatar atau tema yang telah diperoleh.
- Tetap mempertahankan keterbacaan dan kontras antarmuka.

## 4.4 Notifikasi

### Kelompok notifikasi
| Kelompok | Contoh | Dapat dimatikan |
|---|---|---|
| Progres belajar | Naik rank, course selesai, lulus latihan untuk pertama kali, achievement diperoleh | Ya |
| Konten baru | Course "Segera hadir" menjadi tersedia, latihan baru, eBook atau project baru | Ya |
| Transaksi | Pembayaran berhasil, gagal, atau tertunda; membership aktif; kredit eBook atau project terpakai | Tidak |
| Akun dan sistem | Selamat datang, perubahan kebijakan, jadwal maintenance | Tidak |
| Khusus role | Creator: konten disetujui atau perlu revisi. Reviewer: konten baru di antrean. Admin: transaksi tertunda | Ya |

Tidak dibuat notifikasi untuk: setiap perolehan XP, setiap lesson selesai, perubahan posisi leaderboard, dan pengingat streak harian (dapat dipertimbangkan setelah ada penjadwal di server).

Notifikasi mengikuti mode aktif (FR-15): di mode peran hanya tampil notifikasi Khusus role serta Akun dan sistem; kelompok lain tampil di Mode Belajar.

Notifikasi achievement hanya berfungsi sebagai penunjuk ke tab Pencapaian di profil; badge achievement tetap hanya ditampilkan di profil (FR-14).

### Tampilan
- **Lonceng di header:** menampilkan jumlah belum dibaca, maksimal "9+".
- **Desktop:** klik lonceng membuka popover di bawahnya berisi maksimal 5 notifikasi terbaru, tombol "Tandai semua dibaca", dan tautan "Lihat semua notifikasi". Klik lonceng tidak memindahkan halaman.
- **Mobile:** klik lonceng membuka halaman notifikasi atau panel dari bawah layar.
- **Halaman `/notifications`** berfungsi sebagai arsip: judul "Notifikasi", tab Semua dan Belum dibaca, filter per kelompok, tombol "Tandai semua dibaca", dan pengelompokan per tanggal (Hari ini, Kemarin, lalu tanggal lengkap).
- Notifikasi belum dibaca dibedakan secara visual.
- Notifikasi sejenis yang muncul berdekatan digabung, mis. "3 course baru tersedia".
- Empty state saat tidak ada notifikasi.

### Acuan tampilan
| Kelompok | Warna aksen | Ikon |
|---|---|---|
| Konten baru | Biru | Buku |
| Progres belajar | Ungu | Target atau piala |
| Transaksi | Hijau | Kartu pembayaran |
| Akun dan sistem | Kuning | Roda gigi |
| Khusus role | Oranye | Pensil |

- Ikon dan warna konsisten di popover, halaman, mobile, dan modal.
- Format waktu: relatif untuk kurang dari 24 jam ("5 menit lalu", "2 jam lalu"); di atas itu "Kemarin, 20.14" atau "30 Okt, 14.22".
- Popover: lebar sekitar 360px; setiap item berisi ikon kelompok dalam kotak membulat, judul tebal, isi maksimal 2 baris, dan waktu.
- Halaman: tab berupa tombol pil, filter kelompok berupa dropdown "Semua kelompok", tombol "Tandai semua dibaca", dan setiap item memiliki penanda panah.
- Mobile: halaman notifikasi dengan tombol kembali di kiri judul.
- Modal pengumuman: ikon kelompok, judul, isi lengkap, dan tombol "Mengerti".
- Teks notifikasi membership mengikuti model Lifetime (FR-10), mis. "Membership Premium aktif. Kamu dapat mengakses materi premium yang termasuk dalam paketmu." Notifikasi tidak boleh menjanjikan akses ke seluruh konten premium.

### Tujuan klik
Klik notifikasi menandainya sebagai dibaca dan langsung membuka halaman terkait:

| Notifikasi | Tujuan |
|---|---|
| Naik rank, achievement diperoleh | Profil (tab Ringkasan atau Pencapaian) |
| Course selesai, course baru tersedia | Halaman detail course |
| Lulus latihan, latihan baru | Halaman latihan |
| eBook atau project baru | Halaman detail produk |
| Transaksi | Detail transaksi |
| Membership aktif | Halaman membership |
| Konten perlu revisi atau disetujui (Creator) | Konten terkait beserta catatan |
| Konten baru di antrean (Reviewer) | Antrean review |

- Pengumuman tanpa halaman tujuan (kebijakan, maintenance) dibuka dalam modal berisi teks lengkap.
- Jika halaman tujuan sudah tidak tersedia, arahkan ke halaman notifikasi dengan pesan "Konten ini sudah tidak tersedia".

### Saluran
1. Di website (lonceng dan halaman notifikasi): tahap awal.
2. Email: setelah backend tersedia; wajib untuk transaksi, opsional untuk kelompok lain. Dikirim lewat Resend: email akun (verifikasi, reset password) dari Supabase Auth, dan email transaksi dari antrean di database yang dicoba ulang bila gagal. Pengumuman massal lewat email menyusul setelah kuota dan reputasi pengirim siap.
3. Push notification browser: fase berikutnya.

### Preferensi
- Halaman pengaturan menyediakan toggle per kelompok yang dapat dimatikan, serta toggle email terpisah.
- Kelompok Transaksi dan Akun ditampilkan sebagai "Selalu aktif".

### Penyimpanan
- Notifikasi berusia lebih dari 90 hari dihapus otomatis.
- Status dibaca tersimpan per pengguna di backend.

## 4.5 Masuk dan Daftar

### Metode
- Email dan password.
- Akun Google: tombol "Masuk dengan Google" di halaman masuk dan "Daftar dengan Google" di halaman daftar, di bawah tombol utama form email (Masuk atau Buat Akun), dipisah garis "atau".

### Daftar dengan email
- Isian: nama lengkap, username (FR-13), email, password (minimal 8 karakter), konfirmasi password, dan persetujuan syarat dan ketentuan.
- Ketersediaan username diperiksa sebelum akun dibuat.
- Setelah mendaftar, pengguna diminta membuka tautan verifikasi di email. Akun baru dapat dipakai untuk masuk setelah email terverifikasi.
- Untuk email yang sudah terdaftar, tampilan tetap sama seperti pendaftaran berhasil, agar keberadaan akun tidak dapat ditebak.
- Email verifikasi dapat dikirim ulang dari halaman daftar dan dari halaman masuk jika email belum terverifikasi.
- Email verifikasi berbahasa Indonesia dengan identitas belajarautomation.com, subjek "Verifikasi email akun belajarautomation.com". Desain mengikuti mockup pemilik: header gelap dengan logo, ilustrasi kucing dengan perisai centang, judul "Verifikasi Email Anda", tombol "Verifikasi Akun Sekarang", masa berlaku tautan, kotak "Tidak merasa mendaftar?", dan footer dengan logo serta fitur utama, ditambah tautan cadangan bila tombol tidak berfungsi. Template disimpan di `supabase/templates/confirm-signup.html`; gambarnya PNG di `public/email/` karena sebagian aplikasi email tidak mendukung WebP. Teks masa berlaku mengikuti pengaturan Email OTP Expiration. Template hanya dapat dipasang setelah SMTP kustom (Resend) tersedia; sebelum itu Supabase memakai template bawaan.

### Lupa password
- Tautan "Lupa password?" di halaman masuk membuka halaman permintaan reset.
- Pesan setelah meminta reset selalu sama, terdaftar atau tidak emailnya.
- Tautan di email membuka halaman "Buat password baru". Tautan kedaluwarsa atau tidak valid diarahkan ke halaman masuk dengan pesan untuk meminta tautan baru.

### Akun demo
- Akun demo per peran hanya dapat dipakai di DEV, atau di lingkungan yang belum memasang Supabase. Di UAT dan Production dengan Supabase, masuk hanya lewat akun sungguhan.
- Daftar akun demo tidak ditampilkan di halaman masuk agar form tetap ringkas; daftarnya ada di README.

### Panel promosi
- Di desktop, sisi kiri halaman masuk dan daftar menampilkan 3 slide promosi; di layar kecil panel ini tidak ditampilkan agar form tetap di atas.
- Slide awal: poster belajarautomation.com, koleksi avatar kucing, dan eBook.
- Panel berupa bingkai potret 3:4 yang tingginya mengikuti layar; form mengisi sisa ruang. Titik navigasi dan tombol jeda berada di bawah bingkai.
- Slide poster ditampilkan utuh tanpa teks tambahan, dengan teks alternatif yang menjelaskan isinya. Poster disimpan di `public/auth-slides/` (potret 3:4).
- Slide bergeser otomatis setiap 6 detik dan berhenti saat diarahkan mouse atau difokuskan. Tersedia titik navigasi, tombol jeda, dan dapat digeser.
- Pengguna yang mengaktifkan "kurangi gerakan" tidak melihat pergeseran otomatis.
- Isi promosi harus sesuai kondisi nyata: fitur yang belum tersedia di lingkungan tersebut diberi label "Segera hadir".
- Isi slide dikelola lewat file data sampai pengelolaannya tersedia di Panel Admin (Fase 6).

### Aturan akun Google
- Pengguna baru yang mendaftar dengan Google memilih username satu kali sebelum memakai aplikasi, karena username dipakai di profil publik (FR-13). Nama tampilan dan foto diambil dari akun Google dan dapat diubah.
- Jika email Google sudah terdaftar dengan password dan email tersebut terverifikasi oleh Google, akun disambungkan; tidak dibuat akun baru.
- Semua peran dapat masuk dengan Google. Admin tetap wajib verifikasi dua langkah di aplikasi (8.3).
- Akun nonaktif tetap ditolak (FR-16 C), dan selama maintenance Aktif hanya Admin yang dapat masuk (FR-16 K).

### Tahap
- Sebelum backend: tombol tampil dengan keterangan "Segera hadir" dan tidak dapat dipakai.
- Setelah backend: memakai login Google dari Supabase Auth. Pemilik menyiapkan project Google Cloud, layar persetujuan OAuth (nama aplikasi, logo, tautan kebijakan privasi), Client ID dan Secret, serta alamat redirect untuk DEV, UAT, dan Production.

## 4.6 Pemberitahuan Aksi dan Koneksi
Alert singkat di atas tengah layar memberi tahu hasil aksi pengguna dan perubahan koneksi internet. Berlaku di semua halaman dan semua mode (Belajar, Creator, Reviewer, Admin).

### Kapan tampil
| Kejadian | Jenis | Contoh |
|---|---|---|
| Simpan, buat, atau ubah berhasil | Sukses | "Profil tersimpan." |
| Hapus berhasil | Info | "Membership Pro Lifetime dihapus dari keranjang." |
| Simpan gagal karena server atau aturan | Error | "Username sudah dipakai. Pilih yang lain." |
| Koneksi internet terputus | Peringatan | "Koneksi internet terputus. Perubahan belum bisa disimpan sampai koneksi kembali." |
| Koneksi internet kembali | Sukses | "Koneksi internet kembali." |

### Aturan
- Posisi atas tengah; di layar kecil selebar layar dengan jarak tepi 16px. Paling banyak 3 alert bertumpuk, yang terbaru di atas.
- Sukses dan info tampil 4 detik, error dan peringatan 8 detik. Semua alert dapat ditutup dengan tombol tutup.
- Alert koneksi terputus tetap tampil sampai koneksi kembali, lalu diganti alert koneksi kembali.
- Kesalahan pada isian tertentu (mis. format username) tetap ditampilkan di bawah isiannya, bukan sebagai alert, agar dekat dengan yang perlu diperbaiki.
- Status yang menetap di halaman (mis. "Lesson selesai") tetap di halaman, bukan alert.
- Pesan di halaman latihan Playground adalah bagian dari soal dan tidak diubah menjadi alert.
- Pembaca layar mengumumkan error dan peringatan segera, serta sukses dan info tanpa memotong.

### Tahap penerapan
- Tahap 1: sistem alert, alert koneksi, dan fitur Pelajar (Pengaturan profil, Kustomisasi, keranjang).
- Tahap 2: aksi Creator, Reviewer, dan Admin (buat, ubah, hapus konten, review, kelola pengguna, dan lainnya).

## 4.7 Popup Promosi
Popup di tengah layar yang memberi tahu promosi atau info terbaru (mis. eBook, project, avatar, atau tema baru).

- Tampil satu kali setiap pengguna masuk lewat halaman masuk, di halaman pertama setelah masuk. Tidak tampil saat pengguna membuka situs dengan sesi yang masih aktif.
- Hanya di Mode Belajar. Bila popup maintenance sedang berlaku, popup promosi tidak ditampilkan.
- Berisi gambar, judul, deskripsi, tombol ajakan (opsional), "Nanti saja", dan "Jangan tampilkan lagi".
- "Nanti saja" menutup popup; popup tampil lagi di login berikutnya.
- "Jangan tampilkan lagi" menutup popup dan tidak menampilkan promosi itu lagi untuk akun tersebut. Promosi baru dengan id berbeda tetap tampil.
- Isi promosi harus sesuai kondisi nyata.
- Satu promosi aktif dalam satu waktu, dikelola lewat file data sampai tersedia di Panel Admin (Fase 6). Pilihan "Jangan tampilkan lagi" disimpan di browser sampai tersedia di backend.

---

# 5. Model Akses dan Monetisasi

## 5.1 Matriks Akses

| Fitur atau Produk | Basic | Pro | Premium |
|---|---|---|---|
| Dashboard | Ya | Ya | Ya |
| Course gratis | Ya | Ya | Ya |
| Course premium (yang tersedia saat pembelian) | Katalog dan cuplikan | Ya | Ya |
| Roadmap | Ya | Ya | Ya |
| Kuis dan challenge course gratis | Ya | Ya | Ya |
| Kuis dan challenge course premium | Tidak | Ya | Ya |
| XP dan rank | Ya, hingga Master | Ya | Ya |
| Leaderboard | Ya | Ya | Ya |
| Blog publik | Ya | Ya | Ya |
| Katalog dan preview eBook | Ya | Ya | Ya |
| Isi lengkap eBook | Beli terpisah | Beli terpisah atau 1 kredit | Beli terpisah atau 3 kredit |
| Katalog dan preview project | Ya | Ya | Ya |
| Isi lengkap project | Beli terpisah | Beli terpisah atau 1 kredit | Beli terpisah atau 3 kredit |
| Mode terang/gelap | Ya | Ya | Ya |
| Emblem tameng rank | Sesuai rank | Sesuai rank | Sesuai rank |
| Avatar dan tema banner gratis | Ya | Ya | Ya |
| Avatar dan tema banner berbayar | Tidak | Sesuai paket | Sesuai paket |
| Bonus XP atau rank karena pembayaran | Tidak ada | Tidak ada | Tidak ada |

## 5.2 Entitlement
Entitlement adalah catatan hak akses pengguna terhadap suatu produk atau benefit.

Sistem harus dapat membedakan:
- Hak akses yang berasal dari pembelian individual.
- Tingkat membership yang dimiliki pengguna (Basic, Pro, Premium) beserta versi paketnya.
- Hak akses course premium beserta daftar course yang termasuk pada saat pembelian.
- Hak akses yang berasal dari klaim kredit membership.
- Hak avatar dan tema banner yang berasal dari paket tertentu.
- Kredit yang masih tersedia.
- Kredit yang telah digunakan.

Entitlement produk harus tetap mengikuti ketentuan lisensinya.

## 5.3 Aturan Pembelian dan Klaim
- Setiap transaksi memiliki identitas unik.
- Pembelian yang berhasil harus tercatat.
- Status pembayaran harus diverifikasi.
- Klaim produk harus dicatat dan tidak dapat digandakan.
- Kredit harus terkait dengan paket dan pemiliknya.
- Akses course premium dan produk tidak boleh hanya ditentukan oleh status membership di frontend.
- Sistem harus mencegah klaim atau aktivasi benefit berulang melalui permintaan yang dimanipulasi.

---

# 6. Konsep Arsitektur Sistem

Bagian ini merupakan gambaran konseptual, bukan keputusan final teknologi.

## 6.1 Frontend
Tanggung jawab:
- Menampilkan halaman dan komponen antarmuka.
- Menangani interaksi pengguna.
- Menampilkan materi.
- Menampilkan progress.
- Mengirim permintaan ke backend.
- Menampilkan status akses dan hasil transaksi.

## 6.2 Backend API
Tanggung jawab:
- Autentikasi dan otorisasi.
- Pengelolaan profil.
- Pengelolaan materi dan progress.
- Validasi jawaban kuis dan challenge.
- Perhitungan dan pencatatan XP.
- Penghitungan rank.
- Pengelolaan leaderboard.
- Verifikasi transaksi.
- Pengelolaan entitlement produk.
- Pengelolaan membership, akses course premium, dan klaim kredit.
- Penyimpanan preferensi pengguna.

## 6.3 Database
Backend memakai Supabase: Auth untuk autentikasi, Postgres untuk database dengan Row Level Security sebagai penegak hak akses, dan Storage untuk gambar konten serta file produk. Region Singapura (`ap-southeast-1`), yang paling dekat dengan pengguna Indonesia.

Rancangan tabel, indeks, aturan akses, perkiraan beban, dan tahapan pembangunan ada di `docs/DATABASE.md`. Jika dokumen tersebut bertentangan dengan PRD, PRD yang berlaku.

Database menjadi sumber data persisten untuk:
- Pengguna.
- Konten.
- Progress.
- Riwayat aktivitas.
- XP dan rank.
- Transaksi.
- Hak akses produk.
- Paket membership.
- Klaim benefit.
- Preferensi pengguna.

Isi konten:
- Isi course, lesson, soal kuis, dan artikel disimpan di database.
- Halaman publik tetap dibuat statis dari isi database saat build, lalu hanya halaman yang berubah yang diperbarui saat konten diterbitkan atau ditarik. Pembaca tidak memicu kueri database (Bagian 8.2).
- Kunci jawaban kuis dan latihan tidak pernah dikirim ke browser. Penilaian tetap dilakukan di server.

Lingkungan:

| Lingkungan | Paket Supabase | Catatan |
|---|---|---|
| DEV | Free | Data uji dan data dummy |
| UAT | Free | Berhenti otomatis bila tidak dipakai sekitar seminggu; diaktifkan kembali dari dashboard Supabase sebelum pengujian |
| Production | Pro | Backup harian; compute ditambah berdasarkan metrik, bukan perkiraan |

## 6.4 Prinsip Arsitektur
- Validasi penting dilakukan di backend.
- Hak akses tidak boleh bergantung pada data lokal browser.
- Operasi pembayaran dan klaim harus aman dari duplikasi.
- Perubahan skema data harus dapat dikelola melalui migrasi.
- Pemisahan tanggung jawab antarkomponen harus jelas.
- Struktur saat ini perlu diaudit sebelum memilih perubahan arsitektur besar.
- Jangan mengganti teknologi yang sudah digunakan tanpa alasan teknis yang kuat.

---

# 7. Entitas Data Konseptual

Entitas berikut adalah model konseptual awal. Nama tabel, tipe data, relasi, dan implementasi final harus mengikuti hasil audit kode dan desain database.

## 7.1 User
Menyimpan identitas dan informasi dasar pengguna, beserta perannya: `student` (Pelajar, dimiliki setiap akun), `creator`, `reviewer`, dan `admin`.

## 7.2 UserPreferences
Menyimpan preferensi tampilan dan pengaturan pengguna.

## 7.3 LearningContent
Menyimpan informasi materi pembelajaran, termasuk isi teks lesson dan daftar referensi video (ID video YouTube, judul, nama channel, durasi, bahasa, posisi di dalam lesson, dan status ketersediaan terakhir).

## 7.4 LearningProgress
Mencatat status dan progress materi pengguna.

## 7.5 QuizAttempt
Mencatat sesi pengerjaan kuis, jawaban yang tersimpan per soal, sisa waktu, dan hasilnya. Percobaan yang terpotong maintenance ditandai tertunda dan tidak dihitung (FR-16 K).

## 7.6 ChallengeSubmission
Mencatat pengiriman jawaban challenge dan hasil validasinya.

## 7.7 XPTransaction
Mencatat perubahan XP beserta sumber aktivitasnya.

## 7.8 RankDefinition
Menyimpan definisi rank, aturan progresinya, warna identitas, dan aset emblem tameng.

## 7.9 LeaderboardSnapshot
Menyimpan snapshot peringkat jika strategi leaderboard membutuhkan riwayat atau periode tertentu.

## 7.10 EbookProduct
Menyimpan katalog eBook.

## 7.11 ProjectProduct
Menyimpan katalog produk project.

## 7.12 MembershipPackage
Menyimpan identitas paket (Pro, Premium), versi, harga, benefit, jumlah kredit, dan daftar course premium yang termasuk.

## 7.13 Purchase
Mencatat transaksi pembelian dan status pembayaran.

## 7.14 PackageEntitlement
Mencatat membership yang dimiliki pengguna, termasuk tanggal pembelian dan daftar course premium yang menjadi haknya.

## 7.15 ProductEntitlement
Mencatat hak akses pengguna terhadap produk tertentu.

## 7.16 BenefitClaim
Mencatat penggunaan kredit produk dari membership Pro atau Premium.

## 7.17 AvatarDefinition
Menyimpan definisi avatar kucing: ID, nama, jenis kucing, gaya, aset ukuran kecil dan besar, serta tingkat akses.

## 7.18 ThemeDefinition
Menyimpan definisi tema banner: ID, nama, aset latar mode terang dan gelap, thumbnail, serta tingkat akses.

## 7.19 UserAppearance
Mencatat avatar dan tema aktif yang dipilih pengguna. Dapat menjadi bagian dari UserPreferences.

## 7.20 CosmeticEntitlement
Mencatat hak pengguna atas avatar dan tema beserta sumbernya (gratis atau membership tertentu). Dapat menjadi bagian dari PackageEntitlement.

## 7.21 AchievementDefinition
Menyimpan definisi achievement: ID, nama, deskripsi syarat, kategori, ikon, dan target progres.

## 7.22 UserAchievement
Mencatat achievement yang diperoleh pengguna, tanggal diperoleh, dan progres achievement bertahap.

## 7.23 AdminAuditLog
Mencatat setiap aksi Admin: waktu, Admin, aksi, target, alasan, dan data sebelum serta sesudah perubahan.

## 7.24 CreatorAgreement
Mencatat kesepakatan tertulis Creator: pengguna, tanggal, tautan atau keterangan dokumen, dan Admin yang mencatat.

## 7.25 ModerationFlag
Mencatat penandaan akun oleh sistem moderasi, alasan penandaan, dan tindakan Admin.

## 7.26 Announcement
Menyimpan pengumuman: isi, tautan, grup notifikasi, target, jadwal, status, dan pembuat.

## 7.27 MaintenanceWindow
Menyimpan jadwal maintenance: waktu mulai, perkiraan selesai, lama tahap Persiapan, pesan, status (Terjadwal, Persiapan, Aktif, Selesai, Dibatalkan), Admin pembuat, serta waktu dan Admin yang mengakhirinya.

### Prinsip penting
- Riwayat transaksi tidak boleh bergantung pada status tampilan frontend.
- Kuota klaim harus dapat diaudit.
- Entitlement harus dapat ditelusuri ke sumber hak aksesnya.
- XP harus memiliki catatan transaksi.
- Data historis yang diperlukan untuk audit tidak boleh dihapus hanya karena pengguna mengubah preferensi.

---

# 8. Non-Functional Requirements

## 8.1 Responsivitas
Aplikasi harus dapat digunakan pada desktop, tablet, dan perangkat mobile.

## 8.2 Performance
- Halaman tidak boleh memuat data yang tidak diperlukan.
- Daftar konten harus dapat dikembangkan tanpa membuat halaman semakin berat secara tidak terkendali.
- Gambar produk dan materi perlu dioptimalkan.
- Embed video pihak ketiga dimuat hanya saat pengguna mengklik putar.
- Proses yang berat harus dipertimbangkan untuk dijalankan secara asinkron jika diperlukan.
- Halaman publik (blog, katalog, detail course, lesson, roadmap, detail latihan) disiapkan saat build dan disajikan dari CDN. Data pribadi di halaman tersebut diambil terpisah agar halaman tetap bisa di-cache.
- Walaupun isi konten disimpan di database, halaman publik tidak membaca database setiap kali dibuka. Halaman diperbarui per halaman saat konten diterbitkan atau ditarik.
- Total XP, rank, dan jumlah materi selesai disimpan sebagai ringkasan yang diperbarui saat XP bertambah, bukan dihitung ulang dari seluruh riwayat setiap kali halaman dibuka.
- Leaderboard dibaca dari snapshot yang diperbarui berkala (7.9), bukan mengurutkan seluruh pengguna setiap kali dibuka.
- Daftar panjang memakai pagination dan tidak memuat seluruh data ke browser.
- Splash screen tampil sekali per browser, bukan setiap kali membuka tab baru.

### Target
Diukur untuk 1 juta pengguna terdaftar, dengan perkiraan beban di `docs/DATABASE.md` Bagian 2.

| Ukuran | Target |
|---|---|
| LCP halaman publik (HP kelas menengah, 4G) | ≤ 2,5 detik |
| Waktu respons halaman statis | ≤ 100 ms dari CDN |
| Respons API (p95) | ≤ 300 ms |
| Kueri database (p95) | ≤ 50 ms |
| JavaScript halaman publik (terkompres) | ≤ 250 KB |

## 8.3 Security
- Autentikasi dan otorisasi harus diterapkan sesuai kebutuhan.
- Hak akses produk harus diperiksa di backend.
- Input pengguna harus divalidasi.
- Data transaksi harus dilindungi.
- Kunci rahasia tidak boleh disimpan dalam kode frontend.
- Operasi penting harus aman terhadap duplikasi permintaan.
- Akses terhadap file produk berbayar harus mengikuti entitlement.
- Akun Admin wajib memakai verifikasi dua langkah saat backend tersedia.
  - Metode: kode 6 digit (TOTP) dari aplikasi authenticator, mis. Google Authenticator, Microsoft Authenticator, atau Authy.
  - Pertama kali membuka halaman Admin, Admin memindai kode QR (atau memasukkan kode rahasia secara manual), lalu memasukkan kode untuk mengaktifkannya.
  - Setiap sesi berikutnya, halaman Admin baru terbuka setelah Admin memasukkan kode 6 digit. Kode yang salah atau kedaluwarsa ditolak dengan pesan yang jelas.
  - Aksi Admin di database hanya berlaku untuk sesi yang sudah lolos verifikasi dua langkah, jadi melewati halaman verifikasi di browser tidak memberi akses.
- Halaman dan aksi Admin hanya dapat diakses pengguna berperan Admin, diperiksa di backend.
- Status maintenance diperiksa di server; penolakan login dan penutupan halaman selama maintenance tidak hanya dilakukan di frontend (FR-16 K).

## 8.4 Data Integrity
- Progress belajar harus konsisten.
- XP tidak boleh terduplikasi karena pengiriman ulang permintaan.
- Klaim produk harus bersifat atomik dan tidak dapat melampaui kuota.
- Status pembayaran dan hak akses harus konsisten.
- Perubahan paket tidak boleh menghapus benefit lama yang telah dijanjikan.

## 8.5 Maintainability
- Komponen antarmuka harus dapat digunakan kembali.
- Aturan bisnis tidak boleh tersebar secara tidak terkendali di banyak komponen frontend.
- Skema database dan migrasi harus terkelola.
- Konfigurasi rank, avatar, tema, achievement, dan paket sebaiknya tidak mengharuskan perubahan kode pada setiap perubahan konten.
- Dokumentasi implementasi harus diperbarui saat arsitektur berubah.

## 8.6 Accessibility dan Usability
- Kontras teks minimal 4,5:1 untuk teks normal dan 3:1 untuk teks besar, di mode terang maupun gelap (setara WCAG 2.1 AA).
- Kontrol interaktif harus jelas.
- Navigasi keyboard perlu diperhatikan.
- Status error, loading, empty state, dan success harus informatif.

---

# 9. Aturan Bisnis Utama

1. Materi dasar tersedia gratis; sebagian materi lanjutan bersifat premium sesuai `docs/CURRICULUM.md`.
2. Kuis dan challenge pada course gratis dapat diakses pengguna Basic.
3. XP hanya berasal dari aktivitas yang memenuhi aturan validasi.
4. Rank tidak dapat dibeli dan rank Master wajib dapat dicapai hanya dari konten gratis.
5. Membership tidak memberikan bonus XP atau rank; XP dari materi premium dihitung dengan aturan yang sama.
6. eBook dan project dijual secara individual dan dapat dibeli oleh semua pengguna.
7. Membership terdiri dari Basic (gratis), Pro, dan Premium dengan model Lifetime untuk materi yang tersedia pada saat pembelian.
8. Kredit produk hanya berlaku sesuai paket: Pro 1 eBook + 1 project, Premium 3 eBook + 3 project.
9. Kredit bukan uang tunai dan tidak dapat dipindahtangankan.
10. Klaim bersifat satu kali per produk yang dipilih dan tidak diisi ulang secara berkala.
11. Klaim dicatat secara persisten di backend.
12. Hak akses produk mengikuti lisensi produk.
13. Paket versi baru tidak otomatis memberikan benefit baru kepada pemilik paket lama.
14. Benefit yang telah dijanjikan kepada pemilik paket lama harus tetap dihormati.
15. Identitas visual rank tidak berubah saat pengguna mengganti mode tampilan, avatar, atau tema.
16. Data pengguna tidak boleh dibuat seolah-olah nyata ketika data belum tersedia di lingkungan produksi. Data dummy hanya untuk tahap pengembangan dan wajib dihapus sebelum rilis.
17. Seluruh aturan akses dan transaksi penting harus divalidasi oleh backend.
18. Warna website ditetapkan biru dan putih; pengguna hanya memilih mode terang atau gelap.
19. Avatar dan tema banner bersifat kosmetik dan tidak memengaruhi XP, rank, maupun leaderboard.
20. Emblem rank berupa tameng dan terpisah dari avatar; maskot dan avatar tidak digunakan sebagai emblem rank.
21. Pengguna Basic memakai avatar dan tema gratis; avatar dan tema berbayar diperoleh melalui membership Pro atau Premium.
22. Avatar dan tema tidak boleh memakai kombinasi warna identitas rank.
23. Rank tidak memiliki level maupun sub-tingkat.
24. Achievement hanya ditampilkan di profil dan tidak memberikan XP.
25. Setiap aksi Admin tercatat dan tidak dapat dihapus.
26. Konten dari Creator tanpa kesepakatan tertulis tercatat tidak dapat diterbitkan.
27. Koreksi XP dan hak akses dilakukan dengan catatan baru, bukan mengubah riwayat.

---

# 10. Prioritas Implementasi

Pengembangan harus dilakukan secara bertahap agar perubahan tidak merusak fitur yang sudah tersedia.

## Phase 0 — Audit Sistem Saat Ini
- Audit struktur repository.
- Identifikasi framework dan library.
- Periksa halaman dan komponen yang sudah ada.
- Periksa skema database.
- Periksa autentikasi.
- Periksa sumber data konten.
- Identifikasi fitur yang masih menggunakan local state atau local storage.
- Dokumentasikan kesenjangan terhadap PRD.

**Output:** Audit report dan daftar pekerjaan teknis.

## Phase 1 — Fondasi Aplikasi
- Menetapkan struktur aplikasi berdasarkan hasil audit.
- Menyelesaikan autentikasi dan identitas pengguna sesuai kebutuhan.
- Menyiapkan model data inti.
- Menyiapkan akses database dan validasi.
- Menetapkan pola API.
- Menyediakan state loading, error, dan empty state.

**Output:** Fondasi aplikasi yang dapat dikembangkan dan diuji.

## Phase 2 — Learning Center dan Progress
- Katalog materi.
- Pencarian.
- Filter dan kategori.
- Detail materi.
- Modul pembelajaran.
- Penyimpanan progress.
- Integrasi progress dengan dashboard.

**Output:** Pengguna dapat belajar dan melanjutkan materi dengan progress persisten.

## Phase 3 — Playground, XP, Rank, dan Leaderboard
- Daftar latihan.
- Pilihan ganda.
- Challenge.
- Validasi jawaban.
- Pencatatan XP.
- Perhitungan rank.
- Emblem tameng untuk keenam rank.
- Anti-abuse.
- Leaderboard.

**Output:** Sistem latihan dan gamifikasi yang adil dan dapat diaudit.

## Phase 4 — Roadmap
- Daftar jalur.
- Definisi urutan materi.
- Visualisasi node dan garis.
- Informasi skill.
- Tombol Lihat Materi.
- Integrasi ke Learning Center.

**Output:** Pengguna dapat mengikuti jalur belajar yang terstruktur.

## Phase 5 — Blog dan Produk Digital
- Katalog eBook.
- Detail dan preview produk.
- Katalog project.
- Detail dan preview project.
- Mekanisme pembelian.
- Verifikasi pembayaran.
- Entitlement produk.

**Output:** Pengguna dapat membeli dan mengakses produk digital sesuai haknya.

## Phase 6 — Membership
- Katalog paket Basic, Pro, dan Premium.
- Penandaan dan pembatasan akses course premium.
- Detail benefit.
- Pembelian paket.
- Aktivasi entitlement.
- Katalog avatar dan tema banner, koleksi di Kustomisasi profil, dan pemilihan item aktif.
- Kredit produk.
- Alur klaim eBook.
- Alur klaim project.
- Riwayat klaim.
- Pengujian keamanan dan konsistensi transaksi.

**Output:** Sistem membership dengan akses dan benefit yang transparan dan persisten.

## Phase 7 — Career dan Pengembangan Lanjutan
- Melihat profil pengguna lain dari leaderboard.
- Ruang chat komunitas.
- Konten karier.
- Panduan portofolio.
- Persiapan wawancara.
- Fitur tambahan berdasarkan kebutuhan pengguna.

**Output:** Perluasan platform setelah fondasi utama stabil.

---

# 11. Kriteria Penerimaan Produk

## Dashboard
- Dashboard menampilkan data sesuai pengguna.
- Layout responsif.
- Progress dan statistik tidak menggunakan angka palsu.
- Pengguna dapat melanjutkan materi.
- Kalender menggunakan aktivitas yang tersimpan.

## Learning Center
- Pengguna dapat mencari materi.
- Filter dapat digunakan.
- Materi dapat dibuka.
- Progress tersimpan dan dapat dipulihkan.
- Lesson dapat dipelajari lengkap tanpa memutar video referensi.
- Video referensi baru memuat player YouTube setelah diklik dan menampilkan judul serta nama channel.

## Roadmap
- Pengguna dapat melihat jalur belajar.
- Materi ditampilkan sebagai node yang terhubung.
- Skill yang dipelajari dijelaskan.
- Tombol Lihat Materi membuka materi terkait.

## Playground
- Pengguna dapat memulai latihan.
- Jawaban pilihan ganda dapat divalidasi.
- Challenge dapat diproses sesuai mekanisme penilaian.
- Hasil pengerjaan tersimpan.
- Pengulangan tidak memberikan XP tanpa batas.

## XP dan Rank
- XP dihitung berdasarkan aturan yang valid.
- Rank dihitung dari total XP dan konfigurasi rank.
- Perubahan XP tercatat.
- Status membership tidak memberikan bonus XP atau rank secara langsung.

## Leaderboard
- Peringkat berasal dari data valid.
- Semua tingkat membership menggunakan aturan XP yang sama.
- Aktivitas pembayaran tidak menambah skor.

## Produk Digital
- Katalog dan preview dapat dilihat.
- Produk berbayar hanya dapat diakses jika pengguna memiliki entitlement yang valid.
- Pembelian tercatat.
- Hak akses tetap sesuai ketentuan lisensi.

## Membership
- Perbedaan Basic, Pro, dan Premium terlihat jelas sebelum pembayaran, termasuk daftar course premium yang termasuk.
- Pengguna Basic dapat melihat katalog dan cuplikan course premium, tetapi tidak dapat membuka isi lengkapnya.
- Pengguna Pro dan Premium dapat membuka course premium yang termasuk dalam pembeliannya.
- Rank Master dapat dicapai oleh pengguna Basic.
- Benefit paket terlihat sebelum pembayaran.
- Pembayaran diverifikasi.
- Kredit tercatat.
- Klaim tidak dapat dilakukan melebihi kredit.
- Kredit tidak dapat di-reset melalui manipulasi browser.
- Benefit paket lama tetap dihormati.
- Paket baru tidak memberikan benefit secara retroaktif tanpa kebijakan yang jelas.

## Preferensi Tampilan
- Pengguna dapat beralih antara mode terang dan gelap.
- Warna website tetap biru dan putih.
- Identitas visual rank tetap konsisten.
- Pengaturan tampilan tidak mengubah progress, XP, atau entitlement.

## Avatar, Tema, Profil, dan Achievement
- Welcome Banner menampilkan tema aktif tanpa avatar; banner profil menampilkan avatar dan tema aktif pengguna.
- Teks banner tetap terbaca pada semua tema, di mode terang maupun gelap.
- Bagian website di luar banner tetap mengikuti brand guideline apa pun temanya.
- Pengguna Basic hanya dapat memilih avatar dan tema gratis.
- Pemilik Pro dan Premium dapat memilih avatar dan tema sesuai paket.
- Emblem tameng rank tidak berubah karena avatar atau tema.
- Avatar pengguna di header, profil, dan leaderboard menampilkan avatar aktif.
- Jika avatar atau tema aktif tidak valid, tampilan kembali ke bawaan gratis.
- Profil memiliki 3 tab: Ringkasan, Aktivitas, dan Pencapaian.
- Kustomisasi dibuka dari ikon pensil pada avatar dan hanya dapat dibuka oleh pemilik profil.
- Tombol aksi banner (Edit profil, Bagikan profil, Pengaturan, Lihat sebagai publik) hanya tampil pada profil sendiri.
- Achievement hanya muncul di profil dan tidak menambah XP.

---

# 12. Keputusan yang Belum Final

Hal berikut harus diputuskan sebelum implementasi fitur terkait mencapai tahap produksi.

## Produk dan Konten
- Fitur sertifikat kelulusan: direncanakan oleh pemilik produk dan sudah disebut di poster panel promosi halaman masuk. Bentuk, syarat, dan hubungannya dengan rank (rank bukan sertifikasi profesional, FR-05) belum ditetapkan.
- Struktur final materi dan modul.
- Imbalan untuk Creator dan bentuk kesepakatan kepemilikan konten.
- Waktu peralihan dari menulis di Google Docs ke editor di aplikasi (setelah backend Supabase untuk alur konten siap).
- Produksi video sendiri (misalnya untuk materi premium) beserta layanan hosting-nya; tidak termasuk rilis awal.

## Gamification
- Penyesuaian nilai XP dan batas rank setelah konten bertambah.
- Apakah perlu periode leaderboard (mingguan atau bulanan) di masa depan.
- Mekanisme penanganan kecurangan, termasuk batas yang memicu penandaan Moderasi (FR-16).

## Membership
- Harga final Pro dan Premium.
- Daftar course gratis dan premium.
- Daftar tema per paket (daftar avatar sudah ditetapkan di FR-12).
- Masa berlaku dan ketentuan penggunaan kredit.
- Kebijakan akses untuk course premium baru dan produk yang dihentikan.
- Kebijakan harga upgrade dari Pro ke Premium.
- Apakah paket Lifetime mencakup avatar dan tema yang dirilis setelah pembelian.
- Daftar produk yang memenuhi syarat klaim.
- Kebijakan diskon pemilik paket sebelumnya.
- Ketentuan refund.
- Definisi lisensi produk dan benefit Lifetime.

## Maskot, Avatar, Tema, dan Achievement
- Nama maskot resmi.
- Varian ringkas emblem untuk ukuran kecil.
- Daftar 5 tema rilis awal, beserta komposisi gratis dan berbayar (daftar avatar sudah ditetapkan di FR-12).
- Apakah avatar atau tema dapat dibeli secara individual di luar membership.
- Apakah avatar dan tema baru dirilis secara berkala.
- Daftar final achievement.
- Pembuat aset ilustrasi dan format file final.

## Pembayaran dan Operasional
- Payment gateway.
- Penanganan transaksi pending dan gagal.
- Kebijakan refund: syarat, batas waktu, dan perlakuan untuk paket Lifetime (FR-16).
- Proses administrasi dan rekonsiliasi transaksi.

## Teknologi
- **Sudah diputuskan:** backend memakai Supabase (Auth untuk login, Postgres untuk database, Storage untuk gambar dan file).
- Audit stack saat ini.
- Strategi autentikasi (detail implementasi di Supabase Auth).
- Desain API.
- Struktur database final: rancangan di `docs/DATABASE.md`, menunggu persetujuan pemilik.
- Strategi penyimpanan dan pengamanan file.
- Strategi deployment, logging, backup, dan monitoring.

---

# 13. Peran dan Prinsip Pengembangan

## 13.1 Peran
| Peran | Pelaksana | Tanggung jawab |
|---|---|---|
| Pemilik produk dan pendiri | Sahril Rahmatulloh | Keputusan akhir produk dan bisnis |
| Product Owner | Claude (diskusi produk) | Menyusun dan menjaga PRD serta kurikulum, menerjemahkan keputusan menjadi kebutuhan dan prompt pengembangan |
| UI/UX | ChatGPT (diskusi desain) | Mengeksplorasi konsep visual dan mockup |
| Programmer | Claude Code di VS Code | Mengimplementasikan kebutuhan sesuai PRD |

## 13.2 Status mockup desain
- Mockup dan konsep desain adalah bahan eksplorasi, **bukan kebutuhan produk**.
- Elemen di mockup hanya diimplementasikan setelah dimasukkan ke PRD atau disebutkan secara eksplisit dalam tugas pengembangan.
- Jika mockup bertentangan dengan PRD, PRD yang berlaku.

Penyimpanan mockup:
- Hanya mockup yang sudah disetujui yang disimpan di repository, di folder `docs/desain/`. Mockup eksplorasi atau yang sudah digantikan revisi tidak disimpan.
- Nama file per fitur (mis. `creator-mode.webp`, `playground.webp`) dalam format WebP terkompresi.
- `docs/desain/README.md` mencatat setiap mockup: nama file, fitur, bagian PRD terkait, tanggal disetujui, dan perbedaan yang sudah diketahui terhadap PRD.
- Jika desain berubah, mockup lama diganti atau dihapus agar tidak ada acuan usang.

## 13.3 Lingkungan dan alur rilis

| Lingkungan | Branch | Fungsi |
|---|---|---|
| DEV | `develop` | Tempat menggabungkan hasil pengembangan; boleh berisi data dummy dan alat bantu pengembangan |
| UAT | `uat` | Pengujian penerimaan oleh pemilik produk berdasarkan Bagian 11 |
| Production | `main` | Website untuk pengguna; belum digunakan sampai backend, autentikasi, dan pembayaran siap serta data dummy dihapus |

Aturan:
- Agen pemrograman membuat branch fitur dari `develop` dan hanya membuat pull request ke `develop`.
- Perubahan naik berurutan: `develop` → `uat` → `main`. Tidak boleh melompati tahap.
- Tidak ada perbaikan langsung di `uat` maupun `main`; semua perbaikan dimulai dari `develop`.
- Hanya pemilik produk yang menaikkan perubahan ke `uat` dan `main`.
- Lingkungan ditentukan oleh variabel `NEXT_PUBLIC_APP_ENV` (`dev`, `uat`, `production`). Fitur bantu pengembangan hanya aktif di `dev`, dan label lingkungan tidak tampil di `production`.
- Lesson dan course berstatus draf tampil dan dapat diselesaikan (termasuk mendapat XP) di `dev` dan `uat`, dengan label "Draf", agar pemilik produk dapat menguji alur belajar saat UAT. Di `production` isi draf tidak tampil dan tidak dapat diselesaikan. Artikel blog draf tetap hanya tampil di `dev`.
- Selama domain belum tersedia, setiap lingkungan memakai alamat bawaan Vercel.

## 13.4 Test otomatis dan quality gate
- Repository memiliki test end-to-end menggunakan Playwright untuk alur utama aplikasi.
- GitHub Actions menjalankan lint, build (termasuk script pengecekan data), dan test end-to-end pada setiap pull request ke `develop` dan setiap push ke `develop`.
- Pull request hanya boleh di-merge jika seluruh pemeriksaan CI lulus.
- Setiap fitur baru atau perubahan perilaku wajib menambah atau memperbarui test yang relevan; test ditulis bersama fiturnya.
- Saat development, pemeriksaan lokal sebelum pull request cukup lint, build, dan test yang berhubungan dengan perubahan. Seluruh test end-to-end dijalankan oleh CI di setiap pull request.
- Seluruh test end-to-end (termasuk build di luar DEV) dijalankan di lokal sebelum perubahan naik ke UAT dan sebagai uji regresi.
- Test ditulis dengan pola Page Object Model, locator berbasis peran dan label yang dapat diakses, serta tanpa jeda waktu tetap (hard wait).
- Test otomatis tidak menggantikan UAT; pemilik produk tetap melakukan UAT sebelum perubahan naik ke `main`.

## 13.5 Prinsip pengembangan
Agen pemrograman harus memperlakukan dokumen ini sebagai acuan kebutuhan produk, bukan izin untuk mengubah seluruh aplikasi sekaligus.

Sebelum mengimplementasikan fitur:

1. Periksa repository dan struktur kode yang sudah ada.
2. Baca instruksi proyek seperti AGENTS.md atau CLAUDE.md jika tersedia.
3. Identifikasi fitur yang sudah berjalan.
4. Bandingkan implementasi saat ini dengan kebutuhan PRD.
5. Tentukan file dan komponen yang benar-benar perlu diubah.
6. Implementasikan dalam lingkup yang jelas.
7. Hindari perubahan yang tidak berkaitan dengan tugas.
8. Jangan menghapus data atau fitur lama tanpa alasan yang jelas.
9. Tambahkan atau perbarui pengujian yang relevan.
10. Jalankan pemeriksaan dan laporkan hasilnya.

Jika terdapat konflik antara desain referensi, implementasi yang sudah ada, dan kebutuhan dalam PRD, dokumentasikan konflik tersebut sebelum mengambil keputusan yang berdampak besar.

---

# 14. Definisi Keberhasilan

BelajarAutomation dianggap berhasil mencapai fondasi produk yang diharapkan ketika:

- Pengguna dapat mempelajari materi dasar secara gratis dan mencapai rank tertinggi tanpa membayar.
- Progress belajar tersimpan dengan benar.
- Pengguna dapat berlatih melalui kuis dan challenge.
- XP dan rank dihitung secara konsisten.
- Leaderboard tidak dapat dimenangkan melalui pembayaran.
- Roadmap membantu pengguna memahami urutan belajar.
- Produk digital dapat dibeli dan diakses dengan aman.
- Akses course premium dan benefit membership tercatat dan diberikan sesuai paket.
- Klaim produk tidak dapat digandakan atau di-reset secara tidak sah.
- Antarmuka konsisten, responsif, dan mudah digunakan.
- Sistem dapat dikembangkan tanpa mengorbankan integritas data dan hak pengguna.

---

# 15. Brand Guideline (Rancangan v1.0)

Bagian ini masih rancangan. Implementasi final disesuaikan dengan tampilan website yang sebenarnya.

## 15.1 Kepribadian brand
Profesional, ramah, praktis, menyenangkan, dan berorientasi pada perkembangan keterampilan.

## 15.2 Palet warna

| Warna | Kode |
|---|---|
| Primary Blue | `#2563EB` |
| Dark Blue | `#1E3A8A` |
| Accent Blue | `#60A5FA` |
| Black | `#111827` |
| Light Gray | `#F3F4F6` |
| White | `#FFFFFF` |

Warna identitas rank (FR-05) terpisah dari palet brand dan tidak berubah.

Tombol utama dengan teks putih memakai Primary Blue `#2563EB` di mode terang maupun gelap agar memenuhi kontras minimal 4,5:1. Accent Blue `#60A5FA` dipakai untuk teks, ikon, atau aksen di atas latar gelap, bukan sebagai latar tombol berteks putih.

## 15.3 Tipografi
- **Inter:** heading dan teks utama.
- **JetBrains Mono:** kode pemrograman.

## 15.4 Prinsip desain
- Minimalis dan terstruktur.
- Dominan putih dengan aksen biru; hitam untuk teks dan mode gelap.
- Mudah dibaca di perangkat mobile.
- Maskot digunakan sebagai aksen, bukan pengganggu konten.
- Desain konsisten antara website dan media sosial.

## 15.5 Karakter
| Karakter | Peran |
|---|---|
| Kucing putih | Maskot resmi BelajarAutomation, dipakai di website (FR-12) |
| Pria berkacamata dengan kucing putih di atas kepala | Karakter pendamping untuk konten personal dan edukasi di media sosial; penghubung antara identitas pendiri dan brand. Tidak digunakan sebagai elemen antarmuka website kecuali diputuskan lain. |

BelajarAutomation adalah brand independen yang tetap memiliki hubungan visual dengan identitas personal pendirinya.

---

# 16. Prinsip Kualitas Konten dan Produk

1. Konten boleh dibantu AI dalam proses pembuatannya.
2. Materi teknis wajib diperiksa sebelum dipublikasikan.
3. Contoh kode wajib diuji dan dapat dijalankan.
4. Project wajib memiliki dokumentasi yang jelas dan kode yang berfungsi.
5. Koreksi dan perbaikan pada produk yang sama dikelola dan diberikan tanpa biaya tambahan.
6. Klaim pemasaran harus realistis dan tidak menjanjikan hasil karier yang tidak dapat dijamin.
7. Course hanya boleh berstatus `available` saat rilis jika status kontennya `ready` (FR-02).
8. Video referensi adalah pelengkap; isi teks harus lengkap tanpa video, dan setiap video mencantumkan kredit pembuatnya.

---

# 17. Arah Pemasaran (Di Luar Lingkup Aplikasi)

Bagian ini menjadi konteks, bukan kebutuhan fungsional aplikasi.

| Kanal | Fokus konten |
|---|---|
| Instagram | Carousel edukasi, tips QA, identitas visual |
| TikTok | Tips singkat, demo testing, mini tutorial |
| LinkedIn | Konten profesional, studi kasus, wawasan QA |
| YouTube | Tutorial lebih panjang dan demonstrasi project |

Strategi awal:
- Mengutamakan konten organik, tidak langsung mengandalkan iklan berbayar.
- Satu materi konten diadaptasi ke beberapa platform.
- Mengutamakan nilai edukasi dan membangun kepercayaan.
- Menggunakan maskot sebagai elemen pengenal brand.

---

## Penutup

BelajarAutomation bukan sekadar katalog materi, melainkan platform belajar yang menggabungkan materi gratis dan premium, latihan, jalur pembelajaran, gamifikasi dengan maskot kucing putih, membership, dan produk digital.

Keputusan desain dan teknis harus mendukung tujuan tersebut tanpa membuat pembelajaran dasar dan perkembangan rank bergantung pada pembayaran.

**Prinsip produk yang harus selalu dijaga: belajar dasar secara gratis, berkembang secara adil, dan membayar untuk materi lanjutan serta benefit tambahan yang jelas.**