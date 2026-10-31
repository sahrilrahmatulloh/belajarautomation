"use server";

import { CHALLENGE_DETAILS } from "@/data/challengeDetails";
import { ChallengeCheckResult } from "@/types/ChallengeDetail";

const MAX_ANSWER_LENGTH = 5000;

// Hanya memeriksa jawaban. Tidak menyimpan hasil dan tidak memberi XP
// sampai backend (auth, progress, anti-abuse) tersedia.
export async function checkChallengeAnswer(
  slug: string,
  answer: string
): Promise<ChallengeCheckResult> {
  if (typeof slug !== "string" || typeof answer !== "string") {
    return { status: "failed" };
  }

  const detail = CHALLENGE_DETAILS.find(
    (item) => item.slug === slug
  );

  const normalizedAnswer = answer
    .slice(0, MAX_ANSWER_LENGTH)
    .trim()
    .toLowerCase();

  if (!detail || !normalizedAnswer) {
    return { status: "failed" };
  }

  const isCorrect = normalizedAnswer.includes(
    detail.expectedAnswer.toLowerCase()
  );

  return isCorrect
    ? { status: "success", feedback: detail.successFeedback }
    : { status: "failed" };
}
