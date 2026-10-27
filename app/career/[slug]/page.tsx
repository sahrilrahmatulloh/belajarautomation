import { notFound } from "next/navigation";

import DashboardLayout from "@/components/layout/DashboardLayout";
import CareerDetailPage from "@/components/career/CareerDetailPage";

import { CAREER_RESOURCES } from "@/data/careerResources";

interface CareerPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CareerResourcePage({
  params,
}: CareerPageProps) {
  const { slug } = await params;

  const resource = CAREER_RESOURCES.find(
    (item) => item.slug === slug
  );

  if (
    !resource ||
    resource.status === "coming-soon"
  ) {
    notFound();
  }

  return (
    <DashboardLayout>
      <CareerDetailPage resource={resource} />
    </DashboardLayout>
  );
}