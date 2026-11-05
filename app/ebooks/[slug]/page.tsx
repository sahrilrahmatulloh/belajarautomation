import DashboardLayout from "@/components/layout/DashboardLayout";
import BookDetailGate from "@/components/books/BookDetailGate";

interface BookPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BookPage({
  params,
}: BookPageProps) {
  const { slug } = await params;

  return (
    <DashboardLayout>
      <BookDetailGate slug={slug} />
    </DashboardLayout>
  );
}
