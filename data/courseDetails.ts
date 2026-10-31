import { CourseDetail, CourseModule } from "@/types/CourseDetail";

export const COURSE_DETAILS: CourseDetail[] = [
  {
    courseSlug: "qa-fundamentals",
    overview:
      "Pelajari fundamental Quality Assurance sebagai fondasi sebelum masuk ke automation testing.",
    objectives: [
      "Memahami peran QA dalam proses pengembangan software",
      "Menulis test scenario dan test case yang jelas",
      "Membuat bug report dengan severity dan priority yang tepat",
      "Memahami alur testing di project nyata",
    ],
    prerequisites: [
      "Tidak ada prasyarat khusus, cocok untuk pemula",
    ],
    modules: [
      {
        id: 1,
        title: "Introduction to Quality Assurance",
        lessons: [
          {
            id: 1,
            slug: "apa-itu-quality-assurance",
            title: "Apa itu Quality Assurance?",
            duration: "5 menit",
            isCompleted: false,
          },
          {
            id: 2,
            slug: "qa-vs-qc",
            title: "QA vs QC",
            duration: "7 menit",
            isCompleted: false,
          },
          {
            id: 3,
            slug: "peran-qa-engineer",
            title: "Peran QA Engineer",
            duration: "8 menit",
            isCompleted: false,
          },
        ],
      },
      {
        id: 2,
        title: "Software Development Process",
        lessons: [
          {
            id: 4,
            slug: "sdlc",
            title: "Software Development Life Cycle",
            duration: "10 menit",
            isCompleted: false,
          },
          {
            id: 5,
            slug: "stlc",
            title: "Software Testing Life Cycle",
            duration: "10 menit",
            isCompleted: false,
          },
          {
            id: 6,
            slug: "agile-scrum",
            title: "Agile & Scrum untuk QA",
            duration: "12 menit",
            isCompleted: false,
          },
        ],
      },
      {
        id: 3,
        title: "Testing Fundamentals",
        lessons: [
          {
            id: 7,
            slug: "jenis-software-testing",
            title: "Jenis-Jenis Software Testing",
            duration: "12 menit",
            isCompleted: false,
          },
          {
            id: 8,
            slug: "test-scenario",
            title: "Membuat Test Scenario",
            duration: "10 menit",
            isCompleted: false,
          },
          {
            id: 9,
            slug: "test-case",
            title: "Membuat Test Case",
            duration: "15 menit",
            isCompleted: false,
          },
          {
            id: 10,
            slug: "positive-negative-testing",
            title: "Positive & Negative Testing",
            duration: "8 menit",
            isCompleted: false,
          },
        ],
      },
      {
        id: 4,
        title: "Bug Management",
        lessons: [
          {
            id: 11,
            slug: "apa-itu-bug",
            title: "Apa itu Bug?",
            duration: "6 menit",
            isCompleted: false,
          },
          {
            id: 12,
            slug: "bug-report",
            title: "Membuat Bug Report",
            duration: "15 menit",
            isCompleted: false,
          },
          {
            id: 13,
            slug: "severity-priority",
            title: "Severity vs Priority",
            duration: "10 menit",
            isCompleted: false,
          },
          {
            id: 14,
            slug: "bug-life-cycle",
            title: "Bug Life Cycle",
            duration: "10 menit",
            isCompleted: false,
          },
        ],
      },
      {
        id: 5,
        title: "QA in Real Projects",
        lessons: [
          {
            id: 15,
            slug: "testing-dalam-project",
            title: "Workflow Testing dalam Project",
            duration: "12 menit",
            isCompleted: false,
          },
          {
            id: 16,
            slug: "qa-career-next-step",
            title: "Next Step sebagai QA Engineer",
            duration: "8 menit",
            isCompleted: false,
          },
        ],
      },
    ],
  },

  {
    courseSlug: "playwright",
    overview:
      "Pelajari Playwright dari fundamental hingga mampu membangun automation testing untuk aplikasi web modern.",
    objectives: [
      "Menyiapkan project Playwright dari nol",
      "Menggunakan locator dan assertion yang stabil",
      "Menerapkan Page Object Model",
      "Menguji API langsung dari Playwright",
    ],
    prerequisites: [
      "Menyelesaikan QA Fundamentals",
      "Memahami dasar JavaScript atau TypeScript",
    ],
    modules: [
      {
        id: 1,
        title: "Introduction to Playwright",
        lessons: [
          {
            id: 1,
            slug: "apa-itu-playwright",
            title: "Apa itu Playwright?",
            duration: "5 menit",
            isCompleted: false,
          },
          {
            id: 2,
            slug: "installation-setup",
            title: "Installation & Setup",
            duration: "10 menit",
            isCompleted: false,
          },
          {
            id: 3,
            slug: "first-test",
            title: "Membuat Test Pertama",
            duration: "12 menit",
            isCompleted: false,
          },
        ],
      },
      {
        id: 2,
        title: "Working with Elements",
        lessons: [
          {
            id: 4,
            slug: "locator",
            title: "Memahami Locator",
            duration: "15 menit",
            isCompleted: false,
          },
          {
            id: 5,
            slug: "user-actions",
            title: "User Actions",
            duration: "12 menit",
            isCompleted: false,
          },
          {
            id: 6,
            slug: "assertions",
            title: "Assertions",
            duration: "15 menit",
            isCompleted: false,
          },
        ],
      },
      {
        id: 3,
        title: "Advanced Playwright",
        lessons: [
          {
            id: 7,
            slug: "page-object-model",
            title: "Page Object Model",
            duration: "20 menit",
            isCompleted: false,
          },
          {
            id: 8,
            slug: "api-testing",
            title: "API Testing dengan Playwright",
            duration: "20 menit",
            isCompleted: false,
          },
        ],
      },
    ],
  },

  {
    courseSlug: "java",
    overview:
      "Belajar Java dari dasar hingga OOP sebagai bekal menulis automation test dengan Selenium dan framework berbasis Java.",
    objectives: [
      "Memahami sintaks dasar dan tipe data Java",
      "Menerapkan OOP untuk menyusun kode test yang rapi",
      "Menggunakan collection dan exception handling",
      "Menyiapkan project Java dengan Maven dan JUnit",
    ],
    prerequisites: [
      "Tidak perlu pengalaman pemrograman sebelumnya",
    ],
    modules: createModules([
      {
        title: "Java Basics",
        lessons: [
          ["Pengenalan Java & JDK", 8],
          ["Variabel & Tipe Data", 10],
          ["Operator & Percabangan", 12],
          ["Perulangan", 12],
        ],
      },
      {
        title: "Object-Oriented Programming",
        lessons: [
          ["Class & Object", 15],
          ["Constructor & Method", 12],
          ["Inheritance & Polymorphism", 15],
          ["Interface & Abstract Class", 12],
        ],
      },
      {
        title: "Java untuk Automation",
        lessons: [
          ["Collection: List & Map", 15],
          ["Exception Handling", 10],
          ["Maven & Struktur Project", 12],
          ["Unit Test dengan JUnit", 15],
        ],
      },
    ]),
  },

  {
    courseSlug: "javascript",
    overview:
      "Kuasai JavaScript modern sebagai fondasi untuk Playwright, Cypress, dan tooling automation berbasis Node.js.",
    objectives: [
      "Memahami tipe data, function, array, dan object",
      "Menggunakan fitur ES6+ seperti destructuring dan module",
      "Menulis kode asynchronous dengan Promise dan async/await",
      "Mengelola project dengan npm",
    ],
    prerequisites: [
      "Tidak perlu pengalaman pemrograman sebelumnya",
    ],
    modules: createModules([
      {
        title: "JavaScript Dasar",
        lessons: [
          ["Pengenalan JavaScript & Node.js", 8],
          ["Variabel & Tipe Data", 10],
          ["Function", 12],
          ["Array & Object", 15],
        ],
      },
      {
        title: "ES6+",
        lessons: [
          ["Arrow Function & Destructuring", 12],
          ["Module: import & export", 10],
          ["Promise", 15],
          ["Async/Await", 15],
        ],
      },
      {
        title: "JavaScript untuk Automation",
        lessons: [
          ["npm & package.json", 10],
          ["Menulis Test Pertama dengan Node Test Runner", 15],
        ],
      },
    ]),
  },

  {
    courseSlug: "python",
    overview:
      "Belajar Python untuk scripting dan automation testing, dari sintaks dasar hingga menulis test dengan pytest.",
    objectives: [
      "Memahami sintaks dasar dan struktur data Python",
      "Membaca dan menulis file untuk kebutuhan test data",
      "Mengelola dependency dengan virtual environment",
      "Menulis test sederhana dengan pytest",
    ],
    prerequisites: [
      "Tidak perlu pengalaman pemrograman sebelumnya",
    ],
    modules: createModules([
      {
        title: "Python Dasar",
        lessons: [
          ["Pengenalan Python & Instalasi", 8],
          ["Variabel & Tipe Data", 10],
          ["Percabangan & Perulangan", 12],
          ["Function", 12],
        ],
      },
      {
        title: "Struktur Data",
        lessons: [
          ["List & Tuple", 12],
          ["Dictionary & Set", 12],
          ["File Handling", 10],
        ],
      },
      {
        title: "Python untuk Automation",
        lessons: [
          ["Virtual Environment & pip", 10],
          ["Class & Object", 15],
          ["Testing dengan pytest", 15],
        ],
      },
    ]),
  },

  {
    courseSlug: "git-github",
    overview:
      "Kelola kode test dengan Git dan berkolaborasi melalui GitHub, termasuk pull request dan CI sederhana.",
    objectives: [
      "Memahami konsep version control",
      "Menggunakan branch, merge, dan menyelesaikan conflict",
      "Berkolaborasi lewat pull request dan code review",
      "Menjalankan test otomatis dengan GitHub Actions",
    ],
    prerequisites: [
      "Terbiasa menggunakan terminal dasar",
    ],
    modules: createModules([
      {
        title: "Git Dasar",
        lessons: [
          ["Apa itu Version Control?", 6],
          ["Instalasi & Konfigurasi Git", 8],
          ["init, add, dan commit", 12],
          ["Melihat History", 8],
        ],
      },
      {
        title: "Branching",
        lessons: [
          ["Branch & Merge", 12],
          ["Menyelesaikan Conflict", 12],
        ],
      },
      {
        title: "GitHub",
        lessons: [
          ["Remote Repository & Push", 10],
          ["Pull Request & Code Review", 12],
          ["GitHub Actions untuk Test", 15],
        ],
      },
    ]),
  },

  {
    courseSlug: "selenium",
    overview:
      "Bangun web automation dengan Selenium WebDriver dan Java, dari locator dasar hingga Page Object Model dan eksekusi paralel.",
    objectives: [
      "Menyiapkan project Selenium dengan Java",
      "Memilih locator yang stabil dan menangani wait dengan benar",
      "Menerapkan Page Object Model dan TestNG",
      "Menjalankan test secara paralel dengan Selenium Grid",
    ],
    prerequisites: [
      "Menyelesaikan QA Fundamentals",
      "Memahami dasar Java",
    ],
    modules: createModules([
      {
        title: "Selenium Dasar",
        lessons: [
          ["Apa itu Selenium WebDriver?", 6],
          ["Setup Project Selenium dengan Java", 12],
          ["Membuka Browser & Navigasi", 10],
        ],
      },
      {
        title: "Locator & Interaksi",
        lessons: [
          ["Locator Strategy: id, CSS, XPath", 15],
          ["Interaksi dengan Elemen", 12],
          ["Dropdown, Alert, dan Frame", 15],
        ],
      },
      {
        title: "Wait & Struktur Test",
        lessons: [
          ["Implicit vs Explicit Wait", 12],
          ["Page Object Model", 15],
          ["TestNG & Assertion", 15],
        ],
      },
      {
        title: "Selenium Lanjutan",
        lessons: [
          ["Screenshot & Reporting", 12],
          ["Selenium Grid & Eksekusi Paralel", 15],
        ],
      },
    ]),
  },

  {
    courseSlug: "cypress",
    overview:
      "Tulis end-to-end test yang cepat dan mudah di-debug untuk aplikasi web menggunakan Cypress.",
    objectives: [
      "Menyiapkan Cypress dan memahami Test Runner",
      "Menggunakan selector dan assertion yang stabil",
      "Membuat custom command",
      "Melakukan mock API dengan intercept",
    ],
    prerequisites: [
      "Menyelesaikan QA Fundamentals",
      "Memahami dasar JavaScript",
    ],
    modules: createModules([
      {
        title: "Cypress Dasar",
        lessons: [
          ["Apa itu Cypress?", 6],
          ["Instalasi & Test Runner", 10],
          ["Membuat Test Pertama", 12],
        ],
      },
      {
        title: "Selector & Assertion",
        lessons: [
          ["Selector & Atribut data-cy", 10],
          ["Assertion", 12],
          ["Custom Command", 12],
        ],
      },
      {
        title: "Cypress Lanjutan",
        lessons: [
          ["Intercept & Mock API", 15],
          ["Fixtures", 10],
          ["Menjalankan Cypress di CI", 12],
        ],
      },
    ]),
  },

  {
    courseSlug: "cucumber",
    overview:
      "Terapkan Behavior-Driven Development dengan Cucumber dan Gherkin agar skenario test mudah dipahami seluruh tim.",
    objectives: [
      "Memahami konsep BDD dan sintaks Gherkin",
      "Menulis scenario yang jelas dan dapat dipakai ulang",
      "Membuat step definition dan scenario outline",
      "Mengintegrasikan Cucumber dengan Selenium",
    ],
    prerequisites: [
      "Memahami dasar Java atau JavaScript",
      "Pernah membuat web automation sederhana",
    ],
    modules: createModules([
      {
        title: "Behavior-Driven Development",
        lessons: [
          ["Apa itu BDD?", 8],
          ["Gherkin: Feature, Scenario, Steps", 12],
          ["Menulis Scenario yang Baik", 12],
        ],
      },
      {
        title: "Cucumber",
        lessons: [
          ["Setup Cucumber", 12],
          ["Step Definition", 15],
          ["Scenario Outline & Examples", 12],
        ],
      },
      {
        title: "Integrasi",
        lessons: [
          ["Hooks & Tags", 10],
          ["Integrasi dengan Selenium", 15],
          ["Reporting Cucumber", 10],
        ],
      },
    ]),
  },

  {
    courseSlug: "katalon",
    overview:
      "Mulai automation dengan pendekatan low-code menggunakan Katalon Studio untuk web, API, dan mobile.",
    objectives: [
      "Membuat test dengan record & playback",
      "Mengelola object repository",
      "Menerapkan data-driven testing",
      "Menjalankan test API dan mobile dari Katalon",
    ],
    prerequisites: [
      "Menyelesaikan QA Fundamentals",
    ],
    modules: createModules([
      {
        title: "Katalon Dasar",
        lessons: [
          ["Pengenalan Katalon Studio", 6],
          ["Instalasi & Project Pertama", 10],
          ["Record & Playback", 12],
        ],
      },
      {
        title: "Web Testing",
        lessons: [
          ["Object Repository", 12],
          ["Manual Mode & Script Mode", 15],
          ["Data-Driven Testing", 12],
        ],
      },
      {
        title: "API & Mobile",
        lessons: [
          ["API Testing di Katalon", 15],
          ["Mobile Testing di Katalon", 15],
          ["Test Suite & Report", 10],
        ],
      },
    ]),
  },

  {
    courseSlug: "robot-framework",
    overview:
      "Bangun test automation berbasis keyword dengan Robot Framework dan SeleniumLibrary.",
    objectives: [
      "Memahami struktur test dan keyword Robot Framework",
      "Mengotomasi web dengan SeleniumLibrary",
      "Membuat custom keyword dan resource file",
      "Menjalankan test data-driven dan membaca report",
    ],
    prerequisites: [
      "Menyelesaikan QA Fundamentals",
      "Memahami dasar Python",
    ],
    modules: createModules([
      {
        title: "Robot Framework Dasar",
        lessons: [
          ["Apa itu Robot Framework?", 6],
          ["Instalasi & Struktur Test", 10],
          ["Keyword & Variable", 12],
        ],
      },
      {
        title: "Web Testing",
        lessons: [
          ["SeleniumLibrary", 15],
          ["Custom Keyword", 12],
          ["Resource File", 10],
        ],
      },
      {
        title: "Robot Framework Lanjutan",
        lessons: [
          ["Data-Driven Test", 12],
          ["Tags & Eksekusi Selektif", 8],
          ["Report & Log", 10],
        ],
      },
    ]),
  },
];

interface ModuleInput {
  title: string;
  // [judul lesson, durasi dalam menit]
  lessons: [string, number][];
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Membentuk modul dengan id lesson berurutan per course.
function createModules(modules: ModuleInput[]): CourseModule[] {
  let lessonId = 0;

  return modules.map((module, index) => ({
    id: index + 1,
    title: module.title,
    lessons: module.lessons.map(([title, minutes]) => ({
      id: ++lessonId,
      slug: slugify(title),
      title,
      duration: `${minutes} menit`,
      isCompleted: false,
    })),
  }));
}
