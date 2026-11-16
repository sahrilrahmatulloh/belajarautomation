import type { Metadata } from "next";

import RoleSettingsPage from "@/components/roles/RoleSettingsPage";
import DashboardLayout from "@/components/layout/DashboardLayout";

export const metadata: Metadata = {
  title: "Pengaturan Admin | belajarautomation.com",
};

// Pengaturan Admin (PRD FR-16 L): akun, keamanan, notifikasi Admin, dan tampilan.
export default function Page() {
  return (
    <DashboardLayout>
      <RoleSettingsPage role="admin" />
    </DashboardLayout>
  );
}
