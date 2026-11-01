# Kurikulum belajarautomation.id

Sumber acuan konten Learning Center (PRD FR-02) dan Roadmap (PRD FR-03).
Data di `data/` mengikuti dokumen ini. Jika ada perubahan kurikulum, perbarui dokumen ini lebih dulu.

## Ketentuan umum

- **Slug** dipakai di URL `/learn/<slug>` dan tidak boleh diganti setelah terbit agar tautan tidak rusak.
- **Status**
  - `available`: materi lengkap dengan modul dan lesson.
  - `coming-soon`: tampil di katalog dengan badge "Segera hadir". Halaman detail tetap bisa dibuka dan menampilkan deskripsi, kategori, bahasa, serta roadmap yang memuat course tersebut.
- **Bahasa** hanya diisi untuk course yang memakai bahasa pemrograman atau query. Course konsep diisi `–`.
- **Kategori**: Fundamental, Manual Testing, Web Automation, Mobile Testing, API Testing, Performance Testing, Security Testing, Programming, AI, Low-Code.

## Katalog course (25)

| # | Slug | Judul | Kategori | Bahasa | Status |
|---|---|---|---|---|---|
| 1 | qa-fundamentals | QA Fundamental | Fundamental | – | available |
| 2 | dasar-web-api | Dasar Web & API untuk QA | Fundamental | – | available |
| 3 | test-design | Test Design & Test Case | Manual Testing | – | available |
| 4 | bug-reporting | Bug Reporting & Defect Management | Manual Testing | – | available |
| 5 | test-management | Test Management dengan Jira & TestRail | Manual Testing | – | coming-soon |
| 6 | sql-untuk-qa | SQL untuk QA | Manual Testing | SQL | coming-soon |
| 7 | git-github | Git & GitHub untuk QA | Programming | – | available |
| 8 | javascript | JavaScript untuk Tester | Programming | JavaScript | available |
| 9 | typescript | TypeScript untuk Tester | Programming | TypeScript | available |
| 10 | java | Java untuk Tester | Programming | Java | coming-soon |
| 11 | python | Python untuk Tester | Programming | Python | coming-soon |
| 12 | playwright | Playwright | Web Automation | TypeScript | available |
| 13 | cypress | Cypress | Web Automation | JavaScript | coming-soon |
| 14 | selenium | Selenium WebDriver + TestNG | Web Automation | Java | coming-soon |
| 15 | cucumber | BDD dengan Cucumber | Web Automation | Java | coming-soon |
| 16 | robot-framework | Robot Framework | Web Automation | Python | coming-soon |
| 17 | katalon | Katalon Studio (Web, API, Mobile) | Low-Code | Groovy | coming-soon |
| 18 | cicd-testing | CI/CD untuk Testing (GitHub Actions) | Web Automation | – | coming-soon |
| 19 | postman | API Testing dengan Postman | API Testing | – | coming-soon |
| 20 | api-automation | API Automation (Playwright & REST Assured) | API Testing | TypeScript | coming-soon |
| 21 | performance-testing | Performance Testing dengan JMeter & K6 | Performance Testing | – | coming-soon |
| 22 | mobile-testing-dasar | Mobile Testing Dasar (Android) | Mobile Testing | – | coming-soon |
| 23 | appium | Appium | Mobile Testing | Java | coming-soon |
| 24 | dasar-ai-llm | Dasar AI & LLM | AI | – | coming-soon |
| 25 | ai-for-testing | AI for Testing | AI | – | coming-soon |

Catatan slug: course #1 memakai slug lama `qa-fundamentals` (bukan `qa-fundamental`) agar tautan yang sudah ada tetap berfungsi.

## Ruang lingkup course

| Course | Ruang lingkup |
|---|---|
| QA Fundamental | Peran QA, QA vs QC, SDLC, STLC, Agile, jenis testing, test case, bug report, QA di project nyata. |
| Dasar Web & API untuk QA | Client-server, HTTP method dan status code, browser dan DOM, JSON, membaca request di DevTools. |
| Test Design & Test Case | Test scenario, test case, equivalence partitioning, boundary value analysis, decision table, positive dan negative testing. |
| Bug Reporting & Defect Management | Anatomi bug report, severity vs priority, bug life cycle, bukti (screenshot, log), komunikasi dengan developer. |
| Test Management dengan Jira & TestRail | Mengelola test case, test run, dan laporan test; menghubungkan bug di Jira dengan hasil test. |
| SQL untuk QA | SELECT, filter, JOIN, dan agregasi untuk memvalidasi data aplikasi dari database. |
| Git & GitHub untuk QA | Version control, branch, merge, pull request, code review, GitHub Actions dasar. |
| JavaScript untuk Tester | Variabel, function, array dan object, async/await, module, npm. |
| TypeScript untuk Tester | Tipe dasar, interface, type, generic sederhana, konfigurasi `tsconfig` untuk project test. |
| Java untuk Tester | Sintaks dasar, OOP, collection, exception, Maven, JUnit. |
| Python untuk Tester | Sintaks dasar, struktur data, file handling, virtual environment, pytest. |
| Playwright | Setup project, locator, assertion, Page Object Model, API testing dengan Playwright. |
| Cypress | Test runner, selector, assertion, custom command, intercept dan mock API. |
| Selenium WebDriver + TestNG | Locator, wait, Page Object Model, TestNG, eksekusi paralel dengan Selenium Grid. |
| BDD dengan Cucumber | Konsep BDD, Gherkin, step definition, scenario outline, integrasi dengan Selenium. |
| Robot Framework | Keyword-driven testing, SeleniumLibrary, custom keyword, data-driven test, report. |
| Katalon Studio (Web, API, Mobile) | Record & playback, object repository, script mode (Groovy), data-driven, API dan mobile testing. |
| CI/CD untuk Testing (GitHub Actions) | Menjalankan test otomatis di pipeline, artefak report, eksekusi terjadwal dan paralel. |
| API Testing dengan Postman | Request, environment, variable, assertion, collection runner. |
| API Automation (Playwright & REST Assured) | Automasi API dengan request context Playwright dan REST Assured, validasi schema. |
| Performance Testing dengan JMeter & K6 | Load, stress, dan spike test; metrik response time dan throughput; membaca hasil. |
| Mobile Testing Dasar (Android) | Karakteristik mobile testing, emulator vs real device, ADB dasar, skenario khas mobile. |
| Appium | Setup Appium, capabilities, locator mobile, gesture, eksekusi di emulator dan device farm. |
| Dasar AI & LLM | Cara kerja AI dan LLM secara sederhana, prompt engineering, batasan, halusinasi, risiko data dan privasi. |
| AI for Testing | Membuat test case dan script dengan AI, mereview output AI, self-healing test, menguji fitur berbasis LLM, pengenalan QA agent. |

## Roadmap (6)

Notasi: `→` urutan, *(opsional)* boleh dilewati, **cabang** berarti memilih salah satu jalur lalu bergabung kembali ke node berikutnya.

### 1. Fundamental (`fundamental`)

qa-fundamentals → dasar-web-api → dasar-ai-llm *(opsional)*

### 2. QA Manual Engineer (`qa-manual-engineer`)

qa-fundamentals → test-design → bug-reporting → test-management → sql-untuk-qa → ai-for-testing *(opsional)*

### 3. Programming (`programming`)

git-github → **cabang bahasa**:

- JavaScript: javascript → typescript *(rekomendasi)*
- Java: java
- Python: python

### 4. QA Automation Web (`qa-automation-web`)

qa-fundamentals → test-design → git-github → **cabang**:

- TypeScript: typescript → playwright *(rekomendasi)*
- JavaScript: javascript → cypress
- Java: java → selenium → cucumber
- Python: python → robot-framework
- Low-code: katalon

→ cicd-testing → ai-for-testing

### 5. API Test Engineer (`api-test-engineer`)

qa-fundamentals → dasar-web-api → postman → sql-untuk-qa → api-automation → performance-testing → ai-for-testing

### 6. QA Automation Mobile (`qa-automation-mobile`)

qa-fundamentals → mobile-testing-dasar → **cabang**:

- Java: java → appium *(rekomendasi)*
- Low-code: katalon

→ cicd-testing → ai-for-testing
