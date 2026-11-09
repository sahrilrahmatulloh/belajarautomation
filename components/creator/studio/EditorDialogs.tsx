"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Dialog } from "@base-ui/react/dialog";
import { CircleAlert, Clock3, LoaderCircle, TriangleAlert, UploadCloud, X } from "lucide-react";

import type { YoutubeLookup } from "@/app/api/youtube-oembed/route";
import { prepareImage, validateImage } from "@/lib/content/imageUpload";
import { MAX_VIDEOS, parseYoutubeId } from "@/lib/content/rules";
import { ContentVideo } from "@/types/ContentWorkflow";

const inputClass = "mt-1.5 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm dark:bg-card";
const DURATION = /^\d{1,2}:\d{2}(:\d{2})?$/;

export function EditorDialog({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
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

function WarningText({ children }: { children: React.ReactNode }) {
  return (
    <p role="status" className="mt-3 flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-800 dark:text-amber-200">
      <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      {children}
    </p>
  );
}

const footerClass = "mt-5 flex justify-end gap-2";
const cancelClass = "min-h-10 rounded-xl border border-border px-4 text-sm font-semibold transition-colors hover:bg-accent";
const submitClass = "min-h-10 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors enabled:hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground";

type LookupState = YoutubeLookup | { status: "idle" | "memuat" };

export function VideoDialog({
  initial,
  usedIds,
  onSave,
  onClose,
}: {
  initial: ContentVideo | null;
  // Id video lain yang sudah ada di konten ini.
  usedIds: string[];
  onSave: (video: ContentVideo) => void;
  onClose: () => void;
}) {
  const [link, setLink] = useState(initial ? `https://www.youtube.com/watch?v=${initial.id}` : "");
  const [lookup, setLookup] = useState<LookupState>(
    initial ? (initial.embed ? { status: "ok", judul: initial.judul, channel: initial.channel } : { status: "embed-mati" }) : { status: "idle" }
  );
  const [judul, setJudul] = useState(initial?.judul ?? "");
  const [channel, setChannel] = useState(initial?.channel ?? "");
  const [durasi, setDurasi] = useState(initial?.durasi ?? "");
  const [bahasa, setBahasa] = useState(initial?.bahasa ?? "Indonesia");
  const [alasan, setAlasan] = useState(initial?.alasan ?? "");
  const latestRequest = useRef(0);

  const id = parseYoutubeId(link);
  const isLinkInvalid = link.trim() !== "" && !id;
  const isDuplicate = Boolean(id && usedIds.includes(id));
  const isManual = lookup.status === "embed-mati" || lookup.status === "tidak-tersedia";
  const isComplete =
    Boolean(id && judul.trim() && channel.trim() && DURATION.test(durasi.trim()) && alasan.trim()) &&
    !isDuplicate &&
    lookup.status !== "memuat" &&
    lookup.status !== "tidak-ditemukan";

  const changeLink = async (value: string) => {
    setLink(value);
    const nextId = parseYoutubeId(value);
    const request = ++latestRequest.current;
    setJudul("");
    setChannel("");
    if (!nextId) {
      setLookup({ status: "idle" });
      return;
    }
    setLookup({ status: "memuat" });
    let result: YoutubeLookup = { status: "tidak-tersedia" };
    try {
      const response = await fetch(`/api/youtube-oembed?id=${nextId}`);
      result = (await response.json()) as YoutubeLookup;
    } catch {
      // Tetap "tidak-tersedia": Creator mengisi judul dan channel sendiri.
    }
    if (request !== latestRequest.current) return;
    setLookup(result);
    if (result.status === "ok") {
      setJudul(result.judul);
      setChannel(result.channel);
    }
  };

  return (
    <EditorDialog title="Sisipkan Video YouTube" onClose={onClose}>
      <p className="mt-1 text-sm text-muted-foreground">{usedIds.length + 1} dari {MAX_VIDEOS} video</p>

      <div className="mt-4">
        <label htmlFor="video-link" className="text-sm font-medium">Link YouTube</label>
        <input id="video-link" value={link} onChange={(event) => void changeLink(event.target.value)} placeholder="https://www.youtube.com/watch?v=..." className={inputClass} />
      </div>

      {isLinkInvalid && <ErrorText>Link tidak valid. Pastikan link YouTube sudah benar.</ErrorText>}
      {isDuplicate && <ErrorText>Video ini sudah disisipkan di konten ini.</ErrorText>}
      {lookup.status === "memuat" && (
        <p role="status" className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
          Mengambil judul dan channel...
        </p>
      )}
      {lookup.status === "tidak-ditemukan" && <ErrorText>Video tidak ditemukan. Periksa kembali link-nya.</ErrorText>}
      {lookup.status === "embed-mati" && <WarningText>Video tidak bisa di-embed karena pemiliknya mematikan embed. Video akan tampil sebagai tautan.</WarningText>}
      {lookup.status === "tidak-tersedia" && <WarningText>Judul dan channel tidak bisa diambil otomatis. Isi secara manual.</WarningText>}

      {lookup.status === "ok" && id && (
        <div className="mt-3 flex items-center gap-3 rounded-xl border border-border p-3">
          <div className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-lg bg-muted">
            <Image src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" fill sizes="112px" className="object-cover" />
          </div>
          <p className="min-w-0 text-sm">
            <span className="block font-semibold">{judul}</span>
            <span className="block text-muted-foreground">{channel}</span>
          </p>
        </div>
      )}

      {isManual && (
        <>
          <div className="mt-3">
            <label htmlFor="video-title" className="text-sm font-medium">Judul video</label>
            <input id="video-title" value={judul} onChange={(event) => setJudul(event.target.value)} className={inputClass} />
          </div>
          <div className="mt-3">
            <label htmlFor="video-channel" className="text-sm font-medium">Nama channel</label>
            <input id="video-channel" value={channel} onChange={(event) => setChannel(event.target.value)} className={inputClass} />
          </div>
        </>
      )}

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="video-duration" className="flex items-center gap-1.5 text-sm font-medium">
            <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
            Durasi
          </label>
          <input id="video-duration" value={durasi} onChange={(event) => setDurasi(event.target.value)} placeholder="12:34" className={inputClass} />
        </div>
        <div>
          <label htmlFor="video-language" className="text-sm font-medium">Bahasa video</label>
          <select id="video-language" value={bahasa} onChange={(event) => setBahasa(event.target.value)} className={inputClass}>
            <option value="Indonesia">Bahasa Indonesia</option>
            <option value="Inggris">Bahasa Inggris</option>
          </select>
        </div>
      </div>

      <div className="mt-3">
        <label htmlFor="video-reason" className="text-sm font-medium">Alasan memilih video ini</label>
        <textarea id="video-reason" rows={3} value={alasan} onChange={(event) => setAlasan(event.target.value)} className="mt-1.5 w-full rounded-lg border border-input bg-background p-3 text-sm dark:bg-card" />
        <p className="mt-1 text-xs text-muted-foreground">Hanya terlihat oleh Reviewer.</p>
      </div>

      <div className={footerClass}>
        <button type="button" onClick={onClose} className={cancelClass}>Batal</button>
        <button
          type="button"
          disabled={!isComplete}
          onClick={() =>
            id && onSave({ id, judul: judul.trim(), channel: channel.trim(), durasi: durasi.trim(), bahasa, embed: lookup.status !== "embed-mati", alasan: alasan.trim() })
          }
          className={submitClass}
        >
          {initial ? "Simpan Video" : "Sisipkan Video"}
        </button>
      </div>
    </EditorDialog>
  );
}

export function ImageDialog({ onSave, onClose }: { onSave: (image: { src: string; alt: string; keterangan: string }) => void; onClose: () => void }) {
  const [src, setSrc] = useState("");
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [alt, setAlt] = useState("");
  const [keterangan, setKeterangan] = useState("");

  const pickFile = async (file: File | undefined) => {
    if (!file) return;
    setSrc("");
    setFileName("");
    const problem = validateImage(file);
    setError(problem ?? "");
    if (problem) return;
    setIsUploading(true);
    try {
      setSrc(await prepareImage(file));
      setFileName(file.name);
    } catch (reason) {
      setError((reason as Error).message);
    }
    setIsUploading(false);
  };

  return (
    <EditorDialog title="Upload Gambar" onClose={onClose}>
      <p className="mt-1 text-sm text-muted-foreground">Simulasi: gambar hanya tersimpan di browser ini sampai backend tersedia.</p>
      <label
        data-testid="area-upload"
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          void pickFile(event.dataTransfer.files[0]);
        }}
        className={`mt-4 flex cursor-pointer flex-col items-center rounded-xl border border-dashed p-6 text-center text-sm focus-within:ring-2 focus-within:ring-ring ${isDragging ? "border-primary bg-primary/10" : "border-primary/40 bg-primary/5"}`}
      >
        <UploadCloud className="h-7 w-7 text-primary-accent" aria-hidden="true" />
        <span className="mt-2 font-medium">Seret dan lepas gambar di sini, atau pilih file</span>
        <span className="mt-1 text-xs text-muted-foreground">Format JPG, PNG, WebP. Ukuran maksimal 2 MB.</span>
        <input
          type="file"
          aria-label="Pilih file gambar"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(event) => void pickFile(event.target.files?.[0])}
        />
      </label>
      {isUploading && (
        <p role="status" className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
          Mengunggah gambar...
        </p>
      )}
      {error && <ErrorText>{error}</ErrorText>}
      {fileName && <p className="mt-2 text-sm font-medium">{fileName}</p>}

      <div className="mt-3">
        <label htmlFor="image-alt" className="text-sm font-medium">Teks alternatif</label>
        <input id="image-alt" value={alt} onChange={(event) => setAlt(event.target.value)} className={inputClass} />
      </div>
      <div className="mt-3">
        <label htmlFor="image-caption" className="text-sm font-medium">Keterangan (opsional)</label>
        <input id="image-caption" value={keterangan} onChange={(event) => setKeterangan(event.target.value)} className={inputClass} />
      </div>

      <div className={footerClass}>
        <button type="button" onClick={onClose} className={cancelClass}>Batal</button>
        <button type="button" disabled={!src || !alt.trim()} onClick={() => onSave({ src, alt: alt.trim(), keterangan: keterangan.trim() })} className={submitClass}>
          Upload
        </button>
      </div>
    </EditorDialog>
  );
}
