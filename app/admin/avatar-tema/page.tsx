import { Palette } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import RoleGuidePage from "@/components/roles/RoleGuidePage";

export default function Page() {
  return (
    <DashboardLayout>
      <RoleGuidePage
        role="admin"
        title="Avatar & Tema"
        description="Pengelolaan avatar dan tema tersedia setelah backend siap."
        icon={Palette}
      />
    </DashboardLayout>
  );
}
