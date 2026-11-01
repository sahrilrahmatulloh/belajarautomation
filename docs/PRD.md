# BELAJARAUTOMATION.COM
## Product Requirements Document (PRD)
**Versi:** 1.10  
**Status:** Draft — Acuan Pengembangan Produk  
**Platform:** Web Application  
**Target Pengguna:** Pemula hingga praktisi QA, Software Testing, dan Programming

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

Platform menggunakan gamifikasi untuk meningkatkan motivasi belajar tanpa menjadikan pembayaran sebagai keuntungan kompetitif.

## 1.2 Visi Produk

Menjadi platform pembelajaran QA dan Automation yang membantu siapa pun membangun keterampilan teknis secara bertahap, terarah, dan terjangkau.

## 1.3 Prinsip Utama

> Belajar gratis, berkembang secara adil, dan membayar hanya untuk produk atau benefit tambahan yang jelas.

Prinsip ini menjadi dasar pengambilan keputusan terkait fitur, monetisasi, gamifikasi, dan akses pengguna.

## 1.4 Tujuan Produk

- Menyediakan materi QA dan Programming dalam satu platform.
- Membantu pengguna menemukan materi sesuai kebutuhan dan minat.
- Menyediakan latihan berbasis kuis dan challenge.
- Memberikan indikator perkembangan belajar melalui XP, rank, dan statistik.
- Menyediakan produk digital berupa eBook dan proyek praktis.
- Menyediakan paket Premium Lifetime dengan benefit yang transparan.
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
10. Premium

Struktur navigasi harus konsisten di seluruh halaman.

## 2.1 Navigasi Pendukung

Fitur berikut tersedia melalui elemen antarmuka yang sesuai, bukan sebagai menu utama tambahan di sidebar:

- Profil pengguna.
- Pengaturan akun.
- Preferensi tampilan (mode terang/gelap).
- Pemilihan skin maskot.
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
- Avatar pengguna berupa maskot dengan skin aktif.

**B. Welcome Banner**
- Sapaan kepada pengguna.
- Deskripsi singkat platform.
- Maskot kucing putih dengan skin yang sedang aktif, dalam pose menyapa.
- Latar, ornamen, dan warna aksen di dalam banner mengikuti tema skin yang sedang aktif.
- Pengguna yang belum memilih skin, atau pengguna gratis, melihat banner dengan skin Basic.

Ketentuan Welcome Banner:
- Tema skin hanya berlaku di dalam Welcome Banner; bagian website lainnya tetap biru dan putih.
- Setiap skin memiliki identitas banner yang khas, bukan sekadar mengganti satu warna.
- Struktur konten banner (tagline, sapaan, deskripsi) dan posisinya tetap sama di semua skin.
- Welcome Banner tidak menampilkan kutipan motivasi.
- Teks banner harus tetap terbaca dengan kontras memadai pada semua skin, di mode terang maupun gelap.
- Pada layar kecil, maskot menyesuaikan ukuran atau posisi agar tidak menutupi teks.

**C. Rank & XP**
- Emblem tameng rank saat ini (lihat FR-05). Emblem tidak dipengaruhi skin.
- Nama rank.
- Total XP.
- Progress menuju rank berikutnya.
- Persentase progress.
- Informasi rank berikutnya.
- Tombol menuju detail rank.

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

**G. Rekomendasi untukmu**
- Menampilkan rekomendasi materi.
- Mendukung kategori seperti Fundamental, Automation, API Testing, Mobile Testing, Performance, dan Security.
- Menyediakan akses menuju detail materi.

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
- Bagian atas halaman Belajar, di antara header dan filter, menampilkan ajakan "Tidak tahu mulai dari mana?" dengan tombol menuju halaman Roadmap.
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

### Aturan akses
Seluruh materi pembelajaran utama tersedia secara gratis.

Pengguna tidak harus membeli Premium untuk:
- Membaca materi.
- Menyelesaikan modul.
- Mengikuti kuis dan challenge.
- Mendapatkan XP yang valid.
- Menaikkan rank.

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

### Jenis soal

**A. Pilihan Ganda**
- Satu pertanyaan dengan beberapa opsi.
- Sistem memvalidasi jawaban.
- Hasil dinilai berdasarkan kunci jawaban yang telah ditentukan.

**B. Challenge**
- Pengguna diminta menyelesaikan tugas atau persoalan.
- Bentuknya dapat berupa analisis kasus, penulisan kode, atau penyelesaian skenario pengujian.
- Penilaian dapat menggunakan pemeriksaan otomatis atau rubrik yang sesuai.

### Alur pengerjaan

1. Pengguna memilih latihan.
2. Sistem menampilkan informasi latihan.
3. Pengguna memulai sesi.
4. Sistem menyajikan soal pilihan ganda dan/atau challenge.
5. Pengguna mengirim jawaban.
6. Sistem memvalidasi jawaban.
7. Sistem menampilkan hasil dan pembahasan sesuai kebijakan latihan.
8. XP diberikan jika syarat validasi terpenuhi.
9. Hasil tersimpan pada riwayat pengguna.

### Aturan
- Jumlah soal ditentukan oleh konfigurasi latihan; contoh awal dapat berupa 10 soal.
- Tidak semua latihan harus memiliki komposisi soal yang sama.
- Jawaban yang benar-benar diperiksa sistem dapat menghasilkan XP sesuai aturan.
- Mengulang latihan tidak boleh menghasilkan XP tanpa batas.
- Soal, jawaban, dan hasil penilaian harus diproses secara aman.

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
- Emblem rank sama untuk semua pengguna di rank yang sama, gratis maupun Premium, dan tidak berubah karena skin.

### Identitas visual
- Trainee: bronze/oranye.
- Apprentice: silver.
- Practitioner: gold.
- Specialist: emerald green.
- Expert: purple.
- Master: crimson red dengan aksen gold.

Warna dan emblem rank merupakan identitas tetap. Mengubah mode terang/gelap atau skin maskot tidak boleh mengubah emblem maupun warna identitas rank.

### Sistem XP

XP diberikan atas aktivitas belajar yang valid, misalnya:
- Menyelesaikan materi sesuai aturan.
- Menyelesaikan kuis yang memenuhi syarat.
- Menyelesaikan challenge yang telah divalidasi.

Nilai XP dan batas rank dikelola melalui konfigurasi sistem. Nilai awal yang disepakati:

| Aktivitas | XP |
|---|---|
| Menyelesaikan satu lesson | 10 |
| Bonus menyelesaikan seluruh lesson dalam satu course | 50 |
| Lulus kuis | 30 |
| Menyelesaikan challenge yang tervalidasi | 75 |

XP hanya diberikan saat aktivitas tersebut diselesaikan pertama kali. Pengguna boleh mengulang lesson, kuis, atau challenge tanpa memperoleh XP lagi.

### Batas XP rank
| Rank | Minimal XP | Gambaran pencapaian |
|---|---|---|
| Trainee | 0 | Baru mulai belajar |
| Apprentice | 300 | Menyelesaikan roadmap Fundamental |
| Practitioner | 1.000 | Menyelesaikan satu roadmap lengkap |
| Specialist | 2.200 | Menyelesaikan sekitar dua roadmap |
| Expert | 3.800 | Menyelesaikan sebagian besar jalur automation |
| Master | 5.500 | Menyelesaikan hampir seluruh konten dan challenge |

Batas ini dihitung dari perkiraan total XP konten yang direncanakan (sekitar 6.600 XP) dan wajib ditinjau ulang setiap kali jumlah konten berubah signifikan, agar rank Master tetap dapat dicapai.

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

### Prinsip keadilan
- Pengguna gratis dan Premium menggunakan aturan XP yang sama.
- Pembelian produk tidak memberikan XP.
- Pembelian Premium tidak memberikan bonus rank.
- Tidak ada keunggulan leaderboard yang diperoleh hanya melalui pembayaran.

Rank adalah indikator perkembangan belajar di platform, bukan sertifikasi profesional.

---

## FR-06 — Leaderboard

### Tujuan
Menampilkan peringkat pengguna berdasarkan aktivitas belajar yang valid.

### Informasi dasar
- Posisi pengguna.
- Avatar maskot dengan skin aktif pengguna.
- Nama atau username.
- Emblem tameng rank sesuai rank pengguna. Emblem tidak dipengaruhi skin.
- Total XP.

### Aturan
- Pengguna gratis dan Premium memiliki kesempatan kompetisi yang sama.
- XP harus berasal dari aktivitas yang valid.
- Pembelian eBook, project, atau Premium tidak meningkatkan peringkat.
- Skin pada avatar bersifat kosmetik dan tidak menggantikan emblem tameng rank di leaderboard.
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
- Setiap tab menampilkan 50 peringkat teratas.
- Posisi pengguna yang sedang login selalu ditampilkan (disematkan) di kedua tab, termasuk jika berada di luar 50 besar:
  - Tab Global: posisi di antara seluruh pengguna.
  - Tab rank: posisi di antara sesama rank.
- Tab rank menampilkan informasi rank berikutnya, mis. "Butuh 320 XP lagi untuk naik ke Practitioner". Pengguna Master melihat keterangan bahwa rank tertinggi telah tercapai.
- Setiap baris menampilkan posisi, avatar maskot sesuai skin aktif, nama tampilan, emblem tameng rank, dan total XP.
- Tiga posisi teratas di setiap tab boleh diberi penekanan visual.

### Privasi
- Pengguna dapat memilih untuk tidak ditampilkan di leaderboard melalui pengaturan.
- Pengguna yang memilih tidak tampil tetap dapat melihat posisinya sendiri.
- Leaderboard hanya menampilkan nama tampilan, bukan email atau data pribadi lain.

---

## FR-07 — Blog

### Tujuan
Menyediakan artikel edukasi dan informasi seputar QA, testing, automation, dan programming.

### Fitur
- Daftar artikel.
- Pencarian artikel jika diperlukan.
- Filter kategori.
- Halaman detail artikel.
- Informasi penulis.
- Tanggal publikasi.
- Artikel terkait.

### Kategori awal
- QA Fundamentals.
- Manual Testing.
- Automation Testing.
- API Testing.
- Programming.
- Career.
- Tools dan teknologi.

### Aturan
- Artikel yang ditetapkan sebagai publik dapat dibaca secara gratis.
- Konten harus dapat dikelola tanpa mengubah struktur aplikasi setiap kali artikel baru diterbitkan.
- Fitur komentar bukan prioritas awal.

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
2. Klaim dari paket Premium yang memiliki benefit eBook.

### Aturan
- Katalog dan preview dapat diakses gratis.
- Isi lengkap hanya dapat diakses pengguna yang memiliki entitlement atau hak akses yang valid.
- Produk yang telah dibeli dengan lisensi permanen tetap dapat diakses sesuai ketentuan lisensinya.
- Pembelian eBook tidak memberikan XP atau rank.
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
2. Klaim dari paket Premium yang memiliki benefit project.

### Aturan
- Katalog dan preview dapat dilihat tanpa pembayaran.
- Konten lengkap membutuhkan hak akses yang valid.
- Pembelian project tidak memberikan XP atau rank.
- Hak akses mengikuti lisensi produk.
- File produk harus dilindungi melalui mekanisme akses yang sesuai.

---

## FR-10 — Premium Lifetime

### Tujuan
Menyediakan paket benefit tambahan melalui pembayaran satu kali.

### Model bisnis
Premium menggunakan model **Lifetime**, bukan langganan bulanan atau tahunan berulang.

Pengguna membayar satu kali untuk memperoleh benefit yang secara eksplisit dijanjikan dalam paket tersebut.

Istilah Lifetime harus disertai ketentuan yang jelas mengenai hak akses, cakupan benefit, dan keberlangsungan layanan.

### Benefit dasar yang disepakati
Benefit paket dapat mencakup:
- Akses skin maskot yang tercantum pada paket (lihat FR-12).
- Kuota klaim eBook.
- Kuota klaim project.

Tema visual dan warna aksen tambahan tidak lagi menjadi benefit Premium. Warna website ditetapkan biru dan putih untuk semua pengguna.

Benefit yang sebenarnya harus ditampilkan dengan jelas pada detail paket sebelum pembayaran.

### Skin Maskot
- Paket membuka skin bertema yang tercantum di dalamnya.
- Akses skin tidak bergantung pada rank pengguna.
- Pemilik paket dapat memilih salah satu skin yang tersedia untuk ditampilkan; seluruh skin tersedia untuk dipilih, bukan diterapkan sekaligus.
- Skin tidak mengubah emblem rank maupun warna identitas rank.
- Tidak boleh diasumsikan bahwa semua skin otomatis termasuk dalam setiap paket; hak akses mengikuti benefit yang tercantum pada paket.
- Cakupan skin pada paket (apakah termasuk skin yang dirilis setelah pembelian) harus dinyatakan jelas sebelum pembayaran.

### Kuota klaim produk

Untuk setiap paket yang secara eksplisit menyertakan benefit klaim:

- 3 klaim eBook.
- 3 klaim project.

Setiap klaim digunakan untuk memilih satu produk yang memenuhi syarat.

Kuota tersebut:
- Berlaku satu kali untuk setiap paket yang dibeli.
- Bukan kuota berulang bulanan atau tahunan.
- Tidak diisi ulang otomatis.
- Tidak dapat di-reset dengan logout, login ulang, mengganti browser, atau mengganti perangkat.
- Tidak dapat digunakan lebih dari satu kali untuk klaim yang sama.
- Hanya berlaku pada produk yang memenuhi ketentuan paket.

Setelah klaim berhasil, pengguna memperoleh entitlement produk sesuai lisensi yang berlaku.

### Alur klaim

1. Pengguna membuka benefit paket Premium yang dimiliki.
2. Pengguna melihat kuota klaim yang tersisa.
3. Pengguna memilih produk yang memenuhi syarat.
4. Sistem menampilkan konfirmasi.
5. Pengguna mengonfirmasi klaim.
6. Backend memvalidasi hak paket dan kuota.
7. Backend mencatat klaim secara permanen.
8. Sistem memberikan entitlement produk.
9. Kuota tersisa diperbarui.

### Pembelian paket baru
- Setiap paket memiliki identitas dan versi yang jelas.
- Pembelian paket baru adalah transaksi baru.
- Benefit paket baru tidak otomatis diberikan kepada pemilik paket sebelumnya.
- Membeli paket versi 2 tidak boleh dianggap sebagai hak otomatis bagi seluruh pemilik versi 1.
- Benefit yang telah dijanjikan pada paket lama tetap harus dihormati.
- Benefit baru dapat disediakan melalui paket baru atau penawaran terpisah.
- Kebijakan upgrade dan diskon untuk pemilik paket sebelumnya masih perlu ditentukan.

### Batasan Premium
Premium tidak boleh:
- Memberikan XP tambahan hanya karena status Premium.
- Menaikkan rank secara langsung.
- Memberikan bonus kompetitif pada leaderboard.
- Mengunci materi pembelajaran utama yang sebelumnya dijanjikan gratis.
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

Harga paket dan metode pembayaran final belum ditetapkan.

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

## FR-12 — Maskot dan Skin

### Tujuan
Memberikan identitas karakter yang mudah dikenali dan menjadi sarana ekspresi diri pengguna tanpa memengaruhi keadilan sistem belajar.

### Filosofi maskot
- Kucing putih melambangkan ilmu yang dimiliki, dipelajari, dan dibagikan kepada orang lain.
- Maskot merepresentasikan semangat belajar dan identitas visual platform.

### Dua sistem visual yang terpisah
| | Emblem Rank | Skin Maskot |
|---|---|---|
| Bentuk | Tameng berwarna identitas rank | Kucing dengan kostum dan tema banner |
| Cara memperoleh | Naik rank melalui XP yang valid | Basic gratis; skin lain melalui paket Premium |
| Dipilih bebas | Tidak; mengikuti rank saat ini | Ya, dari skin yang dimiliki |
| Tampil di | Kartu Rank & XP, profil, leaderboard | Halaman profil, foto profil, karakter dashboard, latar Welcome Banner |
| Memengaruhi XP/rank/leaderboard | Tidak | Tidak |

### Maskot
- Maskot platform adalah seekor kucing putih.
- Maskot menjadi benang merah dengan website personal pembuat platform.
- Logo dan warna brand BelajarAutomation tetap menjadi identitas utama platform; maskot berperan sebagai karakter pendamping.

### Penempatan maskot
Maskot dengan skin aktif pengguna digunakan pada:
- **Halaman profil:** ilustrasi utama pengguna dan koleksi skin.
- **Foto profil (avatar):** di header, profil, leaderboard, dan tempat lain yang menampilkan pengguna.
- **Karakter di dashboard:** maskot tampil sebagai karakter pada Welcome Banner.
- **Latar belakang Welcome Banner:** latar, ornamen, dan warna aksen banner mengikuti tema skin.

Maskot dalam versi Basic Cat juga dapat digunakan pada empty state, halaman 404, hasil latihan di Playground, dan halaman Tentang.

Maskot tidak digunakan sebagai emblem rank.

### Ekspresi maskot
Set ekspresi awal yang dibutuhkan:
- Menyapa, untuk Welcome Banner.
- Bingung atau mencari, untuk empty state dan halaman 404.
- Senang, untuk jawaban benar.
- Berpikir atau semangat, untuk jawaban salah; tetap bernada positif.
- Membaca, untuk Learning Center dan eBook.
- Merayakan, untuk kenaikan rank.

### Aset per skin
Setiap skin membutuhkan aset untuk setiap tempat penggunaannya:
- Avatar: potongan wajah atau setengah badan, terbaca jelas pada ukuran kecil (sekitar 32–48px).
- Ilustrasi karakter untuk Welcome Banner dan halaman profil.
- Latar belakang Welcome Banner versi mode terang dan gelap.

### Skin
Skin adalah kostum bertema untuk maskot.

Rilis awal menyediakan **5 skin**: 1 skin gratis (Basic Cat) dan 4 skin Premium. Jumlah ini merupakan rilis awal, bukan batas permanen.

Kandidat konsep skin (nama dan konsep final belum ditetapkan):

| Skin | Akses | Karakteristik visual | Suasana tema banner |
|---|---|---|---|
| Basic Cat | Gratis | Kucing putih polos dengan ekspresi sederhana | Minimalis biru-putih |
| Bug Hunter / Detective Cat | Premium | Kaca pembesar atau aksesori investigasi | Investigasi dan debugging |
| Scholar Cat | Premium | Kacamata dan buku | Perpustakaan dan belajar |
| Cyber Tester / Cyber Cat | Premium | Jaket teknis dan visor | Futuristik dan teknologi |
| Test Wizard / Wizard Cat | Premium | Jubah dengan ornamen fantasi | Fantasi dan pengetahuan |

- Pengguna gratis mendapat satu skin, yaitu Basic Cat.
- Skin bertema lainnya diperoleh melalui paket Premium sesuai benefit yang tercantum.
- Skin dapat dipilih bebas tanpa bergantung pada rank pengguna.
- Pengguna memilih satu skin aktif yang tampil di halaman profil, foto profil, dan Welcome Banner.
- Skin yang terkunci boleh ditampilkan di koleksi dengan indikator yang jelas.

Setiap skin memiliki:
- ID unik.
- Nama dan deskripsi.
- Aset avatar.
- Ilustrasi karakter.
- Aksesori khas.
- Tema banner: latar, ornamen, dan warna aksen.
- Status akses pengguna.

### Koleksi skin di profil
Pengguna dapat:
1. Melihat skin yang dimiliki dan yang masih terkunci.
2. Melihat informasi setiap skin.
3. Memilih dan mengaktifkan skin yang dimiliki.
4. Melihat skin yang sedang aktif.

Pilihan skin tersimpan sebagai preferensi pengguna dan tetap konsisten saat berpindah halaman atau kembali mengakses website.

### Aturan desain skin
- Semua skin harus tetap terlihat sebagai kucing yang sama: wajah, proporsi, dan gaya ilustrasi konsisten.
- Skin Basic harus tetap menarik; Premium terasa sebagai bonus, bukan penebus kekurangan versi gratis.
- Skin tidak boleh memakai kombinasi warna identitas rank, misalnya crimson dengan gold milik Master, agar tidak disangka sebagai rank.
- Gaya ilustrasi konsisten dengan maskot pada website personal pembuat.
- Tema skin hanya berlaku di dalam Welcome Banner, tidak mengubah warna website.
- Kontras teks banner harus tetap baik di semua skin, di mode terang maupun gelap.
- Hindari animasi atau efek berlebihan yang mengganggu pengalaman belajar.

### Aturan
- Skin bersifat kosmetik dan tidak memengaruhi XP, rank, maupun posisi leaderboard.
- Hak penggunaan skin diverifikasi oleh backend, bukan hanya berdasarkan data lokal browser.
- Jika skin aktif tidak lagi valid, sistem kembali ke Basic Cat. Skin yang sudah menjadi hak pengguna tidak boleh dicabut secara sepihak.
- Tema skin dikelola melalui satu mekanisme yang dapat digunakan kembali, bukan diatur ulang di setiap halaman.
- Mengganti skin tidak mengubah progress, XP, rank, atau entitlement.
- Selama database belum tersedia, platform cukup menampilkan Basic Cat; koleksi skin boleh ditampilkan sebagai pratinjau, dan pemilihan skin diaktifkan setelah data pengguna dapat disimpan.

---

# 4. Profil, Preferensi, dan Pengaturan

## 4.1 Profil
Informasi dasar pengguna dapat mencakup:
- Nama tampilan.
- Username.
- Avatar berupa maskot dengan skin aktif.
- Ilustrasi maskot dengan skin aktif.
- Koleksi skin.
- Ringkasan progress belajar.
- Rank beserta emblem tameng.
- Total XP.

Informasi sensitif tidak boleh ditampilkan secara publik tanpa alasan dan persetujuan yang sesuai.

## 4.2 Preferensi Tampilan
Warna website ditetapkan biru dan putih untuk semua pengguna. Tema skin hanya berlaku di dalam Welcome Banner.

Pengguna dapat mengatur:
- Mode terang atau gelap.
- Skin maskot aktif, sesuai hak yang dimiliki (FR-12).

## 4.3 Konsistensi Tampilan
Perubahan mode tampilan dan skin maskot harus:
- Tidak mengubah data belajar.
- Tidak mengubah XP atau rank.
- Tidak mengubah entitlement produk.
- Tidak menghapus hak skin yang telah diperoleh.
- Tetap mempertahankan keterbacaan dan kontras antarmuka.

## 4.4 Notifikasi
Notifikasi dapat digunakan untuk memberi informasi mengenai aktivitas atau perubahan yang relevan.

Preferensi notifikasi dan jenis notifikasi yang akan didukung masih perlu ditentukan.

---

# 5. Model Akses dan Monetisasi

## 5.1 Matriks Akses

| Fitur atau Produk | Gratis | Premium |
|---|---|---|
| Dashboard | Ya | Ya |
| Materi Learning Center | Ya | Ya |
| Roadmap | Ya | Ya |
| Kuis dan challenge | Ya | Ya |
| XP dan rank | Ya | Ya |
| Leaderboard | Ya | Ya |
| Blog publik | Ya | Ya |
| Katalog eBook | Ya | Ya |
| Preview eBook | Ya | Ya |
| Isi lengkap eBook | Perlu pembelian atau entitlement | Sesuai benefit dan entitlement |
| Katalog project | Ya | Ya |
| Preview project | Ya | Ya |
| Isi lengkap project | Perlu pembelian atau entitlement | Sesuai benefit dan entitlement |
| Mode terang/gelap | Ya | Ya |
| Emblem tameng rank | Sesuai rank | Sesuai rank (sama dengan gratis) |
| Skin Basic Cat | Ya | Ya |
| Skin bertema lainnya | Tidak | Sesuai paket |
| XP atau rank tambahan karena pembayaran | Tidak ada | Tidak ada |
| Keuntungan leaderboard karena pembayaran | Tidak ada | Tidak ada |

## 5.2 Entitlement
Entitlement adalah catatan hak akses pengguna terhadap suatu produk atau benefit.

Sistem harus dapat membedakan:
- Hak akses yang berasal dari pembelian individual.
- Hak akses yang berasal dari klaim paket Premium.
- Benefit skin yang berasal dari paket tertentu.
- Kuota klaim yang masih tersedia.
- Kuota klaim yang telah digunakan.

Entitlement produk harus tetap mengikuti ketentuan lisensinya.

## 5.3 Aturan Pembelian dan Klaim
- Setiap transaksi memiliki identitas unik.
- Pembelian yang berhasil harus tercatat.
- Status pembayaran harus diverifikasi.
- Klaim produk harus dicatat dan tidak dapat digandakan.
- Kuota klaim harus terkait dengan paket dan pemiliknya.
- Akses produk tidak boleh hanya ditentukan oleh status Premium aktif di frontend.
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
- Pengelolaan Premium dan klaim.
- Penyimpanan preferensi pengguna.

## 6.3 Database
Database menjadi sumber data persisten untuk:
- Pengguna.
- Konten.
- Progress.
- Riwayat aktivitas.
- XP dan rank.
- Transaksi.
- Hak akses produk.
- Paket Premium.
- Klaim benefit.
- Preferensi pengguna.

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
Menyimpan identitas dan informasi dasar pengguna.

## 7.2 UserPreferences
Menyimpan preferensi tampilan dan pengaturan pengguna.

## 7.3 LearningContent
Menyimpan informasi materi pembelajaran.

## 7.4 LearningProgress
Mencatat status dan progress materi pengguna.

## 7.5 QuizAttempt
Mencatat sesi pengerjaan kuis dan hasilnya.

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

## 7.12 PremiumPackage
Menyimpan identitas paket, versi, harga, dan benefit yang dijanjikan.

## 7.13 Purchase
Mencatat transaksi pembelian dan status pembayaran.

## 7.14 PackageEntitlement
Mencatat benefit paket yang dimiliki pengguna.

## 7.15 ProductEntitlement
Mencatat hak akses pengguna terhadap produk tertentu.

## 7.16 BenefitClaim
Mencatat penggunaan kuota klaim produk dari paket Premium.

## 7.17 SkinDefinition
Menyimpan definisi skin maskot: ID, nama, deskripsi, aset avatar, aset ilustrasi karakter, aksesori, tema banner (latar terang dan gelap, ornamen, warna aksen), serta apakah skin gratis.

## 7.18 UserSkinSelection
Mencatat skin aktif yang dipilih pengguna. Dapat menjadi bagian dari UserPreferences.

## 7.19 SkinEntitlement
Mencatat hak pengguna atas skin tertentu beserta sumbernya (gratis atau paket Premium tertentu). Dapat menjadi bagian dari PackageEntitlement.

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
- Proses yang berat harus dipertimbangkan untuk dijalankan secara asinkron jika diperlukan.

## 8.3 Security
- Autentikasi dan otorisasi harus diterapkan sesuai kebutuhan.
- Hak akses produk harus diperiksa di backend.
- Input pengguna harus divalidasi.
- Data transaksi harus dilindungi.
- Kunci rahasia tidak boleh disimpan dalam kode frontend.
- Operasi penting harus aman terhadap duplikasi permintaan.
- Akses terhadap file produk berbayar harus mengikuti entitlement.

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
- Konfigurasi rank, skin, dan paket sebaiknya tidak mengharuskan perubahan kode pada setiap perubahan konten.
- Dokumentasi implementasi harus diperbarui saat arsitektur berubah.

## 8.6 Accessibility dan Usability
- Kontras teks harus memadai.
- Kontrol interaktif harus jelas.
- Navigasi keyboard perlu diperhatikan.
- Status error, loading, empty state, dan success harus informatif.

---

# 9. Aturan Bisnis Utama

1. Materi pembelajaran utama gratis.
2. Kuis dan challenge dapat diakses pengguna gratis.
3. XP hanya berasal dari aktivitas yang memenuhi aturan validasi.
4. Rank tidak dapat dibeli.
5. Pembayaran tidak memberikan keuntungan kompetitif di leaderboard.
6. eBook dan project dijual secara individual.
7. Paket Premium Lifetime memberikan benefit sesuai deskripsi paket.
8. Kuota klaim Premium hanya berlaku jika benefit tersebut tercantum pada paket.
9. Setiap paket yang memiliki benefit klaim menyediakan tiga klaim eBook dan tiga klaim project.
10. Klaim bersifat satu kali per produk yang dipilih dan tidak diisi ulang secara berkala.
11. Klaim dicatat secara persisten di backend.
12. Hak akses produk mengikuti lisensi produk.
13. Paket versi baru tidak otomatis memberikan benefit baru kepada pemilik paket lama.
14. Benefit yang telah dijanjikan kepada pemilik paket lama harus tetap dihormati.
15. Identitas visual rank tidak berubah saat pengguna mengganti mode tampilan atau skin.
16. Data pengguna tidak boleh dibuat seolah-olah nyata ketika data belum tersedia di lingkungan produksi. Data dummy hanya untuk tahap pengembangan dan wajib dihapus sebelum rilis.
17. Seluruh aturan akses dan transaksi penting harus divalidasi oleh backend.
18. Warna website ditetapkan biru dan putih; pengguna hanya memilih mode terang atau gelap.
19. Skin maskot bersifat kosmetik dan tidak memengaruhi XP, rank, maupun leaderboard.
20. Emblem rank berupa tameng dan terpisah dari skin; maskot tidak digunakan sebagai emblem rank.
21. Pengguna gratis mendapat skin Basic Cat; skin bertema lainnya diperoleh melalui paket Premium.
22. Skin tidak boleh memakai kombinasi warna identitas rank.

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

## Phase 6 — Premium Lifetime
- Katalog paket.
- Detail benefit.
- Pembelian paket.
- Aktivasi entitlement.
- Katalog skin, koleksi skin di profil, dan pemilihan skin aktif.
- Avatar maskot dan tema Welcome Banner per skin.
- Kuota klaim.
- Alur klaim eBook.
- Alur klaim project.
- Riwayat klaim.
- Pengujian keamanan dan konsistensi transaksi.

**Output:** Sistem Premium dengan benefit yang transparan dan persisten.

## Phase 7 — Career dan Pengembangan Lanjutan
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
- Status Premium tidak memberikan keuntungan kompetitif.

## Leaderboard
- Peringkat berasal dari data valid.
- Pengguna gratis dan Premium menggunakan aturan yang sama.
- Aktivitas pembayaran tidak menambah skor.

## Produk Digital
- Katalog dan preview dapat dilihat.
- Produk berbayar hanya dapat diakses jika pengguna memiliki entitlement yang valid.
- Pembelian tercatat.
- Hak akses tetap sesuai ketentuan lisensi.

## Premium
- Benefit paket terlihat sebelum pembayaran.
- Pembayaran diverifikasi.
- Kuota klaim tercatat.
- Klaim tidak dapat dilakukan melebihi kuota.
- Kuota tidak dapat di-reset melalui manipulasi browser.
- Benefit paket lama tetap dihormati.
- Paket baru tidak memberikan benefit secara retroaktif tanpa kebijakan yang jelas.

## Preferensi Tampilan
- Pengguna dapat beralih antara mode terang dan gelap.
- Warna website tetap biru dan putih.
- Identitas visual rank tetap konsisten.
- Pengaturan tampilan tidak mengubah progress, XP, atau entitlement.

## Maskot dan Skin
- Welcome Banner menampilkan karakter maskot dan latar belakang sesuai skin aktif pengguna.
- Teks banner tetap terbaca pada semua skin, di mode terang maupun gelap.
- Bagian website di luar Welcome Banner tetap biru dan putih apa pun skinnya.
- Pengguna gratis hanya dapat memilih Basic Cat.
- Pemilik Premium dapat memilih skin sesuai paket.
- Emblem tameng rank di dashboard, profil, dan leaderboard tidak berubah karena skin.
- Avatar pengguna di header, profil, dan leaderboard menampilkan maskot dengan skin aktif.
- Jika skin aktif tidak valid, tampilan kembali ke Basic Cat.

---

# 12. Keputusan yang Belum Final

Hal berikut harus diputuskan sebelum implementasi fitur terkait mencapai tahap produksi.

## Produk dan Konten
- Struktur final materi dan modul.
- Pengelolaan konten dan peran Creator, Reviewer, serta Admin.
- Mekanisme penerbitan dan peninjauan konten.

## Gamification
- Penyesuaian nilai XP dan batas rank setelah konten bertambah.
- Apakah perlu periode leaderboard (mingguan atau bulanan) di masa depan.
- Mekanisme penanganan kecurangan.

## Premium
- Daftar paket final.
- Harga setiap paket.
- Daftar skin per paket.
- Apakah paket Lifetime mencakup skin yang dirilis setelah pembelian.
- Daftar produk yang memenuhi syarat klaim.
- Kebijakan upgrade paket.
- Kebijakan diskon pemilik paket sebelumnya.
- Ketentuan refund.
- Definisi lisensi produk dan benefit Lifetime.

## Maskot dan Skin
- Nama maskot.
- Varian ringkas emblem untuk ukuran kecil.
- Nama dan konsep final 4 skin Premium pada rilis awal.
- Apakah skin dapat dibeli secara individual di luar paket Premium.
- Apakah skin baru dirilis secara berkala.
- Detail animasi setiap skin.
- Pembuat aset ilustrasi dan format file final.

## Pembayaran dan Operasional
- Payment gateway.
- Penanganan transaksi pending dan gagal.
- Mekanisme refund.
- Proses administrasi dan rekonsiliasi transaksi.

## Teknologi
- Audit stack saat ini.
- Strategi autentikasi.
- Desain API.
- Struktur database final.
- Strategi penyimpanan dan pengamanan file.
- Strategi deployment, logging, backup, dan monitoring.

---

# 13. Prinsip Pengembangan dengan Codex

Codex harus memperlakukan dokumen ini sebagai acuan kebutuhan produk, bukan izin untuk mengubah seluruh aplikasi sekaligus.

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

- Pengguna dapat mempelajari materi secara gratis.
- Progress belajar tersimpan dengan benar.
- Pengguna dapat berlatih melalui kuis dan challenge.
- XP dan rank dihitung secara konsisten.
- Leaderboard tidak dapat dimenangkan melalui pembayaran.
- Roadmap membantu pengguna memahami urutan belajar.
- Produk digital dapat dibeli dan diakses dengan aman.
- Benefit Premium tercatat dan diberikan sesuai paket.
- Klaim produk tidak dapat digandakan atau di-reset secara tidak sah.
- Antarmuka konsisten, responsif, dan mudah digunakan.
- Sistem dapat dikembangkan tanpa mengorbankan integritas data dan hak pengguna.

---

## Penutup

BelajarAutomation bukan sekadar katalog materi, melainkan platform belajar yang menggabungkan materi gratis, latihan, jalur pembelajaran, gamifikasi dengan maskot kucing putih, dan produk digital.

Keputusan desain dan teknis harus mendukung tujuan tersebut tanpa membuat pembelajaran inti bergantung pada pembayaran.

**Prinsip produk yang harus selalu dijaga: belajar gratis, berkembang secara adil, dan membayar hanya untuk produk atau benefit tambahan yang jelas.**