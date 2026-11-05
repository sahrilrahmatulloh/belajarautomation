import { Suspense } from "react";
import { Receipt } from "lucide-react";

import TransactionsPage from "@/components/admin/TransactionsPage";
import DashboardLayout from "@/components/layout/DashboardLayout";
import RoleGuidePage from "@/components/roles/RoleGuidePage";
import { isDev } from "@/lib/env";

// Antarmuka dengan data dummy hanya di DEV. Di luar DEV tetap halaman informasi (PRD FR-16).
// PENTING: route ini WAJIB dilindungi otorisasi role "admin" di backend sebelum rilis (PRD 8.3).
export default function Page() {
  return (
    <DashboardLayout>
      {isDev ? (
        <Suspense fallback={<p className="text-sm text-muted-foreground">Memuat transaksi...</p>}>
          <TransactionsPage />
        </Suspense>
      ) : (
        <RoleGuidePage
          role="admin"
          title="Transaksi"
          description="Daftar transaksi tersedia setelah backend dan payment gateway siap."
          icon={Receipt}
        />
      )}
    </DashboardLayout>
  );
}
