import { notFound } from "next/navigation";

import DashboardLayout from "@/components/layout/DashboardLayout";
import ChallengeWorkspace from "@/components/playground/ChallengeWorkspace";

import { CHALLENGES } from "@/data/challenges";
import { CHALLENGE_DETAILS } from "@/data/challengeDetails";
import { PublicChallengeDetail } from "@/types/ChallengeDetail";

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

  // Hapus React component `icon` sebelum mengirim data ke Client Component.
  const challenge = Object.fromEntries(
    Object.entries(challengeData).filter(([key]) => key !== "icon")
  ) as Omit<typeof challengeData, "icon">;

  // Kunci jawaban tidak boleh dikirim ke browser; pengecekan ada di actions.ts.
  const publicDetail: PublicChallengeDetail = {
    slug: detail.slug,
    instruction: detail.instruction,
    requirements: detail.requirements,
    code: detail.code,
    placeholder: detail.placeholder,
  };

  return (
    <DashboardLayout>
      <ChallengeWorkspace
        challenge={challenge}
        detail={publicDetail}
      />
    </DashboardLayout>
  );
}
