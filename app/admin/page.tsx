import { LayoutDashboard } from "lucide-react";

import AdminSummary from "@/components/admin/AdminSummary";
import AdminRealSwitch from "@/components/admin/real/AdminRealSwitch";
import RealAdminDashboard from "@/components/admin/real/RealAdminDashboard";
import DashboardLayout from "@/components/layout/DashboardLayout";
import RoleGuidePage from "@/components/roles/RoleGuidePage";
import { isDev } from "@/lib/env";

// Dashboard Admin (PRD FR-16 A).
// - Akun sungguhan: data asli dari database (dijaga peran Admin dan verifikasi dua langkah di
//   database), ditambah angka contoh berlabel untuk bagian yang belum punya backend.
// - Akun demo: data dummy hanya di DEV, di luar DEV halaman informasi.
export default function Page() {
  return (
    <DashboardLayout>
      <AdminRealSwitch real={<RealAdminDashboard />}>
        {isDev ? (
          <AdminSummary />
        ) : (
          <RoleGuidePage
            role="admin"
            title="Dashboard"
            description="Pantau pengguna, membership, dan alur konten."
            icon={LayoutDashboard}
          />
        )}
      </AdminRealSwitch>
    </DashboardLayout>
  );
}
