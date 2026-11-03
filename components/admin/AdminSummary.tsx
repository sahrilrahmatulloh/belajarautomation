"use client";

import Link from "next/link";
import { BadgeCheck, CheckCircle2, Clock3, FilePen, Hourglass, Inbox, RotateCcw, ShieldCheck, UserRoundX } from "lucide-react";

import EmptyState from "@/components/common/EmptyState";
import PrototypeNotice from "@/components/creator/studio/PrototypeNotice";
import { userName } from "@/components/creator/studio/useCreatorData";
import DashboardPanel from "@/components/roles/DashboardPanel";
import RoleGreeting from "@/components/roles/RoleGreeting";
import RoleStatCard from "@/components/roles/RoleStatCard";
import { formatContentDate } from "@/lib/content/document";
import { useSession } from "@/lib/session";
import { ContentStatusId } from "@/types/ContentWorkflow";

import { isLongWaiting, LONG_WAIT_DAYS, useAdminData } from "./useAdminData";

const RECENT_LIMIT = 5;

// Ringkasan Admin (PRD FR-15). Setiap angka membuka Semua Konten yang sudah tersaring.
export default function AdminSummary() {
  const session = useSession();
  const { data } = useAdminData();
  const contents = data?.contents ?? [];
  const count = (status: ContentStatusId) => String(contents.filter((content) => content.status === status).length);
  const waiting = contents.filter((content) => content.status === "menunggu-review");
  const published = contents
    .filter((content) => content.status === "terbit")
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, RECENT_LIMIT);

  const statusCards = [
    { label: "Draf", value: count("draf"), detail: "Masih di tangan Creator", icon: FilePen, iconStyle: "bg-muted text-muted-foreground", href: "/admin/konten?status=draf" },
    { label: "Menunggu Review", value: count("menunggu-review"), detail: "Di antrean Reviewer", icon: Inbox, iconStyle: "bg-amber-500/10 text-amber-600 dark:text-amber-300", href: "/admin/konten?status=menunggu-review" },
    { label: "Perlu Revisi", value: count("perlu-revisi"), detail: "Ada catatan dari Reviewer", icon: RotateCcw, iconStyle: "bg-rose-500/10 text-rose-600 dark:text-rose-300", href: "/admin/konten?status=perlu-revisi" },
    { label: "Disetujui", value: count("disetujui"), detail: "Siap diterbitkan", icon: BadgeCheck, iconStyle: "bg-sky-500/10 text-sky-700 dark:text-sky-300", href: "/admin/konten?status=disetujui" },
    { label: "Terbit", value: count("terbit"), detail: "Sudah tayang", icon: CheckCircle2, iconStyle: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300", href: "/admin/konten?status=terbit" },
  ];
  const attentionCards = [
    {
      label: "Belum Ditugaskan",
      value: String(waiting.filter((content) => !content.reviewerId).length),
      detail: "Menunggu Review tanpa Reviewer",
      icon: UserRoundX,
      iconStyle: "bg-brand-blue/10 text-brand-blue",
      href: "/admin/konten?status=menunggu-review&reviewer=belum",
    },
    {
      label: `Menunggu Lebih dari ${LONG_WAIT_DAYS} Hari`,
      value: String(waiting.filter((content) => isLongWaiting(content, data?.loadedAt ?? 0)).length),
      detail: "Review yang perlu dipercepat",
      icon: Hourglass,
      iconStyle: "bg-rose-500/10 text-rose-600 dark:text-rose-300",
      href: "/admin/konten?status=menunggu-review&lama=1",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[1600px] min-w-0 space-y-5 lg:space-y-6">
      <PrototypeNotice />

      <RoleGreeting
        title="Halo, Admin!"
        description="Pantau alur konten, tugaskan Reviewer, terbitkan konten, dan kelola peran pengguna."
        icon={ShieldCheck}
        meta={`Masuk sebagai ${session?.name ?? ""}`}
      />

      <section aria-labelledby="ringkasan-status">
        <h2 id="ringkasan-status" className="text-lg font-bold">Konten per Status</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5 [&>*:last-child]:col-span-2 sm:[&>*:last-child]:col-span-1">
          {statusCards.map(({ href, ...card }) => (
            <Link key={card.label} href={href} className="rounded-2xl transition-shadow hover:shadow-md">
              <RoleStatCard {...card} as="div" />
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="ringkasan-perhatian">
        <h2 id="ringkasan-perhatian" className="text-lg font-bold">Perlu Perhatian</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {attentionCards.map(({ href, ...card }) => (
            <Link key={card.label} href={href} className="rounded-2xl transition-shadow hover:shadow-md">
              <RoleStatCard {...card} as="div" />
            </Link>
          ))}
        </div>
      </section>

      <DashboardPanel id="terbit-terbaru" title="Terbit Terbaru" description="Konten yang terakhir diterbitkan.">
        {published.length > 0 ? (
          <ul className="divide-y divide-border">
            {published.map((content) => (
              <li key={content.id} className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{content.judul}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{userName(data?.users ?? [], content.authorId)}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock3 className="h-4 w-4" aria-hidden="true" />
                  {formatContentDate(content.updatedAt)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="Belum ada konten terbit" description="Konten yang diterbitkan akan muncul di sini." />
        )}
      </DashboardPanel>
    </div>
  );
}
