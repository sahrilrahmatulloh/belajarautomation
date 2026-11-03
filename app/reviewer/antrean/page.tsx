import { Inbox } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import RoleGuidePage from "@/components/roles/RoleGuidePage";

export default function Page() {
  return (
    <DashboardLayout>
      <RoleGuidePage
        role="reviewer"
        title="Antrean Review"
        description="Konten yang menunggu review adalah dokumen Google Docs yang dibagikan Creator kepadamu."
        icon={Inbox}
      />
    </DashboardLayout>
  );
}
