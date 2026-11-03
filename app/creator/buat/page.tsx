import { FilePlus2 } from "lucide-react";

import CreatorGuidePage from "@/components/creator/CreatorGuidePage";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function Page() {
  return (
    <DashboardLayout>
      <CreatorGuidePage
        title="Buat Konten"
        description="Tulis artikel baru di Google Docs memakai template resmi."
        icon={FilePlus2}
      />
    </DashboardLayout>
  );
}
