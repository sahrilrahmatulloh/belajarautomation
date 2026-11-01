import { LucideIcon } from "lucide-react";

import { CourseCategory } from "./Course";

export type ChallengeDifficulty =
  | "Beginner"
  | "Intermediate"
  | "Advanced";

// "multiple-choice" disiapkan untuk soal pilihan ganda (belum ada datanya).
export type ChallengeType = "challenge" | "multiple-choice";

export interface Challenge {
  id: number;
  slug: string;
  title: string;
  description: string;
  // Kategori yang sama dengan Learning Center.
  category: CourseCategory;
  // Course terkait di katalog (data/courses.ts).
  courseSlug: string;
  type: ChallengeType;
  difficulty: ChallengeDifficulty;
  duration: string;
  completed: boolean;
  icon: LucideIcon;
}
