import {
  CheckCircle2,
  Clock3,
  FilePen,
  FilePlus2,
  MessageSquareText,
  PenLine,
  RotateCcw,
} from "lucide-react";

import EmptyState from "@/components/common/EmptyState";
import ComingSoonButton from "@/components/roles/ComingSoonButton";
import ContentStatusBadge from "@/components/roles/ContentStatusBadge";
import DashboardPanel from "@/components/roles/DashboardPanel";
import RoleGreeting from "@/components/roles/RoleGreeting";
import RolePreviewNotice from "@/components/roles/RolePreviewNotice";
import RoleStatCard from "@/components/roles/RoleStatCard";
import {
  DUMMY_CREATOR_CONTENTS,
  DUMMY_CREATOR_NAME,
  DUMMY_REVISION_NOTES,
} from "@/data/dummy/creator";
import { formatDate } from "@/lib/format";
import { ContentStatus } from "@/types/Content";

function countByStatus(status: ContentStatus) {
  return DUMMY_CREATOR_CONTENTS.filter(
    (content) => content.status === status
  ).length;
}

const stats = [
  {
    label: "Draft",
    value: countByStatus("draft"),
    detail: "Belum dikirim ke reviewer",
    icon: FilePen,
    iconStyle: "bg-muted text-muted-foreground",
  },
  {
    label: "Menunggu Review",
    value: countByStatus("in-review"),
    detail: "Sedang di antrean reviewer",
    icon: Clock3,
    iconStyle: "bg-amber-500/10 text-amber-600 dark:text-amber-300",
  },
  {
    label: "Perlu Revisi",
    value: countByStatus("needs-revision"),
    detail: "Ada catatan dari reviewer",
    icon: RotateCcw,
    iconStyle: "bg-rose-500/10 text-rose-600 dark:text-rose-300",
  },
  {
    label: "Terbit",
    value: countByStatus("published"),
    detail: "Sudah bisa dipelajari pengguna",
    icon: CheckCircle2,
    iconStyle: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
  },
];

export default function CreatorDashboard() {
  return (
    <div className="mx-auto w-full max-w-[1600px] min-w-0 space-y-5 lg:space-y-6">
      <RolePreviewNotice />

      <RoleGreeting
        title="Halo, Creator!"
        description="Tulis materi, modul, soal latihan, dan artikel, lalu pantau statusnya dari review hingga terbit."
        icon={PenLine}
        meta={`Masuk sebagai ${DUMMY_CREATOR_NAME}`}
        action={
          <ComingSoonButton
            label="Buat Konten Baru"
            icon={<FilePlus2 className="h-4 w-4" aria-hidden="true" />}
          />
        }
      />

      <section aria-label="Statistik konten" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <RoleStatCard
            key={stat.label}
            {...stat}
            value={String(stat.value)}
          />
        ))}
      </section>

      <div className="grid min-w-0 gap-5 lg:gap-6 xl:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]">
        <DashboardPanel
          id="creator-contents"
          title="Konten Saya"
          description="Status terbaru setiap konten yang kamu buat."
        >
          {DUMMY_CREATOR_CONTENTS.length > 0 ? (
            <div className="relative -mx-4 overflow-x-auto sm:-mx-5">
              <table className="w-full min-w-[560px] text-left text-sm">
                <caption className="sr-only">
                  Daftar konten milik creator beserta status penerbitannya
                </caption>
                <thead className="border-y border-border bg-muted/40 text-xs text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-4 py-2.5 font-medium sm:px-5">Judul</th>
                    <th scope="col" className="px-3 py-2.5 font-medium">Jenis</th>
                    <th scope="col" className="px-3 py-2.5 font-medium">Status</th>
                    <th scope="col" className="px-4 py-2.5 font-medium sm:px-5">Diperbarui</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {DUMMY_CREATOR_CONTENTS.map((content) => (
                    <tr key={content.id}>
                      <th scope="row" className="px-4 py-3 font-medium sm:px-5">
                        {content.title}
                      </th>
                      <td className="px-3 py-3 text-muted-foreground">{content.type}</td>
                      <td className="px-3 py-3">
                        <ContentStatusBadge status={content.status} />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground sm:px-5">
                        {formatDate(content.updatedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
          {DUMMY_REVISION_NOTES.length > 0 ? (
            <ul className="space-y-3">
              {DUMMY_REVISION_NOTES.map((note) => (
                <li
                  key={note.id}
                  className="rounded-lg border border-border p-3"
                >
                  <p className="text-sm font-semibold">
                    {note.contentTitle}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {note.summary}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {note.reviewerName} · {formatDate(note.date)}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={MessageSquareText}
              title="Belum ada catatan revisi"
              description="Catatan dari reviewer akan muncul setelah kontenmu direview."
            />
          )}
        </DashboardPanel>
      </div>
    </div>
  );
}
