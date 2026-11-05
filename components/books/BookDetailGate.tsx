"use client";

import Link from "next/link";

import { useProductCatalog } from "@/lib/content";
import { productToBook } from "@/lib/bookProducts";
import { useSession } from "@/lib/session";

import BookDetailPage from "./BookDetailPage";

// Detail mengikuti data produk: produk Draf tidak bisa dibuka dari katalog publik (PRD FR-16 F).
export default function BookDetailGate({ slug }: { slug: string }) {
  const session = useSession();
  const catalog = useProductCatalog("ebook", session?.userId);

  if (!catalog) return <p className="py-10 text-center text-sm text-muted-foreground">Memuat eBook...</p>;

  const product = catalog.products.find((item) => item.slug === slug);
  if (!product) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h1 className="text-2xl font-bold tracking-tight">eBook tidak ditemukan</h1>
        <Link href="/ebooks" className="mt-4 inline-block font-semibold text-primary-accent hover:underline">Kembali ke eBook</Link>
      </div>
    );
  }

  return <BookDetailPage book={productToBook(product, catalog.ownedIds.has(product.id))} />;
}
