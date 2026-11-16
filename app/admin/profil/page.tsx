import type { Metadata } from "next";

import AdminProfilePage from "@/components/admin/AdminProfilePage";
import DashboardLayout from "@/components/layout/DashboardLayout";

export const metadata: Metadata = {
  title: "Profil Admin | belajarautomation.com",
};

// Profil Admin (PRD FR-16 L): tanpa foto, XP, rank, maupun kustomisasi.
export default function Page() {
  return (
    <DashboardLayout>
      <AdminProfilePage />
    </DashboardLayout>
  );
}
