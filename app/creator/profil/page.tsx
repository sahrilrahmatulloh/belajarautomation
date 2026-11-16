import type { Metadata } from "next";

import CreatorProfilePage from "@/components/creator/CreatorProfilePage";
import DashboardLayout from "@/components/layout/DashboardLayout";

export const metadata: Metadata = {
  title: "Profil Creator | belajarautomation.com",
};

// Profil Creator (PRD FR-15): tanpa foto, XP, rank, maupun kustomisasi.
export default function Page() {
  return (
    <DashboardLayout>
      <CreatorProfilePage />
    </DashboardLayout>
  );
}
