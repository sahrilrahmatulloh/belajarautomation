import { notFound } from "next/navigation";

import DashboardLayout from "@/components/layout/DashboardLayout";
import CourseComingSoonPage from "@/components/learn/CourseComingSoonPage";
import CourseDetailPage from "@/components/learn/CourseDetailPage";

import { COURSES } from "@/data/courses";
import { COURSE_DETAILS } from "@/data/courseDetails";
import { getRoadmapsForCourse } from "@/lib/courseRoadmaps";

interface CoursePageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Disiapkan saat build dan disajikan dari CDN, bukan dirender ulang di server setiap kali dibuka.
export function generateStaticParams() {
  return COURSES.map((course) => ({ slug: course.slug }));
}

export default async function CoursePage({
  params,
}: CoursePageProps) {
  const { slug } = await params;

  const course = COURSES.find(
    (item) => item.slug === slug
  );

  if (!course) {
    notFound();
  }

  // Course "coming-soon" tetap punya halaman, tanpa daftar modul.
  if (course.availability === "coming-soon") {
    return (
      <DashboardLayout>
        <CourseComingSoonPage
          course={course}
          roadmaps={getRoadmapsForCourse(course.slug)}
        />
      </DashboardLayout>
    );
  }

  const detail = COURSE_DETAILS.find(
    (item) => item.courseSlug === slug
  );

  if (!detail) {
    notFound();
  }

  return (
    <DashboardLayout>
      <CourseDetailPage
        courseSlug={course.slug}
        detail={detail}
      />
    </DashboardLayout>
  );
}
