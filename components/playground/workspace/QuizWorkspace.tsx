"use client";

import { useState, useTransition } from "react";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";

import { submitQuiz } from "@/app/playground/[slug]/actions";
import { Progress } from "@/components/ui/progress";
import { recordChallengeAttempt } from "@/lib/challengeAttempts";
import { PublicChallengeDetail, QuizResult } from "@/types/ChallengeDetail";

import ResultSummary from "./ResultSummary";
import SubmitError from "./SubmitError";

type QuizData = Extract<PublicChallengeDetail, { type: "quiz" }>;

function QuizReview({ result }: { result: QuizResult }) {
  return (
    <ol aria-label="Pembahasan" className="space-y-3">
      {result.review.map((item, index) => {
        const isCorrect = item.userIndex === item.correctIndex;

        return (
          <li key={item.question} className="rounded-2xl border border-border bg-card p-4 sm:p-5">
            <p className="text-xs font-medium text-muted-foreground">Soal {index + 1}</p>
            <h3 className="mt-1 font-semibold leading-snug">{item.question}</h3>

            <dl className="mt-3 space-y-2 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Jawaban kamu</dt>
                <dd
                  className={`flex items-start gap-1.5 font-medium ${
                    isCorrect ? "text-emerald-700 dark:text-emerald-300" : "text-destructive"
                  }`}
                >
                  {isCorrect ? (
                    <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  ) : (
                    <X className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  )}
                  {item.options[item.userIndex]}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Jawaban benar</dt>
                <dd className="font-medium">{item.options[item.correctIndex]}</dd>
              </div>
            </dl>

            <p className="mt-3 rounded-xl bg-muted/60 p-3 text-sm leading-6 text-muted-foreground">
              {item.explanation}
            </p>
          </li>
        );
      })}
    </ol>
  );
}

export default function QuizWorkspace({ slug, data }: { slug: string; data: QuizData }) {
  const { questions } = data;
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));
  const [outcome, setOutcome] = useState<{ result: QuizResult; xp: number } | null>(null);
  const [failed, setFailed] = useState(false);
  const [isPending, startTransition] = useTransition();

  const answeredCount = answers.filter((answer) => answer !== null).length;
  const allAnswered = answeredCount === questions.length;
  const question = questions[current];

  const submit = () => {
    setFailed(false);
    startTransition(async () => {
      try {
        const result = await submitQuiz(slug, answers as number[]);
        if (!result) return setFailed(true);
        setOutcome({ result, xp: recordChallengeAttempt(slug, "quiz", result) });
      } catch {
        setFailed(true);
      }
    });
  };

  const retry = () => {
    setOutcome(null);
    setAnswers(questions.map(() => null));
    setCurrent(0);
  };

  if (outcome) {
    return (
      <div className="space-y-4">
        <ResultSummary
          result={outcome.result}
          xp={outcome.xp}
          detail={`${outcome.result.correctCount} dari ${questions.length} jawaban benar. Lulus minimal ${outcome.result.passingScore}%.`}
          onRetry={retry}
        />
        <QuizReview result={outcome.result} />
      </div>
    );
  }

  return (
    <section aria-label="Pengerjaan kuis" className="space-y-4 rounded-2xl border border-border bg-card p-4 sm:p-6">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <p className="font-semibold">
            Soal {current + 1} dari {questions.length}
          </p>
          <p className="text-muted-foreground">
            {answeredCount} dari {questions.length} terjawab
          </p>
        </div>
        <Progress
          value={(answeredCount / questions.length) * 100}
          aria-label="Progres kuis"
          className="mt-2"
        />
      </div>

      <fieldset key={current} className="space-y-2">
        <legend className="mb-3 font-semibold leading-snug">{question.question}</legend>
        {question.options.map((option, index) => (
          <label
            key={option}
            className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-3 text-sm transition-colors hover:bg-accent has-[:checked]:border-primary has-[:checked]:bg-primary/5"
          >
            <input
              type="radio"
              name="jawaban"
              checked={answers[current] === index}
              onChange={() =>
                setAnswers((previous) => previous.map((answer, position) => (position === current ? index : answer)))
              }
              className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
            />
            {option}
          </label>
        ))}
      </fieldset>

      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          disabled={current === 0}
          onClick={() => setCurrent((value) => value - 1)}
          className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-border px-3 text-sm font-medium transition-colors enabled:hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Sebelumnya
        </button>
        <button
          type="button"
          disabled={current === questions.length - 1}
          onClick={() => setCurrent((value) => value + 1)}
          className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-border px-3 text-sm font-medium transition-colors enabled:hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          Berikutnya
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="border-t border-border pt-4">
        {failed && <SubmitError />}
        <button
          type="button"
          disabled={!allAnswered || isPending}
          onClick={submit}
          className="min-h-11 w-full rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors enabled:hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Mengirim..." : "Kirim jawaban"}
        </button>
        {!allAnswered && (
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Jawab semua soal untuk mengirim. Jawaban masih bisa diubah sebelum dikirim.
          </p>
        )}
      </div>
    </section>
  );
}
