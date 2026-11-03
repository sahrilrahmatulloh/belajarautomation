import { Inbox } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import RoleGuidePage from "@/components/roles/RoleGuidePage";

export default function Page() {
  return (
    <DashboardLayout>
      <RoleGuidePage
        title="Antrean Review"
        description="Konten yang menunggu review adalah pull request ke develop yang memakai template konten."
        icon={Inbox}
        flowTitle="Sementara review dilakukan lewat pull request di GitHub"
      />
    </DashboardLayout>
  );
}
