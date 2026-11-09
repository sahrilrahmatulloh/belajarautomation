import { Wrench } from "lucide-react";

import MaintenancePage from "@/components/admin/MaintenancePage";
import DashboardLayout from "@/components/layout/DashboardLayout";
import RoleGuidePage from "@/components/roles/RoleGuidePage";
import { isDev } from "@/lib/env";

// Antarmuka dengan data dummy hanya di DEV. Di luar DEV tetap halaman informasi (PRD FR-16).
// PENTING: route ini WAJIB dilindungi otorisasi role "admin" di backend sebelum rilis (PRD 8.3).
export default function Page() {
  return (
    <DashboardLayout>
      {isDev ? (
        <MaintenancePage />
      ) : (
        <RoleGuidePage
          role="admin"
          title="Mode Maintenance"
          description="Mode Maintenance tersedia setelah backend siap."
          icon={Wrench}
        />
      )}
    </DashboardLayout>
  );
}
