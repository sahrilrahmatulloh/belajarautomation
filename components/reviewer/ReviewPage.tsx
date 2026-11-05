"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CircleCheck, Trash2 } from "lucide-react";

import ConfirmDialog from "@/components/common/ConfirmDialog";
import ContentArticleView from "@/components/content/ContentArticleView";
import PrototypeNotice from "@/components/creator/studio/PrototypeNotice";
import { userName } from "@/components/creator/studio/useCreatorData";
import ContentStatusBadge from "@/components/roles/ContentStatusBadge";
import { runContentAction, useContentData } from "@/lib/content";
import { KIND_LABELS, listHeadings, noteLabel } from "@/lib/content/document";
import { REVIEWER_CHECKLIST } from "@/lib/content/rules";
import { useSession } from "@/lib/session";
import { ContentItem, ReviewNote, ReviewNoteKind } from "@/types/ContentWorkflow";

import { submissionLabel } from "./useReviewerData";

const fieldClass = "mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm dark:bg-card";
const panelClass = "rounded-2xl border border-border bg-card p-4";

function NoteForm({ content, userId, onError }: { content: ContentItem; userId: string; onError: (message: string) => void }) {
  const headings = listHeadings(content.body);
  const [kind, setKind] = useState<ReviewNoteKind>("umum");
  const [heading, setHeading] = useState(headings[0]?.id ?? "");
  const [video, setVideo] = useState(content.videos[0]?.id ?? "");
  const [isi, setIsi] = useState("");

  const add = async () => {
    const anchor = kind === "bagian" ? heading : kind === "video" ? video : null;
    const result = await runContentAction((repository) => repository.addNote(userId, content.id, { kind, anchor, isi }));
    onError(result.ok ? "" : result.message);
    if (result.ok) setIsi("");
  };

  return (
    <section aria-labelledby="tambah-catatan" className={panelClass}>
      <h2 id="tambah-catatan" className="font-semibold">Tambah Catatan</h2>
      <label className="mt-3 block text-sm font-medium">
        Jenis catatan
        <select value={kind} onChange={(event) => setKind(event.target.value as ReviewNoteKind)} className={fieldClass}>
          <option value="umum">Catatan umum</option>
          <option value="bagian" disabled={headings.length === 0}>Per bagian</option>
          <option value="video" disabled={content.videos.length === 0}>Per video</option>
        </select>
      </label>
      {kind === "bagian" && (
        <label className="mt-3 block text-sm font-medium">
          Bagian
          <select value={heading} onChange={(event) => setHeading(event.target.value)} className={fieldClass}>
            {headings.map((item) => <option key={item.id} value={item.id}>{item.text}</option>)}
          </select>
        </label>
      )}
      {kind === "video" && (
        <label className="mt-3 block text-sm font-medium">
          Video
          <select value={video} onChange={(event) => setVideo(event.target.value)} className={fieldClass}>
            {content.videos.map((item) => <option key={item.id} value={item.id}>{item.judul}</option>)}
          </select>
        </label>
      )}
      <label className="mt-3 block text-sm font-medium">
        Isi catatan
        <textarea rows={3} value={isi} onChange={(event) => setIsi(event.target.value)} className={fieldClass} />
      </label>
      <button type="button" disabled={!isi.trim()} onClick={() => void add()} className="mt-3 min-h-10 w-full rounded-xl border border-border text-sm font-semibold transition-colors enabled:hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50">
        Tambah catatan
      </button>
    </section>
  );
}

function PreviousNotes({ notes, content }: { notes: ReviewNote[]; content: ContentItem }) {
  if (notes.length === 0) return null;
  return (
    <section aria-labelledby="catatan-sebelumnya" className={panelClass}>
      <h2 id="catatan-sebelumnya" className="font-semibold">Catatan Sebelumnya</h2>
      <ul className="mt-2 space-y-2">
        {notes.map((note) => (
          <li key={note.id} className="rounded-xl border border-border p-3 text-sm">
            <p className="font-medium">{noteLabel(note, content)} · Kiriman ke-{note.round}</p>
            <p className="mt-1 text-muted-foreground">{note.isi}</p>
            {note.creatorReply && <p className="mt-1">Balasan Creator: {note.creatorReply}</p>}
            {note.markedFixed && (
              <p className="mt-1 inline-flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-300">
                <CircleCheck className="h-4 w-4" aria-hidden="true" />
                Sudah diperbaiki
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

// Halaman Review (PRD FR-15): isi konten hanya ditampilkan, perbaikan selalu lewat catatan.
export default function ReviewPage({ contentId }: { contentId: string }) {
  const router = useRouter();
  const session = useSession();
  const userId = session?.userId ?? "";
  const [checked, setChecked] = useState<string[]>([]);
  const [confirming, setConfirming] = useState<"revisi" | "setujui" | null>(null);
  const [error, setError] = useState("");

  const data = useContentData(`review-${contentId}`, async (repository) => {
    const [content, notes, users] = await Promise.all([repository.getContent(contentId), repository.listNotes(contentId), repository.listUsers()]);
    return { content, notes, users };
  });

  if (!data) return <p className="py-10 text-center text-sm text-muted-foreground">Memuat konten...</p>;

  const { content, notes, users } = data;
  // Draf dan konten sebelum dikirim bukan bahan review.
  if (!content || content.submissionCount === 0) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Konten tidak ditemukan</h1>
        <Link href="/reviewer/antrean" className="mt-4 inline-block font-semibold text-primary-accent hover:underline">Kembali ke Antrean Review</Link>
      </div>
    );
  }

  const isWaiting = content.status === "menunggu-review";
  const isOwn = content.authorId === userId;
  const isAssigned = isWaiting && content.reviewerId === userId;
  const canClaim = isWaiting && !content.reviewerId && !isOwn;
  const newNotes = notes.filter((note) => !note.released);
  const previousNotes = notes.filter((note) => note.released);
  const isChecklistDone = checked.length === REVIEWER_CHECKLIST.length;

  const claim = async () => {
    const result = await runContentAction((repository) => repository.claimReview(userId, contentId));
    setError(result.ok ? "" : result.message);
  };

  const removeNote = async (noteId: string) => {
    const result = await runContentAction((repository) => repository.removeNote(userId, noteId));
    setError(result.ok ? "" : result.message);
  };

  const decide = async () => {
    const result = await runContentAction((repository) =>
      confirming === "revisi" ? repository.requestRevision(userId, contentId) : repository.approve(userId, contentId, checked)
    );
    if (result.ok) router.push("/reviewer/antrean");
    else {
      setError(result.message);
      setConfirming(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5">
      <PrototypeNotice />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/reviewer/antrean" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-accent hover:underline">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Kembali ke Antrean Review
        </Link>
        <ContentStatusBadge status={content.status} />
      </div>

      {error && <p role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="min-w-0 rounded-2xl border border-border bg-background p-4 sm:p-6">
          <ContentArticleView content={content} authorName={userName(users, content.authorId)} />
        </div>

        <aside aria-label="Panel review" className="min-w-0 space-y-4">
          <section aria-labelledby="info-konten" className={`${panelClass} text-sm`}>
            <h2 id="info-konten" className="font-semibold">Info Konten</h2>
            <dl className="mt-2 space-y-1.5">
              <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Jenis</dt><dd>{KIND_LABELS[content.type]}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Kategori</dt><dd className="text-right">{content.kategori}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Creator</dt><dd>{userName(users, content.authorId)}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Kiriman</dt><dd>{submissionLabel(content.submissionCount)}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Sumber</dt><dd>{content.sumber.length}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Ajakan</dt><dd>{content.ajakan ? "Ada" : "Tidak ada"}</dd></div>
            </dl>
          </section>

          {content.videos.length > 0 && (
            <section aria-labelledby="referensi-video" className={`${panelClass} text-sm`}>
              <h2 id="referensi-video" className="font-semibold">Referensi Video</h2>
              <ul className="mt-2 space-y-2">
                {content.videos.map((video) => (
                  <li key={video.id} className="rounded-xl border border-border p-3">
                    <p className="font-medium">{video.judul}</p>
                    <p className="text-muted-foreground">{video.channel} · {video.durasi} · Bahasa {video.bahasa}</p>
                    <p className="mt-1">Alasan: {video.alasan}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <PreviousNotes notes={previousNotes} content={content} />

          {isOwn && isWaiting && <p className={`${panelClass} text-sm`}>Ini tulisanmu sendiri, jadi kamu tidak dapat me-review konten ini.</p>}

          {canClaim && (
            <button type="button" onClick={() => void claim()} className="min-h-11 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover">
              Ambil untuk review
            </button>
          )}

          {isAssigned && (
            <>
              <NoteForm content={content} userId={userId} onError={setError} />

              {newNotes.length > 0 && (
                <section aria-labelledby="catatan-baru" className={panelClass}>
                  <h2 id="catatan-baru" className="font-semibold">Catatan Baru ({newNotes.length})</h2>
                  <ul className="mt-2 space-y-2">
                    {newNotes.map((note) => (
                      <li key={note.id} className="flex items-start justify-between gap-2 rounded-xl border border-border p-3 text-sm">
                        <span className="min-w-0">
                          <span className="block font-medium">{noteLabel(note, content)}</span>
                          <span className="block text-muted-foreground">{note.isi}</span>
                        </span>
                        <button type="button" aria-label={`Hapus catatan ${noteLabel(note, content)}`} onClick={() => void removeNote(note.id)} className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-destructive transition-colors hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <section aria-labelledby="checklist-reviewer" className={panelClass}>
                <h2 id="checklist-reviewer" className="font-semibold">Checklist Reviewer</h2>
                <div className="mt-3 space-y-2">
                  {REVIEWER_CHECKLIST.map((item) => (
                    <label key={item.id} className="flex items-start gap-2.5 text-sm">
                      <input
                        type="checkbox"
                        checked={checked.includes(item.id)}
                        onChange={(event) => setChecked(event.target.checked ? [...checked, item.id] : checked.filter((value) => value !== item.id))}
                        className="mt-1 h-4 w-4 accent-primary"
                      />
                      {item.label}
                    </label>
                  ))}
                </div>
              </section>

              <section aria-labelledby="keputusan" className={panelClass}>
                <h2 id="keputusan" className="font-semibold">Keputusan</h2>
                <div className="mt-3 grid gap-2">
                  <button type="button" disabled={newNotes.length === 0} onClick={() => setConfirming("revisi")} className="min-h-11 rounded-xl border border-border text-sm font-semibold transition-colors enabled:hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50">
                    Minta Revisi
                  </button>
                  <button type="button" disabled={!isChecklistDone} onClick={() => setConfirming("setujui")} className="min-h-11 rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-colors enabled:hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground">
                    Setujui
                  </button>
                </div>
                {newNotes.length === 0 && <p className="mt-2 text-xs text-muted-foreground">Minta Revisi butuh minimal satu catatan baru.</p>}
                {!isChecklistDone && <p className="mt-1 text-xs text-muted-foreground">Setujui butuh seluruh checklist dicentang.</p>}
              </section>
            </>
          )}
        </aside>
      </div>

      {confirming === "revisi" && (
        <ConfirmDialog
          title="Minta revisi?"
          description={`${newNotes.length} catatan baru akan dikirim ke Creator, dan konten kembali berstatus Perlu Revisi.`}
          confirmLabel="Minta Revisi"
          onConfirm={() => void decide()}
          onClose={() => setConfirming(null)}
        />
      )}
      {confirming === "setujui" && (
        <ConfirmDialog
          title="Setujui konten ini?"
          description={newNotes.length > 0 ? "Seluruh catatan, termasuk catatan baru yang belum dikirim, akan dinyatakan selesai. Konten lalu menunggu diterbitkan Admin." : "Seluruh catatan akan dinyatakan selesai. Konten lalu menunggu diterbitkan Admin."}
          confirmLabel="Setujui"
          onConfirm={() => void decide()}
          onClose={() => setConfirming(null)}
        />
      )}
    </div>
  );
}
