import { redirect } from "next/navigation";

import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardSection from "@/components/dashboard/sections/DashboardSection";
import { getCurrentUser } from "@/lib/auth/user";

export default async function Home() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <DashboardLayout>
      <DashboardSection />
    </DashboardLayout>
  );
}