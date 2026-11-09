import { ArticleCategory } from "@/types/Article";

export default function ArticleCategoryBadge({ category }: { category: ArticleCategory }) {
  return (
    <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-300">
      {category}
    </span>
  );
}
