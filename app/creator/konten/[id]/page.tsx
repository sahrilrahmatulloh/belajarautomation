import { notFound } from "next/navigation";

import ContentDetailPage from "@/components/creator/studio/ContentDetailPage";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { isDev } from "@/lib/env";

// Hanya di DEV (PRD FR-15).
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  if (!isDev) notFound();
  const { id } = await params;

  return (
    <DashboardLayout>
      <ContentDetailPage contentId={id} />
    </DashboardLayout>
  );
}
