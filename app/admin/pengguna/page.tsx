import { Users } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import RoleGuidePage from "@/components/roles/RoleGuidePage";

export default function Page() {
  return (
    <DashboardLayout>
      <RoleGuidePage
        title="Pengguna & Role"
        description="Pengelolaan pengguna dan peran tersedia setelah backend siap."
        icon={Users}
        flowTitle="Sementara penerbitan dilakukan lewat pull request di GitHub"
      />
    </DashboardLayout>
  );
}
