import { Files } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import RoleGuidePage from "@/components/roles/RoleGuidePage";

export default function Page() {
  return (
    <DashboardLayout>
      <RoleGuidePage
        role="admin"
        title="Konten"
        description="Terbitkan konten yang sudah disetujui Reviewer."
        icon={Files}
      />
    </DashboardLayout>
  );
}
