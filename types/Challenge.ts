import { CourseCategory } from "./Course";

export type ChallengeDifficulty =
  | "Beginner"
  | "Intermediate"
  | "Advanced";

// Empat jenis latihan Playground (PRD FR-04).
export type ChallengeType = "quiz" | "bug-hunt" | "test-case" | "locator";

// Data publik yang tampil di daftar latihan. Isi latihan dan kunci jawaban ada di
// data/challengeDetails.ts dan hanya boleh dibaca dari kode server.
export interface Challenge {
  slug: string;
  title: string;
  description: string;
  type: ChallengeType;
  // Kategori course terkait, sama dengan Learning Center.
  category: CourseCategory;
  // Course terkait di katalog (data/courses.ts).
  courseSlug: string;
  difficulty: ChallengeDifficulty;
  duration: string;
  // Opsional; bila kosong memakai sampul course terkait.
  cover?: string;
  // Hanya untuk kuis.
  questionCount?: number;
}
