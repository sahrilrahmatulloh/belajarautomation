"use client";

import { useState, useTransition } from "react";

import { revealTestCase, submitTestCaseCheck } from "@/app/playground/[slug]/actions";
import { recordChallengeAttempt } from "@/lib/challengeAttempts";
import { ChallengeScore, PublicChallengeDetail, TestCaseReveal } from "@/types/ChallengeDetail";

import ResultSummary from "./ResultSummary";
import SubmitError from "./SubmitError";

type TestCaseData = Extract<PublicChallengeDetail, { type: "test-case" }>;

const MAX_ANSWER_LENGTH = 5000;
const FORMAT_EXAMPLE = `Judul: ...
Prasyarat: ...
Langkah:
1. ...
2. ...
Hasil yang diharapkan: ...`;

const primaryButton =
  "min-h-11 w-full rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors enabled:hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50";

export default function TestCaseWorkspace({ slug, data }: { slug: string; data: TestCaseData }) {
  const [answer, setAnswer] = useState("");
  const [reveal, setReveal] = useState<TestCaseReveal | null>(null);
  const [checked, setChecked] = useState<string[]>([]);
  const [outcome, setOutcome] = useState<{ result: ChallengeScore; xp: number } | null>(null);
  const [failed, setFailed] = useState(false);
  const [isPending, startTransition] = useTransition();

  const run = (task: () => Promise<boolean>) => {
    setFailed(false);
    startTransition(async () => {
      try {
        if (!(await task())) setFailed(true);
      } catch {
        setFailed(true);
      }
    });
  };

  const submitAnswer = () =>
    run(async () => {
      const revealed = await revealTestCase(slug, answer);
      setReveal(revealed);
      return Boolean(revealed);
    });

  const submitCheck = () =>
    run(async () => {
      const result = await submitTestCaseCheck(slug, checked);
      if (!result) return false;
      setOutcome({ result, xp: recordChallengeAttempt(slug, "test-case", result) });
      return true;
    });

  const retry = () => {
    setAnswer("");
    setReveal(null);
    setChecked([]);
    setOutcome(null);
  };

  return (
    <div className="space-y-4">
      {outcome && reveal && (
        <ResultSummary
          result={outcome.result}
          xp={outcome.xp}
          detail={`${checked.length} dari ${reveal.checklist.length} poin kamu centang. Lulus jika semua poin wajib tercentang.`}
          onRetry={retry}
        />
      )}

      <section aria-label="Kebutuhan fitur" className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <h2 className="font-semibold">Kebutuhan fitur</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted-foreground">
          {data.requirement.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      {reveal ? (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <section aria-label="Jawaban kamu" className="min-w-0 rounded-2xl border border-border bg-card p-4 sm:p-5">
              <h2 className="font-semibold">Jawaban kamu</h2>
              <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6">{answer}</p>
            </section>
            <section aria-label="Contoh jawaban" className="min-w-0 rounded-2xl border border-border bg-card p-4 sm:p-5">
              <h2 className="font-semibold">Contoh jawaban</h2>
              <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6">{reveal.sampleAnswer}</p>
            </section>
          </div>

          <section aria-label="Checklist penilaian" className="space-y-3 rounded-2xl border border-border bg-card p-4 sm:p-5">
            <div>
              <h2 className="font-semibold">Checklist penilaian mandiri</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Ini penilaian mandiri: bandingkan jawabanmu dengan contoh, lalu centang poin yang
                benar-benar terpenuhi. Sistem tidak memeriksa isi jawabanmu.
              </p>
            </div>

            <div className="space-y-2">
              {reveal.checklist.map((item) => (
                <label key={item.id} className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-border p-3 text-sm">
                  <input
                    type="checkbox"
                    disabled={Boolean(outcome)}
                    checked={checked.includes(item.id)}
                    onChange={() =>
                      setChecked((current) =>
                        current.includes(item.id) ? current.filter((id) => id !== item.id) : [...current, item.id]
                      )
                    }
                    className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
                  />
                  <span className="min-w-0 flex-1">
                    {item.label}{" "}
                    <span className="text-xs font-medium text-muted-foreground">
                      ({item.required ? "wajib" : "opsional"})
                    </span>
                  </span>
                </label>
              ))}
            </div>

            {!outcome && (
              <>
                {failed && <SubmitError />}
                <button type="button" disabled={isPending} onClick={submitCheck} className={primaryButton}>
                  {isPending ? "Mengirim..." : "Selesai menilai"}
                </button>
              </>
            )}
          </section>
        </>
      ) : (
        <section aria-label="Jawaban test case" className="space-y-3 rounded-2xl border border-border bg-card p-4 sm:p-5">
          <div>
            <label htmlFor="test-case-answer" className="font-semibold">
              Tulis test case kamu
            </label>
            <p className="mt-1 text-xs text-muted-foreground">Contoh format:</p>
            <pre tabIndex={0} className="mt-1 overflow-x-auto rounded-xl bg-muted/60 p-3 text-xs leading-5 text-muted-foreground">
              {FORMAT_EXAMPLE}
            </pre>
          </div>

          <textarea
            id="test-case-answer"
            rows={10}
            maxLength={MAX_ANSWER_LENGTH}
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            className="w-full rounded-xl border border-input bg-background p-3 text-sm leading-6 outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 dark:bg-input/30"
          />

          {failed && <SubmitError />}
          <button type="button" disabled={!answer.trim() || isPending} onClick={submitAnswer} className={primaryButton}>
            {isPending ? "Mengirim..." : "Kirim jawaban"}
          </button>
        </section>
      )}
    </div>
  );
}
