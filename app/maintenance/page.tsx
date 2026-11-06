import type { Metadata } from "next";

import MaintenanceStatusPage from "@/components/maintenance/MaintenanceStatusPage";

export const metadata: Metadata = {
  title: "Maintenance | belajarautomation.com",
};

export default function Page() {
  return <MaintenanceStatusPage />;
}
