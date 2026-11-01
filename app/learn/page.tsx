import { Suspense } from "react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import LearnHeader from "@/components/learn/LearnHeader";
import CourseGrid from "@/components/learn/CourseGrid";
import RoadmapCTA from "@/components/learn/RoadmapCTA";

export default function LearnPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <LearnHeader />

        <RoadmapCTA />

        {/* CourseGrid membaca filter dari URL (useSearchParams). */}
        <Suspense fallback={<p className="text-sm text-muted-foreground">Memuat materi...</p>}>
          <CourseGrid />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}