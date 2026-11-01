import { COURSES } from "@/data/courses";
import { isDev } from "@/lib/env";
import { Course } from "@/types/Course";

// Course "available" yang isinya masih placeholder. Sebelum rilis daftar ini
// wajib kosong: lengkapi materinya atau ubah course ke "coming-soon"
// (CURRICULUM bagian 1). Diperiksa juga oleh `npm run check:content`.
export function getDraftAvailableCourses(courses: Course[] = COURSES) {
  return courses.filter(
    (course) => course.availability === "available" && course.contentStatus === "draft"
  );
}

// Penanda "Draf" hanya tampil di lingkungan DEV (PRD Bagian 13.3).
export function shouldShowDraftBadge(course: Course) {
  return (
    isDev &&
    course.availability === "available" &&
    course.contentStatus === "draft"
  );
}
