"use client";

import { CheckCircle2, ClipboardCheck, RotateCcw, ShieldCheck } from "lucide-react";

import { getCreatorStats } from "@/components/creator/creatorStats";
import { useCreatorData } from "@/components/creator/studio/useCreatorData";
import { ownDecisions, useReviewerData } from "@/components/reviewer/useReviewerData";
import RoleStatCard from "@/components/roles/RoleStatCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ROLE_LABELS } from "@/data/navigation";
import { useAppearance } from "@/lib/useAppearance";
import { formatContentDate, KIND_LABELS } from "@/lib/content/document";
import { useSession } from "@/lib/session";
import { useViewMode } from "@/lib/viewMode";

const ADMIN_TASKS = ["Menerbitkan konten yang sudah disetujui", "Mengelola peran pengguna"];

const REVIEWER_STATS = (approved: number, returned: number) => [
  {
    label: "Direview",
    value: String(approved + returned),
    detail: "Keputusan review yang sudah dibuat",
    icon: ClipboardCheck,
    iconStyle: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  },
  {
    label: "Disetujui",
    value: String(approved),
    detail: "Lolos review",
    icon: CheckCircle2,
    iconStyle: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
  },
  {
    label: "Diminta Revisi",
    value: String(returned),
    detail: "Dikembalikan ke creator",
    icon: RotateCcw,
    iconStyle: "bg-rose-500/10 text-rose-600 dark:text-rose-300",
  },
];

function StatsSection({ title, stats }: { title: string; stats: ReturnType<typeof REVIEWER_STATS> }) {
  return (
    <section aria-labelledby="statistik-peran">
      <h2 id="statistik-peran" className="text-lg font-bold">
        {title}
      </h2>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 [&>*:last-child:nth-child(odd)]:col-span-2 sm:[&>*:last-child:nth-child(odd)]:col-span-1">
        {stats.map((stat) => (
          <RoleStatCard key={stat.label} {...stat} />
        ))}
      </div>
    </section>
  );
}

function CreatorProfile() {
  const { data } = useCreatorData();
  const contents = data?.contents ?? [];
  const published = contents.filter((content) => content.status === "terbit");

  return (
    <>
      <StatsSection title="Konten per Status" stats={getCreatorStats(contents)} />

      <section aria-labelledby="konten-terbit" className="rounded-2xl border border-border bg-card p-5">
        <h2 id="konten-terbit" className="text-lg font-bold">
          Konten Terbit
        </h2>
        {published.length > 0 ? (
          <ul className="mt-3 divide-y divide-border">
            {published.map((content) => (
              <li key={content.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="font-medium">{content.judul}</p>
                  <p className="text-sm text-muted-foreground">{KIND_LABELS[content.type]}</p>
                </div>
                <span className="text-sm text-muted-foreground">{formatContentDate(content.updatedAt)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">Belum ada konten yang terbit.</p>
        )}
      </section>
    </>
  );
}

function ReviewerProfile() {
  const { userId, data } = useReviewerData();
  const decisions = ownDecisions(data?.events ?? [], userId);
  const approved = decisions.filter((event) => event.action === "setujui").length;

  return <StatsSection title="Aktivitas Review" stats={REVIEWER_STATS(approved, decisions.length - approved)} />;
}

function AdminProfile() {
  return (
    <section aria-labelledby="tugas-admin" className="rounded-2xl border border-border bg-card p-5">
      <h2 id="tugas-admin" className="text-lg font-bold">
        Peran dan Tugas
      </h2>
      <ul className="mt-3 space-y-2.5">
        {ADMIN_TASKS.map((task) => (
          <li key={task} className="flex items-start gap-2.5 text-sm">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary-accent" aria-hidden="true" />
            {task}
          </li>
        ))}
      </ul>
    </section>
  );
}

// Profil saat mode peran (PRD FR-15): identitas yang sama dengan Mode Belajar, tanpa XP,
// rank, achievement, dan membership.
export default function RoleProfile() {
  const { avatar } = useAppearance();
  const session = useSession();
  const { activeRole } = useViewMode();
  if (!session) return null;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-5">
      <header className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
        <Avatar className="h-16 w-16 shrink-0 sm:h-20 sm:w-20">
          <AvatarImage src={avatar.image} alt="" />
          <AvatarFallback>BA</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold tracking-tight">{session.name}</h1>
          <p className="truncate text-sm text-muted-foreground">{session.email}</p>
          <span className="mt-2 inline-flex rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-300">
            {ROLE_LABELS[activeRole]}
          </span>
        </div>
      </header>

      {activeRole === "creator" && <CreatorProfile />}
      {activeRole === "reviewer" && <ReviewerProfile />}
      {activeRole === "admin" && <AdminProfile />}
    </div>
  );
}
