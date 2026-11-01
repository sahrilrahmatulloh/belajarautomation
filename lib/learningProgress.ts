import { COURSES } from "@/data/courses";
import { DUMMY_LEARNING_PROGRESS } from "@/data/dummy/learningProgress";
import { AvailableCourse } from "@/types/Course";

export interface CourseInProgress {
  course: AvailableCourse;
  lastLesson: { slug: string; title: string };
  completedLessons: number;
  totalLessons: number;
  percent: number;
  lastOpenedAt: string;
}

// Course yang sedang dipelajari, yang terakhir dibuka lebih dulu.
// Entri untuk course yang tidak ada atau belum tersedia diabaikan.
export function getCoursesInProgress(): CourseInProgress[] {
  return DUMMY_LEARNING_PROGRESS.flatMap((entry) => {
    const course = COURSES.find((item) => item.slug === entry.courseSlug);
    if (!course || course.availability !== "available") return [];

    const totalLessons = course.lessons;
    const completedLessons = Math.min(entry.completedLessons, totalLessons);

    return [
      {
        course,
        lastLesson: entry.lastLesson,
        completedLessons,
        totalLessons,
        percent: Math.round((completedLessons / totalLessons) * 100),
        lastOpenedAt: entry.lastOpenedAt,
      },
    ];
  }).sort((a, b) => Date.parse(b.lastOpenedAt) - Date.parse(a.lastOpenedAt));
}

// Total lesson selesai; sumber yang sama dengan kartu Lanjutkan Belajar.
export function getCompletedLessonCount() {
  return getCoursesInProgress().reduce(
    (total, item) => total + item.completedLessons,
    0
  );
}
