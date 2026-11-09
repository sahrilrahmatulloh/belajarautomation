import { LayoutDashboard } from "lucide-react";

import AdminSummary from "@/components/admin/AdminSummary";
import DashboardLayout from "@/components/layout/DashboardLayout";
import RoleGuidePage from "@/components/roles/RoleGuidePage";
import { isDev } from "@/lib/env";

// Antarmuka dengan data dummy hanya di DEV. Di luar DEV tetap halaman informasi (PRD FR-16).
// PENTING: route ini WAJIB dilindungi otorisasi role "admin" di backend sebelum rilis (PRD 8.3).
// Saat ini sengaja tanpa proteksi karena belum ada autentikasi; jangan menambahkan proteksi palsu di frontend.
export default function Page() {
  return (
    <DashboardLayout>
      {isDev ? (
        <AdminSummary />
      ) : (
        <RoleGuidePage
          role="admin"
          title="Ringkasan"
          description="Pantau konten yang menunggu diterbitkan."
          icon={LayoutDashboard}
        />
      )}
    </DashboardLayout>
  );
}
