import { MessageSquareText } from "lucide-react";

import CreatorGuidePage from "@/components/creator/CreatorGuidePage";
import RevisionsPage from "@/components/creator/studio/RevisionsPage";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { isDev } from "@/lib/env";

// Prototipe dengan data dummy hanya di DEV. Di luar DEV tetap halaman informasi (PRD FR-15).
export default function Page() {
  return (
    <DashboardLayout>
      {isDev ? (
        <RevisionsPage />
      ) : (
        <CreatorGuidePage
          title="Catatan Revisi"
          description="Catatan dari Reviewer ada di komentar pada dokumen Google Docs milikmu."
          icon={MessageSquareText}
        />
      )}
    </DashboardLayout>
  );
}
