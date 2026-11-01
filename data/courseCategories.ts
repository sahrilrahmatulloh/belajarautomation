import { CourseCategory, CourseLanguage } from "@/types/Course";

// Kategori Learning Center sesuai PRD (FR-02), dipakai sebagai filter.
export const COURSE_CATEGORIES: CourseCategory[] = [
  "Fundamental",
  "Manual Testing",
  "Web Automation",
  "Mobile Testing",
  "API Testing",
  "Performance Testing",
  "Security Testing",
  "Programming",
  "AI",
  "Low-Code",
];

// Bahasa yang ditampilkan sebagai filter (Groovy tidak ditampilkan).
export const COURSE_LANGUAGE_FILTERS: CourseLanguage[] = [
  "JavaScript",
  "TypeScript",
  "Java",
  "Python",
  "SQL",
];
