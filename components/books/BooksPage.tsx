"use client";

import { useState } from "react";

import { BOOKS } from "@/data/books";

import BooksHeader from "./BooksHeader";
import BooksGrid from "@/components/books/BookGrid";

type BooksTab = "all" | "owned";

export default function BooksPage() {
  const [activeTab, setActiveTab] =
    useState<BooksTab>("all");

  const displayedBooks =
    activeTab === "all"
      ? BOOKS
      : BOOKS.filter((book) => book.owned);

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
          Semua Buku
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