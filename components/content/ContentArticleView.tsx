"use client";

import { ArticleCoverImage, ArticleCtaSection, ArticleHeader, ArticleSources } from "@/components/blog/ArticleParts";
import { countWords, readingMinutes } from "@/lib/content/document";
import { ContentItem } from "@/types/ContentWorkflow";

import ContentBody from "./ContentBody";

const HTTP_URL = /^https?:\/\//;

type ContentView = Pick<ContentItem, "judul" | "ringkasan" | "kategori" | "sampul" | "ajakan" | "sumber" | "body" | "updatedAt">;

// Tampilan konten seperti halaman publik, untuk pratinjau, tampilan baca, dan halaman review.
export default function ContentArticleView({ content, authorName }: { content: ContentView; authorName: string }) {
  return (
    <article className="min-w-0">
      <ArticleHeader
        category={content.kategori}
        title={content.judul || "Tanpa judul"}
        excerpt={content.ringkasan}
        author={authorName}
        publishedAt={content.updatedAt.slice(0, 10)}
        readingMinutes={readingMinutes(countWords(content.body))}
      />
      <div className="mt-6 min-w-0">
        {content.sampul && <ArticleCoverImage src={content.sampul} title={content.judul} category={content.kategori} />}
        <div className="mt-8 min-w-0">
          <ContentBody body={content.body} />
        </div>
        <ArticleCtaSection cta={content.ajakan ? [content.ajakan] : []} />
        <ArticleSources sources={content.sumber.filter((source) => HTTP_URL.test(source.url))} />
      </div>
    </article>
  );
}
