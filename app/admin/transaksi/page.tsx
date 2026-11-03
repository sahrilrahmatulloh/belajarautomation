import { Receipt } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import RoleGuidePage from "@/components/roles/RoleGuidePage";

export default function Page() {
  return (
    <DashboardLayout>
      <RoleGuidePage
        role="admin"
        title="Transaksi"
        description="Pemeriksaan transaksi tersedia setelah backend siap."
        icon={Receipt}
      />
    </DashboardLayout>
  );
}
