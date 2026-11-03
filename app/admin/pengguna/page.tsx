import { Users } from "lucide-react";

import ManageRolesPage from "@/components/admin/ManageRolesPage";
import DashboardLayout from "@/components/layout/DashboardLayout";
import RoleGuidePage from "@/components/roles/RoleGuidePage";
import { isDev } from "@/lib/env";

// Antarmuka dengan data dummy hanya di DEV. Di luar DEV tetap halaman informasi (PRD FR-15).
export default function Page() {
  return (
    <DashboardLayout>
      {isDev ? (
        <ManageRolesPage />
      ) : (
        <RoleGuidePage
          role="admin"
          title="Kelola Peran"
          description="Pengelolaan pengguna dan peran tersedia setelah backend siap."
          icon={Users}
        />
      )}
    </DashboardLayout>
  );
}
