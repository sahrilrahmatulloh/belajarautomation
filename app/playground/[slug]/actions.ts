"use server";

import { CHALLENGE_DETAILS } from "@/data/challengeDetails";
import { CHALLENGES } from "@/data/challenges";
import { canAccessChallengeCourse } from "@/lib/challengeAccess";
import { recordChallengeAttempt } from "@/lib/xp/record";
import {
  BugHuntDetail,
  BugHuntResult,
  ChallengeDetail,
  ChallengeScore,
  LocatorDetail,
  LocatorResult,
  QuizDetail,
  QuizResult,
  TestCaseDetail,
  TestCaseReveal,
} from "@/types/ChallengeDetail";

const MAX_ANSWER_LENGTH = 5000;
const MAX_LOCATOR_MATCHES = 1000;

// Mengembalikan null bila latihan tidak ada, jenisnya berbeda, atau tidak bisa diakses.
function findDetail<T extends ChallengeDetail>(slug: unknown, type: T["type"]) {
  const challenge = CHALLENGES.find((item) => item.slug === slug);
  if (!challenge || !canAccessChallengeCourse(challenge.courseSlug)) return null;
  const detail = CHALLENGE_DETAILS.find((item) => item.slug === slug);
  return detail?.type === type ? (detail as T) : null;
}

const uniqueStrings = (value: unknown) =>
  Array.isArray(value) ? [...new Set(value.filter((item): item is string => typeof item === "string"))] : [];

export async function submitQuiz(slug: string, answers: number[]): Promise<QuizResult | null> {
  const detail = findDetail<QuizDetail>(slug, "quiz");
  if (!detail || !Array.isArray(answers) || answers.length !== detail.questions.length) return null;

  const isValid = detail.questions.every(
    ({ options }, index) =>
      Number.isInteger(answers[index]) && answers[index] >= 0 && answers[index] < options.length
  );
  if (!isValid) return null;

  const correctCount = detail.questions.filter(
    ({ correctIndex }, index) => answers[index] === correctIndex
  ).length;
  const score = Math.round((correctCount / detail.questions.length) * 100);
  const passed = score >= detail.passingScore;

  return {
    score,
    passed,
    xp: await recordChallengeAttempt(detail.slug, "quiz", score, passed),
    correctCount,
    passingScore: detail.passingScore,
    review: detail.questions.map((question, index) => ({
      question: question.question,
      options: question.options,
      userIndex: answers[index],
      correctIndex: question.correctIndex,
      explanation: question.explanation,
    })),
  };
}

export async function submitBugHunt(slug: string, selectedIds: string[]): Promise<BugHuntResult | null> {
  const detail = findDetail<BugHuntDetail>(slug, "bug-hunt");
  if (!detail) return null;

  const selected = new Set(uniqueStrings(selectedIds));
  const isBug = (id: string) => detail.bugIds.includes(id);
  const found = detail.findings.filter(({ id }) => isBug(id) && selected.has(id));
  const missed = detail.findings.filter(({ id }) => isBug(id) && !selected.has(id));
  const falsePositives = detail.findings.filter(({ id }) => !isBug(id) && selected.has(id));

  // Setiap salah tandai mengurangi satu temuan yang benar.
  const score = Math.round((Math.max(found.length - falsePositives.length, 0) / detail.bugIds.length) * 100);
  const passed = missed.length === 0 && falsePositives.length <= detail.maxFalsePositives;

  return {
    score,
    passed,
    xp: await recordChallengeAttempt(detail.slug, "bug-hunt", score, passed),
    found,
    missed,
    falsePositives,
    maxFalsePositives: detail.maxFalsePositives,
  };
}

// Contoh jawaban dan checklist baru dikirim setelah pengguna mengirim jawabannya.
export async function revealTestCase(slug: string, answer: string): Promise<TestCaseReveal | null> {
  const detail = findDetail<TestCaseDetail>(slug, "test-case");
  if (!detail || typeof answer !== "string") return null;
  if (!answer.slice(0, MAX_ANSWER_LENGTH).trim()) return null;

  return { sampleAnswer: detail.sampleAnswer, checklist: detail.checklist };
}

export async function submitTestCaseCheck(slug: string, checkedIds: string[]): Promise<ChallengeScore | null> {
  const detail = findDetail<TestCaseDetail>(slug, "test-case");
  if (!detail) return null;

  const checked = new Set(uniqueStrings(checkedIds));
  const met = detail.checklist.filter(({ id }) => checked.has(id)).length;

  const score = Math.round((met / detail.checklist.length) * 100);
  const passed = detail.checklist.every(({ id, required }) => !required || checked.has(id));

  // Tercatat selesai tanpa XP: dinilai sendiri oleh pengguna (PRD FR-05).
  return { score, passed, xp: await recordChallengeAttempt(detail.slug, "test-case", score, passed) };
}

// matchedIds: nilai data-practice-id tiap elemen yang cocok; string kosong untuk
// elemen tanpa identitas. Lulus hanya bila elemen target saja yang cocok.
export async function submitLocator(slug: string, matchedIds: string[]): Promise<LocatorResult | null> {
  const detail = findDetail<LocatorDetail>(slug, "locator");
  if (!detail || !Array.isArray(matchedIds) || matchedIds.length > MAX_LOCATOR_MATCHES) return null;
  if (!matchedIds.every((id) => typeof id === "string")) return null;

  const outcome =
    matchedIds.length === 0
      ? "none"
      : matchedIds.length > 1
        ? "multiple"
        : matchedIds[0] === detail.targetElementId
          ? "target"
          : "wrong";

  const passed = outcome === "target";

  return {
    score: passed ? 100 : 0,
    passed,
    xp: await recordChallengeAttempt(detail.slug, "locator", passed ? 100 : 0, passed),
    outcome,
    matchCount: matchedIds.length,
  };
}
