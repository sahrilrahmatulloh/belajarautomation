import DashboardLayout from "@/components/layout/DashboardLayout";
import BlogPage from "@/components/blog/BlogPage";
import { getArticles } from "@/lib/blog";

export default function Page() {
  return (
    <DashboardLayout>
      <BlogPage articles={getArticles()} />
    </DashboardLayout>
  );
}
