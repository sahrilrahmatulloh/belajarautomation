import type { Metadata } from "next";

import DashboardLayout from "@/components/layout/DashboardLayout";
import RoleSettingsPage from "@/components/roles/RoleSettingsPage";

export const metadata: Metadata = {
  title: "Pengaturan Reviewer | belajarautomation.com",
};

// Pengaturan Reviewer (PRD FR-15): akun, keamanan, notifikasi review, dan tampilan.
export default function Page() {
  return (
    <DashboardLayout>
      <RoleSettingsPage role="reviewer" />
    </DashboardLayout>
  );
}
