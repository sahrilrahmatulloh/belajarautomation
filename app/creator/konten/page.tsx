import { FileText } from "lucide-react";

import CreatorGuidePage from "@/components/creator/CreatorGuidePage";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function Page() {
  return (
    <DashboardLayout>
      <CreatorGuidePage
        title="Konten Saya"
        description="Daftar lengkap dan statusnya bisa kamu pantau di pull request milikmu."
        icon={FileText}
      />
    </DashboardLayout>
  );
}
