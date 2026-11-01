# Kurikulum BelajarAutomation

**Versi:** 2.1
**Acuan:** `docs/PRD.md` v2.0 — FR-02 (Learning Center), FR-03 (Roadmap), FR-05 (XP dan Rank), FR-10 (Membership)

Dokumen ini adalah sumber acuan konten Learning Center dan Roadmap. Data di `data/` wajib mengikuti dokumen ini. Jika kurikulum berubah, perbarui dokumen ini lebih dulu, lalu sesuaikan data. Jika dokumen ini bertentangan dengan PRD, PRD yang berlaku.

Website: www.belajarautomation.com

---

## 1. Ketentuan umum

### Slug
- Slug dipakai di URL `/learn/<slug>` dan `/roadmap/<slug>`.
- Slug tidak boleh diganti setelah terbit agar tautan tidak rusak.
- Course #1 memakai slug lama `qa-fundamentals` (bukan `qa-fundamental`) agar tautan yang sudah ada tetap berfungsi.

### Status katalog (`availability`)
- `available`: course dapat dibuka dan dipelajari.
- `coming-soon`: tampil di katalog dengan badge "Segera hadir". Halaman detail tetap dapat dibuka dan menampilkan sampul, deskripsi, kategori, bahasa, level, serta roadmap yang memuat course tersebut, dengan keterangan "Materi sedang disiapkan".

### Status konten (`contentStatus`)
- `ready`: seluruh lesson sudah ditulis dan ditinjau.
- `draft`: struktur modul sudah ada, tetapi sebagian atau seluruh isi lesson masih placeholder.

Aturan:
- Selama pengembangan, course `available` boleh berstatus `draft`.
- **Sebelum rilis, setiap course `available` wajib berstatus `ready`.** Course yang belum `ready` diubah menjadi `coming-soon`.
- Course `coming-soon` selalu berstatus `draft`.

### Tingkat akses (`access`)
- `free`: dapat dipelajari semua pengguna, termasuk Basic.
- `premium`: hanya dapat dipelajari pengguna Pro dan Premium (PRD FR-02 dan FR-10). Pengguna Basic tetap dapat melihat katalog, deskripsi, daftar modul, dan cuplikan.

Aturan pembagian:
- Course fondasi wajib `free`, minimal: qa-fundamentals, dasar-web-api, test-design, bug-reporting, git-github, dan setidaknya satu bahasa pemrograman beserta satu tool automation.
- Total XP dari course dan latihan `free` wajib cukup untuk mencapai rank Master (saat ini 5.500 XP, PRD FR-05). Jika pembagian membuat XP gratis kurang dari itu, batas rank wajib diturunkan.
- Course yang sudah `free` tidak boleh diubah menjadi `premium` setelah ada pengguna yang mempelajarinya.

> **Status saat ini:** pembagian course gratis dan premium belum ditetapkan. Sampai diputuskan, seluruh course diperlakukan sebagai `free`.

### Bahasa (`languages`)
- Berupa daftar, karena satu course dapat memakai lebih dari satu bahasa.
- Diisi hanya untuk course yang memakai bahasa pemrograman atau query. Course konsep diisi daftar kosong.
- Nilai yang dipakai: JavaScript, TypeScript, Java, Python, SQL, Groovy.
- Filter bahasa di Learning Center menampilkan course yang memuat bahasa tersebut.

### Level
Beginner, Intermediate, atau Advanced, sesuai kesiapan yang dibutuhkan untuk memulai course.

### Kategori
- **Aktif di filter:** Fundamental, Manual Testing, Programming, Web Automation, API Testing, Performance Testing, Mobile Testing, AI, Low-Code.
- **Dicadangkan:** Security Testing. Tidak ditampilkan di filter sampai ada course di kategori ini.

### Target lesson
- Kolom "Target lesson" adalah rencana jumlah lesson. Jumlah lesson aktual di data boleh berbeda selama pengembangan.
- Total target sekitar 206 lesson. Angka ini menjadi dasar perhitungan batas XP rank di PRD FR-05 (10 XP per lesson, 50 XP bonus course tuntas, ditambah XP kuis dan challenge).
- Jika total lesson aktual berubah signifikan, batas XP rank wajib ditinjau ulang agar rank Master tetap dapat dicapai.

### Sampul
- Course: `public/covers/courses/<slug>.webp`
- Roadmap: `public/covers/roadmaps/<slug>.webp`
- Format WebP, dioptimalkan dengan `npm run optimize:covers`.

---

## 2. Katalog course (25)

| # | Slug | Judul | Kategori | Bahasa | Level | Target lesson | Status | Konten |
|---|---|---|---|---|---|---|---|---|
| 1 | qa-fundamentals | QA Fundamental | Fundamental | – | Beginner | 16 | available | ready |
| 2 | dasar-web-api | Dasar Web & API untuk QA | Fundamental | – | Beginner | 8 | available | draft |
| 3 | test-design | Test Design & Test Case | Manual Testing | – | Beginner | 8 | available | draft |
| 4 | bug-reporting | Bug Reporting & Defect Management | Manual Testing | – | Beginner | 6 | available | draft |
| 5 | test-management | Test Management dengan Jira & TestRail | Manual Testing | – | Beginner | 6 | coming-soon | draft |
| 6 | sql-untuk-qa | SQL untuk QA | Manual Testing | SQL | Beginner | 8 | coming-soon | draft |
| 7 | git-github | Git & GitHub untuk QA | Programming | – | Beginner | 8 | available | draft |
| 8 | javascript | JavaScript untuk Tester | Programming | JavaScript | Beginner | 10 | available | draft |
| 9 | typescript | TypeScript untuk Tester | Programming | TypeScript | Beginner | 8 | available | draft |
| 10 | java | Java untuk Tester | Programming | Java | Beginner | 10 | coming-soon | draft |
| 11 | python | Python untuk Tester | Programming | Python | Beginner | 10 | coming-soon | draft |
| 12 | playwright | Playwright | Web Automation | TypeScript | Intermediate | 10 | available | ready |
| 13 | cypress | Cypress | Web Automation | JavaScript | Intermediate | 8 | coming-soon | draft |
| 14 | selenium | Selenium WebDriver + TestNG | Web Automation | Java | Intermediate | 10 | coming-soon | draft |
| 15 | cucumber | BDD dengan Cucumber | Web Automation | Java | Intermediate | 6 | coming-soon | draft |
| 16 | robot-framework | Robot Framework | Web Automation | Python | Intermediate | 8 | coming-soon | draft |
| 17 | katalon | Katalon Studio (Web, API, Mobile) | Low-Code | Groovy | Beginner | 8 | coming-soon | draft |
| 18 | cicd-testing | CI/CD untuk Testing (GitHub Actions) | Web Automation | – | Intermediate | 6 | coming-soon | draft |
| 19 | postman | API Testing dengan Postman | API Testing | – | Beginner | 8 | coming-soon | draft |
| 20 | api-automation | API Automation (Playwright & REST Assured) | API Testing | TypeScript, Java | Intermediate | 8 | coming-soon | draft |
| 21 | performance-testing | Performance Testing dengan JMeter & K6 | Performance Testing | JavaScript | Intermediate | 8 | coming-soon | draft |
| 22 | mobile-testing-dasar | Mobile Testing Dasar (Android) | Mobile Testing | – | Beginner | 6 | coming-soon | draft |
| 23 | appium | Appium | Mobile Testing | Java | Intermediate | 8 | coming-soon | draft |
| 24 | dasar-ai-llm | Dasar AI & LLM | AI | – | Beginner | 6 | coming-soon | draft |
| 25 | ai-for-testing | AI for Testing | AI | – | Intermediate | 8 | coming-soon | draft |

**Ringkasan:** 8 course `available` (2 `ready`, 6 `draft`), 17 course `coming-soon`, total target 206 lesson.

> Status konten `ready` untuk QA Fundamental dan Playwright perlu diverifikasi: pastikan seluruh lesson benar-benar berisi materi, bukan placeholder. Playwright saat ini memiliki 8 lesson dari target 10.

---

## 3. Ruang lingkup course

| Course | Ruang lingkup |
|---|---|
| QA Fundamental | Peran QA, QA vs QC, SDLC, STLC, Agile dan Scrum, jenis testing, pengenalan test case dan bug report, QA di project nyata. |
| Dasar Web & API untuk QA | Client-server, HTTP method dan status code, browser dan DOM, JSON, membaca request di DevTools. |
| Test Design & Test Case | Test scenario, test case, equivalence partitioning, boundary value analysis, decision table, positive dan negative testing. |
| Bug Reporting & Defect Management | Anatomi bug report, severity vs priority, bug life cycle, bukti (screenshot, log), komunikasi dengan developer. |
| Test Management dengan Jira & TestRail | Mengelola test case, test run, dan laporan test; menghubungkan bug di Jira dengan hasil test. |
| SQL untuk QA | SELECT, filter, JOIN, dan agregasi untuk memvalidasi data aplikasi dari database. |
| Git & GitHub untuk QA | Version control, commit, branch, merge, konflik, pull request, code review. (GitHub Actions dibahas di CI/CD untuk Testing.) |
| JavaScript untuk Tester | Variabel, tipe data, function, array dan object, async/await, module, npm. |
| TypeScript untuk Tester | Tipe data, interface, type, function, async/await, konfigurasi dasar, dan TypeScript yang dipakai di Playwright. |
| Java untuk Tester | Sintaks dasar, OOP, collection, exception, Maven, dan TestNG dasar sebagai persiapan Selenium. |
| Python untuk Tester | Sintaks dasar, struktur data, file handling, virtual environment, pytest, persiapan Robot Framework. |
| Playwright | Setup project, locator, actions, assertion, fixture, Page Object Model, report, dan pengenalan request API. (Automasi API lengkap dibahas di API Automation.) |
| Cypress | Test runner, selector, assertion, custom command, intercept dan mock API. |
| Selenium WebDriver + TestNG | Locator, wait, Page Object Model, TestNG lanjutan, eksekusi paralel dengan Selenium Grid. |
| BDD dengan Cucumber | Konsep BDD, Gherkin, step definition, scenario outline, integrasi dengan Selenium. |
| Robot Framework | Keyword-driven testing, SeleniumLibrary, custom keyword, data-driven test, report. |
| Katalon Studio (Web, API, Mobile) | Record & playback, object repository, script mode (Groovy), data-driven, API dan mobile testing. |
| CI/CD untuk Testing (GitHub Actions) | Konsep CI/CD, workflow GitHub Actions, menjalankan test otomatis di pipeline, artefak report, eksekusi terjadwal dan paralel. |
| API Testing dengan Postman | Request, environment, variable, assertion, collection runner. |
| API Automation (Playwright & REST Assured) | Automasi API dengan request context Playwright (TypeScript) dan REST Assured (Java), validasi schema. |
| Performance Testing dengan JMeter & K6 | Load, stress, dan spike test; metrik response time dan throughput; membaca hasil; script K6 dengan JavaScript. |
| Mobile Testing Dasar (Android) | Karakteristik mobile testing, emulator vs real device, ADB dasar, skenario khas mobile. |
| Appium | Setup Appium, capabilities, locator mobile, gesture, eksekusi di emulator dan device farm. |
| Dasar AI & LLM | Cara kerja AI dan LLM secara sederhana, prompt engineering, batasan, halusinasi, risiko data dan privasi. |
| AI for Testing | Membuat test case dan script dengan AI, mereview output AI, self-healing test, menguji fitur berbasis LLM, pengenalan QA agent. |

---

## 4. Roadmap (6)

Notasi: `→` urutan, *(opsional)* boleh dilewati, **cabang** berarti memilih salah satu jalur lalu bergabung kembali ke node berikutnya.

### Aturan roadmap (PRD FR-03)
- Roadmap adalah panduan urutan belajar, bukan pengunci materi. Semua course tetap dapat dibuka langsung dari Learning Center.
- Setiap node wajib terhubung ke satu course di katalog.
- Node course `coming-soon` tetap ditampilkan dengan badge "Segera hadir" dan tombol Lihat Materi menuju halaman detail course.
- **Penyelesaian roadmap** dihitung dari node wajib yang berstatus `available` pada jalur yang dipilih. Node opsional dan node `coming-soon` tidak menghalangi roadmap dianggap tuntas. Ketika course `coming-soon` dirilis, course tersebut menjadi bagian dari perhitungan.

### 4.1 Fundamental (`fundamental`)
qa-fundamentals → dasar-web-api → dasar-ai-llm *(opsional)*

### 4.2 QA Manual Engineer (`qa-manual-engineer`)
qa-fundamentals → test-design → bug-reporting → test-management → sql-untuk-qa → ai-for-testing *(opsional)*

### 4.3 Programming (`programming`)
git-github → **cabang bahasa**:
- JavaScript: javascript → typescript *(rekomendasi)*
- Java: java
- Python: python

### 4.4 QA Automation Web (`qa-automation-web`)
qa-fundamentals → test-design → git-github → **cabang**:
- TypeScript: typescript → playwright *(rekomendasi)*
- JavaScript: javascript → cypress
- Java: java → selenium → cucumber
- Python: python → robot-framework
- Low-code: katalon

→ cicd-testing → ai-for-testing

### 4.5 API Test Engineer (`api-test-engineer`)
qa-fundamentals → dasar-web-api → postman → sql-untuk-qa → api-automation → performance-testing → ai-for-testing

### 4.6 QA Automation Mobile (`qa-automation-mobile`)
qa-fundamentals → mobile-testing-dasar → **cabang**:
- Java: java → appium *(rekomendasi)*
- Low-code: katalon

→ cicd-testing → ai-for-testing

---

## 5. Kondisi rilis awal

Roadmap yang dapat dituntaskan saat rilis, jika ke-8 course `available` sudah `ready`:

| Roadmap | Jalur | Node wajib tersedia | Catatan |
|---|---|---|---|
| Fundamental | – | qa-fundamentals, dasar-web-api | Dapat dituntaskan |
| Programming | JavaScript | git-github, javascript, typescript | Dapat dituntaskan |
| QA Automation Web | TypeScript | qa-fundamentals, test-design, git-github, typescript, playwright | Dapat dituntaskan; cicd-testing dan ai-for-testing menyusul |
| QA Manual Engineer | – | qa-fundamentals, test-design, bug-reporting | Sebagian; test-management dan sql-untuk-qa menyusul |
| API Test Engineer | – | qa-fundamentals, dasar-web-api | Sebagian |
| QA Automation Mobile | – | qa-fundamentals | Sebagian |

### Prioritas course setelah rilis (usulan)
1. cicd-testing dan ai-for-testing — melengkapi roadmap QA Automation Web.
2. java dan selenium — permintaan tinggi di lowongan Indonesia.
3. postman dan sql-untuk-qa — melengkapi roadmap API Test Engineer dan QA Manual Engineer.
4. test-management.
5. Course lainnya sesuai kapasitas penulisan.