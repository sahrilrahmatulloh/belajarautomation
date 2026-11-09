import { Suspense } from "react";
import { Users } from "lucide-react";

import UsersPage from "@/components/admin/UsersPage";
import DashboardLayout from "@/components/layout/DashboardLayout";
import RoleGuidePage from "@/components/roles/RoleGuidePage";
import { isDev } from "@/lib/env";

// Antarmuka dengan data dummy hanya di DEV. Di luar DEV tetap halaman informasi (PRD FR-16).
// PENTING: route ini WAJIB dilindungi otorisasi role "admin" di backend sebelum rilis (PRD 8.3).
export default function Page() {
  return (
    <DashboardLayout>
      {isDev ? (
        <Suspense fallback={<p className="text-sm text-muted-foreground">Memuat pengguna...</p>}>
          <UsersPage />
        </Suspense>
      ) : (
        <RoleGuidePage
          role="admin"
          title="Pengguna dan Peran"
          description="Pengelolaan pengguna dan peran tersedia setelah backend siap."
          icon={Users}
        />
      )}
    </DashboardLayout>
  );
}
