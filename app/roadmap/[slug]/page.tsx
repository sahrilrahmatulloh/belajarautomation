import { notFound } from "next/navigation";

import DashboardLayout from "@/components/layout/DashboardLayout";
import RoadmapDetailPage from "@/components/roadmap/RoadmapDetailPage";

import { ROADMAPS } from "@/data/roadmap";

interface RoadmapPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return ROADMAPS.filter(
    (roadmap) => roadmap.status === "active"
  ).map((roadmap) => ({ slug: roadmap.id }));
}

export default async function RoadmapPage({
  params,
}: RoadmapPageProps) {
  const { slug } = await params;

  const roadmap = ROADMAPS.find(
    (item) => item.id === slug && item.status === "active"
  );

  if (!roadmap) {
    notFound();
  }

  return (
    <DashboardLayout>
      <RoadmapDetailPage roadmap={roadmap} />
    </DashboardLayout>
  );
}
