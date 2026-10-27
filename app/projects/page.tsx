import DashboardLayout from "@/components/layout/DashboardLayout";
import ProjectsPage from "@/components/projects/ProjectsPage";

export default function Page() {
  return (
    <DashboardLayout>
      <ProjectsPage />
    </DashboardLayout>
  );
}