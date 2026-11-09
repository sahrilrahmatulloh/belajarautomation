"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dialog } from "@base-ui/react/dialog";
import { ExternalLink, Eye, FilePen, FileText, MessageSquareText, Pencil, Plus, Send, Trash2, Undo2 } from "lucide-react";

import IconAction from "@/components/common/IconAction";
import ListPagination, { pageSlice } from "@/components/common/ListPagination";
import FilterChips from "@/components/filters/FilterChips";
import SearchField from "@/components/filters/SearchField";
import ContentStatusBadge from "@/components/roles/ContentStatusBadge";
import { runContentAction } from "@/lib/content";
import { formatContentDate, KIND_LABELS, STATUS_LABELS } from "@/lib/content/document";
import { matchesKeyword } from "@/lib/filters";
import { ContentItem, ContentKind, ContentStatusId } from "@/types/ContentWorkflow";

import PrototypeNotice from "./PrototypeNotice";
import { useCreatorData, userName } from "./useCreatorData";

const PAGE_SIZE = 5;
const STATUSES = Object.keys(STATUS_LABELS) as ContentStatusId[];
const KINDS = Object.keys(KIND_LABELS) as ContentKind[];

function RowActions({
  content,
  userId,
  onDelete,
  onError,
}: {
  content: ContentItem;
  userId: string;
  onDelete: (content: ContentItem) => void;
  onError: (message: string) => void;
}) {
  const router = useRouter();
  const detailHref = `/creator/konten/${content.id}`;
  const editHref = `/creator/buat/artikel?konten=${content.id}`;

  const withdraw = async () => {
    const result = await runContentAction((repository) => repository.withdraw(userId, content.id));
    onError(result.ok ? "" : result.message);
  };

  const createRevision = async () => {
    const result = await runContentAction((repository) => repository.createRevision(userId, content.id));
    if (result.ok) router.push(`/creator/buat/artikel?konten=${result.data.id}`);
    else onError(result.message);
  };

  return (
    <div className="flex flex-wrap items-center gap-1">
      {content.status === "draf" && (
        <>
          <IconAction label="Kirim untuk Review" icon={Send} href={editHref} showLabel />
          <IconAction label="Edit" icon={Pencil} href={editHref} />
          <IconAction label="Hapus" icon={Trash2} tone="destructive" onClick={() => onDelete(content)} />
        </>
      )}
      {content.status === "menunggu-review" && (
        <>
          <IconAction label="Lihat" icon={Eye} href={detailHref} />
          <IconAction label="Tarik kembali" icon={Undo2} onClick={() => void withdraw()} />
        </>
      )}
      {content.status === "perlu-revisi" && (
        <>
          <IconAction label="Lihat catatan" icon={MessageSquareText} href={`/creator/revisi/${content.id}`} />
          <IconAction label="Edit" icon={Pencil} href={editHref} />
        </>
      )}
      {content.status === "disetujui" && <IconAction label="Lihat" icon={Eye} href={detailHref} />}
      {content.status === "terbit" && (
        <>
          <IconAction label="Buat revisi" icon={FilePen} onClick={() => void createRevision()} showLabel />
          {content.publicPath && <IconAction label="Lihat di website" icon={ExternalLink} href={content.publicPath} />}
        </>
      )}
    </div>
  );
}

function RevisionLabel({ content }: { content: ContentItem }) {
  if (!content.revisionOf) return null;
  return <span className="mt-0.5 block text-xs font-normal text-muted-foreground">Revisi dari versi terbit</span>;
}

// Konten Saya (PRD FR-15).
export default function ContentsPage() {
  const { userId, data } = useCreatorData();
  const [status, setStatus] = useState<"" | ContentStatusId>("");
  const [kind, setKind] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState<ContentItem | null>(null);
  const [error, setError] = useState("");

  if (!data) return <p className="py-10 text-center text-sm text-muted-foreground">Memuat konten...</p>;

  const { contents, users } = data;
  const tabs = [
    { value: "", label: `Semua (${contents.length})` },
    ...STATUSES.map((value) => ({ value, label: `${STATUS_LABELS[value]} (${contents.filter((content) => content.status === value).length})` })),
  ];
  const filtered = contents.filter(
    (content) => (!status || content.status === status) && (!kind || content.type === kind) && matchesKeyword(search, content.judul)
  );
  // Halaman bisa melebihi jumlah bila konten terakhirnya baru dihapus.
  const currentPage = Math.min(page, Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)));
  const visible = pageSlice(filtered, currentPage, PAGE_SIZE);
  const titleOf = (content: ContentItem) => content.judul || "Tanpa judul";

  const confirmDelete = async () => {
    if (!deleting) return;
    const result = await runContentAction((repository) => repository.deleteDraft(userId, deleting.id));
    setError(result.ok ? "" : result.message);
    setDeleting(null);
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5">
      <PrototypeNotice />

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Konten Saya</h1>
          <p className="mt-1 text-muted-foreground">Kelola konten dan pantau statusnya dari draf hingga terbit.</p>
        </div>
        <Link href="/creator/buat" className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Buat Konten
        </Link>
      </header>

      {error && <p role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}

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
            <SearchField
              label="Cari konten"
              value={search}
              placeholder="Cari judul konten..."
              onChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
            />
            <select
              aria-label="Filter jenis"
              value={kind}
              onChange={(event) => {
                setKind(event.target.value);
                setPage(1);
              }}
              className="h-11 rounded-lg border border-input bg-background px-3 text-sm font-medium dark:bg-card"
            >
              <option value="">Semua jenis</option>
              {KINDS.map((item) => <option key={item} value={item}>{KIND_LABELS[item]}</option>)}
            </select>
          </div>

          <FilterChips
            label="Status"
            layout="scroll"
            options={tabs}
            active={status}
            onChange={(value) => {
              setStatus(value as "" | ContentStatusId);
              setPage(1);
            }}
          />

          {filtered.length > 0 ? (
            <>
              <div role="group" tabIndex={0} aria-label="Tabel konten saya" className="hidden overflow-x-auto rounded-2xl border border-border bg-card md:block">
                <table className="w-full min-w-[820px] text-left text-sm">
                  <thead className="border-b border-border bg-muted/40 text-xs text-muted-foreground">
                    <tr>
                      {["Judul", "Jenis", "Kategori", "Status", "Terakhir diubah", "Reviewer", "Aksi"].map((heading) => (
                        <th key={heading} scope="col" className="px-4 py-2.5 font-medium">{heading}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {visible.map((content) => (
                      <tr key={content.id}>
                        <th scope="row" className="px-4 py-3 font-medium">{titleOf(content)}<RevisionLabel content={content} /></th>
                        <td className="px-4 py-3 text-muted-foreground">{KIND_LABELS[content.type]}</td>
                        <td className="px-4 py-3 text-muted-foreground">{content.kategori || "-"}</td>
                        <td className="px-4 py-3"><ContentStatusBadge status={content.status} /></td>
                        <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{formatContentDate(content.updatedAt)}</td>
                        <td className="px-4 py-3 text-muted-foreground">{userName(users, content.reviewerId)}</td>
                        <td className="px-4 py-3"><RowActions content={content} userId={userId} onDelete={setDeleting} onError={setError} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <ul aria-label="Daftar konten saya" className="space-y-3 md:hidden">
                {visible.map((content) => (
                  <li key={content.id} className="rounded-2xl border border-border bg-card p-4">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="min-w-0 font-semibold">{titleOf(content)}<RevisionLabel content={content} /></h2>
                      <ContentStatusBadge status={content.status} />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {KIND_LABELS[content.type]} · {content.kategori || "-"} · {formatContentDate(content.updatedAt)}
                    </p>
                    <p className="text-sm text-muted-foreground">Reviewer: {userName(users, content.reviewerId)}</p>
                    <div className="mt-2 border-t border-border pt-2">
                      <RowActions content={content} userId={userId} onDelete={setDeleting} onError={setError} />
                    </div>
                  </li>
                ))}
              </ul>

              <ListPagination total={filtered.length} page={currentPage} pageSize={PAGE_SIZE} itemLabel="konten" onChange={setPage} />
            </>
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
              &quot;{deleting && titleOf(deleting)}&quot; akan dihapus dan tidak bisa dikembalikan.
            </Dialog.Description>
            <div className="mt-5 flex justify-end gap-2">
              <Dialog.Close className="min-h-10 rounded-xl border border-border px-4 text-sm font-semibold transition-colors hover:bg-accent">
                Batal
              </Dialog.Close>
              <button type="button" onClick={() => void confirmDelete()} className="min-h-10 rounded-xl bg-red-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-red-800">
                Hapus
              </button>
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
