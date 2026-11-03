import { Settings } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import RoleGuidePage from "@/components/roles/RoleGuidePage";

export default function Page() {
  return (
    <DashboardLayout>
      <RoleGuidePage
        title="Pengaturan"
        description="Pengaturan platform tersedia setelah backend siap."
        icon={Settings}
        flowTitle="Sementara penerbitan dilakukan lewat pull request di GitHub"
      />
    </DashboardLayout>
  );
}
