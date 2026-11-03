import { FilePlus2 } from "lucide-react";

import CreatorGuidePage from "@/components/creator/CreatorGuidePage";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function Page() {
  return (
    <DashboardLayout>
      <CreatorGuidePage
        title="Buat Konten"
        description="Mulai dari artikel blog dengan menulis file MDX di branch milikmu."
        icon={FilePlus2}
      />
    </DashboardLayout>
  );
}
