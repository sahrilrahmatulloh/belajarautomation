import { MessageSquareText } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import RoleGuidePage from "@/components/roles/RoleGuidePage";

export default function Page() {
  return (
    <DashboardLayout>
      <RoleGuidePage
        title="Catatan Revisi"
        description="Catatan dari Reviewer tersedia di halaman review pull request kontenmu."
        icon={MessageSquareText}
        flowTitle="Sementara penulisan dilakukan lewat GitHub"
      />
    </DashboardLayout>
  );
}
