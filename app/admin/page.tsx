import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminSummary from "@/components/admin/AdminSummary";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { isDev } from "@/lib/env";

// PENTING: route ini WAJIB dilindungi otorisasi role "admin" di backend
// sebelum rilis (PRD 8.3). Saat ini sengaja tanpa proteksi karena belum ada
// autentikasi; jangan menambahkan proteksi palsu di frontend.
export default function Page() {
  return (
    <DashboardLayout>
      {isDev ? <AdminSummary /> : <AdminDashboard />}
    </DashboardLayout>
  );
}
