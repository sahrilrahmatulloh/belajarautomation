import { Article } from "@/types/Article";
import ArticleCard from "./ArticleCard";

interface ArticleGridProps {
  articles: Article[];
}

export default function ArticleGrid({
  articles,
}: ArticleGridProps) {
  if (articles.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border py-16 text-center">
        <h3 className="font-semibold">
          Artikel tidak ditemukan
        </h3>

        <p className="mt-2 text-sm text-muted-foreground">
          Coba gunakan kata kunci atau kategori lain.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
        />
      ))}
    </div>
  );
}