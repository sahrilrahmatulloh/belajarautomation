import { Suspense } from "react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import NotificationsPage from "@/components/notifications/NotificationsPage";

export default function Page() {
  return (
    <DashboardLayout>
      {/* NotificationsPage membaca tab dan filter dari URL (useSearchParams). */}
      <Suspense fallback={<p className="text-sm text-muted-foreground">Memuat notifikasi...</p>}>
        <NotificationsPage />
      </Suspense>
    </DashboardLayout>
  );
}
