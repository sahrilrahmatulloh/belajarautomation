"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CircleCheck, Info } from "lucide-react";

import ContentStatusBadge from "@/components/roles/ContentStatusBadge";
import { runContentAction } from "@/lib/content";
import { formatContentDate, KIND_LABELS, listHeadings } from "@/lib/content/document";
import { latestRoundNotes } from "@/lib/content/rules";
import { ContentItem, ReviewNote } from "@/types/ContentWorkflow";

import PrototypeNotice from "./PrototypeNotice";
import { useCreatorData, userName } from "./useCreatorData";

export function noteLabel(note: ReviewNote, content: ContentItem) {
  if (note.kind === "umum") return "Catatan Umum";
  if (note.kind === "bagian") return `Bagian: ${listHeadings(content.body).find((heading) => heading.id === note.anchor)?.text ?? note.anchor}`;
  return `Video: ${content.videos.find((video) => video.id === note.anchor)?.judul ?? note.anchor}`;
}

function NoteCard({ note, content, userId, isEditable, onError }: { note: ReviewNote; content: ContentItem; userId: string; isEditable: boolean; onError: (message: string) => void }) {
  const [reply, setReply] = useState(note.creatorReply);
  const label = noteLabel(note, content);

  const saveReply = async () => {
    if (reply === note.creatorReply) return;
    const result = await runContentAction((repository) => repository.replyToNote(userId, note.id, reply));
    onError(result.ok ? "" : result.message);
  };

  const toggleFixed = async (fixed: boolean) => {
    const result = await runContentAction((repository) => repository.setNoteFixed(userId, note.id, fixed));
    onError(result.ok ? "" : result.message);
  };

  return (
    <li className="rounded-2xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        {note.anchor ? (
          <Link href={`/creator/buat/artikel?konten=${content.id}&bagian=${encodeURIComponent(note.anchor)}`} className="font-semibold text-primary-accent underline-offset-2 hover:underline">
            {label}
          </Link>
        ) : (
          <h2 className="font-semibold">{label}</h2>
        )}
        <label className={`inline-flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-sm font-medium ${note.markedFixed ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "border-border"}`}>
          <input type="checkbox" disabled={!isEditable} checked={note.markedFixed} onChange={(event) => void toggleFixed(event.target.checked)} className="h-4 w-4 accent-primary" />
          Sudah diperbaiki
          <span className="sr-only">: {label}</span>
        </label>
      </div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{note.isi}</p>
      <label className="mt-3 block text-sm font-medium">
        Balasan
        <span className="sr-only"> untuk {label}</span>
        <input
          value={reply}
          disabled={!isEditable}
          onChange={(event) => setReply(event.target.value)}
          onBlur={() => void saveReply()}
          placeholder="Tulis balasan singkat..."
          className="mt-1.5 h-10 w-full rounded-lg border border-input bg-background px-3 font-normal disabled:cursor-not-allowed disabled:opacity-70 dark:bg-card"
        />
      </label>
    </li>
  );
}

// Detail catatan revisi satu konten (PRD FR-15). "Sudah diperbaiki" adalah tanda dari Creator,
// bukan persetujuan; catatan dinyatakan selesai saat Reviewer menyetujui konten.
export default function RevisionDetailPage({ contentId }: { contentId: string }) {
  const router = useRouter();
  const { userId, data } = useCreatorData();
  const [error, setError] = useState("");

  if (!data) return <p className="py-10 text-center text-sm text-muted-foreground">Memuat catatan...</p>;

  const content = data.contents.find((item) => item.id === contentId);
  const allNotes = data.notes.filter((note) => note.contentId === contentId);
  const notes = latestRoundNotes(allNotes);
  const earlier = allNotes.filter((note) => !notes.includes(note));

  if (!content || notes.length === 0) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Catatan tidak ditemukan</h1>
        <Link href="/creator/revisi" className="mt-4 inline-block font-semibold text-primary-accent hover:underline">Kembali ke Catatan Revisi</Link>
      </div>
    );
  }

  const fixedCount = notes.filter((note) => note.markedFixed).length;
  const isEditable = content.status === "perlu-revisi";
  const canResubmit = isEditable && fixedCount === notes.length;

  const resubmit = async () => {
    const result = await runContentAction((repository) => repository.resubmit(userId, contentId));
    if (result.ok) router.push("/creator/revisi");
    else setError(result.message);
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5">
      <PrototypeNotice />

      <header className="flex flex-wrap items-start gap-3">
        <Link href="/creator/revisi" aria-label="Kembali ke Catatan Revisi" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-accent">
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </Link>
        <div className="min-w-0 flex-1 basis-56">
          <h1 className="text-2xl font-bold tracking-tight">Catatan Revisi: {content.judul}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{userName(data.users, notes[0].reviewerId)} · {formatContentDate(notes[0].createdAt)}</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
          <CircleCheck className="h-4 w-4" aria-hidden="true" />
          {fixedCount} dari {notes.length} selesai
        </span>
      </header>

      {error && <p role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="min-w-0 space-y-5">
          <ul aria-label="Daftar catatan" className="space-y-3">
            {notes.map((note) => (
              <NoteCard key={note.id} note={note} content={content} userId={userId} isEditable={isEditable} onError={setError} />
            ))}
          </ul>

          {earlier.length > 0 && (
            <section aria-labelledby="catatan-sebelumnya">
              <h2 id="catatan-sebelumnya" className="font-semibold">Catatan kiriman sebelumnya</h2>
              <ul className="mt-2 space-y-2">
                {earlier.map((note) => (
                  <li key={note.id} className="rounded-xl border border-border p-3 text-sm">
                    <p className="font-medium">{noteLabel(note, content)} · Kiriman ke-{note.round}</p>
                    <p className="mt-1 text-muted-foreground">{note.isi}</p>
                    {note.creatorReply && <p className="mt-1">Balasan: {note.creatorReply}</p>}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="space-y-3 lg:sticky lg:top-4 lg:self-start">
          <section aria-labelledby="aksi-revisi" className="rounded-2xl border border-border bg-card p-4">
            <h2 id="aksi-revisi" className="font-semibold">Aksi</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Seluruh catatan dinyatakan selesai saat Reviewer menyetujui konten.
            </p>
            {content.status === "draf" ? (
              <Link href={`/creator/buat/artikel?konten=${content.id}`} className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-primary px-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover">
                Perbaiki di editor
              </Link>
            ) : (
              <button
                type="button"
                disabled={!canResubmit}
                onClick={() => void resubmit()}
                className="mt-3 min-h-11 w-full rounded-xl bg-primary px-3 text-sm font-semibold text-primary-foreground transition-colors enabled:hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
              >
                Kirim ulang untuk Review
              </button>
            )}
            {isEditable && !canResubmit && (
              <p className="mt-2 flex items-start gap-2 text-xs leading-5 text-muted-foreground">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                Tandai semua catatan ({fixedCount} dari {notes.length} selesai) untuk mengirim ulang.
              </p>
            )}
          </section>

          <section aria-labelledby="detail-konten" className="rounded-2xl border border-border bg-card p-4 text-sm">
            <h2 id="detail-konten" className="font-semibold">Detail Konten</h2>
            <dl className="mt-2 space-y-1.5">
              <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Jenis</dt><dd>{KIND_LABELS[content.type]}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Kategori</dt><dd className="text-right">{content.kategori}</dd></div>
              <div className="flex items-center justify-between gap-3"><dt className="text-muted-foreground">Status</dt><dd><ContentStatusBadge status={content.status} /></dd></div>
            </dl>
          </section>
        </aside>
      </div>
    </div>
  );
}
