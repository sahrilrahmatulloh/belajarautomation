import { COURSES } from "@/data/courses";
import { showsDraftLearning } from "@/lib/env";
import { Course } from "@/types/Course";

// Course "available" yang isinya masih placeholder. Sebelum rilis daftar ini
// wajib kosong: lengkapi materinya atau ubah course ke "coming-soon"
// (CURRICULUM bagian 1). Diperiksa juga oleh `npm run check:content`.
export function getDraftAvailableCourses(courses: Course[] = COURSES) {
  return courses.filter(
    (course) => course.availability === "available" && course.contentStatus === "draft"
  );
}

// Penanda "Draf" tampil di DEV dan UAT, sama dengan isi belajar draf (lib/env.ts).
export function shouldShowDraftBadge(course: Course) {
  return (
    showsDraftLearning &&
    course.availability === "available" &&
    course.contentStatus === "draft"
  );
}
