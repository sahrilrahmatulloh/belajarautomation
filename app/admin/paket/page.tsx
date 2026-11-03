import { Crown } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import RoleGuidePage from "@/components/roles/RoleGuidePage";

export default function Page() {
  return (
    <DashboardLayout>
      <RoleGuidePage
        role="admin"
        title="Paket Membership"
        description="Pengelolaan paket membership tersedia setelah backend siap."
        icon={Crown}
      />
    </DashboardLayout>
  );
}
