import { BookOpenCheck } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import RoleGuidePage from "@/components/roles/RoleGuidePage";

export default function Page() {
  return (
    <DashboardLayout>
      <RoleGuidePage
        title="Panduan Review"
        description="Checklist review ada di panduan kontribusi dan template pull request konten."
        icon={BookOpenCheck}
        flowTitle="Sementara review dilakukan lewat pull request di GitHub"
      />
    </DashboardLayout>
  );
}
