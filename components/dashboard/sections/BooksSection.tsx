import BookCard from "@/components/books/BookCard";
import { BOOKS } from "@/data/books";

export default function BooksSection() {
  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Books & E-Books
          </h2>

          <p className="text-muted-foreground">
            Pelajari QA Automation lebih dalam melalui buku dan panduan praktis.
          </p>
        </div>

        <button className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
          View All
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {BOOKS.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
}