import { Users } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import RoleGuidePage from "@/components/roles/RoleGuidePage";

export default function Page() {
  return (
    <DashboardLayout>
      <RoleGuidePage
        role="admin"
        title="Pengguna & Role"
        description="Pengelolaan pengguna dan peran tersedia setelah backend siap."
        icon={Users}
      />
    </DashboardLayout>
  );
}
