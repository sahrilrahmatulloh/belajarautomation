import { BOOKS } from "@/data/books";
import { Product } from "@/types/Commerce";
import type { Book } from "@/types/book";

// Produk dari Panel Admin menjadi tampilan katalog. Detail isi (topik, halaman) masih dari data
// katalog; produk baru belum punya detail itu.
export function productToBook(product: Product, owned: boolean): Book {
  const base = BOOKS.find((book) => book.slug === product.slug);
  return {
    id: base?.id ?? product.slug.length + BOOKS.length * 1000,
    slug: product.slug,
    author: base?.author ?? "belajarautomation.com",
    level: base?.level ?? "Beginner",
    format: "PDF",
    pages: base?.pages ?? 0,
    updatedAt: base?.updatedAt ?? "",
    topics: base?.topics ?? [],
    title: product.title,
    description: product.description,
    cover: product.cover,
    price: product.price,
    owned,
  };
}
