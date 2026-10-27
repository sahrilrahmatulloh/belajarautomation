import { Category } from "@/types/Category";
import { ChevronRight } from "lucide-react";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({
  category,
}: CategoryCardProps) {
  const Icon = category.icon;

  return (
    <div
      className="
        group
        cursor-pointer
        rounded-3xl
        border
        border-border
        bg-card
        p-6
        text-card-foreground
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-lg
      "
    >
      <div className="flex items-center justify-between">
        <div className="rounded-2xl bg-blue-100 p-3 dark:bg-blue-950">
          <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>

        <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
      </div>

      <h3 className="mt-5 text-lg font-semibold">
        {category.title}
      </h3>

      <p className="mt-2 text-sm text-muted-foreground">
        {category.lessons} Lessons
      </p>

      <span className="mt-4 inline-block rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
        {category.level}
      </span>
    </div>
  );
}