import { Suspense } from "react";
import { Users } from "lucide-react";

import UsersPage from "@/components/admin/UsersPage";
import AdminRealSwitch from "@/components/admin/real/AdminRealSwitch";
import RealUsersPage from "@/components/admin/real/RealUsersPage";
import DashboardLayout from "@/components/layout/DashboardLayout";
import RoleGuidePage from "@/components/roles/RoleGuidePage";
import { isDev } from "@/lib/env";

// Akun sungguhan: data dari database, dijaga peran Admin dan verifikasi dua langkah di database
// (PRD 8.3). Akun demo: data dummy hanya di DEV, di luar DEV halaman informasi (PRD FR-16).
export default function Page() {
  return (
    <DashboardLayout>
      <AdminRealSwitch real={<RealUsersPage />}>
        {isDev ? (
          <Suspense fallback={<p className="text-sm text-muted-foreground">Memuat pengguna...</p>}>
            <UsersPage />
          </Suspense>
        ) : (
          <RoleGuidePage
            role="admin"
            title="Pengguna dan Peran"
            description="Pengelolaan pengguna dan peran tersedia setelah backend siap."
            icon={Users}
          />
        )}
      </AdminRealSwitch>
    </DashboardLayout>
  );
}
