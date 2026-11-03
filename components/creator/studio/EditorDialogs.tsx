"use client";

import { useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { CircleAlert, UploadCloud, X } from "lucide-react";

import { DraftImage, DraftVideo } from "@/types/RoleDashboard";

const inputClass = "mt-1.5 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm dark:bg-card";
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

export function parseYoutubeId(link: string) {
  return link.trim().match(/(?:youtube\.com\/watch\?(?:.*&)?v=|youtu\.be\/)([A-Za-z0-9_-]{11})(?:[&?#].*)?$/)?.[1] ?? null;
}

// Pesan error gambar, atau null bila valid (mockup Upload Gambar).
export function validateImage(file: { type: string; size: number }) {
  if (!IMAGE_TYPES.includes(file.type)) return "Format tidak didukung. Gunakan JPG, PNG, atau WEBP.";
  if (file.size > MAX_IMAGE_BYTES) return "Ukuran file terlalu besar. Ukuran maksimal 2 MB.";
  return null;
}

function EditorDialog({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/70" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-border bg-card p-5 text-foreground shadow-xl">
          <div className="flex items-center justify-between gap-3">
            <Dialog.Title className="text-lg font-bold">{title}</Dialog.Title>
            <Dialog.Close aria-label="Tutup" className="inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-accent">
              <X className="h-4 w-4" aria-hidden="true" />
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="mt-3 flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
      <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      {children}
    </p>
  );
}

const footerClass = "mt-5 flex justify-end gap-2";
const cancelClass = "min-h-10 rounded-xl border border-border px-4 text-sm font-semibold transition-colors hover:bg-accent";
const submitClass = "min-h-10 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors enabled:hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground";

export function VideoDialog({
  initial,
  count,
  onSave,
  onClose,
}: {
  initial: DraftVideo | null;
  count: number;
  onSave: (video: DraftVideo) => void;
  onClose: () => void;
}) {
  const [link, setLink] = useState(initial ? `https://www.youtube.com/watch?v=${initial.id}` : "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [channel, setChannel] = useState(initial?.channel ?? "");
  const [duration, setDuration] = useState(initial?.duration ?? "");
  const [language, setLanguage] = useState(initial?.language ?? "Indonesia");
  const [reason, setReason] = useState(initial?.reason ?? "");

  const id = parseYoutubeId(link);
  const isLinkInvalid = link.trim() !== "" && !id;
  const isComplete = Boolean(id && title.trim() && channel.trim() && duration.trim() && reason.trim());

  return (
    <EditorDialog title="Sisipkan Video YouTube" onClose={onClose}>
      <p className="mt-1 text-sm text-muted-foreground">{initial ? count : count + 1} dari 3 video</p>

      <div className="mt-4">
        <label htmlFor="video-link" className="text-sm font-medium">Link YouTube</label>
        <input id="video-link" value={link} onChange={(event) => setLink(event.target.value)} placeholder="https://www.youtube.com/watch?v=..." className={inputClass} />
      </div>
      {isLinkInvalid && <ErrorText>Link tidak valid. Pastikan link YouTube sudah benar.</ErrorText>}

      <div className="mt-3">
        <label htmlFor="video-title" className="text-sm font-medium">Judul video</label>
        <input id="video-title" value={title} onChange={(event) => setTitle(event.target.value)} className={inputClass} />
      </div>
      <div className="mt-3">
        <label htmlFor="video-channel" className="text-sm font-medium">Nama channel</label>
        <input id="video-channel" value={channel} onChange={(event) => setChannel(event.target.value)} className={inputClass} />
      </div>
      <p className="mt-1.5 text-xs text-muted-foreground">Judul dan channel terisi otomatis setelah backend tersedia.</p>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="video-duration" className="text-sm font-medium">Durasi</label>
          <input id="video-duration" value={duration} onChange={(event) => setDuration(event.target.value)} placeholder="12:34" className={inputClass} />
        </div>
        <div>
          <label htmlFor="video-language" className="text-sm font-medium">Bahasa video</label>
          <select id="video-language" value={language} onChange={(event) => setLanguage(event.target.value)} className={inputClass}>
            <option value="Indonesia">Bahasa Indonesia</option>
            <option value="Inggris">Bahasa Inggris</option>
          </select>
        </div>
      </div>

      <div className="mt-3">
        <label htmlFor="video-reason" className="text-sm font-medium">Alasan memilih video ini</label>
        <textarea id="video-reason" rows={3} value={reason} onChange={(event) => setReason(event.target.value)} className="mt-1.5 w-full rounded-lg border border-input bg-background p-3 text-sm dark:bg-card" />
        <p className="mt-1 text-xs text-muted-foreground">Hanya terlihat oleh Reviewer.</p>
      </div>

      <div className={footerClass}>
        <button type="button" onClick={onClose} className={cancelClass}>Batal</button>
        <button
          type="button"
          disabled={!isComplete}
          onClick={() => id && onSave({ id, title: title.trim(), channel: channel.trim(), duration: duration.trim(), language, reason: reason.trim() })}
          className={submitClass}
        >
          Sisipkan Video
        </button>
      </div>
    </EditorDialog>
  );
}

export function ImageDialog({ onSave, onClose }: { onSave: (image: DraftImage) => void; onClose: () => void }) {
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [alt, setAlt] = useState("");
  const [caption, setCaption] = useState("");

  return (
    <EditorDialog title="Upload Gambar" onClose={onClose}>
      <label className="mt-4 flex cursor-pointer flex-col items-center rounded-xl border border-dashed border-primary/40 bg-primary/5 p-6 text-center text-sm focus-within:ring-2 focus-within:ring-ring">
        <UploadCloud className="h-7 w-7 text-primary-accent" aria-hidden="true" />
        <span className="mt-2 font-medium">Pilih file gambar</span>
        <span className="mt-1 text-xs text-muted-foreground">Format JPG, PNG, WEBP. Ukuran maksimal 2 MB.</span>
        <input
          type="file"
          aria-label="Pilih file gambar"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            const problem = validateImage(file);
            setError(problem ?? "");
            setFileName(problem ? "" : file.name);
          }}
        />
      </label>
      {error && <ErrorText>{error}</ErrorText>}
      {fileName && <p className="mt-2 text-sm font-medium">{fileName}</p>}

      <div className="mt-3">
        <label htmlFor="image-alt" className="text-sm font-medium">Teks alternatif</label>
        <input id="image-alt" value={alt} onChange={(event) => setAlt(event.target.value)} className={inputClass} />
      </div>
      <div className="mt-3">
        <label htmlFor="image-caption" className="text-sm font-medium">Keterangan (opsional)</label>
        <input id="image-caption" value={caption} onChange={(event) => setCaption(event.target.value)} className={inputClass} />
      </div>

      <div className={footerClass}>
        <button type="button" onClick={onClose} className={cancelClass}>Batal</button>
        <button
          type="button"
          disabled={!fileName || !alt.trim()}
          onClick={() => onSave({ fileName, alt: alt.trim(), caption: caption.trim() })}
          className={submitClass}
        >
          Upload
        </button>
      </div>
    </EditorDialog>
  );
}
