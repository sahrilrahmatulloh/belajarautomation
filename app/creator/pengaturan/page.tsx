import type { Metadata } from "next";

import DashboardLayout from "@/components/layout/DashboardLayout";
import RoleSettingsPage from "@/components/roles/RoleSettingsPage";

export const metadata: Metadata = {
  title: "Pengaturan Creator | belajarautomation.com",
};

// Pengaturan Creator (PRD FR-15): akun, keamanan, notifikasi konten, dan tampilan.
export default function Page() {
  return (
    <DashboardLayout>
      <RoleSettingsPage role="creator" />
    </DashboardLayout>
  );
}
