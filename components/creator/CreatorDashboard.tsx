"use client";

import Link from "next/link";
import { FilePlus2, MessageSquareText, PenLine } from "lucide-react";

import EmptyState from "@/components/common/EmptyState";
import DashboardPanel from "@/components/roles/DashboardPanel";
import RoleGreeting from "@/components/roles/RoleGreeting";
import RolePreviewNotice from "@/components/roles/RolePreviewNotice";
import RoleStatCard from "@/components/roles/RoleStatCard";
import { useCreatorData, userName } from "@/components/creator/studio/useCreatorData";
import { formatContentDate } from "@/lib/content/document";
import { latestRoundNotes } from "@/lib/content/rules";
import { useSession } from "@/lib/session";

import CreatorContentsTable from "./CreatorContentsTable";
import { getCreatorStats } from "./creatorStats";

export default function CreatorDashboard() {
  const session = useSession();
  const { data } = useCreatorData();
  const contents = data?.contents ?? [];
  const users = data?.users ?? [];
  // Hanya konten yang masih perlu dikerjakan, satu baris per konten.
  const openRevisions = contents
    .filter((content) => content.status === "perlu-revisi")
    .flatMap((content) => {
      const [note] = latestRoundNotes((data?.notes ?? []).filter((item) => item.contentId === content.id));
      return note ? [{ content, note }] : [];
    });

  return (
    <div className="mx-auto w-full max-w-[1600px] min-w-0 space-y-5 lg:space-y-6">
      <RolePreviewNotice />

      <RoleGreeting
        title="Halo, Creator!"
        description="Tulis materi, modul, soal latihan, dan artikel, lalu pantau statusnya dari review hingga terbit."
        icon={PenLine}
        meta={`Masuk sebagai ${session?.name ?? ""}`}
        action={
          <Link
            href="/creator/buat"
            className="inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            <FilePlus2 className="h-4 w-4" aria-hidden="true" />
            Buat Konten Baru
          </Link>
        }
      />

      <section aria-labelledby="creator-stats">
        <h2 id="creator-stats" className="sr-only">
          Statistik konten
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5 [&>*:last-child]:col-span-2 sm:[&>*:last-child]:col-span-1">
          {getCreatorStats(contents).map((stat) => (
            <RoleStatCard key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      <div className="grid min-w-0 gap-5 lg:gap-6 xl:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]">
        <DashboardPanel
          id="creator-contents"
          title="Konten Saya"
          description="Status terbaru setiap konten yang kamu buat."
        >
          {contents.length > 0 ? (
            <CreatorContentsTable contents={contents} />
          ) : (
            <EmptyState
              title="Belum ada konten"
              description="Konten yang kamu buat akan muncul di sini beserta status review-nya."
            />
          )}
        </DashboardPanel>

        <DashboardPanel
          id="creator-revisions"
          title="Catatan Revisi Terbaru"
          description="Masukan dari reviewer untuk kontenmu."
        >
          {openRevisions.length > 0 ? (
            <ul className="space-y-3">
              {openRevisions.map(({ content, note }) => (
                <li
                  key={content.id}
                  className="rounded-lg border border-border p-3"
                >
                  <p className="text-sm font-semibold">
                    {content.judul}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {note.isi}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {userName(users, note.reviewerId)} · {formatContentDate(note.createdAt)}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={MessageSquareText}
              title="Tidak ada revisi yang perlu dikerjakan"
              description="Catatan dari reviewer akan muncul saat kontenmu perlu direvisi."
            />
          )}
        </DashboardPanel>
      </div>
    </div>
  );
}
