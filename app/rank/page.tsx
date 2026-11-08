import type { Metadata } from "next";

import DashboardLayout from "@/components/layout/DashboardLayout";
import RankPage from "@/components/rank/RankPage";

export const metadata: Metadata = {
  title: "Rank & XP | belajarautomation.com",
};

export default function Page() {
  return (
    <DashboardLayout>
      <RankPage />
    </DashboardLayout>
  );
}
