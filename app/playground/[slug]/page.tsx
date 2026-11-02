import { notFound } from "next/navigation";

import DashboardLayout from "@/components/layout/DashboardLayout";
import ChallengeWorkspace from "@/components/playground/workspace/ChallengeWorkspace";
import { CHALLENGES } from "@/data/challenges";
import { canAccessChallengeCourse } from "@/lib/challengeAccess";
import { getPublicChallengeDetail } from "@/lib/challengePublic";

interface ChallengePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ChallengePage({ params }: ChallengePageProps) {
  const { slug } = await params;
  const challenge = CHALLENGES.find((item) => item.slug === slug);
  const detail = getPublicChallengeDetail(slug);

  if (!challenge || !detail) {
    notFound();
  }

  return (
    <DashboardLayout>
      <ChallengeWorkspace
        challenge={challenge}
        detail={detail}
        locked={!canAccessChallengeCourse(challenge.courseSlug)}
      />
    </DashboardLayout>
  );
}
