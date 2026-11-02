# BELAJARAUTOMATION.COM
## Product Requirements Document (PRD)
**Versi:** 2.5  
**Status:** Draft — Acuan Pengembangan Produk  
**Platform:** Web Application  
**Target Pengguna:** Pemula hingga praktisi QA, Software Testing, dan Programming

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
- Avatar kucing aktif pengguna dalam ukuran besar.
- Latar banner sesuai tema banner aktif pengguna (FR-12).
- Pengguna baru melihat avatar Kucing Putih Basic dan tema gratis bawaan.

Ketentuan Welcome Banner:
- Tema banner hanya berlaku di Welcome Banner dan banner profil; bagian website lainnya mengikuti brand guideline.
- Struktur konten banner (tagline, sapaan, deskripsi) dan posisinya tetap sama di semua tema.
- Welcome Banner tidak menampilkan kutipan motivasi.
- Teks banner harus tetap terbaca dengan kontras memadai pada semua tema, di mode terang maupun gelap.
- Pada layar kecil, avatar menyesuaikan ukuran atau posisi agar tidak menutupi teks.

**C. Rank & XP**
- Emblem tameng rank saat ini (lihat FR-05). Emblem tidak dipengaruhi avatar atau tema.
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

Batas ini dihitung dari perkiraan total XP konten yang direncanakan (sekitar 6.600 XP) dan wajib ditinjau ulang setiap kali jumlah konten atau pembagian course gratis dan premium berubah, agar rank Master tetap dapat dicapai hanya dari konten gratis.

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
- Setiap tab menampilkan 50 peringkat teratas.
- Posisi pengguna yang sedang login selalu ditampilkan (disematkan) di kedua tab, termasuk jika berada di luar 50 besar:
  - Tab Global: posisi di antara seluruh pengguna.
  - Tab rank: posisi di antara sesama rank.
- Tab rank menampilkan informasi rank berikutnya, mis. "Butuh 320 XP lagi untuk naik ke Practitioner". Pengguna Master melihat keterangan bahwa rank tertinggi telah tercapai.
- Setiap baris menampilkan posisi, avatar kucing aktif, nama tampilan, emblem tameng rank, dan total XP.
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

## FR-12 — Maskot, Avatar, dan Tema Banner

### Tujuan
Memberikan identitas brand yang mudah dikenali dan sarana ekspresi diri pengguna tanpa memengaruhi keadilan sistem belajar.

### Maskot resmi
- Maskot resmi BelajarAutomation adalah **kucing putih**.
- Desain mengikuti desain asli yang sudah digunakan di Instagram pembuat. Bentuk dasar dan ciri khasnya tidak diubah, dan tidak diubah menjadi karakter 3D atau fotorealistis.
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
| Tampil di | Kartu Rank & XP, profil, leaderboard | Foto profil, header, leaderboard, Welcome Banner, profil | Welcome Banner dan banner profil |
| Memengaruhi XP, rank, leaderboard | Tidak | Tidak | Tidak |

### Avatar kucing
- Avatar adalah foto profil pengguna berupa ilustrasi kucing.
- Tersedia beberapa **jenis kucing** agar pilihan tidak monoton, misalnya kucing putih, oren-putih, hitam-putih, dan abu-abu. Setiap jenis dapat memiliki beberapa **gaya** (mis. Basic, Developer, Scholar).
- Kucing putih Basic menjadi avatar bawaan setiap pengguna baru.
- Semua avatar memakai gaya ilustrasi yang sama dengan maskot resmi agar terasa satu keluarga.
- Avatar tampil di header, halaman profil, leaderboard, dan Welcome Banner.
- Avatar tidak menggantikan emblem rank.

Setiap avatar memiliki:
- ID unik, nama, jenis kucing, dan gaya.
- Aset ukuran kecil (32–48px, untuk header dan leaderboard) dan ukuran besar (untuk profil dan Welcome Banner).
- Tingkat akses: gratis atau berbayar (Pro/Premium).

### Tema banner
- Tema adalah ilustrasi latar untuk **Welcome Banner dashboard** dan **banner halaman profil**.
- Tema tidak mengubah warna website. Warna website tetap mengikuti brand guideline (Bagian 15), dengan pilihan mode terang atau gelap.
- Setiap tema memiliki versi mode terang dan gelap, atau satu versi yang tetap terbaca di keduanya.
- Area teks pada banner harus tetap terbaca dengan kontras memadai di setiap tema.

Setiap tema memiliki:
- ID unik dan nama.
- Aset latar (mode terang dan gelap bila diperlukan) dan thumbnail.
- Tingkat akses: gratis atau berbayar (Pro/Premium).

### Rilis awal
- **5 avatar** dan **5 tema banner**.
- Komposisi gratis dan berbayar ditetapkan di Bagian 12. Minimal 1 avatar dan 1 tema tersedia gratis.
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

### Header profil
Tampil di semua tab:
- Banner sesuai tema aktif pengguna.
- Avatar kucing aktif.
- Nama tampilan dan username.
- Bio singkat.
- Emblem tameng dan nama rank.
- Total XP dan progress menuju rank berikutnya (atau keterangan rank tertinggi untuk Master).

Ketentuan:
- Tidak ada sistem level. Perkembangan hanya ditunjukkan oleh rank dan XP (FR-05).
- Rank tidak memiliki sub-tingkat (mis. tidak ada "Apprentice II").
- Tidak ada lencana verifikasi atau penanda status membership di samping nama.

### Tab profil

| Tab | Isi |
|---|---|
| **Ringkasan** | Statistik utama (total XP, materi selesai, challenge selesai, jumlah achievement), progress per kategori materi, progress roadmap yang sedang diikuti, achievement unggulan, dan aktivitas terbaru |
| **Aktivitas** | Riwayat aktivitas yang dikelompokkan per tanggal beserta XP yang diperoleh; filter jenis aktivitas (materi, challenge, kuis, achievement, rank) dan periode; ringkasan periode; grafik XP harian dan heatmap konsistensi belajar |
| **Pencapaian** | Achievement yang sudah diperoleh dan yang sedang dalam progres, dikelompokkan per kategori (FR-14) |
| **Kustomisasi** | Koleksi avatar dan tema banner, preview profil, serta pilihan yang sedang digunakan. Hanya terlihat oleh pemilik profil |

Ketentuan:
- Nama tab dan seluruh label dalam Bahasa Indonesia.
- Progress roadmap mengikuti 6 roadmap dan cabangnya (FR-03); roadmap tidak ditampilkan sebagai jalur yang mengunci materi.
- Nilai XP pada riwayat mengikuti konfigurasi XP di FR-05.
- Informasi yang sama tidak perlu diulang di beberapa tab.

### Kustomisasi
- Dua bagian: **Avatar** dan **Tema Banner**.
- Filter koleksi: Semua, Dimiliki, Terkunci.
- Avatar dikelompokkan per jenis kucing.
- Preview profil memperlihatkan hasil pilihan sebelum disimpan.
- Bagian "Digunakan saat ini" menampilkan avatar dan tema aktif.
- Item terkunci menampilkan cara memperolehnya (mis. "Tersedia di Pro dan Premium").

### Profil publik
- Profil dapat dilihat oleh pengguna lain.
- Yang terlihat publik: banner, avatar, nama tampilan, username, bio, rank, total XP, ringkasan statistik, dan achievement.
- Yang tidak terlihat publik: tab Kustomisasi, email, data pembelian, dan membership.
- Riwayat aktivitas detail hanya terlihat oleh pemilik profil, kecuali pengguna memilih membukanya.
- Pengguna yang memilih tidak tampil di leaderboard tetap dapat memilih apakah profilnya dapat dilihat publik.
- Fitur melihat profil pengguna lain dari leaderboard dan ruang chat komunitas direncanakan untuk tahap berikutnya (Phase 7).

---

## FR-14 — Achievement

### Tujuan
Memberikan pengakuan atas pencapaian belajar sebagai motivasi tambahan.

### Ketentuan
- Achievement **hanya ditampilkan di halaman profil** (tab Ringkasan sebagai achievement unggulan, dan tab Pencapaian). Achievement tidak ditampilkan di dashboard.
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

# 4. Profil, Preferensi, dan Pengaturan

## 4.1 Profil
Ketentuan profil pengguna diatur di FR-13. Informasi sensitif tidak boleh ditampilkan secara publik tanpa alasan dan persetujuan yang sesuai.

## 4.2 Preferensi Tampilan
Warna website mengikuti brand guideline untuk semua pengguna. Tema banner hanya berlaku untuk Welcome Banner dan banner profil.

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
Notifikasi dapat digunakan untuk memberi informasi mengenai aktivitas atau perubahan yang relevan.

Preferensi notifikasi dan jenis notifikasi yang akan didukung masih perlu ditentukan.

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
- Konfigurasi rank, avatar, tema, achievement, dan paket sebaiknya tidak mengharuskan perubahan kode pada setiap perubahan konten.
- Dokumentasi implementasi harus diperbarui saat arsitektur berubah.

## 8.6 Accessibility dan Usability
- Kontras teks harus memadai.
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
- Katalog avatar dan tema banner, koleksi di tab Kustomisasi profil, dan pemilihan item aktif.
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
- Welcome Banner dan banner profil menampilkan avatar dan tema aktif pengguna.
- Teks banner tetap terbaca pada semua tema, di mode terang maupun gelap.
- Bagian website di luar banner tetap mengikuti brand guideline apa pun temanya.
- Pengguna Basic hanya dapat memilih avatar dan tema gratis.
- Pemilik Pro dan Premium dapat memilih avatar dan tema sesuai paket.
- Emblem tameng rank tidak berubah karena avatar atau tema.
- Avatar pengguna di header, profil, dan leaderboard menampilkan avatar aktif.
- Jika avatar atau tema aktif tidak valid, tampilan kembali ke bawaan gratis.
- Profil memiliki 4 tab: Ringkasan, Aktivitas, Pencapaian, dan Kustomisasi.
- Tab Kustomisasi hanya terlihat oleh pemilik profil.
- Achievement hanya muncul di profil dan tidak menambah XP.

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

## Membership
- Harga final Pro dan Premium.
- Daftar course gratis dan premium.
- Daftar avatar dan tema per paket.
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
- Daftar 5 avatar dan 5 tema rilis awal, beserta komposisi gratis dan berbayar.
- Jenis kucing yang tersedia sebagai avatar.
- Apakah avatar atau tema dapat dibeli secara individual di luar membership.
- Apakah avatar dan tema baru dirilis secara berkala.
- Daftar final achievement.
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
- Selama domain belum tersedia, setiap lingkungan memakai alamat bawaan Vercel.

## 13.4 Test otomatis dan quality gate
- Repository memiliki test end-to-end menggunakan Playwright untuk alur utama aplikasi.
- GitHub Actions menjalankan lint, build (termasuk script pengecekan data), dan test end-to-end pada setiap pull request ke `develop` dan setiap push ke `develop`.
- Pull request hanya boleh di-merge jika seluruh pemeriksaan CI lulus.
- Setiap fitur baru atau perubahan perilaku wajib menambah atau memperbarui test yang relevan.
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