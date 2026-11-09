import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ArticleDetailPage from "@/components/blog/ArticleDetailPage";
import { getArticleBySlug, getArticleHeadings, getArticles, getRelatedArticles } from "@/lib/blog";

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return getArticles().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getArticleBySlug(slug);
  if (!entry) return {};

  const { article } = entry;
  const title = `${article.title} | belajarautomation.com`;
  const url = `/blog/${article.slug}`;

  return {
    title,
    description: article.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: article.excerpt,
      url,
      type: "article",
      publishedTime: article.publishedAt,
      ...(article.updatedAt && { modifiedTime: article.updatedAt }),
      authors: [article.author],
      images: [article.cover],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const entry = getArticleBySlug(slug);

  if (!entry) {
    notFound();
  }

  return (
    <ArticleDetailPage
      article={entry.article}
      content={entry.content}
      headings={getArticleHeadings(entry.content)}
      related={getRelatedArticles(entry.article)}
    />
  );
}
