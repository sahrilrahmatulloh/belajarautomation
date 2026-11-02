import "server-only";

import { CHALLENGE_DETAILS } from "@/data/challengeDetails";
import { PublicChallengeDetail } from "@/types/ChallengeDetail";

// Satu-satunya jalur data latihan ke browser sebelum jawaban dikirim. Field ditulis
// satu per satu agar kunci jawaban tidak ikut terbawa saat data bertambah.
export function getPublicChallengeDetail(slug: string): PublicChallengeDetail | null {
  const detail = CHALLENGE_DETAILS.find((item) => item.slug === slug);
  if (!detail) return null;

  switch (detail.type) {
    case "quiz":
      return {
        type: "quiz",
        passingScore: detail.passingScore,
        questions: detail.questions.map(({ question, options }) => ({ question, options })),
      };
    case "bug-hunt":
      return {
        type: "bug-hunt",
        practicePage: detail.practicePage,
        findings: detail.findings.map(({ id, label }) => ({ id, label })),
      };
    case "test-case":
      return { type: "test-case", requirement: detail.requirement };
    case "locator":
      return {
        type: "locator",
        practicePage: detail.practicePage,
        targetDescription: detail.targetDescription,
        selectorTypes: detail.selectorTypes,
      };
  }
}
