import DashboardLayout from "@/components/layout/DashboardLayout";
import BooksPage from "@/components/books/BooksPage";

export default function Page() {
  return (
    <DashboardLayout>
      <BooksPage />
    </DashboardLayout>
  );
}