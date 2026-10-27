import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  Clock3,
} from "lucide-react";

import { Article } from "@/types/Article";

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({
  article,
}: ArticleCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="relative aspect-video overflow-hidden bg-muted">
        <Image
          src={article.cover}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <span className="text-xs font-medium text-muted-foreground">
          {article.category}
        </span>

        <h2 className="mt-2 text-lg font-semibold">
          {article.title}
        </h2>

        <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
          {article.excerpt}
        </p>

        <div className="mt-auto pt-6">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>{article.publishedAt}</span>

            <span className="flex items-center gap-1">
              <Clock3 className="h-3.5 w-3.5" />
              {article.readTime}
            </span>
          </div>

          <Link
            href={`/blog/${article.slug}`}
            className="mt-4 flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm font-medium transition-colors hover:bg-accent"
          >
            Baca Artikel

            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}