import { PracticePageId } from "@/data/practicePages";

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizDetail {
  type: "quiz";
  slug: string;
  // Skor minimal untuk lulus, dalam persen.
  passingScore: number;
  questions: QuizQuestion[];
}

export interface BugFinding {
  id: string;
  label: string;
  // Bug asli dan pengecoh sama-sama punya penjelasan untuk halaman hasil.
  explanation: string;
}

export interface BugHuntDetail {
  type: "bug-hunt";
  slug: string;
  practicePage: PracticePageId;
  // Pilihan temuan yang ditampilkan: bug asli dan pengecoh.
  findings: BugFinding[];
  // Id temuan yang benar-benar bug.
  bugIds: string[];
  // Batas salah tandai yang masih dianggap lulus.
  maxFalsePositives: number;
}

export interface TestCaseChecklistItem {
  id: string;
  label: string;
  // Poin wajib harus tercentang agar lulus.
  required: boolean;
}

export interface TestCaseDetail {
  type: "test-case";
  slug: string;
  requirement: string[];
  sampleAnswer: string;
  checklist: TestCaseChecklistItem[];
}

export type SelectorType = "css" | "xpath";

export interface LocatorDetail {
  type: "locator";
  slug: string;
  practicePage: PracticePageId;
  targetDescription: string;
  // Nilai atribut data-practice-id pada elemen target di halaman latihan.
  targetElementId: string;
  selectorTypes: SelectorType[];
}

export type ChallengeDetail =
  | QuizDetail
  | BugHuntDetail
  | TestCaseDetail
  | LocatorDetail;

// Data yang aman dikirim ke browser sebelum jawaban dikirim: tanpa kunci jawaban,
// pembahasan, daftar bug, contoh jawaban, checklist, dan elemen target.
export type PublicChallengeDetail =
  | { type: "quiz"; passingScore: number; questions: { question: string; options: string[] }[] }
  | { type: "bug-hunt"; practicePage: PracticePageId; findings: { id: string; label: string }[] }
  | { type: "test-case"; requirement: string[] }
  | {
      type: "locator";
      practicePage: PracticePageId;
      targetDescription: string;
      selectorTypes: SelectorType[];
    };

export interface ChallengeScore {
  score: number;
  passed: boolean;
}

export interface QuizResult extends ChallengeScore {
  correctCount: number;
  passingScore: number;
  review: {
    question: string;
    options: string[];
    userIndex: number;
    correctIndex: number;
    explanation: string;
  }[];
}

export interface BugHuntResult extends ChallengeScore {
  found: BugFinding[];
  missed: BugFinding[];
  falsePositives: BugFinding[];
  maxFalsePositives: number;
}

export interface TestCaseReveal {
  sampleAnswer: string;
  checklist: TestCaseChecklistItem[];
}

export type LocatorOutcome = "target" | "none" | "multiple" | "wrong";

export interface LocatorResult extends ChallengeScore {
  outcome: LocatorOutcome;
  matchCount: number;
}
