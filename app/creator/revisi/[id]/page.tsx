import { notFound } from "next/navigation";

import RevisionDetailPage from "@/components/creator/studio/RevisionDetailPage";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { isDev } from "@/lib/env";

// Prototipe, hanya di DEV.
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  if (!isDev) notFound();
  const { id } = await params;

  return (
    <DashboardLayout>
      <RevisionDetailPage contentId={Number(id)} />
    </DashboardLayout>
  );
}
