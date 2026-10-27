import { notFound } from "next/navigation";

import DashboardLayout from "@/components/layout/DashboardLayout";
import CourseDetailPage from "@/components/learn/CourseDetailPage";

import { COURSES } from "@/data/courses";
import { COURSE_DETAILS } from "@/data/courseDetails";

interface CoursePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CoursePage({
  params,
}: CoursePageProps) {
  const { slug } = await params;

  const course = COURSES.find(
    (item) => item.slug === slug
  );

  const detail = COURSE_DETAILS.find(
    (item) => item.courseSlug === slug
  );

  if (!course || !detail) {
    notFound();
  }

  return (
    <DashboardLayout>
      <CourseDetailPage
        course={course}
        detail={detail}
      />
    </DashboardLayout>
  );
}