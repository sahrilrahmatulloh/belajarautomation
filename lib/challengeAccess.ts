import { COURSES } from "@/data/courses";
import { DUMMY_ACCOUNT } from "@/data/dummy/account";

// Latihan mengikuti hak akses course terkait (PRD FR-04, FR-10). Saat ini memakai
// akun demo; nantinya wajib diverifikasi backend.
export function canAccessChallengeCourse(courseSlug: string) {
  const course = COURSES.find((item) => item.slug === courseSlug);
  return course?.access !== "premium" || DUMMY_ACCOUNT.membership !== "basic";
}
