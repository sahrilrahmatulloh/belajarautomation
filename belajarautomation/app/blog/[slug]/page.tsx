import { notFound } from "next/navigation";

import DashboardLayout from "@/components/layout/DashboardLayout";
import ArticleDetailPage from "@/components/blog/ArticleDetailPage";

import { ARTICLES } from "@/data/articles";

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ArticlePage({
  params,
}: ArticlePageProps) {
  const { slug } = await params;

  const article = ARTICLES.find(
    (item) => item.slug === slug
  );

  if (!article) {
    notFound();
  }

  return (
    <DashboardLayout>
      <ArticleDetailPage article={article} />
    </DashboardLayout>
  );
}