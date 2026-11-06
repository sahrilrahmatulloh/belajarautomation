"use client";

import { useRef, useState, useTransition } from "react";

import { submitLocator } from "@/app/playground/[slug]/actions";
import PendingSubmitNotice from "@/components/maintenance/PendingSubmitNotice";
import { useProtectedSubmit } from "@/components/maintenance/useProtectedSubmit";
import PracticePage from "@/components/practice/PracticePage";
import { Input } from "@/components/ui/input";
import { recordChallengeAttempt } from "@/lib/challengeAttempts";
import { useChallengeDraft } from "@/lib/challengeDrafts";
import { runSelector } from "@/lib/runSelector";
import { LocatorResult, PublicChallengeDetail, SelectorType } from "@/types/ChallengeDetail";

import ResultSummary from "./ResultSummary";
import SubmitError from "./SubmitError";

type LocatorData = Extract<PublicChallengeDetail, { type: "locator" }>;

const SELECTOR_LABELS: Record<SelectorType, { label: string; placeholder: string }> = {
  css: { label: "CSS", placeholder: "Contoh: form input.nama-kelas" },
  xpath: { label: "XPath", placeholder: "Contoh: //form//input[@name='nama']" },
};

const OUTCOME_MESSAGES: Record<LocatorResult["outcome"], (count: number) => string> = {
  target: () => "Selector tepat mengenai elemen target saja.",
  none: () => "Selector tidak mengenai elemen apa pun.",
  multiple: (count) => `Selector mengenai ${count} elemen. Harus hanya elemen target.`,
  wrong: () => "Selector mengenai satu elemen, tetapi bukan elemen target.",
};

const MATCH_ATTRIBUTE = "data-practice-match";

export default function LocatorWorkspace({ slug, data }: { slug: string; data: LocatorData }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const draft = useChallengeDraft(slug, { selectorType: data.selectorTypes[0], selector: "" }, (state) => `selector "${state.selector}" tertulis`);
  const { selectorType, selector } = draft.state;
  const setSelectorType = (value: SelectorType) => draft.setState((state) => ({ ...state, selectorType: value }));
  const setSelector = (value: string) => draft.setState((state) => ({ ...state, selector: value }));
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [outcome, setOutcome] = useState<{ result: LocatorResult; xp: number } | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);
  const [isPending, startTransition] = useTransition();

  const clearHighlight = () => {
    rootRef.current
      ?.querySelectorAll(`[${MATCH_ATTRIBUTE}]`)
      .forEach((element) => element.removeAttribute(MATCH_ATTRIBUTE));
  };

  // Menjalankan selector, menyorot hasilnya, dan mengembalikan elemen yang cocok.
  const test = () => {
    const root = rootRef.current;
    if (!root) return null;

    clearHighlight();
    const run = runSelector(root, selectorType, selector);
    if (!run.ok) {
      setMessage({ text: run.message, isError: true });
      return null;
    }

    run.elements.forEach((element) => element.setAttribute(MATCH_ATTRIBUTE, ""));
    setMessage({ text: `${run.elements.length} elemen cocok.`, isError: false });
    return run.elements;
  };

  const submit = () => {
    const elements = test();
    if (!elements) return;

    setFailed(false);
    startTransition(async () => {
      try {
        const matchedIds = elements.map((element) => element.getAttribute("data-practice-id") ?? "");
        const result = await submitLocator(slug, matchedIds);
        if (!result) return setFailed(true);
        setOutcome({ result, xp: recordChallengeAttempt(slug, "locator", result) });
        draft.clear();
      } catch {
        setFailed(true);
      }
    });
  };

  const protectedSubmit = useProtectedSubmit(draft, submit);

  const retry = () => {
    clearHighlight();
    setOutcome(null);
    setMessage(null);
    draft.clear();
    setAttempt((value) => value + 1);
  };

  return (
    <div className="space-y-4">
      {outcome && (
        <ResultSummary
          result={outcome.result}
          xp={outcome.xp}
          detail={OUTCOME_MESSAGES[outcome.result.outcome](outcome.result.matchCount)}
          onRetry={retry}
        />
      )}

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <PracticePage key={attempt} pageId={data.practicePage} rootRef={rootRef} />

        <section aria-label="Tulis selector" className="space-y-4 rounded-2xl border border-border bg-card p-4">
          <div>
            <h2 className="font-semibold">Elemen target</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{data.targetDescription}</p>
          </div>

          <fieldset>
            <legend className="mb-2 text-sm font-medium">Jenis selector</legend>
            <div className="flex gap-4">
              {data.selectorTypes.map((type) => (
                <label key={type} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="jenis-selector"
                    disabled={Boolean(outcome)}
                    checked={selectorType === type}
                    onChange={() => {
                      clearHighlight();
                      setMessage(null);
                      setSelectorType(type);
                    }}
                    className="h-4 w-4 accent-primary"
                  />
                  {SELECTOR_LABELS[type].label}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="space-y-1.5">
            <label htmlFor="locator-selector" className="text-sm font-medium">
              Selector
            </label>
            <Input
              id="locator-selector"
              spellCheck={false}
              autoComplete="off"
              disabled={Boolean(outcome)}
              placeholder={SELECTOR_LABELS[selectorType].placeholder}
              value={selector}
              onChange={(event) => {
                clearHighlight();
                setMessage(null);
                setSelector(event.target.value);
              }}
              className="font-mono"
            />
          </div>

          {message && (
            <p
              role={message.isError ? "alert" : "status"}
              className={`text-sm font-medium ${message.isError ? "text-destructive" : ""}`}
            >
              {message.text}
            </p>
          )}

          {!outcome && (
            <>
              {failed && <SubmitError />}
              {draft.isPendingSubmit && <PendingSubmitNotice />}
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={!selector.trim() || isPending}
                  onClick={test}
                  className="min-h-11 flex-1 rounded-xl border border-border px-3 text-sm font-semibold transition-colors enabled:hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Uji selector
                </button>
                <button
                  type="button"
                  disabled={!selector.trim() || isPending || draft.isPendingSubmit}
                  onClick={protectedSubmit}
                  className="min-h-11 flex-1 rounded-xl bg-primary px-3 text-sm font-semibold text-primary-foreground transition-colors enabled:hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isPending ? "Mengirim..." : "Kirim"}
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
