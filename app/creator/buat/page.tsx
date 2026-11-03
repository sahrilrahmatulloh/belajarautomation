import { FilePlus2 } from "lucide-react";

import CreatorGuidePage from "@/components/creator/CreatorGuidePage";
import ContentTypePage from "@/components/creator/studio/ContentTypePage";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { isDev } from "@/lib/env";

// Prototipe dengan data dummy hanya di DEV. Di luar DEV tetap halaman informasi (PRD FR-15).
export default function Page() {
  return (
    <DashboardLayout>
      {isDev ? (
        <ContentTypePage />
      ) : (
        <CreatorGuidePage
          title="Buat Konten"
          description="Tulis artikel baru di Google Docs memakai template resmi."
          icon={FilePlus2}
        />
      )}
    </DashboardLayout>
  );
}
