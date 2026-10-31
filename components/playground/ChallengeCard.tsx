import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Trophy,
} from "lucide-react";

import { Challenge } from "@/types/Challenge";

const categoryAccents: Record<string, { surface: string; icon: string; label: string }> = {
  Locator: {
    surface: "bg-brand-blue/10",
    icon: "text-brand-blue",
    label: "text-brand-blue",
  },
  "Test Case": {
    surface: "bg-brand-cyan/10",
    icon: "text-brand-cyan",
    label: "text-brand-cyan",
  },
  "Bug Hunt": {
    surface: "bg-brand-indigo/10",
    icon: "text-brand-indigo",
    label: "text-brand-indigo",
  },
  API: {
    surface: "bg-brand-sky/10",
    icon: "text-brand-sky",
    label: "text-brand-sky",
  },
  Automation: {
    surface: "bg-brand-blue/10",
    icon: "text-brand-blue",
    label: "text-brand-blue",
  },
  AI: {
    surface: "bg-brand-cyan/10",
    icon: "text-brand-cyan",
    label: "text-brand-cyan",
  },
};

interface ChallengeCardProps {
  challenge: Challenge;
}

export default function ChallengeCard({
  challenge,
}: ChallengeCardProps) {
  const Icon = challenge.icon;
  const accent = categoryAccents[challenge.category] ?? categoryAccents.Locator;

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition-all duration-150 hover:border-primary/30 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${accent.surface}`}>
          <Icon className={`h-6 w-6 ${accent.icon}`} />
        </div>

        {challenge.completed && (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        )}
      </div>

      <div className="mt-5 flex-1">
        <span className={`text-xs font-medium ${accent.label}`}>
          {challenge.category}
        </span>

        <h3 className="mt-2 text-lg font-semibold">
          {challenge.title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {challenge.description}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="rounded-full bg-muted px-3 py-1.5">
          {challenge.difficulty}
        </span>

        <span className="flex items-center gap-1">
          <Clock3 className="h-3.5 w-3.5" />
          {challenge.duration}
        </span>

        <span className="flex items-center gap-1 font-medium text-primary">
          <Trophy className="h-3.5 w-3.5" />
          +{challenge.rp} RP
        </span>
      </div>

      <Link
        href={`/playground/${challenge.slug}`}
        className="mt-6 flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm font-medium transition-colors hover:bg-accent"
      >
        {challenge.completed
          ? "Main Lagi"
          : "Mulai Challenge"}

        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </article>
  );
}
