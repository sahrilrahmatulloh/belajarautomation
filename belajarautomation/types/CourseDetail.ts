export interface CourseLesson {
  id: number;
  slug: string;
  title: string;
  duration: string;
  isCompleted: boolean;
  isLocked: boolean;
}

export interface CourseModule {
  id: number;
  title: string;
  lessons: CourseLesson[];
}

export interface CourseDetail {
  courseSlug: string;
  overview: string;
  modules: CourseModule[];
}