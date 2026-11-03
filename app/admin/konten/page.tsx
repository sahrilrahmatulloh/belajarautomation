import { Files } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import RoleGuidePage from "@/components/roles/RoleGuidePage";

export default function Page() {
  return (
    <DashboardLayout>
      <RoleGuidePage
        title="Konten"
        description="Terbitkan konten yang sudah disetujui dengan melakukan merge pull request."
        icon={Files}
        flowTitle="Sementara penerbitan dilakukan lewat pull request di GitHub"
      />
    </DashboardLayout>
  );
}
