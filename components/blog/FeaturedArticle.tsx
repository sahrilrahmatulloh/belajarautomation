import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  Clock3,
} from "lucide-react";

import { Article } from "@/types/Article";

interface FeaturedArticleProps {
  article: Article;
}

export default function FeaturedArticle({
  article,
}: FeaturedArticleProps) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group grid overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all hover:shadow-md lg:grid-cols-2"
    >
      <div className="relative min-h-[280px] bg-muted">
        <Image
          src={article.cover}
          alt={article.title}
          fill
          priority
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-col justify-center p-6 sm:p-8">
        <span className="w-fit rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
          Featured
        </span>

        <p className="mt-5 text-sm font-medium text-muted-foreground">
          {article.category}
        </p>

        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          {article.title}
        </h2>

        <p className="mt-4 leading-7 text-muted-foreground">
          {article.excerpt}
        </p>

        <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
          <span>{article.publishedAt}</span>

          <span className="flex items-center gap-1.5">
            <Clock3 className="h-4 w-4" />
            {article.readTime}
          </span>
        </div>

        <div className="mt-6 flex items-center gap-2 font-medium">
          Baca Artikel
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}