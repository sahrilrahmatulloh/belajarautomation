import { LucideIcon } from "lucide-react";

export type ChallengeCategory =
  | "Locator"
  | "Test Case"
  | "Bug Hunt"
  | "API"
  | "Automation"
  | "AI";

export type ChallengeDifficulty =
  | "Beginner"
  | "Intermediate"
  | "Advanced";

export interface Challenge {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  rp: number;
  duration: string;
  completed: boolean;
  icon: LucideIcon;
}