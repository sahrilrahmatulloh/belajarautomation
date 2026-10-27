import DashboardLayout from "@/components/layout/DashboardLayout";
import LearnHeader from "@/components/learn/LearnHeader";
import CourseGrid from "@/components/learn/CourseGrid";
import RoadmapCTA from "@/components/learn/RoadmapCTA";

export default function LearnPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <LearnHeader />

        <CourseGrid />

        <RoadmapCTA />
      </div>
    </DashboardLayout>
  );
}