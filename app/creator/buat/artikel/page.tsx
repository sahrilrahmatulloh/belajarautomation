import { Suspense } from "react";
import { notFound } from "next/navigation";

import ArticleEditor from "@/components/creator/studio/ArticleEditor";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { isDev } from "@/lib/env";

// Hanya di DEV (PRD FR-15).
export default function Page() {
  if (!isDev) notFound();

  return (
    <DashboardLayout>
      <Suspense fallback={<p className="text-sm text-muted-foreground">Memuat editor...</p>}>
        <ArticleEditor />
      </Suspense>
    </DashboardLayout>
  );
}
