"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, ChevronDown, FileSearch, Hand, History, Inbox, ListChecks, RotateCcw, SearchCheck, ThumbsUp } from "lucide-react";

import EmptyState from "@/components/common/EmptyState";
import WeeklyChart, { lastWeeks, WeeklyPoint } from "@/components/common/WeeklyChart";
import { KIND_ICONS } from "@/components/creator/contentMeta";
import { userName } from "@/components/creator/studio/useCreatorData";
import FilterChips from "@/components/filters/FilterChips";
import ComingSoonButton from "@/components/roles/ComingSoonButton";
import ContentStatusBadge from "@/components/roles/ContentStatusBadge";
import DashboardPanel from "@/components/roles/DashboardPanel";
import RolePreviewNotice from "@/components/roles/RolePreviewNotice";
import RoleStatCard from "@/components/roles/RoleStatCard";
import { REVIEW_GUIDELINES } from "@/data/reviewGuidelines";
import { runContentAction } from "@/lib/content";
import { formatContentDate, KIND_LABELS } from "@/lib/content/document";
import { isDev } from "@/lib/env";
import { formatNumber } from "@/lib/format";
import { useSession } from "@/lib/session";
import { ContentItem } from "@/types/ContentWorkflow";

import { ownDecisions, reviewQueues, useReviewerData, waitingDays } from "./useReviewerData";

const RECENT_LIMIT = 5;
// Sama dengan batas "menunggu lama" di Dashboard Admin (PRD FR-16 A).
const LONG_WAIT_DAYS = 3;
const DECISION_WEEKS = 8;

type QueueFilter = "" | "ditugaskan" | "belum";

// Dashboard Reviewer (PRD FR-15 Dashboard Reviewer): antrean yang bisa disaring dan diambil langsung,
// hasil dan keputusan review per minggu, aktivitas terakhir, serta checklist panduan.
export default function ReviewerDashboard() {
  const session = useSession();
  const router = useRouter();
  const { userId, data } = useReviewerData();
  const [filter, setFilter] = useState<QueueFilter>("");
  const [error, setError] = useState("");
  const [claiming, setClaiming] = useState<string | null>(null);

  const contents = data?.contents ?? [];
  const users = data?.users ?? [];
  const events = data?.events ?? [];
  const now = data?.loadedAt ?? 0;
  const { assigned, unassigned } = reviewQueues({ contents, events }, userId);
  // Konten sendiri tidak masuk antrean.
  const claimable = unassigned.filter((content) => content.authorId !== userId);
  const decisions = ownDecisions(events, userId);
  const approved = decisions.filter((event) => event.action === "setujui").length;
  const returned = decisions.length - approved;
  const queue = filter === "ditugaskan" ? assigned : filter === "belum" ? claimable : [...assigned, ...claimable];

  const kpis = [
    { label: "Ditugaskan ke Saya", value: assigned.length, detail: "Sedang kamu periksa", icon: SearchCheck, iconStyle: "bg-amber-500/10 text-amber-600 dark:text-amber-300", href: "/reviewer/antrean" },
    { label: "Belum Ditugaskan", value: claimable.length, detail: "Bisa diambil untuk review", icon: Inbox, iconStyle: "bg-brand-blue/10 text-brand-blue", href: "/reviewer/antrean?tab=belum" },
    { label: "Disetujui", value: approved, detail: "Keputusan setuju darimu", icon: ThumbsUp, iconStyle: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300", href: "/reviewer/riwayat" },
    { label: "Diminta Revisi", value: returned, detail: "Dikembalikan ke Creator", icon: RotateCcw, iconStyle: "bg-rose-500/10 text-rose-600 dark:text-rose-300", href: "/reviewer/riwayat" },
  ];

  const weekly: WeeklyPoint[] = lastWeeks(now, DECISION_WEEKS).map((week) => {
    const inWeek = decisions.filter((event) => Date.parse(event.at) > week.start && Date.parse(event.at) <= week.end);
    const ok = inWeek.filter((event) => event.action === "setujui").length;
    return { label: week.label, value: inWeek.length, detail: `${ok} disetujui · ${inWeek.length - ok} diminta revisi` };
  });

  const claim = async (content: ContentItem) => {
    setClaiming(content.id);
    const result = await runContentAction((repository) => repository.claimReview(userId, content.id));
    setClaiming(null);
    if (result.ok) router.push(`/reviewer/review/${content.id}`);
    else setError(result.message);
  };

  const approvedShare = decisions.length > 0 ? Math.round((approved / decisions.length) * 100) : 0;

  return (
    <div className="mx-auto w-full max-w-[1600px] min-w-0 space-y-6">
      <RolePreviewNotice />

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Halo, Reviewer!</h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Periksa konten Creator sebelum terbit. Konten milikmu sendiri tidak masuk antreanmu{session?.name ? ` · ${session.name}` : ""}.
          </p>
        </div>
        <Link
          href="/reviewer/antrean"
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover sm:w-auto"
        >
          <Inbox className="h-4 w-4" aria-hidden="true" />
          Buka Antrean
        </Link>
      </header>

      <section aria-label="Statistik review">
        <h2 className="sr-only">Statistik review</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {kpis.map(({ href, value, ...card }) => (
            <Link key={card.label} href={href} className="rounded-xl transition-shadow hover:shadow-md [&>div]:h-full">
              <RoleStatCard as="div" value={formatNumber(value)} {...card} />
            </Link>
          ))}
        </div>
      </section>

      {error && <p role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <DashboardPanel id="review-queue" title="Antrean Review" description="Yang ditugaskan kepadamu di atas, lalu yang paling lama menunggu.">
          <FilterChips
            label="Saring antrean"
            layout="scroll"
            options={[
              { value: "", label: `Semua (${assigned.length + claimable.length})` },
              { value: "ditugaskan", label: `Ditugaskan ke saya (${assigned.length})` },
              { value: "belum", label: `Belum ditugaskan (${claimable.length})` },
            ]}
            active={filter}
            onChange={(value) => setFilter(value as QueueFilter)}
          />
          {queue.length > 0 ? (
            <ul aria-label="Antrean review" className="mt-3 divide-y divide-border">
              {queue.map((content) => {
                const KindIcon = KIND_ICONS[content.type];
                const days = waitingDays(content, now);
                const isLong = days > LONG_WAIT_DAYS;
                const isMine = content.reviewerId === userId;
                return (
                  <li key={content.id} className="flex flex-wrap items-center gap-3 py-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary-accent">
                      <KindIcon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1 basis-48">
                      <p className="text-sm font-medium">{content.judul}</p>
                      <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                        <span>{KIND_LABELS[content.type]} · {userName(users, content.authorId)}</span>
                        <span className={`rounded-full px-2 py-0.5 font-semibold ${isLong ? "bg-rose-500/10 text-rose-700 dark:text-rose-300" : "bg-muted"}`}>
                          Menunggu {days} hari
                        </span>
                        {!isMine && <span className="rounded-full bg-brand-blue/10 px-2 py-0.5 font-semibold text-brand-blue">Belum ditugaskan</span>}
                      </p>
                    </div>
                    {!isDev ? (
                      <ComingSoonButton label="Mulai Review" variant="outline" size="sm" ariaLabel={`Mulai review ${content.judul}`} />
                    ) : isMine ? (
                      <Link
                        href={`/reviewer/review/${content.id}`}
                        aria-label={`Buka review ${content.judul}`}
                        className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
                      >
                        <FileSearch className="h-3.5 w-3.5" aria-hidden="true" />
                        Review
                      </Link>
                    ) : (
                      <button
                        type="button"
                        aria-label={`Ambil untuk review ${content.judul}`}
                        disabled={claiming !== null}
                        onClick={() => void claim(content)}
                        className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-semibold transition-colors hover:bg-accent disabled:opacity-60"
                      >
                        <Hand className="h-3.5 w-3.5" aria-hidden="true" />
                        {claiming === content.id ? "Mengambil..." : "Ambil"}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <EmptyState title="Antrean kosong" description="Belum ada konten yang cocok. Konten baru dari Creator akan muncul di sini." />
          )}
        </DashboardPanel>

        <div className="space-y-5">
          <DashboardPanel id="hasil-review" title="Hasil Review" description="Perbandingan keputusanmu.">
            {decisions.length > 0 ? (
              <>
                <div aria-hidden="true" className="flex h-4 w-full gap-0.5 overflow-hidden rounded-full bg-muted">
                  {approved > 0 && <span className="h-full rounded-l-full bg-[#0ea5e9] dark:bg-[#0284c7]" style={{ width: `${approvedShare}%` }} />}
                  {returned > 0 && <span className="h-full rounded-r-full bg-[#f43f5e] dark:bg-[#db2777]" style={{ width: `${100 - approvedShare}%` }} />}
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#0ea5e9] dark:bg-[#0284c7]" />
                    <dt>Disetujui</dt>
                    <dd className="ml-auto font-bold tabular-nums">{approved} ({approvedShare}%)</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#f43f5e] dark:bg-[#db2777]" />
                    <dt>Diminta revisi</dt>
                    <dd className="ml-auto font-bold tabular-nums">{returned} ({100 - approvedShare}%)</dd>
                  </div>
                </dl>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Belum ada keputusan review.</p>
            )}
          </DashboardPanel>

          <DashboardPanel id="keputusan-mingguan" title="Keputusan per Minggu" description={`${DECISION_WEEKS} minggu terakhir.`}>
            <WeeklyChart kind="bar" points={weekly} formatValue={(value) => `${formatNumber(value)} keputusan`} formatAxis={formatNumber} label="Jumlah keputusan review per minggu" />
          </DashboardPanel>
        </div>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-2">
        <DashboardPanel id="review-activity" title="Aktivitas Review Terakhir">
          {decisions.length > 0 ? (
            <ul className="-my-1 divide-y divide-border">
              {decisions.slice(0, RECENT_LIMIT).map((event) => {
                const content = contents.find((item) => item.id === event.contentId);
                return (
                  <li key={event.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{content?.judul}</p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                        {event.action === "setujui" ? <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> : <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />}
                        {userName(users, content?.authorId ?? null)} · {formatContentDate(event.at)}
                      </p>
                    </div>
                    <ContentStatusBadge status={event.to} />
                  </li>
                );
              })}
            </ul>
          ) : (
            <EmptyState icon={History} title="Belum ada aktivitas" description="Riwayat konten yang kamu setujui atau kembalikan akan muncul di sini." />
          )}
          <Link href="/reviewer/riwayat" className="mt-4 inline-flex text-sm font-medium text-primary-accent hover:underline">
            Lihat Riwayat Review
          </Link>
        </DashboardPanel>

        <DashboardPanel id="review-guidelines" title="Checklist Panduan Review" description="Pastikan setiap poin terpenuhi sebelum menyetujui konten.">
          {/* Dapat dibuka-tutup agar dashboard ringkas; terbuka di layar lebar secara bawaan. */}
          <details className="group" open>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-2 rounded-lg px-1 py-1 text-sm font-medium hover:bg-accent [&::-webkit-details-marker]:hidden">
              <span className="inline-flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-primary-accent" aria-hidden="true" />
                {REVIEW_GUIDELINES.length} poin pemeriksaan
              </span>
              <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" />
            </summary>
            <ul className="mt-3 space-y-3">
              {REVIEW_GUIDELINES.map((guideline) => (
                <li key={guideline} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary-accent" aria-hidden="true" />
                  {guideline}
                </li>
              ))}
            </ul>
          </details>
          <Link href="/reviewer/panduan" className="mt-4 inline-flex text-sm font-medium text-primary-accent hover:underline">
            Buka Panduan Review lengkap
          </Link>
        </DashboardPanel>
      </div>
    </div>
  );
}
