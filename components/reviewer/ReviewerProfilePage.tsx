"use client";

import Link from "next/link";
import { ClipboardCheck, RotateCcw, SearchCheck, Settings, ThumbsUp } from "lucide-react";

import { initialsOf } from "@/components/admin/useMfaStatus";
import { userName } from "@/components/creator/studio/useCreatorData";
import EmptyState from "@/components/common/EmptyState";
import ContentStatusBadge from "@/components/roles/ContentStatusBadge";
import RoleStatCard from "@/components/roles/RoleStatCard";
import { ROLE_LABELS } from "@/data/navigation";
import { formatContentDate } from "@/lib/content/document";
import { formatNumber } from "@/lib/format";
import { useSession } from "@/lib/session";

import { ownDecisions, reviewQueues, useReviewerData } from "./useReviewerData";

const panelClass = "rounded-2xl border border-border bg-card p-5";
const RECENT_LIMIT = 5;

// Profil Reviewer (PRD FR-15 Profil per mode): identitas tanpa foto, statistik review, dan keputusan
// terakhir. XP, rank, dan kustomisasi tetap di profil Mode Belajar.
export default function ReviewerProfilePage() {
  const session = useSession();
  const { userId, data } = useReviewerData();
  if (!session) return null;

  const contents = data?.contents ?? [];
  const decisions = data ? ownDecisions(data.events, userId) : [];
  const approved = decisions.filter((event) => event.action === "setujui").length;
  const { assigned } = data ? reviewQueues(data, userId) : { assigned: [] };
  const joinedAt = data?.users.find((user) => user.id === userId)?.joinedAt;
  const roles = session.roles.filter((role) => role !== "user");

  const stats = [
    { label: "Direview", value: formatNumber(decisions.length), detail: "Keputusan review yang sudah dibuat", icon: ClipboardCheck, iconStyle: "bg-brand-blue/10 text-brand-blue" },
    { label: "Disetujui", value: formatNumber(approved), detail: "Lolos review", icon: ThumbsUp, iconStyle: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300" },
    { label: "Diminta Revisi", value: formatNumber(decisions.length - approved), detail: "Dikembalikan ke Creator", icon: RotateCcw, iconStyle: "bg-rose-500/10 text-rose-600 dark:text-rose-300" },
    { label: "Sedang Ditugaskan", value: formatNumber(assigned.length), detail: "Menunggu keputusanmu", icon: SearchCheck, iconStyle: "bg-amber-500/10 text-amber-600 dark:text-amber-300" },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="flex items-center gap-4">
        <span aria-hidden="true" className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
          {initialsOf(session.name)}
        </span>
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">{session.name}</h1>
          <p className="text-sm text-muted-foreground">Profil Reviewer</p>
        </div>
      </header>

      <section aria-labelledby="reviewer-info-akun" className={panelClass}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="reviewer-info-akun" className="font-bold">Info Akun</h2>
          <Link href="/reviewer/pengaturan" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-accent hover:underline">
            <Settings className="h-4 w-4" aria-hidden="true" />
            Pengaturan
          </Link>
        </div>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex flex-wrap justify-between gap-x-3 gap-y-1">
            <dt className="text-muted-foreground">Email</dt>
            <dd className="min-w-0 text-right font-medium [overflow-wrap:anywhere]">{session.email}</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-x-3 gap-y-1">
            <dt className="text-muted-foreground">Bergabung</dt>
            <dd className="font-medium">{joinedAt ? formatContentDate(joinedAt) : "–"}</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-x-3 gap-y-1">
            <dt className="text-muted-foreground">Peran</dt>
            <dd className="inline-flex flex-wrap justify-end gap-1.5">
              {roles.map((role) => (
                <span key={role} className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary-accent">{ROLE_LABELS[role]}</span>
              ))}
            </dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="reviewer-statistik">
        <h2 id="reviewer-statistik" className="mb-3 text-lg font-bold">Aktivitas Review</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((stat) => (
            <RoleStatCard key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      <section aria-labelledby="reviewer-keputusan" className={panelClass}>
        <h2 id="reviewer-keputusan" className="font-bold">Keputusan Terakhir</h2>
        {decisions.length > 0 ? (
          <ul className="mt-2 divide-y divide-border">
            {decisions.slice(0, RECENT_LIMIT).map((event) => {
              const content = contents.find((item) => item.id === event.contentId);
              return (
                <li key={event.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{content?.judul ?? "Konten"}</p>
                    <p className="text-xs text-muted-foreground">
                      {userName(data?.users ?? [], content?.authorId ?? null)} · {formatContentDate(event.at)}
                    </p>
                  </div>
                  <ContentStatusBadge status={event.to} />
                </li>
              );
            })}
          </ul>
        ) : (
          <EmptyState title="Belum ada keputusan" description="Konten yang kamu setujui atau kembalikan akan muncul di sini." />
        )}
        <Link href="/reviewer/riwayat" className="mt-4 inline-flex text-sm font-medium text-primary-accent hover:underline">
          Lihat Riwayat Review
        </Link>
      </section>
    </div>
  );
}
