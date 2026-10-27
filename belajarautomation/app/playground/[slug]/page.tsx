import { notFound } from "next/navigation";

import DashboardLayout from "@/components/layout/DashboardLayout";
import ChallengeWorkspace from "@/components/playground/ChallengeWorkspace";

import { CHALLENGES } from "@/data/challenges";
import { CHALLENGE_DETAILS } from "@/data/challengeDetails";

interface ChallengePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ChallengePage({
  params,
}: ChallengePageProps) {
  const { slug } = await params;

  const challengeData = CHALLENGES.find(
    (item) => item.slug === slug
  );

  const detail = CHALLENGE_DETAILS.find(
    (item) => item.slug === slug
  );

  if (!challengeData || !detail) {
    notFound();
  }

  // Hapus React component `icon` sebelum dikirim
  // dari Server Component ke Client Component
  const { icon, ...challenge } = challengeData;

  return (
    <DashboardLayout>
      <ChallengeWorkspace
        challenge={challenge}
        detail={detail}
      />
    </DashboardLayout>
  );
}