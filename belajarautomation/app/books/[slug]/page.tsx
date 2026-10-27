import { notFound } from "next/navigation";

import DashboardLayout from "@/components/layout/DashboardLayout";
import BookDetailPage from "@/components/books/BookDetailPage";

import { BOOKS } from "@/data/books";

interface BookPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BookPage({
  params,
}: BookPageProps) {
  const { slug } = await params;

  const book = BOOKS.find(
    (item) => item.slug === slug
  );

  if (!book) {
    notFound();
  }

  return (
    <DashboardLayout>
      <BookDetailPage book={book} />
    </DashboardLayout>
  );
}