"use client";

import { useMemo, useState } from "react";

import { ARTICLES } from "@/data/articles";

import BlogHeader from "./BlogHeader";
import FeaturedArticle from "./FeaturedArticle";
import BlogFilters, {
  BlogCategory,
} from "./BlogFilters";
import ArticleGrid from "./ArticleGrid";

export default function BlogPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] =
    useState<BlogCategory>("All");

  const featuredArticle = ARTICLES.find(
    (article) => article.featured
  );

  const filteredArticles = useMemo(() => {
    return ARTICLES.filter((article) => {
      if (article.featured) {
        return false;
      }

      const matchesSearch =
        article.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        article.excerpt
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        activeCategory === "All" ||
        article.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  return (
    <div className="space-y-10">
      <BlogHeader />

      {featuredArticle && (
        <FeaturedArticle
          article={featuredArticle}
        />
      )}

      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">
            Artikel Terbaru
          </h2>

          <p className="mt-1 text-muted-foreground">
            Temukan insight dan tutorial seputar QA Automation.
          </p>
        </div>

        <BlogFilters
          search={search}
          activeCategory={activeCategory}
          onSearchChange={setSearch}
          onCategoryChange={setActiveCategory}
        />

        <ArticleGrid
          articles={filteredArticles}
        />
      </section>
    </div>
  );
}