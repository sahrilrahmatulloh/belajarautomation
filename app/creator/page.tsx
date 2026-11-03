import CreatorDashboard from "@/components/creator/CreatorDashboard";
import DashboardLayout from "@/components/layout/DashboardLayout";

// PENTING: DashboardLayout hanya mengarahkan tampilan berdasarkan sesi dummy di browser,
// bukan proteksi keamanan. Otorisasi role "creator" WAJIB ada di backend sebelum rilis (PRD 8.3).
export default function Page() {
  return (
    <DashboardLayout>
      <CreatorDashboard />
    </DashboardLayout>
  );
}
