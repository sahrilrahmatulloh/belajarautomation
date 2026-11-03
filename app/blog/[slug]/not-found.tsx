import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export default function ArticleNotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
        <SearchX className="h-7 w-7 text-muted-foreground" aria-hidden="true" />
      </span>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">Artikel tidak ditemukan</h1>
      <p className="mt-2 text-muted-foreground">
        Artikel ini mungkin sudah dipindahkan atau belum terbit. Coba lihat artikel lainnya di Blog.
      </p>
      <Link
        href="/blog"
        className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Kembali ke Blog
      </Link>
    </div>
  );
}
