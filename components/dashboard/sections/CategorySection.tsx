import CategoryCard from "../cards/CategoryCard";
import Link from "next/link";
import { CATEGORIES } from "@/data/categories";

export default function CategorySection() {
  return (
    <section className="w-full min-w-0">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Explore Categories
          </h2>

          <p className="text-muted-foreground">
            Pilih jalur belajar yang ingin kamu kuasai.
          </p>
        </div>

        <Link href="/learn" className="self-start text-sm font-medium text-primary hover:underline">
          Lihat semua materi
        </Link>
      </div>

      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {CATEGORIES.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
          />
        ))}
      </div>
    </section>
  );
}
