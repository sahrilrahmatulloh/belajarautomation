import DashboardLayout from "@/components/layout/DashboardLayout";
import ProfilePage from "@/components/profile/ProfilePage";

export default function Page() {
  return (
    <DashboardLayout>
      <ProfilePage />
    </DashboardLayout>
  );
}