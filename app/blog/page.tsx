import type { Metadata } from "next";
import { Suspense } from "react";

import BlogPage, { BlogPageFallback } from "@/components/blog/BlogPage";
import { getArticles } from "@/lib/blog";

const DESCRIPTION = "Artikel, tutorial, dan insight seputar Quality Assurance dan Automation Testing.";

export const metadata: Metadata = {
  title: "Blog | belajarautomation.com",
  description: DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: { title: "Blog | belajarautomation.com", description: DESCRIPTION, url: "/blog", type: "website" },
};

export default function Page() {
  const articles = getArticles();

  return (
    <Suspense fallback={<BlogPageFallback articles={articles} />}>
      <BlogPage articles={articles} />
    </Suspense>
  );
}
