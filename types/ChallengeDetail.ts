export interface ChallengeDetail {
  slug: string;
  instruction: string;
  requirements: string[];
  code?: string;
  placeholder: string;
  expectedAnswer: string;
  successFeedback: string;
}