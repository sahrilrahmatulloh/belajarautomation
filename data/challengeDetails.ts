// Berisi kunci jawaban: hanya boleh diimpor dari kode server.
import "server-only";

import { ChallengeDetail } from "@/types/ChallengeDetail";

export const CHALLENGE_DETAILS: ChallengeDetail[] = [
  {
    slug: "kuis-qa-fundamental",
    type: "quiz",
    passingScore: 70,
    questions: [
      {
        question: "Apa fokus utama Quality Assurance (QA)?",
        options: [
          "Menemukan bug sebanyak mungkin setelah produk selesai",
          "Mencegah cacat dengan memperbaiki proses pengembangan",
          "Menulis seluruh kode aplikasi",
          "Mengelola anggaran project",
        ],
        correctIndex: 1,
        explanation:
          "QA berorientasi pada proses: memastikan cara kerja tim mencegah cacat sejak awal. Menemukan cacat pada produk lebih dekat dengan peran QC.",
      },
      {
        question: "Apa perbedaan utama QA dan QC?",
        options: [
          "QA berfokus pada proses, QC berfokus pada pemeriksaan produk",
          "QA hanya untuk aplikasi web, QC hanya untuk aplikasi mobile",
          "QA dilakukan pelanggan, QC dilakukan developer",
          "Tidak ada perbedaan, keduanya istilah yang sama",
        ],
        correctIndex: 0,
        explanation:
          "QA menjaga kualitas lewat proses, sedangkan QC memeriksa produk untuk menemukan cacat, misalnya melalui pengujian.",
      },
      {
        question: "Manakah yang merupakan tanggung jawab QA Engineer?",
        options: [
          "Menentukan harga jual produk",
          "Mendesain logo perusahaan",
          "Merancang dan menjalankan pengujian untuk memastikan produk sesuai kebutuhan",
          "Mengelola server produksi setiap hari",
        ],
        correctIndex: 2,
        explanation:
          "QA Engineer memastikan produk memenuhi kebutuhan dengan merancang dan menjalankan pengujian, lalu melaporkan temuannya.",
      },
      {
        question: "Tahap apa yang umumnya menjadi awal Software Development Life Cycle (SDLC)?",
        options: [
          "Deployment",
          "Maintenance",
          "Testing",
          "Analisis kebutuhan",
        ],
        correctIndex: 3,
        explanation:
          "SDLC dimulai dari memahami kebutuhan, karena desain, pengembangan, dan pengujian semuanya mengacu pada kebutuhan tersebut.",
      },
      {
        question: "Manakah urutan Software Testing Life Cycle (STLC) yang benar?",
        options: [
          "Eksekusi test → desain test case → analisis kebutuhan → perencanaan test",
          "Analisis kebutuhan → perencanaan test → desain test case → eksekusi test",
          "Perencanaan test → eksekusi test → analisis kebutuhan → desain test case",
          "Desain test case → analisis kebutuhan → eksekusi test → perencanaan test",
        ],
        correctIndex: 1,
        explanation:
          "Tester perlu memahami kebutuhan dulu, lalu merencanakan pengujian, menyusun test case, dan baru menjalankannya.",
      },
      {
        question: "Dalam Scrum, apa sebutan untuk iterasi kerja dengan durasi tetap?",
        options: [
          "Sprint",
          "Backlog",
          "Epic",
          "Stand-up",
        ],
        correctIndex: 0,
        explanation:
          "Sprint adalah iterasi berdurasi tetap, umumnya 1 sampai 4 minggu. Backlog adalah daftar pekerjaan, dan stand-up adalah pertemuan singkat harian.",
      },
      {
        question: "Apa tujuan regression testing?",
        options: [
          "Menguji performa aplikasi saat banyak pengguna",
          "Menguji tampilan di berbagai browser saja",
          "Memastikan perubahan baru tidak merusak fitur yang sudah berjalan",
          "Menguji fitur untuk pertama kalinya",
        ],
        correctIndex: 2,
        explanation:
          "Regression testing mengulang pengujian fitur yang sudah ada setelah terjadi perubahan, untuk memastikan tidak muncul kerusakan baru.",
      },
      {
        question: "Apa ciri black-box testing?",
        options: [
          "Tester wajib membaca seluruh kode sumber",
          "Pengujian hanya dilakukan oleh developer",
          "Pengujian hanya dapat dilakukan otomatis",
          "Pengujian berdasarkan input dan output tanpa melihat kode",
        ],
        correctIndex: 3,
        explanation:
          "Black-box testing menilai perilaku aplikasi dari luar: input yang diberikan dan output yang dihasilkan, tanpa melihat struktur kodenya.",
      },
      {
        question: "Bagian test case mana yang menjelaskan apa yang seharusnya terjadi?",
        options: [
          "Prasyarat",
          "Expected result",
          "Judul test case",
          "Test data",
        ],
        correctIndex: 1,
        explanation:
          "Expected result adalah acuan hasil yang benar. Hasil aktual dibandingkan dengannya untuk menentukan test lulus atau gagal.",
      },
      {
        question: "Mengapa langkah reproduksi penting dalam bug report?",
        options: [
          "Agar developer dapat mengulang dan memastikan bug tersebut",
          "Agar laporan terlihat lebih panjang",
          "Untuk menentukan gaji tester",
          "Untuk menggantikan severity bug",
        ],
        correctIndex: 0,
        explanation:
          "Langkah reproduksi yang jelas memungkinkan developer melihat bug yang sama, sehingga penyebabnya lebih cepat ditemukan dan diperbaiki.",
      },
    ],
  },
  {
    slug: "kuis-dasar-web-api",
    type: "quiz",
    passingScore: 70,
    questions: [
      {
        question: "Pada arsitektur client-server, apa peran client?",
        options: [
          "Menyimpan seluruh data aplikasi",
          "Mengirim request dan menampilkan response dari server",
          "Mengatur jaringan internet",
          "Menjalankan database untuk semua pengguna",
        ],
        correctIndex: 1,
        explanation:
          "Client, misalnya browser, mengirim request ke server dan menampilkan response yang diterima. Server memproses request dan mengelola data.",
      },
      {
        question: "HTTP method apa yang umum dipakai untuk membuat data baru?",
        options: [
          "GET",
          "DELETE",
          "POST",
          "HEAD",
        ],
        correctIndex: 2,
        explanation:
          "POST umum dipakai untuk mengirim data dan membuat resource baru. GET mengambil data dan DELETE menghapus data.",
      },
      {
        question: "Apa arti status code 404?",
        options: [
          "Resource yang diminta tidak ditemukan",
          "Request berhasil",
          "Server mengalami kesalahan internal",
          "Pengguna belum login",
        ],
        correctIndex: 0,
        explanation:
          "404 Not Found berarti server tidak menemukan resource pada alamat tersebut. Kesalahan internal server adalah 500, dan belum terautentikasi adalah 401.",
      },
      {
        question: "Kelompok status code mana yang menandakan kesalahan di sisi server?",
        options: [
          "2xx",
          "3xx",
          "4xx",
          "5xx",
        ],
        correctIndex: 3,
        explanation:
          "5xx menandakan kesalahan di server. 2xx berarti berhasil, 3xx pengalihan, dan 4xx kesalahan di sisi client.",
      },
      {
        question: "Apa itu DOM?",
        options: [
          "Bahasa pemrograman untuk server",
          "Representasi struktur halaman HTML yang dapat diakses dan diubah oleh script",
          "Format penyimpanan gambar",
          "Jenis database",
        ],
        correctIndex: 1,
        explanation:
          "DOM (Document Object Model) adalah struktur pohon dari halaman yang dibuat browser. Selector pada automation testing bekerja di atas struktur ini.",
      },
      {
        question: "Manakah penulisan JSON yang valid?",
        options: [
          "{ name: 'Sari' }",
          "{ \"name\": 'Sari' }",
          "{ \"name\": \"Sari\" }",
          "( \"name\" = \"Sari\" )",
        ],
        correctIndex: 2,
        explanation:
          "JSON mewajibkan nama properti dan nilai teks memakai tanda kutip ganda, dengan titik dua sebagai pemisah di dalam kurung kurawal.",
      },
      {
        question: "Tab DevTools mana yang dipakai untuk melihat request dan response?",
        options: [
          "Network",
          "Elements",
          "Lighthouse",
          "Application",
        ],
        correctIndex: 0,
        explanation:
          "Tab Network menampilkan setiap request beserta method, status code, header, dan response-nya. Tab Elements dipakai untuk memeriksa struktur HTML.",
      },
      {
        question: "Apa perbedaan utama status 401 dan 403?",
        options: [
          "Keduanya berarti server mati",
          "401 berarti data tidak ditemukan, 403 berarti berhasil",
          "401 berarti berhasil dibuat, 403 berarti dialihkan",
          "401 berarti belum terautentikasi, 403 berarti tidak punya izin",
        ],
        correctIndex: 3,
        explanation:
          "401 berarti server belum mengenali identitas pengguna. 403 berarti identitasnya mungkin sudah dikenal, tetapi tidak punya izin atas resource tersebut.",
      },
    ],
  },
  {
    slug: "kuis-git-github",
    type: "quiz",
    passingScore: 70,
    questions: [
      {
        question: "Apa manfaat utama version control?",
        options: [
          "Mempercepat koneksi internet",
          "Mencatat riwayat perubahan dan memudahkan kerja sama pada kode yang sama",
          "Menghapus bug secara otomatis",
          "Menggantikan kebutuhan testing",
        ],
        correctIndex: 1,
        explanation:
          "Version control menyimpan riwayat perubahan, sehingga tim bisa bekerja bersama, melihat siapa mengubah apa, dan kembali ke versi sebelumnya.",
      },
      {
        question: "Apa fungsi perintah `git add`?",
        options: [
          "Memasukkan perubahan ke staging area sebelum di-commit",
          "Mengirim commit ke GitHub",
          "Membuat repository baru",
          "Menghapus file dari komputer",
        ],
        correctIndex: 0,
        explanation:
          "`git add` memilih perubahan yang akan masuk ke commit berikutnya. Mengirim commit ke remote dilakukan dengan `git push`.",
      },
      {
        question: "Apa yang dimaksud dengan commit?",
        options: [
          "Permintaan untuk meninjau kode",
          "Salinan repository di akun lain",
          "Catatan perubahan pada riwayat repository",
          "Cabang baru untuk fitur",
        ],
        correctIndex: 2,
        explanation:
          "Commit menyimpan sekumpulan perubahan beserta pesan penjelasnya ke dalam riwayat repository.",
      },
      {
        question: "Mengapa fitur baru sebaiknya dikerjakan di branch terpisah?",
        options: [
          "Agar file menjadi lebih kecil",
          "Agar Git berjalan lebih cepat",
          "Agar tidak perlu menulis pesan commit",
          "Agar perubahan tidak langsung memengaruhi branch utama sebelum ditinjau",
        ],
        correctIndex: 3,
        explanation:
          "Branch memisahkan pekerjaan yang belum selesai, sehingga branch utama tetap stabil sampai perubahan ditinjau dan digabungkan.",
      },
      {
        question: "Perintah apa yang menggabungkan branch lain ke branch yang sedang aktif?",
        options: [
          "git merge",
          "git status",
          "git log",
          "git clone",
        ],
        correctIndex: 0,
        explanation:
          "`git merge` menggabungkan riwayat branch lain ke branch aktif. `git status` dan `git log` hanya menampilkan informasi, sedangkan `git clone` menyalin repository.",
      },
      {
        question: "Kapan merge conflict terjadi?",
        options: [
          "Saat repository bersifat publik",
          "Saat dua branch mengubah bagian yang sama pada file dengan cara berbeda",
          "Setiap kali dua orang membuat commit",
          "Saat koneksi internet terputus",
        ],
        correctIndex: 1,
        explanation:
          "Git tidak bisa memutuskan perubahan mana yang benar bila bagian yang sama diubah berbeda, sehingga konfliknya harus diselesaikan manual.",
      },
      {
        question: "Apa tujuan pull request di GitHub?",
        options: [
          "Mengunduh repository ke komputer",
          "Menghapus branch lama",
          "Mengusulkan perubahan agar dapat ditinjau sebelum digabungkan",
          "Membuat salinan file cadangan",
        ],
        correctIndex: 2,
        explanation:
          "Pull request menampilkan perubahan dari sebuah branch, sehingga dapat didiskusikan, ditinjau, dan diuji sebelum digabungkan.",
      },
      {
        question: "Apa yang sebaiknya dilakukan saat code review?",
        options: [
          "Menyetujui semua perubahan tanpa membacanya",
          "Menulis ulang seluruh kode penulis",
          "Hanya memeriksa jumlah baris yang berubah",
          "Memeriksa kebenaran dan keterbacaan perubahan, lalu memberi masukan yang jelas",
        ],
        correctIndex: 3,
        explanation:
          "Code review bertujuan menemukan masalah lebih awal dan menjaga kualitas kode lewat masukan yang spesifik dan membangun.",
      },
    ],
  },
  {
    slug: "kuis-playwright",
    type: "quiz",
    passingScore: 70,
    questions: [
      {
        question: "Perintah apa yang menjalankan seluruh test Playwright di project?",
        options: [
          "npx playwright install",
          "npx playwright test",
          "npx playwright codegen",
          "npx playwright show-report",
        ],
        correctIndex: 1,
        explanation:
          "`npx playwright test` menjalankan test. `install` mengunduh browser, `codegen` merekam langkah menjadi kode, dan `show-report` membuka laporan.",
      },
      {
        question: "Mengapa `getByRole` umumnya lebih disarankan daripada XPath yang panjang?",
        options: [
          "Karena lebih dekat dengan cara pengguna mengenali elemen dan lebih tahan perubahan struktur",
          "Karena hanya bekerja di Chromium",
          "Karena tidak perlu menunggu elemen tampil",
          "Karena dapat dipakai tanpa browser",
        ],
        correctIndex: 0,
        explanation:
          "`getByRole` memakai peran dan nama yang dapat diakses. Locator ini biasanya tetap berfungsi saat struktur HTML berubah, tidak seperti XPath yang bergantung pada susunan elemen.",
      },
      {
        question: "Apa yang dilakukan auto-waiting saat `click()` dipanggil?",
        options: [
          "Menunggu selama 30 detik setiap kali",
          "Mengulang seluruh test bila gagal",
          "Menunggu elemen siap, misalnya terlihat, stabil, dan dapat menerima klik",
          "Melewati klik bila elemen belum tampil",
        ],
        correctIndex: 2,
        explanation:
          "Playwright menjalankan pemeriksaan kesiapan elemen sebelum aksi dilakukan, sehingga jeda waktu tetap biasanya tidak diperlukan.",
      },
      {
        question: "Manakah assertion web-first yang menunggu dan mencoba ulang secara otomatis?",
        options: [
          "expect(await locator.isVisible()).toBe(true)",
          "expect(await locator.count()).toBe(1)",
          "console.assert(locator)",
          "await expect(locator).toBeVisible()",
        ],
        correctIndex: 3,
        explanation:
          "`await expect(locator).toBeVisible()` mengulang pemeriksaan sampai lulus atau timeout. `isVisible()` hanya memeriksa satu kali pada saat dipanggil.",
      },
      {
        question: "Apa yang disediakan fixture bawaan `page`?",
        options: [
          "Halaman browser baru yang terisolasi untuk setiap test",
          "Satu halaman yang dipakai bersama seluruh test",
          "File laporan HTML",
          "Daftar seluruh locator di project",
        ],
        correctIndex: 0,
        explanation:
          "Setiap test mendapat `page` dalam browser context-nya sendiri, sehingga cookie dan penyimpanan tidak bercampur antar-test.",
      },
      {
        question: "Apa manfaat utama Page Object Model?",
        options: [
          "Membuat test berjalan tanpa browser",
          "Mengumpulkan locator dan aksi per halaman agar test mudah dirawat",
          "Menghilangkan kebutuhan assertion",
          "Mengganti file konfigurasi Playwright",
        ],
        correctIndex: 1,
        explanation:
          "Bila tampilan berubah, locator cukup diperbaiki di satu kelas Page Object, tanpa perlu mengubah setiap test yang memakainya.",
      },
      {
        question: "Hook apa yang dijalankan sebelum setiap test dalam satu file atau describe?",
        options: [
          "test.afterAll",
          "test.skip",
          "test.beforeEach",
          "test.only",
        ],
        correctIndex: 2,
        explanation:
          "`test.beforeEach` cocok untuk persiapan berulang, misalnya membuka halaman. `test.only` dan `test.skip` mengatur test mana yang dijalankan.",
      },
      {
        question: "Perintah apa yang membuka laporan HTML hasil test terakhir?",
        options: [
          "npx playwright test --debug",
          "npx playwright init",
          "npx playwright open",
          "npx playwright show-report",
        ],
        correctIndex: 3,
        explanation:
          "`npx playwright show-report` membuka laporan HTML. Laporan ini memuat daftar test, langkah, dan lampiran seperti screenshot.",
      },
      {
        question: "Fixture apa yang dipakai untuk mengirim request API tanpa membuka halaman?",
        options: [
          "request",
          "locator",
          "expect",
          "screenshot",
        ],
        correctIndex: 0,
        explanation:
          "Fixture `request` menyediakan API request context, misalnya `request.get()`, untuk memanggil API langsung dari test.",
      },
      {
        question: "Apa arti opsi `trace: \"on-first-retry\"` pada konfigurasi Playwright?",
        options: [
          "Test tidak pernah diulang",
          "Trace direkam saat test dijalankan ulang untuk pertama kali",
          "Trace direkam di semua test yang lulus",
          "Screenshot diambil pada setiap langkah",
        ],
        correctIndex: 1,
        explanation:
          "Trace hanya direkam pada percobaan ulang pertama, sehingga test yang gagal tetap bisa dianalisis tanpa membebani setiap eksekusi.",
      },
    ],
  },
  {
    slug: "find-checkout-bug",
    type: "bug-hunt",
    practicePage: "checkout",
    findings: [
      {
        id: "total-tanpa-diskon",
        label: "Total pembayaran tidak dikurangi diskon",
        explanation:
          "Bug. Ringkasan menampilkan diskon, tetapi total tetap dihitung dari subtotal dan ongkos kirim saja.",
      },
      {
        id: "subtotal-tidak-berubah",
        label: "Subtotal tidak berubah saat jumlah barang diubah",
        explanation:
          "Bug. Jumlah barang bisa diubah, tetapi subtotal tetap menghitung jumlah awal.",
      },
      {
        id: "jumlah-di-bawah-satu",
        label: "Jumlah barang bisa dikurangi sampai di bawah 1",
        explanation:
          "Bug. Tombol kurang tetap aktif saat jumlah 1, sehingga jumlah barang bisa menjadi 0 atau negatif.",
      },
      {
        id: "ongkir-tidak-dihitung",
        label: "Ongkos kirim tidak masuk ke total pembayaran",
        explanation:
          "Bukan bug. Ongkos kirim sudah ikut dijumlahkan ke total pembayaran.",
      },
      {
        id: "harga-satuan-salah",
        label: "Harga satuan berbeda dengan harga di daftar barang",
        explanation:
          "Bukan bug. Harga satuan yang dipakai sama dengan harga yang tampil pada barang.",
      },
      {
        id: "metode-bayar-hilang",
        label: "Metode pembayaran tidak bisa dipilih",
        explanation:
          "Bukan bug. Pilihan metode pembayaran tampil dan bisa dipilih.",
      },
    ],
    bugIds: ["total-tanpa-diskon", "subtotal-tidak-berubah", "jumlah-di-bawah-satu"],
    maxFalsePositives: 0,
  },
  {
    slug: "bug-hunt-form-login",
    type: "bug-hunt",
    practicePage: "login",
    findings: [
      {
        id: "masuk-tanpa-email",
        label: "Tombol Masuk tetap aktif walau email kosong",
        explanation:
          "Bug. Form seharusnya menolak pengiriman selama email kosong, tetapi tombol Masuk tetap bisa ditekan.",
      },
      {
        id: "pesan-salah-ketik",
        label: "Pesan error password mengandung salah ketik",
        explanation:
          "Bug. Pesan error tertulis \"Pasword salah\", seharusnya \"Password salah\".",
      },
      {
        id: "password-terlihat",
        label: "Password yang diketik terlihat sebagai teks biasa",
        explanation:
          "Bukan bug. Kolom password memakai tipe password, sehingga isinya tersamarkan.",
      },
      {
        id: "tautan-daftar-hilang",
        label: "Tautan menuju halaman daftar tidak tersedia",
        explanation:
          "Bukan bug. Tautan daftar tersedia di bawah form.",
      },
      {
        id: "label-email-hilang",
        label: "Kolom email tidak memiliki label",
        explanation:
          "Bukan bug. Kolom email memiliki label yang terhubung dengan benar.",
      },
    ],
    bugIds: ["masuk-tanpa-email", "pesan-salah-ketik"],
    maxFalsePositives: 0,
  },
  {
    slug: "login-test-case",
    type: "test-case",
    requirement: [
      "Pengguna masuk memakai email dan password.",
      "Bila email dan password benar, pengguna diarahkan ke dashboard.",
      "Bila password salah, tampil pesan \"Email atau password salah\" dan pengguna tetap di halaman login.",
      "Email dan password wajib diisi.",
    ],
    sampleAnswer: `Judul: Login berhasil dengan email dan password yang benar
Prasyarat: Akun user@contoh.com sudah terdaftar dengan password Rahasia123
Langkah:
1. Buka halaman login
2. Isi email dengan user@contoh.com
3. Isi password dengan Rahasia123
4. Klik tombol Masuk
Hasil yang diharapkan: Pengguna diarahkan ke halaman dashboard

Judul: Login gagal dengan password yang salah
Prasyarat: Akun user@contoh.com sudah terdaftar
Langkah:
1. Buka halaman login
2. Isi email dengan user@contoh.com
3. Isi password dengan PasswordSalah
4. Klik tombol Masuk
Hasil yang diharapkan: Tampil pesan "Email atau password salah" dan pengguna tetap di halaman login`,
    checklist: [
      { id: "judul-jelas", label: "Judul test case menjelaskan skenario yang diuji", required: true },
      { id: "prasyarat", label: "Prasyarat menyebutkan akun yang sudah terdaftar", required: true },
      { id: "langkah-berurutan", label: "Langkah ditulis berurutan dan dapat diikuti orang lain", required: true },
      { id: "hasil-dashboard", label: "Skenario positif mengharapkan pengguna masuk ke dashboard", required: true },
      { id: "skenario-negatif", label: "Ada skenario negatif, misalnya password salah", required: false },
      { id: "kolom-kosong", label: "Ada skenario kolom email atau password kosong", required: false },
    ],
  },
  {
    slug: "test-case-pencarian-produk",
    type: "test-case",
    requirement: [
      "Pengguna mencari produk berdasarkan nama lewat kolom pencarian.",
      "Hasil dapat difilter berdasarkan kategori dan rentang harga.",
      "Pencarian dan filter berlaku bersamaan.",
      "Bila tidak ada produk yang cocok, tampil pesan \"Produk tidak ditemukan\".",
    ],
    sampleAnswer: `Judul: Pencarian dengan filter kategori dan harga menampilkan produk yang cocok
Prasyarat: Tersedia produk "Sepatu Lari" kategori Olahraga seharga Rp500.000
Langkah:
1. Buka halaman produk
2. Ketik "sepatu" di kolom pencarian
3. Pilih kategori Olahraga
4. Isi rentang harga Rp400.000 sampai Rp600.000
Hasil yang diharapkan: "Sepatu Lari" tampil, dan semua hasil memenuhi kata kunci, kategori, serta rentang harga

Judul: Pencarian tanpa hasil menampilkan pesan
Prasyarat: Tidak ada produk bernama "zzzz"
Langkah:
1. Buka halaman produk
2. Ketik "zzzz" di kolom pencarian
Hasil yang diharapkan: Tampil pesan "Produk tidak ditemukan"`,
    checklist: [
      { id: "kata-kunci", label: "Ada skenario pencarian dengan kata kunci yang cocok", required: true },
      { id: "filter-gabungan", label: "Ada skenario pencarian yang digabung dengan filter kategori atau harga", required: true },
      { id: "tanpa-hasil", label: "Ada skenario tanpa hasil yang mengharapkan pesan \"Produk tidak ditemukan\"", required: true },
      { id: "data-uji", label: "Data uji ditulis jelas, misalnya kata kunci dan rentang harga", required: true },
      { id: "batas-harga", label: "Ada skenario nilai batas harga, misalnya tepat di harga minimum", required: false },
      { id: "reset-filter", label: "Ada skenario menghapus filter untuk kembali ke semua hasil", required: false },
    ],
  },
  {
    slug: "playwright-locator",
    type: "locator",
    practicePage: "login",
    targetDescription: "Tombol \"Masuk\" untuk mengirim form login.",
    targetElementId: "login-submit",
    selectorTypes: ["css", "xpath"],
  },
  {
    slug: "locator-form-registrasi",
    type: "locator",
    practicePage: "registrasi",
    targetDescription: "Kotak centang persetujuan syarat dan ketentuan.",
    targetElementId: "registrasi-syarat",
    selectorTypes: ["css", "xpath"],
  },
];
