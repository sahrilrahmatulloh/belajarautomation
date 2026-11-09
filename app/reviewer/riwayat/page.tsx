import { History } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import ReviewQueuePage from "@/components/reviewer/ReviewQueuePage";
import RoleGuidePage from "@/components/roles/RoleGuidePage";
import { isDev } from "@/lib/env";

// Antarmuka dengan data dummy hanya di DEV. Di luar DEV tetap halaman informasi (PRD FR-15).
export default function Page() {
  return (
    <DashboardLayout>
      {isDev ? (
        <ReviewQueuePage initialTab="riwayat" />
      ) : (
        <RoleGuidePage
          role="reviewer"
          title="Riwayat Review"
          description="Riwayat review tersimpan di komentar pada setiap dokumen."
          icon={History}
        />
      )}
    </DashboardLayout>
  );
}
