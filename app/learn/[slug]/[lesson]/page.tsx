import { notFound } from "next/navigation";

import DashboardLayout from "@/components/layout/DashboardLayout";
import LessonPage from "@/components/learn/LessonPage";
import { getLessonPageData } from "@/lib/courseLessons";

interface LessonRouteProps {
  params: Promise<{
    slug: string;
    lesson: string;
  }>;
}

export default async function Page({ params }: LessonRouteProps) {
  const { slug, lesson } = await params;
  const data = getLessonPageData(slug, lesson);

  if (!data) {
    notFound();
  }

  return (
    <DashboardLayout>
      <LessonPage {...data} />
    </DashboardLayout>
  );
}
