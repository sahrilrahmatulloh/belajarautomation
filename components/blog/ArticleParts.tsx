import Image from "next/image";
import { CalendarDays, Clock3, ExternalLink, RefreshCw } from "lucide-react";

import ContentCover from "@/components/common/ContentCover";
import { formatArticleDate } from "@/lib/articleFormat";
import { ArticleCategory, ArticleCta, ArticleSource } from "@/types/Article";

import ArticleCategoryBadge from "./ArticleCategoryBadge";
import Ajakan from "./mdx/Ajakan";

// Bagian artikel yang sama untuk halaman publik dan pratinjau konten di editor (PRD FR-15).
export function ArticleHeader({
  category,
  title,
  excerpt,
  author,
  publishedAt,
  updatedAt,
  readingMinutes,
  badge,
  action,
}: {
  category: string;
  title: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  readingMinutes: number;
  badge?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <header className="mt-4">
      <div className="flex flex-wrap items-center gap-2">
        {category && <ArticleCategoryBadge category={category as ArticleCategory} />}
        {badge}
      </div>

      <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>

      <p className="mt-3 max-w-3xl text-lg leading-8 text-muted-foreground">{excerpt}</p>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5 font-medium text-foreground">
          <Image src="/logo.webp" alt="" width={24} height={24} className="h-6 w-6 object-contain" />
          {author}
        </span>
        <span className="flex items-center gap-1.5">
          <CalendarDays className="h-4 w-4" aria-hidden="true" />
          {formatArticleDate(publishedAt)}
        </span>
        {updatedAt && (
          <span className="flex items-center gap-1.5">
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Diperbarui: {formatArticleDate(updatedAt)}
          </span>
        )}
        <span className="flex items-center gap-1.5">
          <Clock3 className="h-4 w-4" aria-hidden="true" />
          {readingMinutes} menit baca
        </span>
        {action && <div className="w-full sm:ml-auto sm:w-auto">{action}</div>}
      </div>
    </header>
  );
}

export function ArticleCoverImage({ src, title, category }: { src: string; title: string; category: string }) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-muted">
      <ContentCover
        src={src}
        title={title}
        category={category as ArticleCategory}
        kind="article"
        priority
        sizes="(max-width: 1280px) 100vw, 760px"
        className="object-cover"
      />
    </div>
  );
}

export function ArticleCtaSection({ cta }: { cta: ArticleCta[] }) {
  if (cta.length === 0) return null;
  return (
    <section aria-label="Ajakan" className="mt-10">
      {cta.map((item) => (
        <Ajakan key={`${item.type}-${item.slug ?? ""}`} {...item} />
      ))}
    </section>
  );
}

export function ArticleSources({ sources }: { sources: ArticleSource[] }) {
  if (sources.length === 0) return null;
  return (
    <section aria-labelledby="sumber-artikel" className="mt-10">
      <h2 id="sumber-artikel" className="text-lg font-bold">
        Sumber
      </h2>
      <ul className="mt-3 space-y-2">
        {sources.map((source) => (
          <li key={source.url}>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary-accent underline underline-offset-2"
            >
              <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
              {source.title}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
