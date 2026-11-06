import Link from "next/link";
import { ArrowLeft, Clock3, Crown, GraduationCap, ListChecks } from "lucide-react";

import MaintenanceStartGuard from "@/components/maintenance/MaintenanceStartGuard";
import { COURSES } from "@/data/courses";
import { Challenge } from "@/types/Challenge";
import { PublicChallengeDetail } from "@/types/ChallengeDetail";

import { CHALLENGE_TYPES } from "../challengeTypes";
import BugHuntWorkspace from "./BugHuntWorkspace";
import LocatorWorkspace from "./LocatorWorkspace";
import QuizWorkspace from "./QuizWorkspace";
import TestCaseWorkspace from "./TestCaseWorkspace";

interface ChallengeWorkspaceProps {
  challenge: Challenge;
  detail: PublicChallengeDetail;
  locked: boolean;
}

function Body({ slug, detail }: { slug: string; detail: PublicChallengeDetail }) {
  switch (detail.type) {
    case "quiz":
      return <QuizWorkspace slug={slug} data={detail} />;
    case "bug-hunt":
      return <BugHuntWorkspace slug={slug} data={detail} />;
    case "test-case":
      return <TestCaseWorkspace slug={slug} data={detail} />;
    case "locator":
      return <LocatorWorkspace slug={slug} data={detail} />;
  }
}

export default function ChallengeWorkspace({ challenge, detail, locked }: ChallengeWorkspaceProps) {
  const type = CHALLENGE_TYPES[challenge.type];
  const TypeIcon = type.icon;
  const course = COURSES.find((item) => item.slug === challenge.courseSlug);
  const isWide = detail.type === "bug-hunt" || detail.type === "locator";

  return (
    <div className={`mx-auto space-y-5 ${isWide ? "max-w-6xl" : "max-w-3xl"}`}>
      <Link
        href="/playground"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Kembali ke Playground
      </Link>

      <header>
        <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-card px-2.5 py-1 text-xs font-medium text-primary-accent">
          <TypeIcon className="h-3.5 w-3.5" aria-hidden="true" />
          {type.label}
        </span>
        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{challenge.title}</h1>
        <p className="mt-1 text-sm leading-6 text-muted-foreground sm:text-base">{challenge.description}</p>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
          {course && (
            <Link
              href={`/learn/${course.slug}`}
              aria-label={`Course: ${course.title}`}
              className="inline-flex items-center gap-1.5 hover:text-primary-accent"
            >
              <GraduationCap className="h-4 w-4 shrink-0" aria-hidden="true" />
              {course.title}
            </Link>
          )}
          <span>{challenge.difficulty}</span>
          {challenge.questionCount && (
            <span className="inline-flex items-center gap-1.5">
              <ListChecks className="h-4 w-4" aria-hidden="true" />
              {challenge.questionCount} soal
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="h-4 w-4" aria-hidden="true" />
            {challenge.duration}
          </span>
        </div>
      </header>

      {locked ? (
        <section className="flex flex-col gap-3 rounded-2xl border border-amber-400/40 bg-amber-400/10 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-2 text-sm">
            <Crown className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-300" aria-hidden="true" />
            <span>
              <span className="font-semibold">Latihan premium.</span>{" "}
              <span className="text-muted-foreground">
                Latihan ini mengikuti course premium dan tersedia untuk pengguna Pro dan Premium.
              </span>
            </span>
          </p>
          <Link
            href="/membership"
            className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
          >
            Lihat Membership
          </Link>
        </section>
      ) : (
        <MaintenanceStartGuard slug={challenge.slug}>
          <Body slug={challenge.slug} detail={detail} />
        </MaintenanceStartGuard>
      )}
    </div>
  );
}
