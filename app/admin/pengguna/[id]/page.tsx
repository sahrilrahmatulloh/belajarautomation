import { Users } from "lucide-react";

import UserDetailPage from "@/components/admin/UserDetailPage";
import AdminRealSwitch from "@/components/admin/real/AdminRealSwitch";
import RealUserDetailPage from "@/components/admin/real/RealUserDetailPage";
import DashboardLayout from "@/components/layout/DashboardLayout";
import RoleGuidePage from "@/components/roles/RoleGuidePage";
import { isDev } from "@/lib/env";

// Akun sungguhan: detail dari database dengan koreksi XP dan membership manual (PRD FR-16 D, E),
// dijaga peran Admin dan verifikasi dua langkah di database. Akun demo: data dummy hanya di DEV.
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <DashboardLayout>
      <AdminRealSwitch real={<RealUserDetailPage userId={id} />}>
        {isDev ? (
          <UserDetailPage userId={id} />
        ) : (
          <RoleGuidePage
            role="admin"
            title="Detail Pengguna"
            description="Pengelolaan pengguna tersedia untuk akun Admin dengan verifikasi dua langkah."
            icon={Users}
          />
        )}
      </AdminRealSwitch>
    </DashboardLayout>
  );
}
