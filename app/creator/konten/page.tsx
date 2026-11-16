import { Suspense } from "react";
import { FileText } from "lucide-react";

import CreatorGuidePage from "@/components/creator/CreatorGuidePage";
import ContentsPage from "@/components/creator/studio/ContentsPage";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { isDev } from "@/lib/env";

// Antarmuka dengan data dummy hanya di DEV. Di luar DEV tetap halaman informasi (PRD FR-15).
export default function Page() {
  return (
    <DashboardLayout>
      {isDev ? (
        // Filter status dibaca dari alamat (useSearchParams), jadi butuh Suspense saat prerender.
        <Suspense fallback={<p className="text-sm text-muted-foreground">Memuat konten...</p>}>
          <ContentsPage />
        </Suspense>
      ) : (
        <CreatorGuidePage
          title="Konten Saya"
          description="Simpan dan pantau tulisanmu di dokumen Google Docs milikmu."
          icon={FileText}
        />
      )}
    </DashboardLayout>
  );
}
