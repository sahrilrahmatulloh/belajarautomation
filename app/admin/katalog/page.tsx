import { Suspense } from "react";
import { LibraryBig } from "lucide-react";

import CatalogPage from "@/components/admin/CatalogPage";
import DashboardLayout from "@/components/layout/DashboardLayout";
import RoleGuidePage from "@/components/roles/RoleGuidePage";
import { isDev } from "@/lib/env";

// Antarmuka dengan data dummy hanya di DEV. Di luar DEV tetap halaman informasi (PRD FR-16).
// PENTING: route ini WAJIB dilindungi otorisasi role "admin" di backend sebelum rilis (PRD 8.3).
export default function Page() {
  return (
    <DashboardLayout>
      {isDev ? (
        <Suspense fallback={<p className="text-sm text-muted-foreground">Memuat katalog...</p>}>
          <CatalogPage />
        </Suspense>
      ) : (
        <RoleGuidePage
          role="admin"
          title="Katalog Belajar"
          description="Sementara, katalog diubah lewat file data di repository."
          icon={LibraryBig}
        />
      )}
    </DashboardLayout>
  );
}
