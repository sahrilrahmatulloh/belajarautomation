"use client";

import { useState, useTransition } from "react";

import { submitBugHunt } from "@/app/playground/[slug]/actions";
import PracticePage from "@/components/practice/PracticePage";
import { recordChallengeAttempt } from "@/lib/challengeAttempts";
import { BugFinding, BugHuntResult, PublicChallengeDetail } from "@/types/ChallengeDetail";

import ResultSummary from "./ResultSummary";
import SubmitError from "./SubmitError";

type BugHuntData = Extract<PublicChallengeDetail, { type: "bug-hunt" }>;

function FindingGroup({ title, items }: { title: string; items: BugFinding[] }) {
  if (items.length === 0) return null;

  return (
    <section aria-label={title} className="rounded-2xl border border-border bg-card p-4">
      <h3 className="font-semibold">
        {title} ({items.length})
      </h3>
      <ul className="mt-3 space-y-3">
        {items.map((item) => (
          <li key={item.id} className="text-sm">
            <p className="font-medium">{item.label}</p>
            <p className="mt-0.5 leading-6 text-muted-foreground">{item.explanation}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function BugHuntWorkspace({ slug, data }: { slug: string; data: BugHuntData }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [outcome, setOutcome] = useState<{ result: BugHuntResult; xp: number } | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);
  const [isPending, startTransition] = useTransition();

  const toggle = (id: string) =>
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  const submit = () => {
    setFailed(false);
    startTransition(async () => {
      try {
        const result = await submitBugHunt(slug, selected);
        if (!result) return setFailed(true);
        setOutcome({ result, xp: recordChallengeAttempt(slug, "bug-hunt", result) });
      } catch {
        setFailed(true);
      }
    });
  };

  const retry = () => {
    setOutcome(null);
    setSelected([]);
    // Mengulang juga mengembalikan halaman latihan ke keadaan awal.
    setAttempt((value) => value + 1);
  };

  return (
    <div className="space-y-4">
      {outcome && (
        <ResultSummary
          result={outcome.result}
          xp={outcome.xp}
          detail={`${outcome.result.found.length} bug ditemukan, ${outcome.result.missed.length} terlewat, ${outcome.result.falsePositives.length} salah tandai.`}
          onRetry={retry}
        />
      )}

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <PracticePage key={attempt} pageId={data.practicePage} />

        {outcome ? (
          <div className="space-y-3">
            <FindingGroup title="Bug ditemukan" items={outcome.result.found} />
            <FindingGroup title="Bug terlewat" items={outcome.result.missed} />
            <FindingGroup title="Salah tandai" items={outcome.result.falsePositives} />
          </div>
        ) : (
          <section aria-label="Daftar dugaan temuan" className="space-y-3 rounded-2xl border border-border bg-card p-4">
            <div>
              <h2 className="font-semibold">Dugaan temuan</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Coba halaman latihan, lalu centang yang menurutmu benar-benar bug.
              </p>
            </div>

            <div className="space-y-2">
              {data.findings.map((finding) => (
                <label
                  key={finding.id}
                  className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-border p-3 text-sm transition-colors hover:bg-accent has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(finding.id)}
                    onChange={() => toggle(finding.id)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
                  />
                  {finding.label}
                </label>
              ))}
            </div>

            {failed && <SubmitError />}
            <button
              type="button"
              disabled={selected.length === 0 || isPending}
              onClick={submit}
              className="min-h-11 w-full rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors enabled:hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? "Mengirim..." : "Kirim temuan"}
            </button>
          </section>
        )}
      </div>
    </div>
  );
}
