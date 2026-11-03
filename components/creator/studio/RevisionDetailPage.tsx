"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CircleCheck, Info } from "lucide-react";

import ContentStatusBadge from "@/components/roles/ContentStatusBadge";
import { countFixedNotes, creatorStudioActions, getRevisionThread, useCreatorStudio } from "@/lib/creatorStudio";
import { formatDate } from "@/lib/format";

import PrototypeNotice from "./PrototypeNotice";

// Detail catatan revisi satu konten (PRD FR-15). "Sudah diperbaiki" adalah tanda dari Creator,
// bukan persetujuan; catatan baru selesai setelah dikonfirmasi Reviewer.
export default function RevisionDetailPage({ contentId }: { contentId: number }) {
  const router = useRouter();
  const { contents, notes } = useCreatorStudio();
  const content = contents.find((item) => item.id === contentId);
  const thread = getRevisionThread(contentId);

  if (!content || !thread) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Catatan tidak ditemukan</h1>
        <Link href="/creator/revisi" className="mt-4 inline-block font-semibold text-primary-accent hover:underline">Kembali ke Catatan Revisi</Link>
      </div>
    );
  }

  const fixedCount = countFixedNotes(contentId, notes);
  const total = thread.notes.length;
  const isEditable = content.status === "needs-revision";
  const canResubmit = isEditable && fixedCount === total;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5">
      <PrototypeNotice />

      <header className="flex flex-wrap items-start gap-3">
        <Link href="/creator/revisi" aria-label="Kembali ke Catatan Revisi" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-accent">
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </Link>
        <div className="min-w-0 flex-1 basis-56">
          <h1 className="text-2xl font-bold tracking-tight">Catatan Revisi: {content.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{thread.reviewerName} (Reviewer) · {formatDate(thread.date)}</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
          <CircleCheck className="h-4 w-4" aria-hidden="true" />
          {fixedCount} dari {total} selesai
        </span>
      </header>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <ul aria-label="Daftar catatan" className="min-w-0 space-y-3">
          {thread.notes.map((note) => {
            const state = notes[note.id] ?? { fixed: false, reply: "" };

            return (
              <li key={note.id} className="rounded-2xl border border-border bg-card p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h2 className="font-semibold">{note.section}</h2>
                  <label className={`inline-flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-sm font-medium ${state.fixed ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "border-border"}`}>
                    <input
                      type="checkbox"
                      disabled={!isEditable}
                      checked={state.fixed}
                      onChange={(event) => creatorStudioActions.setNoteFixed(note.id, event.target.checked)}
                      className="h-4 w-4 accent-primary"
                    />
                    Sudah diperbaiki
                    <span className="sr-only">: {note.section}</span>
                  </label>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{note.message}</p>
                <label className="mt-3 block text-sm font-medium">
                  Balasan
                  <span className="sr-only"> untuk {note.section}</span>
                  <input
                    value={state.reply}
                    disabled={!isEditable}
                    onChange={(event) => creatorStudioActions.setNoteReply(note.id, event.target.value)}
                    placeholder="Tulis balasan singkat..."
                    className="mt-1.5 h-10 w-full rounded-lg border border-input bg-background px-3 font-normal disabled:cursor-not-allowed disabled:opacity-70 dark:bg-card"
                  />
                </label>
              </li>
            );
          })}
        </ul>

        <aside className="space-y-3 lg:sticky lg:top-4 lg:self-start">
          <section aria-labelledby="aksi-revisi" className="rounded-2xl border border-border bg-card p-4">
            <h2 id="aksi-revisi" className="font-semibold">Aksi</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Catatan dinyatakan selesai setelah dikonfirmasi Reviewer pada review berikutnya.
            </p>
            <button
              type="button"
              disabled={!canResubmit}
              onClick={() => {
                creatorStudioActions.submit(contentId);
                router.push("/creator/revisi");
              }}
              className="mt-3 min-h-11 w-full rounded-xl bg-primary px-3 text-sm font-semibold text-primary-foreground transition-colors enabled:hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
            >
              Kirim ulang untuk Review
            </button>
            {isEditable && !canResubmit && (
              <p className="mt-2 flex items-start gap-2 text-xs leading-5 text-muted-foreground">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                Tandai semua catatan ({fixedCount} dari {total} selesai) untuk mengirim ulang.
              </p>
            )}
          </section>

          <section aria-labelledby="detail-konten" className="rounded-2xl border border-border bg-card p-4 text-sm">
            <h2 id="detail-konten" className="font-semibold">Detail Konten</h2>
            <dl className="mt-2 space-y-1.5">
              <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Jenis</dt><dd>{content.type}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Kategori</dt><dd className="text-right">{content.category}</dd></div>
              <div className="flex items-center justify-between gap-3"><dt className="text-muted-foreground">Status</dt><dd><ContentStatusBadge status={content.status} /></dd></div>
            </dl>
          </section>
        </aside>
      </div>
    </div>
  );
}
