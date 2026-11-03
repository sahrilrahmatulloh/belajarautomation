import { Crown } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import RoleGuidePage from "@/components/roles/RoleGuidePage";

export default function Page() {
  return (
    <DashboardLayout>
      <RoleGuidePage
        title="Paket Membership"
        description="Pengelolaan paket membership tersedia setelah backend siap."
        icon={Crown}
        flowTitle="Sementara penerbitan dilakukan lewat pull request di GitHub"
      />
    </DashboardLayout>
  );
}
