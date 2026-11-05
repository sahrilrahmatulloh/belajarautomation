import ComingSoon from "@/components/common/ComingSoon";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { COMING_SOON_FEATURES } from "@/data/comingSoonFeatures";
import { isDev } from "@/lib/env";

// Project terbuka di DEV untuk menguji Panel Admin. Di UAT dan Production semua halamannya tetap
// menampilkan "Segera hadir". Hapus file ini untuk membukanya (lihat data/comingSoonFeatures.ts).
export default function ComingSoonLayout({ children }: { children: React.ReactNode }) {
  if (isDev) return children;

  return (
    <DashboardLayout>
      <ComingSoon {...COMING_SOON_FEATURES.projects} />
    </DashboardLayout>
  );
}
