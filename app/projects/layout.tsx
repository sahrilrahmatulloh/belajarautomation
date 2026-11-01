import ComingSoon from "@/components/common/ComingSoon";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { COMING_SOON_FEATURES } from "@/data/comingSoonFeatures";

// Fitur ini sementara ditutup: semua halaman di /projects menampilkan "Segera hadir".
// Hapus file ini untuk membukanya kembali (lihat data/comingSoonFeatures.ts).
export default function ComingSoonLayout() {
  return (
    <DashboardLayout>
      <ComingSoon {...COMING_SOON_FEATURES.projects} />
    </DashboardLayout>
  );
}
