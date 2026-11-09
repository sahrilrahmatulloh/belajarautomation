import { Suspense } from "react";
import { BarChart3 } from "lucide-react";

import ReportsPage from "@/components/admin/ReportsPage";
import DashboardLayout from "@/components/layout/DashboardLayout";
import RoleGuidePage from "@/components/roles/RoleGuidePage";
import { isDev } from "@/lib/env";

// Antarmuka dengan data dummy hanya di DEV. Di luar DEV tetap halaman informasi (PRD FR-16).
// PENTING: route ini WAJIB dilindungi otorisasi role "admin" di backend sebelum rilis (PRD 8.3).
export default function Page() {
  return (
    <DashboardLayout>
      {isDev ? (
        <Suspense fallback={<p className="text-sm text-muted-foreground">Memuat laporan...</p>}>
          <ReportsPage />
        </Suspense>
      ) : (
        <RoleGuidePage
          role="admin"
          title="Laporan"
          description="Laporan tersedia setelah backend siap."
          icon={BarChart3}
        />
      )}
    </DashboardLayout>
  );
}
