import { History } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import RoleGuidePage from "@/components/roles/RoleGuidePage";

export default function Page() {
  return (
    <DashboardLayout>
      <RoleGuidePage
        title="Riwayat Review"
        description="Riwayatnya tersedia di daftar pull request yang sudah kamu review."
        icon={History}
        flowTitle="Sementara review dilakukan lewat pull request di GitHub"
      />
    </DashboardLayout>
  );
}
