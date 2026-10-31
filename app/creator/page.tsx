import CreatorDashboard from "@/components/creator/CreatorDashboard";
import DashboardLayout from "@/components/layout/DashboardLayout";

// PENTING: route ini WAJIB dilindungi otorisasi role "creator" di backend
// sebelum rilis (PRD 8.3). Saat ini sengaja tanpa proteksi karena belum ada
// autentikasi; jangan menambahkan proteksi palsu di frontend.
export default function Page() {
  return (
    <DashboardLayout>
      <CreatorDashboard />
    </DashboardLayout>
  );
}
