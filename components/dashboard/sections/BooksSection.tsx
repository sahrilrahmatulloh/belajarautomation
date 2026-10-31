import BookCard from "@/components/books/BookCard";
import { BOOKS } from "@/data/books";
import Link from "next/link";

export default function BooksSection() {
  return (
    <section>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            eBook
          </h2>

          <p className="text-muted-foreground">
            Pelajari QA Automation lebih dalam melalui eBook dan panduan praktis.
          </p>
        </div>

        <Link href="/ebooks" className="text-sm font-medium text-primary hover:underline">
          Lihat semua eBook
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {BOOKS.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
}
