import { COURSE_DETAILS } from "@/data/courseDetails";
import { COURSES } from "@/data/courses";

// Lesson beserta posisinya di course. Hanya course "available" yang punya halaman
// lesson; course "coming-soon" belum menampilkan daftar modul (CURRICULUM bagian 1).
export function getLessonPageData(courseSlug: string, lessonSlug: string) {
  const course = COURSES.find((item) => item.slug === courseSlug);
  const detail = COURSE_DETAILS.find((item) => item.courseSlug === courseSlug);

  if (course?.availability !== "available" || !detail) {
    return null;
  }

  const lessons = detail.modules.flatMap((module) =>
    module.lessons.map((lesson) => ({ ...lesson, moduleTitle: module.title }))
  );
  const index = lessons.findIndex((lesson) => lesson.slug === lessonSlug);

  if (index === -1) {
    return null;
  }

  return {
    course,
    lesson: lessons[index],
    position: index + 1,
    total: lessons.length,
    previous: lessons[index - 1],
    next: lessons[index + 1],
  };
}
