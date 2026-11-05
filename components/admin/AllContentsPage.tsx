"use client";

import { useState } from "react";
import Link from "next/link";

import ConfirmDialog from "@/components/common/ConfirmDialog";
import ListPagination, { pageSlice } from "@/components/common/ListPagination";
import { EditorDialog } from "@/components/creator/studio/EditorDialogs";
import PrototypeNotice from "@/components/creator/studio/PrototypeNotice";
import { userName } from "@/components/creator/studio/useCreatorData";
import FilterChips from "@/components/filters/FilterChips";
import SearchField from "@/components/filters/SearchField";
import ContentStatusBadge from "@/components/roles/ContentStatusBadge";
import { runContentAction } from "@/lib/content";
import { formatContentDate, KIND_LABELS, STATUS_LABELS } from "@/lib/content/document";
import { matchesKeyword } from "@/lib/filters";
import { useCatalogFilters } from "@/lib/useUrlFilters";
import { ContentItem, ContentKind, ContentStatusId, ContentUser, StatusAction, StatusEvent } from "@/types/ContentWorkflow";

import AdminList, { AdminColumn } from "./AdminList";
import ReasonDialog from "./ReasonDialog";
import { formatDateTime, isLongWaiting, LONG_WAIT_DAYS, useAdminData } from "./useAdminData";

const PAGE_SIZE = 10;
const UNASSIGNED = "belum";
const FILTER_KEYS = ["q", "status", "jenis", "creator", "reviewer", "lama"] as const;
const STATUSES = Object.keys(STATUS_LABELS) as ContentStatusId[];
const KINDS = Object.keys(KIND_LABELS) as ContentKind[];
const selectClass = "h-11 w-full rounded-lg border border-input bg-background px-3 text-sm font-medium dark:bg-card";
const actionClass = "whitespace-nowrap rounded font-medium text-primary-accent underline-offset-2 hover:underline";
const fieldClass = "mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm dark:bg-card";

const ACTION_LABELS: Record<StatusAction, string> = {
  buat: "Membuat draf",
  kirim: "Mengirim untuk review",
  "kirim-ulang": "Mengirim ulang untuk review",
  "tarik-kembali": "Menarik kembali kiriman",
  ambil: "Mengambil untuk review",
  tugaskan: "Menugaskan Reviewer",
  "minta-revisi": "Meminta revisi",
  setujui: "Menyetujui",
  terbitkan: "Menerbitkan",
  "tarik-website": "Menarik dari website",
  "buat-revisi": "Membuat revisi dari versi terbit",
};

type DialogState = { kind: "tugaskan" | "terbitkan" | "tarik" | "riwayat"; content: ContentItem } | null;

function AssignDialog({ content, users, error, onConfirm, onClose }: { content: ContentItem; users: ContentUser[]; error: string; onConfirm: (reviewerId: string) => void; onClose: () => void }) {
  // Penulis tidak boleh me-review kontennya sendiri.
  const reviewers = users.filter((user) => user.roles.includes("reviewer") && user.id !== content.authorId);
  const [reviewerId, setReviewerId] = useState(content.reviewerId ?? reviewers[0]?.id ?? "");

  return (
    <ConfirmDialog
      title="Tugaskan Reviewer"
      description={`Pilih Reviewer untuk "${content.judul}". Penulis konten tidak termasuk pilihan.`}
      confirmLabel="Tugaskan"
      isConfirmDisabled={!reviewerId}
      error={error}
      onConfirm={() => onConfirm(reviewerId)}
      onClose={onClose}
    >
      <label className="mt-3 block text-sm font-medium">
        Reviewer
        <select value={reviewerId} onChange={(event) => setReviewerId(event.target.value)} className={fieldClass}>
          {reviewers.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
        </select>
      </label>
    </ConfirmDialog>
  );
}

function HistoryDialog({ content, events, users, onClose }: { content: ContentItem; events: StatusEvent[]; users: ContentUser[]; onClose: () => void }) {
  const own = events.filter((event) => event.contentId === content.id).reverse();

  return (
    <EditorDialog title={`Riwayat Status: ${content.judul}`} onClose={onClose}>
      {own.length > 0 ? (
        <ol aria-label="Riwayat status" className="mt-4 space-y-3 border-l-2 border-border pl-4">
          {own.map((event) => (
            <li key={event.id} className="text-sm">
              <p className="font-semibold">{ACTION_LABELS[event.action]}</p>
              <p className="text-muted-foreground">
                {userName(users, event.actorId)} · {formatDateTime(event.at)}
              </p>
              {event.from && event.from !== event.to && <p className="text-muted-foreground">{STATUS_LABELS[event.from]} → {STATUS_LABELS[event.to]}</p>}
              {event.targetUserId && event.action === "tugaskan" && <p className="text-muted-foreground">Kepada {userName(users, event.targetUserId)}</p>}
              {event.alasan && <p className="mt-0.5">Alasan: {event.alasan}</p>}
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">Belum ada riwayat status.</p>
      )}
    </EditorDialog>
  );
}

// Semua Konten (PRD FR-16 B). Filter tersimpan di alamat, agar angka di Ringkasan dan notifikasi
// bisa menautkan daftar yang sudah tersaring.
export default function AllContentsPage() {
  const { userId, data } = useAdminData();
  const { values, search, setSearch, setFilters } = useCatalogFilters(FILTER_KEYS);
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState<DialogState>(null);
  const [dialogError, setDialogError] = useState("");

  if (!data) return <p className="py-10 text-center text-sm text-muted-foreground">Memuat konten...</p>;

  const { contents, users, events, agreements, loadedAt } = data;
  const hasAgreement = (authorId: string) => agreements.some((item) => item.userId === authorId);

  const updateFilter = (key: (typeof FILTER_KEYS)[number], value: string) => {
    setFilters({ [key]: value });
    setPage(1);
  };

  const creators = users.filter((user) => contents.some((content) => content.authorId === user.id));
  const reviewers = users.filter((user) => user.roles.includes("reviewer"));
  const filtered = contents.filter(
    (content) =>
      (!values.status || content.status === values.status) &&
      (!values.jenis || content.type === values.jenis) &&
      (!values.creator || content.authorId === values.creator) &&
      (!values.reviewer || (values.reviewer === UNASSIGNED ? !content.reviewerId : content.reviewerId === values.reviewer)) &&
      (values.lama !== "1" || isLongWaiting(content, loadedAt)) &&
      matchesKeyword(values.q, content.judul)
  );
  const currentPage = Math.min(page, Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)));

  const openDialog = (kindOfDialog: NonNullable<DialogState>["kind"], content: ContentItem) => {
    setDialogError("");
    setDialog({ kind: kindOfDialog, content });
  };

  const finish = (result: { ok: true } | { ok: false; message: string }) => {
    if (result.ok) setDialog(null);
    else setDialogError(result.message);
  };

  const assign = async (reviewerId: string) => {
    if (dialog) finish(await runContentAction((repository) => repository.assignReviewer(userId, dialog.content.id, reviewerId)));
  };
  const publish = async () => {
    if (dialog) finish(await runContentAction((repository) => repository.publish(userId, dialog.content.id)));
  };
  const takedown = async (alasan: string) => {
    if (dialog) finish(await runContentAction((repository) => repository.takedown(userId, dialog.content.id, alasan)));
  };

  const columns: AdminColumn<ContentItem>[] = [
    { header: "Judul", cell: (content) => content.judul || "Tanpa judul" },
    { header: "Jenis", cell: (content) => KIND_LABELS[content.type] },
    { header: "Creator", cell: (content) => userName(users, content.authorId) },
    { header: "Reviewer", cell: (content) => userName(users, content.reviewerId) },
    { header: "Status", cell: (content) => <ContentStatusBadge status={content.status} /> },
    { header: "Terakhir diubah", cell: (content) => <span className="whitespace-nowrap">{formatContentDate(content.updatedAt)}</span> },
    {
      header: "Aksi",
      cell: (content) => (
        <span className="flex flex-wrap gap-x-3 gap-y-1">
          {content.status === "menunggu-review" && (
            <button type="button" onClick={() => openDialog("tugaskan", content)} className={actionClass}>Tugaskan Reviewer</button>
          )}
          {content.status === "disetujui" && hasAgreement(content.authorId) && (
            <button type="button" onClick={() => openDialog("terbitkan", content)} className={actionClass}>Terbitkan</button>
          )}
          {content.status === "disetujui" && !hasAgreement(content.authorId) && (
            <span className="block">
              <button type="button" disabled className="cursor-not-allowed font-medium text-muted-foreground">Terbitkan</button>
              <span className="block text-xs text-foreground">
                Terkunci: Creator belum punya kesepakatan.{" "}
                <Link href={`/admin/pengguna/${content.authorId}`} className="font-medium text-primary-accent underline underline-offset-2">Catat kesepakatan</Link>
              </span>
            </span>
          )}
          {content.status === "terbit" && (
            <button type="button" onClick={() => openDialog("tarik", content)} className="whitespace-nowrap rounded font-medium text-destructive underline-offset-2 hover:underline">Tarik dari website</button>
          )}
          <button type="button" onClick={() => openDialog("riwayat", content)} className={actionClass}>Riwayat</button>
        </span>
      ),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5">
      <PrototypeNotice />

      <header>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Semua Konten</h1>
        <p className="mt-1 text-muted-foreground">Seluruh konten dari semua Creator, dari draf hingga terbit.</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SearchField
          label="Cari konten"
          value={search}
          placeholder="Cari judul konten..."
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
        />
        <select aria-label="Filter jenis" value={values.jenis} onChange={(event) => updateFilter("jenis", event.target.value)} className={selectClass}>
          <option value="">Semua jenis</option>
          {KINDS.map((item) => <option key={item} value={item}>{KIND_LABELS[item]}</option>)}
        </select>
        <select aria-label="Filter Creator" value={values.creator} onChange={(event) => updateFilter("creator", event.target.value)} className={selectClass}>
          <option value="">Semua Creator</option>
          {creators.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
        </select>
        <select aria-label="Filter Reviewer" value={values.reviewer} onChange={(event) => updateFilter("reviewer", event.target.value)} className={selectClass}>
          <option value="">Semua Reviewer</option>
          <option value={UNASSIGNED}>Belum ditugaskan</option>
          {reviewers.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
        </select>
      </div>

      <FilterChips
        label="Status"
        layout="scroll"
        options={[
          { value: "", label: `Semua (${contents.length})` },
          ...STATUSES.map((value) => ({ value, label: `${STATUS_LABELS[value]} (${contents.filter((content) => content.status === value).length})` })),
        ]}
        active={values.status}
        onChange={(value) => updateFilter("status", value)}
      />

      {values.lama === "1" && (
        <p className="flex flex-wrap items-center gap-3 text-sm">
          Hanya review yang menunggu lebih dari {LONG_WAIT_DAYS} hari.
          <button type="button" onClick={() => updateFilter("lama", "")} className={actionClass}>Hapus filter ini</button>
        </p>
      )}

      {filtered.length > 0 ? (
        <>
          <AdminList label="semua konten" rows={pageSlice(filtered, currentPage, PAGE_SIZE)} columns={columns} rowKey={(content) => content.id} />
          <ListPagination total={filtered.length} page={currentPage} pageSize={PAGE_SIZE} itemLabel="konten" onChange={setPage} />
        </>
      ) : (
        <p className="rounded-2xl border border-dashed border-border bg-card px-6 py-10 text-center text-sm text-muted-foreground">Tidak ada konten yang cocok.</p>
      )}

      {dialog?.kind === "tugaskan" && <AssignDialog content={dialog.content} users={users} error={dialogError} onConfirm={(id) => void assign(id)} onClose={() => setDialog(null)} />}
      {dialog?.kind === "terbitkan" && (
        <ConfirmDialog
          title="Terbitkan konten ini?"
          description={`"${dialog.content.judul}" akan berstatus Terbit.`}
          confirmLabel="Terbitkan"
          error={dialogError}
          onConfirm={() => void publish()}
          onClose={() => setDialog(null)}
        >
          <p role="note" className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-800 dark:text-amber-200">
            Simulasi — di tahap ini artikel diterbitkan lewat PR (docs/CONTENT_GUIDE.md).
          </p>
        </ConfirmDialog>
      )}
      {dialog?.kind === "tarik" && (
        <ReasonDialog
          title="Tarik dari website?"
          description={`"${dialog.content.judul}" kembali menjadi Draf milik Creator, dan alasannya tampil sebagai catatan umum.`}
          confirmLabel="Tarik dari website"
          reasonLabel="Alasan penarikan"
          isDestructive
          error={dialogError}
          onConfirm={(alasan) => void takedown(alasan)}
          onClose={() => setDialog(null)}
        />
      )}
      {dialog?.kind === "riwayat" && <HistoryDialog content={dialog.content} events={events} users={users} onClose={() => setDialog(null)} />}
    </div>
  );
}
