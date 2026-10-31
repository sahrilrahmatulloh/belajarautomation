import DashboardLayout from "@/components/layout/DashboardLayout";
import ReviewerDashboard from "@/components/reviewer/ReviewerDashboard";

// PENTING: route ini WAJIB dilindungi otorisasi role "reviewer" di backend
// sebelum rilis (PRD 8.3). Saat ini sengaja tanpa proteksi karena belum ada
// autentikasi; jangan menambahkan proteksi palsu di frontend.
export default function Page() {
  return (
    <DashboardLayout>
      <ReviewerDashboard />
    </DashboardLayout>
  );
}
