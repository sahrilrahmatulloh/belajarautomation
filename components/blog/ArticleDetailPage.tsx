import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ChevronRight, Clock3, ExternalLink, RefreshCw } from "lucide-react";

import ContentCover from "@/components/common/ContentCover";
import { formatArticleDate } from "@/lib/articleFormat";
import { toFilterSlug } from "@/lib/filters";
import { Article, ArticleHeading } from "@/types/Article";

import ArticleCard from "./ArticleCard";
import ArticleCategoryBadge from "./ArticleCategoryBadge";
import ArticleDraftBadge from "./ArticleDraftBadge";
import { ArticleShareButton, ArticleShareSection } from "./ArticleShare";
import { ArticleTocPanel, ArticleTocSidebar } from "./ArticleToc";
import Ajakan from "./mdx/Ajakan";
import ArticleContent from "./mdx/ArticleContent";

interface ArticleDetailPageProps {
  article: Article;
  content: string;
  headings: ArticleHeading[];
  related: Article[];
}

export default function ArticleDetailPage({ article, content, headings, related }: ArticleDetailPageProps) {
  return (
    <div className="mx-auto max-w-6xl">
      <article>
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
            <li>
              <Link href="/blog" className="hover:text-foreground hover:underline">
                Blog
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li>
              <Link
                href={`/blog?kategori=${toFilterSlug(article.category)}`}
                className="hover:text-foreground hover:underline"
              >
                {article.category}
              </Link>
            </li>
          </ol>
        </nav>

        <header className="mt-4">
          <div className="flex flex-wrap items-center gap-2">
            <ArticleCategoryBadge category={article.category} />
            {article.status === "draft" && <ArticleDraftBadge />}
          </div>

          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{article.title}</h1>

          <p className="mt-3 max-w-3xl text-lg leading-8 text-muted-foreground">{article.excerpt}</p>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5 font-medium text-foreground">
              <Image src="/logo.webp" alt="" width={24} height={24} className="h-6 w-6 object-contain" />
              {article.author}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              {formatArticleDate(article.publishedAt)}
            </span>
            {article.updatedAt && (
              <span className="flex items-center gap-1.5">
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                Diperbarui: {formatArticleDate(article.updatedAt)}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock3 className="h-4 w-4" aria-hidden="true" />
              {article.readingMinutes} menit baca
            </span>
            <div className="w-full sm:ml-auto sm:w-auto">
              <ArticleShareButton title={article.title} slug={article.slug} />
            </div>
          </div>
        </header>

        <div className="mt-6 grid gap-8 xl:grid-cols-[minmax(0,1fr)_15rem]">
          <div className="min-w-0">
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-muted">
              <ContentCover
                src={article.cover}
                title={article.title}
                category={article.category}
                kind="article"
                priority
                sizes="(max-width: 1280px) 100vw, 760px"
                className="object-cover"
              />
            </div>

            <ArticleTocPanel headings={headings} />

            <div className="mt-8 min-w-0">
              <ArticleContent content={content} />
            </div>

            {article.cta.length > 0 && (
              <section aria-label="Ajakan" className="mt-10">
                {article.cta.map((cta) => (
                  <Ajakan key={`${cta.type}-${cta.slug ?? ""}`} {...cta} />
                ))}
              </section>
            )}

            {article.sources.length > 0 && (
              <section aria-labelledby="sumber-artikel" className="mt-10">
                <h2 id="sumber-artikel" className="text-lg font-bold">
                  Sumber
                </h2>
                <ul className="mt-3 space-y-2">
                  {article.sources.map((source) => (
                    <li key={source.url}>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary underline underline-offset-2"
                      >
                        <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
                        {source.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <ArticleShareSection title={article.title} slug={article.slug} />
          </div>

          <ArticleTocSidebar headings={headings} />
        </div>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="artikel-terkait" className="mt-12 border-t border-border pt-8">
          <h2 id="artikel-terkait" className="text-2xl font-bold tracking-tight">
            Artikel Terkait
          </h2>
          <ul className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <li key={item.slug} className="min-w-0">
                <ArticleCard article={item} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
