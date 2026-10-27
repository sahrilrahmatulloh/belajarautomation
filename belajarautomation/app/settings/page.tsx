import DashboardLayout from "@/components/layout/DashboardLayout";
import SettingsPage from "@/components/settings/SettingsPage";

export default function Page() {
  return (
    <DashboardLayout>
      <SettingsPage />
    </DashboardLayout>
  );
}