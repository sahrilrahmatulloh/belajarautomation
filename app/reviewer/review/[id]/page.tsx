import { notFound } from "next/navigation";

import DashboardLayout from "@/components/layout/DashboardLayout";
import ReviewPage from "@/components/reviewer/ReviewPage";
import { isDev } from "@/lib/env";

// Hanya di DEV (PRD FR-15).
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  if (!isDev) notFound();
  const { id } = await params;

  return (
    <DashboardLayout>
      <ReviewPage contentId={id} />
    </DashboardLayout>
  );
}
