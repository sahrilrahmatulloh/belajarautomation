import type { Book } from "@/types/book";
import BookCard from "./BookCard";

interface BooksGridProps {
  books: Book[];
}

export default function BooksGrid({
  books,
}: BooksGridProps) {
  if (books.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border py-16 text-center">
        <h3 className="font-semibold">
          Belum ada buku
        </h3>

        <p className="mt-2 text-sm text-muted-foreground">
          Buku yang kamu miliki akan muncul di sini.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
        />
      ))}
    </div>
  );
}