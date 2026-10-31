export interface ChallengeDetail {
  slug: string;
  instruction: string;
  requirements: string[];
  code?: string;
  placeholder: string;
  expectedAnswer: string;
  successFeedback: string;
}

// Data yang aman dikirim ke Client Component (tanpa kunci jawaban).
export type PublicChallengeDetail = Omit<
  ChallengeDetail,
  "expectedAnswer" | "successFeedback"
>;

export type ChallengeCheckResult =
  | { status: "success"; feedback: string }
  | { status: "failed" };
