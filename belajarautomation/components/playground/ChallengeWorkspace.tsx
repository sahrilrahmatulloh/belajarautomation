"use client";

import { useState } from "react";
import Link from "next/link";

import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  RotateCcw,
  Send,
  Trophy,
  XCircle,
} from "lucide-react";

import { Challenge } from "@/types/Challenge";
import { ChallengeDetail } from "@/types/ChallengeDetail";

type ChallengeWorkspaceData = Omit<Challenge, "icon">;

interface ChallengeWorkspaceProps {
  challenge: ChallengeWorkspaceData;
  detail: ChallengeDetail;
}

export default function ChallengeWorkspace({
  challenge,
  detail,
}: ChallengeWorkspaceProps) {
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<
    "success" | "failed" | null
  >(null);

  const handleSubmit = () => {
    const normalizedAnswer = answer
      .trim()
      .toLowerCase();

    const normalizedExpectedAnswer =
      detail.expectedAnswer.toLowerCase();

    const isCorrect = normalizedAnswer.includes(
      normalizedExpectedAnswer
    );

    setResult(isCorrect ? "success" : "failed");
  };

  const handleReset = () => {
    setAnswer("");
    setResult(null);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Back */}
      <Link
        href="/playground"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Playground
      </Link>

      {/* Header */}
      <section className="rounded-3xl border border-border bg-card p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <span className="text-sm font-medium text-violet-600 dark:text-violet-400">
              {challenge.category}
            </span>

            <h1 className="mt-2 text-3xl font-bold">
              {challenge.title}
            </h1>

            <p className="mt-2 max-w-2xl text-muted-foreground">
              {challenge.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-muted px-3 py-2 text-xs font-medium">
              {challenge.difficulty}
            </span>

            <span className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-2 text-xs">
              <Clock3 className="h-3.5 w-3.5" />
              {challenge.duration}
            </span>

            <span className="flex items-center gap-1.5 rounded-full bg-violet-500/10 px-3 py-2 text-xs font-medium text-violet-600 dark:text-violet-400">
              <Trophy className="h-3.5 w-3.5" />
              +{challenge.rp} RP
            </span>
          </div>
        </div>
      </section>

      {/* Workspace */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Question */}
        <section className="rounded-3xl border border-border bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Challenge
          </p>

          <h2 className="mt-3 text-xl font-semibold">
            Instruksi
          </h2>

          <p className="mt-3 leading-7 text-muted-foreground">
            {detail.instruction}
          </p>

          <div className="mt-6">
            <h3 className="text-sm font-semibold">
              Requirements
            </h3>

            <div className="mt-3 space-y-3">
              {detail.requirements.map(
                (requirement) => (
                  <div
                    key={requirement}
                    className="flex items-start gap-3 text-sm"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

                    <span>
                      {requirement}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

          {detail.code && (
            <pre className="mt-6 overflow-x-auto rounded-2xl bg-muted p-4 text-sm">
              <code>{detail.code}</code>
            </pre>
          )}
        </section>

        {/* Answer */}
        <section className="flex flex-col rounded-3xl border border-border bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Jawaban Kamu
          </p>

          <textarea
            value={answer}
            onChange={(event) => {
              setAnswer(event.target.value);
              setResult(null);
            }}
            placeholder={detail.placeholder}
            className="mt-4 min-h-[280px] flex-1 resize-none rounded-2xl border border-border bg-background p-4 font-mono text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-violet-500"
          />

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-medium transition-colors hover:bg-accent"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!answer.trim()}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              Submit Jawaban
            </button>
          </div>
        </section>
      </div>

      {/* Success */}
      {result === "success" && (
        <section className="rounded-3xl border border-green-500/30 bg-green-500/5 p-6">
          <div className="flex items-start gap-4">
            <CheckCircle2 className="h-7 w-7 shrink-0 text-green-500" />

            <div>
              <h2 className="text-xl font-bold">
                Challenge Completed!
              </h2>

              <p className="mt-2 text-muted-foreground">
                {detail.successFeedback}
              </p>

              <p className="mt-4 font-semibold text-violet-600 dark:text-violet-400">
                +{challenge.rp} RP
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Failed */}
      {result === "failed" && (
        <section className="rounded-3xl border border-red-500/30 bg-red-500/5 p-6">
          <div className="flex items-start gap-4">
            <XCircle className="h-7 w-7 shrink-0 text-red-500" />

            <div>
              <h2 className="text-xl font-bold">
                Belum Tepat
              </h2>

              <p className="mt-2 text-muted-foreground">
                Periksa kembali requirement challenge
                dan coba lagi.
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}