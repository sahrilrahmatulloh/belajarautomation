import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  CheckCircle2,
  Download,
  FileText,
} from "lucide-react";

import type { Book } from "@/types/book";

interface BookCardProps {
  book: Book; 
}

export default function BookCard({
  book,
}: BookCardProps) {
  const formattedPrice = new Intl.NumberFormat(
    "id-ID",
    {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }
  ).format(book.price);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      {/* Cover */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={book.cover}
          alt={book.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {book.owned && (
          <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium backdrop-blur">
            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
            Dimiliki
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
            {book.level}
          </span>

          <span className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium">
            <FileText className="h-3.5 w-3.5" />
            {book.format}
          </span>
        </div>

        <h2 className="mt-4 text-lg font-semibold">
          {book.title}
        </h2>

        <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
          {book.description}
        </p>

        <div className="mt-auto pt-6">
          {!book.owned && (
            <p className="mb-4 text-xl font-bold">
              {formattedPrice}
            </p>
          )}

          {book.owned ? (
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </button>
          ) : (
            <Link
              href={`/books/${book.slug}`}
              className="flex w-full items-center justify-between rounded-xl border border-border px-4 py-3 text-sm font-medium transition-colors hover:bg-accent"
            >
              Lihat Detail
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}