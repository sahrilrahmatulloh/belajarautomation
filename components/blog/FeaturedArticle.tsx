import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3 } from "lucide-react";

import ContentCover from "@/components/common/ContentCover";
import { formatArticleDate } from "@/lib/articleFormat";
import { Article } from "@/types/Article";

import ArticleCategoryBadge from "./ArticleCategoryBadge";
import ArticleDraftBadge from "./ArticleDraftBadge";

export default function FeaturedArticle({ article }: { article: Article }) {
  return (
    <article className="group relative grid overflow-hidden rounded-2xl border border-border bg-card transition-all duration-150 hover:border-primary/30 hover:shadow-md md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <div className="relative aspect-video overflow-hidden bg-muted md:aspect-auto md:min-h-72">
        <ContentCover
          src={article.cover}
          title={article.title}
          category={article.category}
          kind="article"
          priority
          sizes="(max-width: 768px) 100vw, 45vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex min-w-0 flex-col p-5 sm:p-7">
        <div className="flex flex-wrap items-center gap-2">
          <ArticleCategoryBadge category={article.category} />
          {article.status === "draft" && <ArticleDraftBadge />}
        </div>

        <h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight sm:text-3xl">{article.title}</h2>

        <p className="mt-3 leading-7 text-muted-foreground">{article.excerpt}</p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5 font-medium text-foreground">
            <Image src="/logo.webp" alt="" width={20} height={20} className="h-5 w-5 object-contain" />
            {article.author}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            {formatArticleDate(article.publishedAt)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock3 className="h-4 w-4" aria-hidden="true" />
            {article.readingMinutes} menit baca
          </span>
        </div>

        <div className="mt-auto flex justify-end pt-5">
          {/* Seluruh kartu dapat diklik lewat area tautan yang membentang. */}
          <Link
            href={`/blog/${article.slug}`}
            aria-label={`Baca Artikel: ${article.title}`}
            className="inline-flex min-h-10 w-full items-center justify-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors after:absolute after:inset-0 hover:bg-primary/90 sm:w-fit"
          >
            Baca Artikel
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
