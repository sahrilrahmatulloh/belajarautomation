"use client";

import { ChevronDown, Newspaper } from "lucide-react";

import FilterChips from "@/components/filters/FilterChips";
import FilterEmptyState from "@/components/filters/FilterEmptyState";
import SearchField from "@/components/filters/SearchField";
import { getCategoryOptions, matchesKeyword, toFilterSlug, validFilterValue } from "@/lib/filters";
import { useCatalogFilters } from "@/lib/useUrlFilters";
import { ARTICLE_CATEGORIES, Article } from "@/types/Article";

import ArticleCard from "./ArticleCard";
import FeaturedArticle from "./FeaturedArticle";

const FILTER_KEYS = ["q", "kategori", "urut"] as const;
const OLDEST_SORT = "terlama";
const SORT_OPTIONS = [
  { value: "", label: "Terbaru" },
  { value: OLDEST_SORT, label: "Terlama" },
];

interface BlogViewProps {
  articles: Article[];
  search?: string;
  category?: string;
  sort?: string;
  onSearchChange?: (value: string) => void;
  onCategoryChange?: (value: string) => void;
  onSortChange?: (value: string) => void;
  onReset?: () => void;
}

function BlogView({
  articles,
  search = "",
  category = "",
  sort = "",
  onSearchChange = () => {},
  onCategoryChange = () => {},
  onSortChange = () => {},
  onReset = () => {},
}: BlogViewProps) {
  const categoryOptions = getCategoryOptions(ARTICLE_CATEGORIES, articles.map((article) => article.category));
  const activeCategory = validFilterValue(category, categoryOptions);
  const isFiltering = Boolean(search.trim() || activeCategory);

  // Saat mencari atau memfilter, artikel unggulan ikut sebagai hasil biasa.
  const featured = isFiltering ? undefined : articles.find((article) => article.featured);
  const latest = articles
    .filter(
      (article) =>
        article !== featured &&
        matchesKeyword(search, article.title, article.excerpt) &&
        (!activeCategory || toFilterSlug(article.category) === activeCategory)
    )
    .sort((a, b) =>
      sort === OLDEST_SORT
        ? a.publishedAt.localeCompare(b.publishedAt)
        : b.publishedAt.localeCompare(a.publishedAt)
    );

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
        <p className="mt-1 text-muted-foreground">
          Artikel, tutorial, dan insight seputar Quality Assurance dan Automation Testing.
        </p>
      </header>

      {articles.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted">
            <Newspaper className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          </span>
          <h2 className="mt-3 font-semibold">Belum ada artikel</h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">Artikel yang sudah terbit akan tampil di sini.</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            <SearchField
              label="Cari artikel"
              value={search}
              placeholder='Cari artikel, contoh: "playwright", "test case", "bug report"'
              onChange={onSearchChange}
            />
            <FilterChips
              label="Kategori"
              layout="scroll"
              options={categoryOptions}
              active={activeCategory}
              onChange={onCategoryChange}
            />
          </div>

          {featured && <FeaturedArticle article={featured} />}

          <section aria-labelledby="artikel-terbaru" className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id="artikel-terbaru" className="text-2xl font-bold tracking-tight">
                Artikel Terbaru
              </h2>

              <div className="relative w-36">
                <select
                  aria-label="Urutkan artikel"
                  value={sort === OLDEST_SORT ? OLDEST_SORT : ""}
                  onChange={(event) => onSortChange(event.target.value)}
                  className="h-10 w-full appearance-none rounded-xl border border-input bg-background pl-3 pr-9 text-sm font-medium dark:bg-card"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
            </div>

            {latest.length > 0 ? (
              <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {latest.map((article) => (
                  <li key={article.slug} className="min-w-0">
                    <ArticleCard article={article} />
                  </li>
                ))}
              </ul>
            ) : (
              <FilterEmptyState
                title="Artikel tidak ditemukan"
                description="Coba kata kunci atau kategori lain."
                onReset={onReset}
              />
            )}
          </section>
        </>
      )}
    </div>
  );
}

// Isi HTML dari server sebelum filter di URL terbaca, agar daftar artikel tetap bisa
// dibaca mesin pencari walaupun filternya baru berjalan di browser.
export function BlogPageFallback({ articles }: { articles: Article[] }) {
  return <BlogView articles={articles} />;
}

export default function BlogPage({ articles }: { articles: Article[] }) {
  const { values, search, setSearch, setFilters, reset } = useCatalogFilters(FILTER_KEYS);

  return (
    <BlogView
      articles={articles}
      search={search}
      category={values.kategori}
      sort={values.urut}
      onSearchChange={setSearch}
      onCategoryChange={(value) => setFilters({ kategori: value })}
      onSortChange={(value) => setFilters({ urut: value })}
      onReset={reset}
    />
  );
}
