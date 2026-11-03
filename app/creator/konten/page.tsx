import { FileText } from "lucide-react";

import CreatorGuidePage from "@/components/creator/CreatorGuidePage";
import ContentsPage from "@/components/creator/studio/ContentsPage";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { isDev } from "@/lib/env";

// Prototipe dengan data dummy hanya di DEV. Di luar DEV tetap halaman informasi (PRD FR-15).
export default function Page() {
  return (
    <DashboardLayout>
      {isDev ? (
        <ContentsPage />
      ) : (
        <CreatorGuidePage
          title="Konten Saya"
          description="Simpan dan pantau tulisanmu di dokumen Google Docs milikmu."
          icon={FileText}
        />
      )}
    </DashboardLayout>
  );
}
