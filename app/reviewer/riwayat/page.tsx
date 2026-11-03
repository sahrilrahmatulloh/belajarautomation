import { History } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import RoleGuidePage from "@/components/roles/RoleGuidePage";

export default function Page() {
  return (
    <DashboardLayout>
      <RoleGuidePage
        role="reviewer"
        title="Riwayat Review"
        description="Riwayat review tersimpan di komentar pada setiap dokumen."
        icon={History}
      />
    </DashboardLayout>
  );
}
