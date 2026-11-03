import { BookOpenCheck } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import RoleGuidePage from "@/components/roles/RoleGuidePage";

export default function Page() {
  return (
    <DashboardLayout>
      <RoleGuidePage
        role="reviewer"
        title="Panduan Review"
        description="Periksa isi, contoh kode, dan referensi video sebelum menyatakan setuju."
        icon={BookOpenCheck}
      />
    </DashboardLayout>
  );
}
