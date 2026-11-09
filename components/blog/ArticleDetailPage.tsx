import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { toFilterSlug } from "@/lib/filters";
import { Article, ArticleHeading } from "@/types/Article";

import ArticleCard from "./ArticleCard";
import ArticleDraftBadge from "./ArticleDraftBadge";
import { ArticleCoverImage, ArticleCtaSection, ArticleHeader, ArticleSources } from "./ArticleParts";
import { ArticleShareButton, ArticleShareSection } from "./ArticleShare";
import { ArticleTocPanel, ArticleTocSidebar } from "./ArticleToc";
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

        <ArticleHeader
          category={article.category}
          title={article.title}
          excerpt={article.excerpt}
          author={article.author}
          publishedAt={article.publishedAt}
          updatedAt={article.updatedAt}
          readingMinutes={article.readingMinutes}
          badge={article.status === "draft" ? <ArticleDraftBadge /> : undefined}
          action={<ArticleShareButton title={article.title} slug={article.slug} />}
        />

        <div className="mt-6 grid gap-8 xl:grid-cols-[minmax(0,1fr)_15rem]">
          <div className="min-w-0">
            <ArticleCoverImage src={article.cover} title={article.title} category={article.category} />

            <ArticleTocPanel headings={headings} />

            <div className="mt-8 min-w-0">
              <ArticleContent content={content} />
            </div>

            <ArticleCtaSection cta={article.cta} />

            <ArticleSources sources={article.sources} />

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
