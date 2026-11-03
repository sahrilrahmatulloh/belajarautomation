import { Receipt } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import RoleGuidePage from "@/components/roles/RoleGuidePage";

export default function Page() {
  return (
    <DashboardLayout>
      <RoleGuidePage
        title="Transaksi"
        description="Pemeriksaan transaksi tersedia setelah backend siap."
        icon={Receipt}
        flowTitle="Sementara penerbitan dilakukan lewat pull request di GitHub"
      />
    </DashboardLayout>
  );
}
