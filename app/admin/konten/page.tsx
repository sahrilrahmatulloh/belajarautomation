import { Suspense } from "react";
import { Files } from "lucide-react";

import AllContentsPage from "@/components/admin/AllContentsPage";
import DashboardLayout from "@/components/layout/DashboardLayout";
import RoleGuidePage from "@/components/roles/RoleGuidePage";
import { isDev } from "@/lib/env";

// Antarmuka dengan data dummy hanya di DEV. Di luar DEV tetap halaman informasi (PRD FR-15).
export default function Page() {
  return (
    <DashboardLayout>
      {isDev ? (
        <Suspense fallback={<p className="text-sm text-muted-foreground">Memuat konten...</p>}>
          <AllContentsPage />
        </Suspense>
      ) : (
        <RoleGuidePage
          role="admin"
          title="Semua Konten"
          description="Terbitkan konten yang sudah disetujui Reviewer."
          icon={Files}
        />
      )}
    </DashboardLayout>
  );
}
