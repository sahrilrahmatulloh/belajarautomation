import { notFound } from "next/navigation";

import ArticleContent from "@/components/blog/mdx/ArticleContent";
import DashboardLayout from "@/components/layout/DashboardLayout";
import LessonPage from "@/components/learn/LessonPage";
import { getLessonPageData } from "@/lib/courseLessons";
import { getLessonContent } from "@/lib/lessons";

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

  const lessonContent = getLessonContent(slug, lesson);

  return (
    <DashboardLayout>
      <LessonPage
        {...data}
        lessonContent={lessonContent}
        body={lessonContent && <ArticleContent content={lessonContent.content} />}
      />
    </DashboardLayout>
  );
}
