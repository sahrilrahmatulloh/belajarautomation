import { Category } from "@/types/Category";
import { ChevronRight } from "lucide-react";

interface CategoryCardProps {
  category: Category;
}

const categoryAccents = [
  {
    surface: "bg-brand-blue/10",
    icon: "text-brand-blue",
    border: "border-t-brand-blue",
  },
  {
    surface: "bg-brand-sky/10",
    icon: "text-brand-sky",
    border: "border-t-brand-sky",
  },
  {
    surface: "bg-brand-cyan/10",
    icon: "text-brand-cyan",
    border: "border-t-brand-cyan",
  },
  {
    surface: "bg-brand-indigo/10",
    icon: "text-brand-indigo",
    border: "border-t-brand-indigo",
  },
];

const levelAccents: Record<string, string> = {
  Beginner: "bg-brand-sky/10 text-brand-sky",
  Intermediate: "bg-brand-blue/10 text-brand-blue",
  Advanced: "bg-brand-indigo/10 text-brand-indigo",
};

export default function CategoryCard({
  category,
}: CategoryCardProps) {
  const Icon = category.icon;
  const accent =
    categoryAccents[(category.id - 1) % categoryAccents.length];

  return (
    <article
      className={`
        group rounded-2xl border border-border border-t-2 ${accent.border} bg-card p-5 text-card-foreground
        transition-colors duration-150 hover:border-primary/30
      `}
    >
      <div className="flex items-center justify-between">
        <div className={`rounded-xl ${accent.surface} p-3`}>
          <Icon className={`h-6 w-6 ${accent.icon}`} />
        </div>

        <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
      </div>

      <h3 className="mt-5 text-lg font-semibold">
        {category.title}
      </h3>

      <p className="mt-2 text-sm text-muted-foreground">
        {category.lessons} Lessons
      </p>

      <span className={`mt-4 inline-block rounded-full px-3 py-1 text-xs font-medium ${levelAccents[category.level] ?? "bg-muted text-muted-foreground"}`}>
        {category.level}
      </span>
    </article>
  );
}
