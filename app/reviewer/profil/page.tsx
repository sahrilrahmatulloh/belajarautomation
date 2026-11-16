import type { Metadata } from "next";

import DashboardLayout from "@/components/layout/DashboardLayout";
import ReviewerProfilePage from "@/components/reviewer/ReviewerProfilePage";

export const metadata: Metadata = {
  title: "Profil Reviewer | belajarautomation.com",
};

// Profil Reviewer (PRD FR-15): tanpa foto, XP, rank, maupun kustomisasi.
export default function Page() {
  return (
    <DashboardLayout>
      <ReviewerProfilePage />
    </DashboardLayout>
  );
}
