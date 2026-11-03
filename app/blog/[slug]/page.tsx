import { notFound } from "next/navigation";

import ArticleDetailPage from "@/components/blog/ArticleDetailPage";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getArticleBySlug, getArticles } from "@/lib/blog";

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Isi artikel dibaca dari file saat build; slug lain langsung 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getArticles().map(({ slug }) => ({ slug }));
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const entry = getArticleBySlug(slug);

  if (!entry) {
    notFound();
  }

  return (
    <DashboardLayout>
      <ArticleDetailPage article={entry.article} content={entry.content} />
    </DashboardLayout>
  );
}
