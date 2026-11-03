import DashboardLayout from "@/components/layout/DashboardLayout";
import ProfileByMode from "@/components/profile/ProfileByMode";
import ProfilePage from "@/components/profile/ProfilePage";

export default function Page() {
  return (
    <DashboardLayout>
      <ProfileByMode>
        <ProfilePage />
      </ProfileByMode>
    </DashboardLayout>
  );
}
