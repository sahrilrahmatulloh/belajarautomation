import DashboardLayout from "@/components/layout/DashboardLayout";
import NotificationsPage from "@/components/notifications/NotificationsPage";

export default function Page() {
  return (
    <DashboardLayout>
      <NotificationsPage />
    </DashboardLayout>
  );
}