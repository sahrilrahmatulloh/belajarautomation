import { Inbox } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import ReviewQueuePage from "@/components/reviewer/ReviewQueuePage";
import RoleGuidePage from "@/components/roles/RoleGuidePage";
import { isDev } from "@/lib/env";

// Antarmuka dengan data dummy hanya di DEV. Di luar DEV tetap halaman informasi (PRD FR-15).
// ?tab=belum membuka tab Belum ditugaskan, mis. dari angka di Dashboard Reviewer.
export default async function Page({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams;
  return (
    <DashboardLayout>
      {isDev ? (
        <ReviewQueuePage key={tab ?? ""} initialTab={tab === "belum" ? "belum" : "ditugaskan"} />
      ) : (
        <RoleGuidePage
          role="reviewer"
          title="Antrean Review"
          description="Konten yang menunggu review adalah dokumen Google Docs yang dibagikan Creator kepadamu."
          icon={Inbox}
        />
      )}
    </DashboardLayout>
  );
}
