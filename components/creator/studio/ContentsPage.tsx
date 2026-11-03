"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dialog } from "@base-ui/react/dialog";
import { FileText, Plus } from "lucide-react";

import FilterChips from "@/components/filters/FilterChips";
import SearchField from "@/components/filters/SearchField";
import ContentStatusBadge from "@/components/roles/ContentStatusBadge";
import { matchesKeyword } from "@/lib/filters";
import { formatDate } from "@/lib/format";
import { creatorStudioActions, useCreatorStudio } from "@/lib/creatorStudio";
import { ContentStatus, ContentType } from "@/types/Content";
import { CreatorContent } from "@/types/RoleDashboard";

import PrototypeNotice from "./PrototypeNotice";

const STATUS_TABS: { value: "" | ContentStatus; label: string }[] = [
  { value: "", label: "Semua" },
  { value: "draft", label: "Draf" },
  { value: "in-review", label: "Menunggu Review" },
  { value: "needs-revision", label: "Perlu Revisi" },
  { value: "approved", label: "Disetujui" },
  { value: "published", label: "Terbit" },
];

const CONTENT_TYPES: ContentType[] = ["Artikel", "Materi", "Modul", "Soal Latihan"];

const actionClass = "whitespace-nowrap rounded font-medium text-primary-accent underline-offset-2 hover:underline";

function RowActions({ content, onDelete }: { content: CreatorContent; onDelete: (content: CreatorContent) => void }) {
  const router = useRouter();
  const detailHref = `/creator/konten/${content.id}`;
  const editHref = `/creator/buat/artikel?konten=${content.id}`;

  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1">
      {content.status === "draft" && (
        <>
          <Link href={editHref} className={actionClass}>Edit</Link>
          <Link href={editHref} className={actionClass}>Kirim untuk Review</Link>
          <button type="button" onClick={() => onDelete(content)} className="whitespace-nowrap rounded font-medium text-destructive underline-offset-2 hover:underline">
            Hapus
          </button>
        </>
      )}
      {content.status === "in-review" && (
        <>
          <Link href={detailHref} className={actionClass}>Lihat</Link>
          <button type="button" onClick={() => creatorStudioActions.withdraw(content.id)} className={actionClass}>
            Tarik kembali
          </button>
        </>
      )}
      {content.status === "needs-revision" && (
        <>
          <Link href={`/creator/revisi/${content.id}`} className={actionClass}>Lihat catatan</Link>
          <Link href={editHref} className={actionClass}>Edit</Link>
        </>
      )}
      {content.status === "approved" && <Link href={detailHref} className={actionClass}>Lihat</Link>}
      {content.status === "published" && (
        <>
          {content.publicHref && <Link href={content.publicHref} className={actionClass}>Lihat di website</Link>}
          <button
            type="button"
            onClick={() => {
              const id = creatorStudioActions.createRevision(content.id);
              if (id) router.push(`/creator/buat/artikel?konten=${id}`);
            }}
            className={actionClass}
          >
            Buat revisi
          </button>
        </>
      )}
    </div>
  );
}

// Konten Saya (PRD FR-15, tahap setelah backend), sebagai prototipe.
export default function ContentsPage() {
  const { contents } = useCreatorStudio();
  const [status, setStatus] = useState<"" | ContentStatus>("");
  const [type, setType] = useState("");
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<CreatorContent | null>(null);

  const tabs = STATUS_TABS.map((tab) => ({
    value: tab.value,
    label: `${tab.label} (${tab.value ? contents.filter((content) => content.status === tab.value).length : contents.length})`,
  }));
  const filtered = contents.filter(
    (content) =>
      (!status || content.status === status) && (!type || content.type === type) && matchesKeyword(search, content.title)
  );

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5">
      <PrototypeNotice />

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Konten Saya</h1>
          <p className="mt-1 text-muted-foreground">Kelola konten dan pantau statusnya dari draf hingga terbit.</p>
        </div>
        <Link
          href="/creator/buat"
          className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Buat Konten
        </Link>
      </header>

      {contents.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted">
            <FileText className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          </span>
          <h2 className="mt-3 font-semibold">Belum ada konten</h2>
          <p className="mt-1 text-sm text-muted-foreground">Mulai dengan menulis konten pertamamu.</p>
          <Link href="/creator/buat" className="mt-4 inline-flex min-h-10 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover">
            Tulis konten pertama
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_13rem]">
            <SearchField label="Cari konten" value={search} placeholder="Cari judul konten..." onChange={setSearch} />
            <select
              aria-label="Filter jenis"
              value={type}
              onChange={(event) => setType(event.target.value)}
              className="h-11 rounded-lg border border-input bg-background px-3 text-sm font-medium dark:bg-card"
            >
              <option value="">Semua jenis</option>
              {CONTENT_TYPES.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>

          <FilterChips
            label="Status"
            layout="scroll"
            options={tabs}
            active={status}
            onChange={(value) => setStatus(value as "" | ContentStatus)}
          />

          {filtered.length > 0 ? (
            <div role="group" tabIndex={0} aria-label="Tabel konten saya" className="overflow-x-auto rounded-2xl border border-border bg-card">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead className="border-b border-border bg-muted/40 text-xs text-muted-foreground">
                  <tr>
                    {["Judul", "Jenis", "Kategori", "Status", "Terakhir diubah", "Reviewer", "Aksi"].map((heading) => (
                      <th key={heading} scope="col" className="px-4 py-2.5 font-medium">{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((content) => (
                    <tr key={content.id}>
                      <th scope="row" className="px-4 py-3 font-medium">{content.title}</th>
                      <td className="px-4 py-3 text-muted-foreground">{content.type}</td>
                      <td className="px-4 py-3 text-muted-foreground">{content.category}</td>
                      <td className="px-4 py-3"><ContentStatusBadge status={content.status} /></td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{formatDate(content.updatedAt)}</td>
                      <td className="px-4 py-3 text-muted-foreground">{content.reviewerName ?? "-"}</td>
                      <td className="px-4 py-3"><RowActions content={content} onDelete={setDeleting} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="rounded-2xl border border-dashed border-border bg-card px-6 py-10 text-center text-sm text-muted-foreground">
              Tidak ada konten yang cocok.
            </p>
          )}
        </>
      )}

      <Dialog.Root open={deleting !== null} onOpenChange={(open) => !open && setDeleting(null)}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/70" />
          <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card p-5 text-foreground shadow-xl">
            <Dialog.Title className="text-lg font-bold">Hapus draf ini?</Dialog.Title>
            <Dialog.Description className="mt-2 text-sm leading-6 text-muted-foreground">
              &quot;{deleting?.title}&quot; akan dihapus dan tidak bisa dikembalikan.
            </Dialog.Description>
            <div className="mt-5 flex justify-end gap-2">
              <Dialog.Close className="min-h-10 rounded-xl border border-border px-4 text-sm font-semibold transition-colors hover:bg-accent">
                Batal
              </Dialog.Close>
              <button
                type="button"
                onClick={() => {
                  if (deleting) creatorStudioActions.remove(deleting.id);
                  setDeleting(null);
                }}
                className="min-h-10 rounded-xl bg-red-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-red-800"
              >
                Hapus
              </button>
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
