import Link from "next/link";
import ContentCover from "@/components/common/ContentCover";

import {
  ArrowLeft,
  Clock3,
  CalendarDays,
} from "lucide-react";

import { formatArticleDate } from "@/lib/articleFormat";
import { Article } from "@/types/Article";

import ArticleDraftBadge from "./ArticleDraftBadge";
import ArticleContent from "./mdx/ArticleContent";

interface ArticleDetailPageProps {
  article: Article;
  content: string;
}

export default function ArticleDetailPage({
  article,
  content,
}: ArticleDetailPageProps) {
  return (
    <article className="mx-auto max-w-4xl">
      {/* Back */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Blog
      </Link>

      {/* Header */}
      <header className="mt-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex rounded-full bg-muted px-3 py-1.5 text-sm font-medium">
            {article.category}
          </span>
          {article.status === "draft" && <ArticleDraftBadge />}
        </div>

        <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          {article.title}
        </h1>

        <p className="mt-5 text-lg leading-8 text-muted-foreground">
          {article.excerpt}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span>
            Oleh {article.author}
          </span>

          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" />
            {formatArticleDate(article.publishedAt)}
          </span>

          <span className="flex items-center gap-1.5">
            <Clock3 className="h-4 w-4" />
            {article.readingMinutes} menit baca
          </span>
        </div>
      </header>

      {/* Cover */}
      <div className="relative mt-10 aspect-video overflow-hidden rounded-3xl border border-border bg-muted">
        <ContentCover
          src={article.cover}
          title={article.title}
          category={article.category}
          kind="article"
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="mt-12 min-w-0">
        <ArticleContent content={content} />
      </div>

      {/* Footer */}
      <div className="mt-14 border-t border-border pt-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Lihat artikel lainnya
        </Link>
      </div>
    </article>
  );
}
