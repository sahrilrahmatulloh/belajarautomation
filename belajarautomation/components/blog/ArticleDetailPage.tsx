import Image from "next/image";
import Link from "next/link";

import {
  ArrowLeft,
  Clock3,
  CalendarDays,
} from "lucide-react";

import { Article } from "@/types/Article";

interface ArticleDetailPageProps {
  article: Article;
}

export default function ArticleDetailPage({
  article,
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
        <span className="inline-flex rounded-full bg-muted px-3 py-1.5 text-sm font-medium">
          {article.category}
        </span>

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
            {article.publishedAt}
          </span>

          <span className="flex items-center gap-1.5">
            <Clock3 className="h-4 w-4" />
            {article.readTime}
          </span>
        </div>
      </header>

      {/* Cover */}
      <div className="relative mt-10 aspect-video overflow-hidden rounded-3xl border border-border bg-muted">
        <Image
          src={article.cover}
          alt={article.title}
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="mt-12 space-y-10">
        {article.content.map((section) => (
          <section key={section.heading}>
            <h2 className="text-2xl font-bold tracking-tight">
              {section.heading}
            </h2>

            <div className="mt-4 space-y-5">
              {section.paragraphs.map(
                (paragraph, index) => (
                  <p
                    key={index}
                    className="text-base leading-8 text-muted-foreground"
                  >
                    {paragraph}
                  </p>
                )
              )}
            </div>
          </section>
        ))}
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