import { MessageSquareText } from "lucide-react";

import CreatorGuidePage from "@/components/creator/CreatorGuidePage";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function Page() {
  return (
    <DashboardLayout>
      <CreatorGuidePage
        title="Catatan Revisi"
        description="Catatan dari Reviewer ada di komentar pada dokumen Google Docs milikmu."
        icon={MessageSquareText}
      />
    </DashboardLayout>
  );
}
