import { FileText } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import RoleGuidePage from "@/components/roles/RoleGuidePage";

export default function Page() {
  return (
    <DashboardLayout>
      <RoleGuidePage
        title="Konten Saya"
        description="Daftar lengkap dan statusnya bisa kamu pantau di pull request milikmu."
        icon={FileText}
        flowTitle="Sementara penulisan dilakukan lewat GitHub"
      />
    </DashboardLayout>
  );
}
