import {
  CheckCircle2,
  ClipboardCheck,
  History,
  Inbox,
  RotateCcw,
  SearchCheck,
  ThumbsUp,
} from "lucide-react";

import EmptyState from "@/components/common/EmptyState";
import ComingSoonButton from "@/components/roles/ComingSoonButton";
import ContentStatusBadge from "@/components/roles/ContentStatusBadge";
import DashboardPanel from "@/components/roles/DashboardPanel";
import RoleGreeting from "@/components/roles/RoleGreeting";
import RolePreviewNotice from "@/components/roles/RolePreviewNotice";
import RoleStatCard from "@/components/roles/RoleStatCard";
import {
  DUMMY_REFERENCE_DATE,
  DUMMY_REVIEW_ACTIVITIES,
  DUMMY_REVIEW_QUEUE,
  DUMMY_REVIEWER_NAME,
  DUMMY_REVIEWER_STATS,
} from "@/data/dummy/reviewer";
import { REVIEW_GUIDELINES } from "@/data/reviewGuidelines";
import { daysBetween, formatDate } from "@/lib/format";
import { ReviewPriority } from "@/types/RoleDashboard";

const priorityStyles: Record<ReviewPriority, string> = {
  Tinggi: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
  Sedang: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  Rendah: "bg-muted text-muted-foreground",
};

// Reviewer tidak me-review kontennya sendiri; paling lama menunggu di atas.
const queue = DUMMY_REVIEW_QUEUE
  .filter((item) => item.creatorName !== DUMMY_REVIEWER_NAME)
  .sort((a, b) => a.submittedAt.localeCompare(b.submittedAt));

const stats = [
  {
    label: "Antrean Review",
    value: queue.length,
    detail: "Konten menunggu diperiksa",
    icon: Inbox,
    iconStyle: "bg-brand-blue/10 text-brand-blue",
  },
  {
    label: "Sedang Direview",
    value: DUMMY_REVIEWER_STATS.inReview,
    detail: "Sedang kamu periksa",
    icon: SearchCheck,
    iconStyle: "bg-amber-500/10 text-amber-600 dark:text-amber-300",
  },
  {
    label: "Disetujui Bulan Ini",
    value: DUMMY_REVIEWER_STATS.approvedThisMonth,
    detail: "Siap diterbitkan",
    icon: ThumbsUp,
    iconStyle: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
  },
  {
    label: "Dikembalikan untuk Revisi",
    value: DUMMY_REVIEWER_STATS.returnedThisMonth,
    detail: "Bulan ini",
    icon: RotateCcw,
    iconStyle: "bg-rose-500/10 text-rose-600 dark:text-rose-300",
  },
];

export default function ReviewerDashboard() {
  return (
    <div className="mx-auto w-full max-w-[1600px] min-w-0 space-y-5 lg:space-y-6">
      <RolePreviewNotice />

      <RoleGreeting
        title="Halo, Reviewer!"
        description="Periksa akurasi dan kualitas konten dari Creator sebelum diterbitkan. Konten milikmu sendiri tidak masuk antreanmu."
        icon={ClipboardCheck}
        meta={`Masuk sebagai ${DUMMY_REVIEWER_NAME}`}
      />

      <section aria-label="Statistik review" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <RoleStatCard
            key={stat.label}
            {...stat}
            value={String(stat.value)}
          />
        ))}
      </section>

      <DashboardPanel
        id="review-queue"
        title="Antrean Review"
        description="Diurutkan dari yang paling lama menunggu."
      >
        {queue.length > 0 ? (
          <div className="relative -mx-4 overflow-x-auto sm:-mx-5">
            <table className="w-full min-w-[760px] text-left text-sm">
              <caption className="sr-only">
                Antrean konten yang menunggu review, diurutkan dari yang paling lama menunggu
              </caption>
              <thead className="border-y border-border bg-muted/40 text-xs text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-2.5 font-medium sm:px-5">Judul</th>
                  <th scope="col" className="px-3 py-2.5 font-medium">Jenis</th>
                  <th scope="col" className="px-3 py-2.5 font-medium">Creator</th>
                  <th scope="col" className="px-3 py-2.5 font-medium">Dikirim</th>
                  <th scope="col" className="px-3 py-2.5 font-medium">Menunggu</th>
                  <th scope="col" className="px-3 py-2.5 font-medium">Prioritas</th>
                  <th scope="col" className="px-4 py-2.5 font-medium sm:px-5">
                    <span className="sr-only">Aksi</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {queue.map((item) => (
                  <tr key={item.id}>
                    <th scope="row" className="px-4 py-3 font-medium sm:px-5">
                      {item.title}
                    </th>
                    <td className="px-3 py-3 text-muted-foreground">{item.type}</td>
                    <td className="px-3 py-3">{item.creatorName}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">
                      {formatDate(item.submittedAt)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {daysBetween(item.submittedAt, DUMMY_REFERENCE_DATE)} hari
                    </td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${priorityStyles[item.priority]}`}>
                        {item.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right sm:px-5">
                      <ComingSoonButton
                        label="Mulai Review"
                        variant="outline"
                        size="sm"
                        ariaLabel={`Mulai review ${item.title}`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="Antrean kosong"
            description="Belum ada konten yang menunggu review. Konten baru dari Creator akan muncul di sini."
          />
        )}
      </DashboardPanel>

      <div className="grid min-w-0 gap-5 lg:grid-cols-2 lg:gap-6">
        <DashboardPanel
          id="review-guidelines"
          title="Checklist Panduan Review"
          description="Pastikan setiap poin terpenuhi sebelum menyetujui konten."
        >
          {REVIEW_GUIDELINES.length > 0 ? (
            <ul className="space-y-3">
              {REVIEW_GUIDELINES.map((guideline) => (
                <li key={guideline} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  {guideline}
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              title="Panduan belum tersedia"
              description="Checklist review akan ditambahkan oleh Admin."
            />
          )}
        </DashboardPanel>

        <DashboardPanel
          id="review-activity"
          title="Aktivitas Review Terakhir"
        >
          {DUMMY_REVIEW_ACTIVITIES.length > 0 ? (
            <ul className="divide-y divide-border">
              {DUMMY_REVIEW_ACTIVITIES.map((activity) => (
                <li
                  key={activity.id}
                  className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {activity.creatorName} · {formatDate(activity.date)}
                    </p>
                  </div>
                  {activity.result === "approved" ? (
                    <ContentStatusBadge status="approved" />
                  ) : (
                    <span className="inline-flex whitespace-nowrap rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-medium text-rose-700 dark:text-rose-300">
                      Dikembalikan
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={History}
              title="Belum ada aktivitas"
              description="Riwayat konten yang kamu setujui atau kembalikan akan muncul di sini."
            />
          )}
        </DashboardPanel>
      </div>
    </div>
  );
}
