import { notFound } from "next/navigation";

import TransactionDetailPage from "@/components/admin/TransactionDetailPage";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { isDev } from "@/lib/env";

// Hanya di DEV (PRD FR-16).
// PENTING: route ini WAJIB dilindungi otorisasi role "admin" di backend sebelum rilis (PRD 8.3).
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  if (!isDev) notFound();
  const { id } = await params;

  return (
    <DashboardLayout>
      <TransactionDetailPage transactionId={id} />
    </DashboardLayout>
  );
}
