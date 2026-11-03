"use client";

import Link from "next/link";
import { CheckCircle2, ClipboardCheck, History, Inbox, RotateCcw, SearchCheck, ThumbsUp } from "lucide-react";

import EmptyState from "@/components/common/EmptyState";
import { userName } from "@/components/creator/studio/useCreatorData";
import ComingSoonButton from "@/components/roles/ComingSoonButton";
import ContentStatusBadge from "@/components/roles/ContentStatusBadge";
import DashboardPanel from "@/components/roles/DashboardPanel";
import RoleGreeting from "@/components/roles/RoleGreeting";
import RolePreviewNotice from "@/components/roles/RolePreviewNotice";
import RoleStatCard from "@/components/roles/RoleStatCard";
import { REVIEW_GUIDELINES } from "@/data/reviewGuidelines";
import { formatContentDate, KIND_LABELS } from "@/lib/content/document";
import { isDev } from "@/lib/env";
import { useSession } from "@/lib/session";

import { ownDecisions, reviewQueues, useReviewerData, waitingDays } from "./useReviewerData";

const RECENT_LIMIT = 5;

export default function ReviewerDashboard() {
  const session = useSession();
  const { userId, data } = useReviewerData();
  const contents = data?.contents ?? [];
  const users = data?.users ?? [];
  const events = data?.events ?? [];
  const { assigned, unassigned } = reviewQueues({ contents, events }, userId);
  const decisions = ownDecisions(events, userId);
  const countDecisions = (action: string) => String(decisions.filter((event) => event.action === action).length);
  // Konten sendiri tidak masuk antrean.
  const queue = [...assigned, ...unassigned.filter((content) => content.authorId !== userId)];

  const stats = [
    { label: "Ditugaskan ke Saya", value: String(assigned.length), detail: "Sedang kamu periksa", icon: SearchCheck, iconStyle: "bg-amber-500/10 text-amber-600 dark:text-amber-300" },
    { label: "Belum Ditugaskan", value: String(unassigned.length), detail: "Bisa diambil untuk review", icon: Inbox, iconStyle: "bg-brand-blue/10 text-brand-blue" },
    { label: "Disetujui", value: countDecisions("setujui"), detail: "Keputusan setuju darimu", icon: ThumbsUp, iconStyle: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300" },
    { label: "Diminta Revisi", value: countDecisions("minta-revisi"), detail: "Dikembalikan ke Creator", icon: RotateCcw, iconStyle: "bg-rose-500/10 text-rose-600 dark:text-rose-300" },
  ];

  return (
    <div className="mx-auto w-full max-w-[1600px] min-w-0 space-y-5 lg:space-y-6">
      <RolePreviewNotice />

      <RoleGreeting
        title="Halo, Reviewer!"
        description="Periksa akurasi dan kualitas konten dari Creator sebelum diterbitkan. Konten milikmu sendiri tidak masuk antreanmu."
        icon={ClipboardCheck}
        meta={`Masuk sebagai ${session?.name ?? ""}`}
      />

      <section aria-label="Statistik review" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <h2 className="sr-only">Statistik review</h2>
        {stats.map((stat) => <RoleStatCard key={stat.label} {...stat} />)}
      </section>

      <DashboardPanel id="review-queue" title="Antrean Review" description="Diurutkan dari yang ditugaskan kepadamu, lalu yang paling lama menunggu.">
        {queue.length > 0 ? (
          <div role="group" tabIndex={0} aria-label="Tabel antrean review" className="relative -mx-4 overflow-x-auto sm:-mx-5">
            <table className="w-full min-w-[680px] text-left text-sm">
              <caption className="sr-only">Antrean konten yang menunggu review</caption>
              <thead className="border-y border-border bg-muted/40 text-xs text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-2.5 font-medium sm:px-5">Judul</th>
                  <th scope="col" className="px-3 py-2.5 font-medium">Jenis</th>
                  <th scope="col" className="px-3 py-2.5 font-medium">Creator</th>
                  <th scope="col" className="px-3 py-2.5 font-medium">Menunggu</th>
                  <th scope="col" className="px-4 py-2.5 font-medium sm:px-5"><span className="sr-only">Aksi</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {queue.map((content) => (
                  <tr key={content.id}>
                    <th scope="row" className="px-4 py-3 font-medium sm:px-5">{content.judul}</th>
                    <td className="px-3 py-3 text-muted-foreground">{KIND_LABELS[content.type]}</td>
                    <td className="px-3 py-3">{userName(users, content.authorId)}</td>
                    <td className="whitespace-nowrap px-3 py-3">{waitingDays(content, data?.loadedAt ?? 0)} hari</td>
                    <td className="px-4 py-3 text-right sm:px-5">
                      {isDev ? (
                        <Link href={`/reviewer/review/${content.id}`} aria-label={`Buka review ${content.judul}`} className="font-medium text-primary-accent underline-offset-2 hover:underline">
                          Review
                        </Link>
                      ) : (
                        <ComingSoonButton label="Mulai Review" variant="outline" size="sm" ariaLabel={`Mulai review ${content.judul}`} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="Antrean kosong" description="Belum ada konten yang menunggu review. Konten baru dari Creator akan muncul di sini." />
        )}
      </DashboardPanel>

      <div className="grid min-w-0 gap-5 lg:grid-cols-2 lg:gap-6">
        <DashboardPanel id="review-guidelines" title="Checklist Panduan Review" description="Pastikan setiap poin terpenuhi sebelum menyetujui konten.">
          <ul className="space-y-3">
            {REVIEW_GUIDELINES.map((guideline) => (
              <li key={guideline} className="flex items-start gap-3 text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary-accent" aria-hidden="true" />
                {guideline}
              </li>
            ))}
          </ul>
        </DashboardPanel>

        <DashboardPanel id="review-activity" title="Aktivitas Review Terakhir">
          {decisions.length > 0 ? (
            <ul className="divide-y divide-border">
              {decisions.slice(0, RECENT_LIMIT).map((event) => {
                const content = contents.find((item) => item.id === event.contentId);
                return (
                  <li key={event.id} className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{content?.judul}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{userName(users, content?.authorId ?? null)} · {formatContentDate(event.at)}</p>
                    </div>
                    <ContentStatusBadge status={event.to} />
                  </li>
                );
              })}
            </ul>
          ) : (
            <EmptyState icon={History} title="Belum ada aktivitas" description="Riwayat konten yang kamu setujui atau kembalikan akan muncul di sini." />
          )}
        </DashboardPanel>
      </div>
    </div>
  );
}
