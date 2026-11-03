"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock3,
  GraduationCap,
  ListChecks,
  RotateCcw,
  XCircle,
} from "lucide-react";

import ContentCover from "@/components/common/ContentCover";
import { COURSES } from "@/data/courses";
import { useChallengeProgress } from "@/lib/challengeAttempts";
import { Challenge, ChallengeDifficulty } from "@/types/Challenge";

import { CHALLENGE_TYPES } from "./challengeTypes";

const LEVEL_STYLES: Record<ChallengeDifficulty, string> = {
  Beginner: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  Intermediate: "bg-amber-500/10 text-amber-800 dark:text-amber-300",
  Advanced: "bg-red-500/10 text-red-700 dark:text-red-300",
};

const primaryAction = "bg-primary text-primary-foreground hover:bg-primary-hover";

const STATUS = {
  "not-started": {
    label: "Belum dikerjakan",
    icon: Circle,
    badge: "bg-muted text-muted-foreground",
    action: "Mulai Latihan",
    actionIcon: ArrowRight,
    actionStyle: primaryAction,
  },
  passed: {
    label: "Lulus",
    icon: CheckCircle2,
    badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    action: "Ulangi",
    actionIcon: RotateCcw,
    actionStyle: "border border-primary/40 text-primary-accent hover:bg-primary/10",
  },
  failed: {
    label: "Belum lulus",
    icon: XCircle,
    badge: "bg-amber-500/10 text-amber-800 dark:text-amber-300",
    action: "Coba Lagi",
    actionIcon: RotateCcw,
    actionStyle: primaryAction,
  },
};

interface ChallengeCardProps {
  challenge: Challenge;
}

// Tata letak mengikuti lebar kartu, bukan lebar layar: sampul di atas pada kartu
// sempit, di kiri mulai @md, dan kolom aksi pindah ke kanan mulai @lg.
export default function ChallengeCard({ challenge }: ChallengeCardProps) {
  const type = CHALLENGE_TYPES[challenge.type];
  const TypeIcon = type.icon;
  const course = COURSES.find((item) => item.slug === challenge.courseSlug);
  const { status: statusKey, lastScore } = useChallengeProgress(challenge.slug);
  const status = STATUS[statusKey];
  const StatusIcon = status.icon;
  const ActionIcon = status.actionIcon;

  return (
    <article className="@container rounded-2xl border border-border bg-card p-3 transition-colors duration-150 hover:border-primary/30">
      <div className="grid h-full gap-3 @md:grid-cols-[7.5rem_minmax(0,1fr)] @md:gap-x-4 @lg:grid-cols-[8.5rem_minmax(0,1fr)_8.5rem] @lg:items-center">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted @md:row-span-2 @md:aspect-[4/3] @md:self-center @lg:row-span-1">
          <ContentCover
            src={challenge.cover ?? course?.cover}
            title={challenge.title}
            category={type.label}
            kind="course"
            alt=""
            sizes="(max-width: 448px) 100vw, 136px"
          />
        </div>

        <div className="min-w-0">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary-accent">
            <TypeIcon className="h-3 w-3" aria-hidden="true" />
            {type.label}
          </span>

          <h2 className="mt-1.5 font-semibold leading-snug">{challenge.title}</h2>

          <p className="mt-1 line-clamp-2 text-sm leading-5 text-muted-foreground">
            {challenge.description}
          </p>

          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
            {course && (
              <Link
                href={`/learn/${course.slug}`}
                aria-label={`Course: ${course.title}`}
                title={course.title}
                className="inline-flex min-w-0 max-w-full items-center gap-1 rounded-full border border-border px-2 py-0.5 transition-colors hover:border-primary/40 hover:text-primary-accent"
              >
                <GraduationCap className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{course.title}</span>
              </Link>
            )}

            <span className={`rounded-full px-2 py-0.5 font-medium ${LEVEL_STYLES[challenge.difficulty]}`}>
              {challenge.difficulty}
            </span>

            {challenge.questionCount && (
              <span className="inline-flex items-center gap-1">
                <ListChecks className="h-3.5 w-3.5" aria-hidden="true" />
                {challenge.questionCount} soal
              </span>
            )}

            <span className="inline-flex items-center gap-1">
              <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
              {challenge.duration}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 @lg:flex-col @lg:items-stretch @lg:justify-center">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 @lg:flex-col">
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${status.badge}`}>
              <StatusIcon className="h-3.5 w-3.5" aria-hidden="true" />
              {status.label}
            </span>
            {lastScore !== undefined && (
              <span className="text-xs text-muted-foreground">Skor terakhir {lastScore}%</span>
            )}
          </div>

          <Link
            href={`/playground/${challenge.slug}`}
            aria-label={`${status.action}: ${challenge.title}`}
            className={`inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl px-3 text-sm font-semibold transition-colors ${status.actionStyle}`}
          >
            {status.action}
            <ActionIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
