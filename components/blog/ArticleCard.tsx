import Link from "next/link";
import { CalendarDays, Clock3 } from "lucide-react";

import ContentCover from "@/components/common/ContentCover";
import { formatArticleDate } from "@/lib/articleFormat";
import { Article } from "@/types/Article";

import ArticleCategoryBadge from "./ArticleCategoryBadge";
import ArticleDraftBadge from "./ArticleDraftBadge";

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-150 hover:border-primary/30 hover:shadow-md">
      <div className="relative aspect-video overflow-hidden bg-muted">
        <ContentCover
          src={article.cover}
          title={article.title}
          category={article.category}
          kind="article"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <ArticleCategoryBadge category={article.category} />
          {article.status === "draft" && <ArticleDraftBadge />}
        </div>

        <h3 className="mt-3 text-lg font-semibold leading-snug">
          {/* Seluruh kartu dapat diklik lewat area tautan yang membentang. */}
          <Link href={`/blog/${article.slug}`} className="after:absolute after:inset-0">
            {article.title}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{article.excerpt}</p>

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            {formatArticleDate(article.publishedAt)}
          </span>
          <span className="flex items-center gap-1">
            <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
            {article.readingMinutes} menit baca
          </span>
        </div>
      </div>
    </article>
  );
}
