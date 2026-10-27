import Image from "next/image";
import Link from "next/link";

import {
  ArrowLeft,
  BookOpen,
  Check,
  CheckCircle2,
  Download,
  FileText,
  Layers3,
  ShoppingCart,
} from "lucide-react";

import type { Book } from "@/types/book";

interface BookDetailPageProps {
  book: Book;
}

export default function BookDetailPage({
  book,
}: BookDetailPageProps) {
  const formattedPrice = new Intl.NumberFormat(
    "id-ID",
    {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }
  ).format(book.price);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Back */}
      <Link
        href="/books"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Books
      </Link>

      {/* Book Hero */}
      <section className="grid gap-8 lg:grid-cols-[360px_1fr]">
        {/* Cover */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-border bg-muted shadow-sm">
          <Image
            src={book.cover}
            alt={book.title}
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Information */}
        <div className="flex flex-col justify-center">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium">
              {book.level}
            </span>

            <span className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-medium">
              <FileText className="h-3.5 w-3.5" />
              {book.format}
            </span>

            {book.owned && (
              <span className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-600 dark:text-green-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Dimiliki
              </span>
            )}
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
            {book.title}
          </h1>

          <p className="mt-3 text-sm text-muted-foreground">
            Oleh {book.author}
          </p>

          <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground">
            {book.description}
          </p>

          {/* Metadata */}
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-border px-4 py-3 text-sm">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              {book.pages} Halaman
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-border px-4 py-3 text-sm">
              <Layers3 className="h-4 w-4 text-muted-foreground" />
              {book.topics.length} Topik
            </div>

            <div className="rounded-xl border border-border px-4 py-3 text-sm">
              Update {book.updatedAt}
            </div>
          </div>

          {/* Purchase */}
          <div className="mt-8 max-w-md rounded-3xl border border-border bg-card p-5">
            {book.owned ? (
              <>
                <p className="font-semibold">
                  Buku ini sudah kamu miliki
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Download file PDF melalui tombol di bawah.
                </p>

                <button
                  type="button"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </button>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  Harga e-book
                </p>

                <p className="mt-1 text-3xl font-bold">
                  {formattedPrice}
                </p>

                <button
                  type="button"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Beli Sekarang
                </button>

                <p className="mt-3 text-center text-xs text-muted-foreground">
                  File PDF tersedia setelah pembayaran berhasil.
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Topics */}
      <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
        <div>
          <h2 className="text-2xl font-bold">
            Apa yang akan kamu pelajari?
          </h2>

          <p className="mt-2 text-muted-foreground">
            Topik utama yang dibahas di dalam e-book ini.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {book.topics.map((topic) => (
            <div
              key={topic}
              className="flex items-center gap-3 rounded-2xl bg-muted/50 p-4"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="h-4 w-4" />
              </div>

              <span className="text-sm font-medium">
                {topic}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}