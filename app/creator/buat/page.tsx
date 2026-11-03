import { FilePlus2 } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import RoleGuidePage from "@/components/roles/RoleGuidePage";

export default function Page() {
  return (
    <DashboardLayout>
      <RoleGuidePage
        title="Buat Konten"
        description="Mulai dari artikel blog dengan menulis file MDX di branch milikmu."
        icon={FilePlus2}
        flowTitle="Sementara penulisan dilakukan lewat GitHub"
      />
    </DashboardLayout>
  );
}
