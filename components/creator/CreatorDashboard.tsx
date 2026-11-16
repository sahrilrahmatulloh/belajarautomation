"use client";

import Link from "next/link";
import { ChevronRight, FilePen, FilePlus2, Files, MessageSquareText, PartyPopper } from "lucide-react";

import EmptyState from "@/components/common/EmptyState";
import WeeklyChart, { lastWeeks, WeeklyPoint } from "@/components/common/WeeklyChart";
import { useCreatorData } from "@/components/creator/studio/useCreatorData";
import ContentStatusBadge from "@/components/roles/ContentStatusBadge";
import DashboardPanel from "@/components/roles/DashboardPanel";
import RolePreviewNotice from "@/components/roles/RolePreviewNotice";
import RoleStatCard from "@/components/roles/RoleStatCard";
import { formatContentDate, KIND_LABELS } from "@/lib/content/document";
import { latestRoundNotes } from "@/lib/content/rules";
import { formatNumber } from "@/lib/format";
import { useSession } from "@/lib/session";
import { ContentItem } from "@/types/ContentWorkflow";

import { KIND_ICONS, STATUS_STAGES } from "./contentMeta";

const ACTIVITY_WEEKS = 8;
const RECENT_LIMIT = 5;

const stageOf = (status: ContentItem["status"]) => STATUS_STAGES.find((stage) => stage.status === status)!;

// Dashboard Creator (PRD FR-15 Dashboard Creator): ringkasan, alur konten, aktivitas menulis, hal yang
// perlu dikerjakan, dan konten terbaru. Setiap angka membuka Konten Saya yang sudah tersaring.
export default function CreatorDashboard() {
  const session = useSession();
  const { data } = useCreatorData();
  const contents = data?.contents ?? [];
  const now = data?.loadedAt ?? 0;
  const count = (status: ContentItem["status"]) => contents.filter((content) => content.status === status).length;
  const total = contents.length;

  const kpis = [
    { label: "Total Konten", value: total, detail: "Semua status", icon: Files, iconStyle: "bg-brand-blue/10 text-brand-blue", href: "/creator/konten" },
    ...(["perlu-revisi", "menunggu-review", "terbit"] as const).map((status) => {
      const stage = stageOf(status);
      return { label: stage.label, value: count(status), detail: stage.detail, icon: stage.icon, iconStyle: stage.iconStyle, href: `/creator/konten?status=${status}` };
    }),
  ];

  // Hal yang perlu dikerjakan Creator: revisi dengan catatan, lalu draf yang belum dikirim.
  const revisions = contents
    .filter((content) => content.status === "perlu-revisi")
    .map((content) => {
      const notes = latestRoundNotes((data?.notes ?? []).filter((item) => item.contentId === content.id));
      return { content, done: notes.filter((note) => note.markedFixed).length, total: notes.length };
    });
  const drafts = contents.filter((content) => content.status === "draf");

  const activity: WeeklyPoint[] = lastWeeks(now, ACTIVITY_WEEKS).map((week) => {
    const created = contents.filter((content) => Date.parse(content.createdAt) > week.start && Date.parse(content.createdAt) <= week.end);
    return { label: week.label, value: created.length, detail: `${formatNumber(created.length)} konten dibuat` };
  });

  const recent = [...contents].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, RECENT_LIMIT);

  return (
    <div className="mx-auto w-full max-w-[1600px] min-w-0 space-y-6">
      <RolePreviewNotice />

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Halo, Creator!</h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Tulis konten, kirim untuk review, dan pantau sampai terbit{session?.name ? ` · ${session.name}` : ""}.
          </p>
        </div>
        <Link
          href="/creator/buat"
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover sm:w-auto"
        >
          <FilePlus2 className="h-4 w-4" aria-hidden="true" />
          Buat Konten Baru
        </Link>
      </header>

      <section aria-labelledby="creator-stats">
        <h2 id="creator-stats" className="sr-only">Statistik konten</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {kpis.map(({ href, value, ...card }) => (
            <Link key={card.label} href={href} className="rounded-xl transition-shadow hover:shadow-md [&>div]:h-full">
              <RoleStatCard as="div" value={formatNumber(value)} {...card} />
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <DashboardPanel id="alur-konten" title="Alur Konten" description="Posisi semua kontenmu dari draf sampai terbit.">
          {total > 0 ? (
            <>
              {/* Batang tersegmen: lebar tiap tahap sebanding jumlahnya; angka ada di legenda. */}
              <div aria-hidden="true" className="flex h-4 w-full gap-0.5 overflow-hidden rounded-full bg-muted">
                {STATUS_STAGES.filter((stage) => count(stage.status) > 0).map((stage) => (
                  <span key={stage.status} className={`h-full first:rounded-l-full last:rounded-r-full ${stage.barClass}`} style={{ width: `${(count(stage.status) / total) * 100}%` }} />
                ))}
              </div>
              <ul aria-label="Jumlah konten per tahap" className="mt-4 grid gap-1 sm:grid-cols-2">
                {STATUS_STAGES.map(({ status, label, icon: Icon, iconStyle, barClass }) => (
                  <li key={status}>
                    <Link href={`/creator/konten?status=${status}`} className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-accent">
                      <span aria-hidden="true" className={`h-2.5 w-2.5 shrink-0 rounded-full ${barClass}`} />
                      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${iconStyle}`}>
                        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                      <span className="flex-1 text-sm">{label}</span>
                      <span className="text-sm font-bold tabular-nums">{formatNumber(count(status))}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <EmptyState title="Belum ada konten" description="Konten yang kamu buat akan muncul di sini beserta tahapnya." />
          )}
        </DashboardPanel>

        <DashboardPanel id="aktivitas-menulis" title="Konten Dibuat per Minggu" description={`${ACTIVITY_WEEKS} minggu terakhir.`}>
          <WeeklyChart kind="bar" points={activity} formatValue={(value) => `${formatNumber(value)} konten`} formatAxis={formatNumber} label="Jumlah konten yang dibuat per minggu" />
        </DashboardPanel>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-2">
        <DashboardPanel id="perlu-dikerjakan" title="Perlu Dikerjakan" description="Revisi dari reviewer dan draf yang belum dikirim.">
          {revisions.length + drafts.length > 0 ? (
            <ul className="-my-1 divide-y divide-border">
              {revisions.map(({ content, done, total: notes }) => (
                <li key={content.id}>
                  <Link href={`/creator/revisi/${content.id}`} className="flex items-center gap-3 rounded-lg px-1 py-3 transition-colors hover:bg-accent">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-300">
                      <MessageSquareText className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{content.judul}</span>
                      <span className="block text-xs text-muted-foreground">Revisi · {done} dari {notes} catatan selesai</span>
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  </Link>
                </li>
              ))}
              {drafts.map((content) => (
                <li key={content.id}>
                  <Link href={`/creator/buat/artikel?konten=${content.id}`} className="flex items-center gap-3 rounded-lg px-1 py-3 transition-colors hover:bg-accent">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-300">
                      <FilePen className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{content.judul || "Tanpa judul"}</span>
                      <span className="block text-xs text-muted-foreground">Draf · lanjutkan menulis lalu kirim untuk review</span>
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState icon={PartyPopper} title="Semua beres" description="Tidak ada revisi atau draf yang menunggu dikerjakan." />
          )}
        </DashboardPanel>

        <DashboardPanel id="konten-terbaru" title="Konten Terbaru" description="Konten yang terakhir diperbarui.">
          {recent.length > 0 ? (
            <ul aria-label="Konten terbaru" className="-my-1 divide-y divide-border">
              {recent.map((content) => {
                const KindIcon = KIND_ICONS[content.type];
                return (
                  <li key={content.id}>
                    <Link href={`/creator/konten/${content.id}`} className="flex items-center gap-3 rounded-lg px-1 py-3 transition-colors hover:bg-accent">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary-accent">
                        <KindIcon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{content.judul || "Tanpa judul"}</span>
                        <span className="block text-xs text-muted-foreground">{KIND_LABELS[content.type]} · {formatContentDate(content.updatedAt)}</span>
                      </span>
                      <ContentStatusBadge status={content.status} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <EmptyState title="Belum ada konten" description="Mulai dengan menulis konten pertamamu." />
          )}
          <Link href="/creator/konten" className="mt-4 inline-flex text-sm font-medium text-primary-accent hover:underline">
            Lihat semua konten
          </Link>
        </DashboardPanel>
      </div>
    </div>
  );
}
