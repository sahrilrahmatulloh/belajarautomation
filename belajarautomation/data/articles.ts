import { Article } from "@/types/Article";

export const ARTICLES: Article[] = [
  {
    id: 1,
    slug: "masa-depan-qa-automation-2026",
    title: "Masa Depan QA Automation di 2026",
    excerpt:
      "Bagaimana AI, coding agents, dan modern testing tools mengubah cara QA Engineer bekerja.",
    category: "AI",
    author: "belajarautomation.id",
    publishedAt: "10 Juli 2026",
    readTime: "8 min",
    cover: "/blog/qa-automation-2026.png",
    featured: true,
    content: [
      {
        heading: "QA Automation Terus Berkembang",
        paragraphs: [
          "QA Automation tidak lagi hanya berfokus pada pembuatan script otomatis. Seorang QA Automation Engineer kini dituntut memahami software engineering, API, CI/CD, cloud, hingga AI-assisted development.",
          "Perubahan ini membuat automation menjadi bagian penting dalam software delivery lifecycle, bukan hanya tahap akhir sebelum release.",
        ],
      },
      {
        heading: "AI Menjadi Partner QA Engineer",
        paragraphs: [
          "AI dapat membantu menghasilkan test case, automation script, debugging, hingga dokumentasi.",
          "Namun AI bukan pengganti QA Engineer. Fundamental testing, programming, dan problem solving tetap menjadi skill utama.",
        ],
      },
      {
        heading: "Kesimpulan",
        paragraphs: [
          "Mulailah dari fundamental QA, kemudian pelajari automation, API, mobile testing, dan manfaatkan AI sebagai accelerator, bukan sebagai pengganti kemampuan engineering.",
        ],
      },
    ],
  },
  {
    id: 2,
    slug: "playwright-vs-selenium",
    title: "Playwright vs Selenium: Pilih Mana?",
    excerpt:
      "Perbandingan Playwright dan Selenium untuk membantu kamu memilih automation tool.",
    category: "Automation",
    author: "belajarautomation.id",
    publishedAt: "8 Juli 2026",
    readTime: "6 min",
    cover: "/blog/playwright-vs-selenium.png",
    featured: false,
    content: [
      {
        heading: "Sekilas Perbandingan",
        paragraphs: [
          "Selenium merupakan framework automation yang sudah matang dan banyak digunakan di industri.",
          "Playwright hadir dengan fitur modern seperti auto waiting, network interception, multi-browser, dan performa yang lebih baik.",
        ],
      },
      {
        heading: "Kapan Memilih Playwright?",
        paragraphs: [
          "Untuk project baru, Playwright menjadi pilihan yang sangat menarik karena developer experience yang lebih modern.",
          "Namun Selenium tetap relevan untuk perusahaan yang sudah memiliki automation framework besar.",
        ],
      },
      {
        heading: "Kesimpulan",
        paragraphs: [
          "Pelajari keduanya. Playwright cocok untuk project modern, sedangkan Selenium masih sangat banyak digunakan di enterprise.",
        ],
      },
    ],
  },
  {
    id: 3,
    slug: "locator-playwright-best-practice",
    title: "Best Practice Locator di Playwright",
    excerpt:
      "Pelajari strategi memilih locator yang readable, resilient, dan mudah dipelihara.",
    category: "Playwright",
    author: "belajarautomation.id",
    publishedAt: "5 Juli 2026",
    readTime: "5 min",
    cover: "/blog/playwright-locator.png",
    featured: false,
    content: [
      {
        heading: "Gunakan Semantic Locator",
        paragraphs: [
          "Prioritaskan getByRole(), getByLabel(), dan getByPlaceholder() dibanding XPath panjang.",
          "Semantic locator membuat automation lebih stabil ketika UI berubah.",
        ],
      },
      {
        heading: "Hindari XPath Berlebihan",
        paragraphs: [
          "XPath yang terlalu panjang rentan rusak ketika struktur DOM berubah.",
          "Gunakan data-testid bila memungkinkan.",
        ],
      },
      {
        heading: "Kesimpulan",
        paragraphs: [
          "Locator yang baik adalah locator yang mudah dibaca, mudah dirawat, dan stabil.",
        ],
      },
    ],
  },
  {
    id: 4,
    slug: "memulai-mobile-automation-appium",
    title: "Memulai Mobile Automation dengan Appium",
    excerpt:
      "Panduan awal memahami Appium dan workflow mobile automation untuk Android dan iOS.",
    category: "Mobile",
    author: "belajarautomation.id",
    publishedAt: "2 Juli 2026",
    readTime: "7 min",
    cover: "/blog/appium-mobile.png",
    featured: false,
    content: [
      {
        heading: "Apa itu Appium?",
        paragraphs: [
          "Appium adalah framework open source untuk melakukan automation testing pada aplikasi Android dan iOS.",
          "Framework ini mendukung berbagai bahasa pemrograman seperti Java, JavaScript, Python, dan lainnya.",
        ],
      },
      {
        heading: "Persiapan Environment",
        paragraphs: [
          "Install Android Studio, Android SDK, Appium Server, serta emulator atau real device.",
          "Pastikan environment variable seperti ANDROID_HOME telah dikonfigurasi dengan benar.",
        ],
      },
      {
        heading: "Kesimpulan",
        paragraphs: [
          "Pahami mobile testing fundamentals terlebih dahulu sebelum membangun automation framework.",
        ],
      },
    ],
  },
  {
    id: 5,
    slug: "api-testing-wajib-qa-engineer",
    title: "Kenapa QA Engineer Harus Memahami API Testing?",
    excerpt:
      "API testing adalah salah satu skill penting untuk membangun strategi testing modern.",
    category: "API Testing",
    author: "belajarautomation.id",
    publishedAt: "28 Juni 2026",
    readTime: "6 min",
    cover: "/blog/api-testing.png",
    featured: false,
    content: [
      {
        heading: "API Adalah Fondasi Aplikasi Modern",
        paragraphs: [
          "Sebagian besar aplikasi modern berkomunikasi melalui API.",
          "Dengan memahami API, QA dapat menemukan bug lebih cepat dibanding hanya melakukan UI testing.",
        ],
      },
      {
        heading: "Apa yang Harus Dipelajari?",
        paragraphs: [
          "Pelajari HTTP Method, Status Code, Authentication, JSON, hingga API Automation.",
        ],
      },
      {
        heading: "Kesimpulan",
        paragraphs: [
          "API Testing adalah skill wajib bagi QA Automation Engineer modern.",
        ],
      },
    ],
  },
  {
    id: 6,
    slug: "portfolio-qa-automation",
    title: "Cara Membangun Portfolio QA Automation",
    excerpt:
      "Susun GitHub dan automation project yang mampu menunjukkan kemampuan teknis kamu.",
    category: "Career",
    author: "belajarautomation.id",
    publishedAt: "25 Juni 2026",
    readTime: "8 min",
    cover: "/blog/qa-portfolio.png",
    featured: false,
    content: [
      {
        heading: "Bangun Project Nyata",
        paragraphs: [
          "Portfolio terbaik adalah project automation yang benar-benar bisa dijalankan.",
          "Sertakan dokumentasi, README, dan struktur project yang rapi.",
        ],
      },
      {
        heading: "Optimalkan GitHub",
        paragraphs: [
          "Gunakan commit yang jelas, branching yang rapi, dan dokumentasi yang mudah dipahami recruiter.",
        ],
      },
      {
        heading: "Kesimpulan",
        paragraphs: [
          "Portfolio yang baik menunjukkan kemampuan engineering, bukan hanya jumlah repository.",
        ],
      },
    ],
  },
];