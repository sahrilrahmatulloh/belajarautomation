import { COURSES } from "@/data/courses";
import { Course } from "@/types/Course";

// Course "available" yang isinya masih placeholder. Sebelum rilis daftar ini
// wajib kosong: lengkapi materinya atau ubah course ke "coming-soon"
// (CURRICULUM bagian 1). Diperiksa juga oleh `npm run check:content`.
export function getDraftAvailableCourses(courses: Course[] = COURSES) {
  return courses.filter(
    (course) => course.availability === "available" && course.contentStatus === "draft"
  );
}

// Penanda "Draf" hanya tampil saat pengembangan, tidak di build produksi.
export function shouldShowDraftBadge(course: Course) {
  return (
    process.env.NODE_ENV === "development" &&
    course.availability === "available" &&
    course.contentStatus === "draft"
  );
}
