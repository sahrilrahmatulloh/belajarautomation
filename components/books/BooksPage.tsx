"use client";

import { useState } from "react";

import { useProductCatalog } from "@/lib/content";
import { productToBook } from "@/lib/bookProducts";
import { useSession } from "@/lib/session";

import BooksHeader from "./BooksHeader";
import BooksGrid from "@/components/books/BookGrid";

type BooksTab = "all" | "owned";

export default function BooksPage() {
  const [activeTab, setActiveTab] =
    useState<BooksTab>("all");

  const session = useSession();
  const catalog = useProductCatalog("ebook", session?.userId);
  const books = (catalog?.products ?? []).map((product) => productToBook(product, catalog?.ownedIds.has(product.id) ?? false));

  const displayedBooks =
    activeTab === "all"
      ? books
      : books.filter((book) => book.owned);

  return (
    <div className="space-y-8">
      <BooksHeader />

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`border-b-2 px-5 py-3 text-sm font-medium transition-colors ${
            activeTab === "all"
              ? "border-foreground text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Semua eBook
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("owned")}
          className={`border-b-2 px-5 py-3 text-sm font-medium transition-colors ${
            activeTab === "owned"
              ? "border-foreground text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Koleksi Saya
        </button>
      </div>

      <BooksGrid books={displayedBooks} />
    </div>
  );
}