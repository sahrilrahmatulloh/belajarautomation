"use client";

import { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Dialog } from "@base-ui/react/dialog";
import { Bold, Code, Eye, Heading2, Heading3, ImagePlus, Lightbulb, List, Table, TriangleAlert, Video, X } from "lucide-react";

import { creatorStudioActions, useCreatorStudio } from "@/lib/creatorStudio";
import { ARTICLE_CATEGORIES } from "@/types/Article";
import { DraftImage, DraftVideo } from "@/types/RoleDashboard";

import ArticlePreview from "./ArticlePreview";
import { ImageDialog, VideoDialog } from "./EditorDialogs";
import PrototypeNotice from "./PrototypeNotice";

const MAX_VIDEOS = 3;
const WORDS_PER_MINUTE = 200;
const CHECKLIST = [
  "Contoh kode sudah diuji dan berjalan dengan benar.",
  "Data dan informasi memiliki sumber yang jelas.",
  "Bahasa dan penulisan sudah diperiksa.",
  "Konten tetap bisa dipahami tanpa video.",
];

const fieldClass = "mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm dark:bg-card";

const TOOLBAR = [
  { label: "Heading 2", icon: Heading2, before: "\n\n## ", after: "\n\n", fallback: "Judul bagian" },
  { label: "Heading 3", icon: Heading3, before: "\n\n### ", after: "\n\n", fallback: "Sub judul" },
  { label: "Tebal", icon: Bold, before: "**", after: "**", fallback: "teks tebal" },
  { label: "Daftar", icon: List, before: "\n\n- ", after: "\n\n", fallback: "Isi daftar" },
  { label: "Blok kode", icon: Code, before: "\n\n```ts\n", after: "\n```\n\n", fallback: "// tulis kode" },
  { label: "Kotak Tips", icon: Lightbulb, before: "\n\n<Tips>", after: "</Tips>\n\n", fallback: "Isi tips" },
  { label: "Kotak Peringatan", icon: TriangleAlert, before: "\n\n<Peringatan>", after: "</Peringatan>\n\n", fallback: "Isi peringatan" },
  { label: "Tabel", icon: Table, before: "\n\n| Kolom 1 | Kolom 2 |\n|---|---|\n| ", after: " | Isi |\n\n", fallback: "Isi" },
];

// Editor artikel (PRD FR-15, tahap setelah backend), sebagai prototipe.
export default function ArticleEditor() {
  const router = useRouter();
  const contentId = Number(useSearchParams().get("konten")) || null;
  const { contents } = useCreatorStudio();
  const existing = contents.find((content) => content.id === contentId);

  const [id, setId] = useState(existing?.id ?? null);
  const [title, setTitle] = useState(existing?.title ?? "");
  const [excerpt, setExcerpt] = useState(existing?.article?.excerpt ?? "");
  const [category, setCategory] = useState(existing?.category ?? "");
  const [cover, setCover] = useState(existing?.article?.cover ?? "");
  const [cta, setCta] = useState(existing?.article?.cta ?? "");
  const [sources, setSources] = useState(existing?.article?.sources ?? "");
  const [body, setBody] = useState(existing?.article?.body ?? "");
  const [videos, setVideos] = useState<DraftVideo[]>(existing?.article?.videos ?? []);
  const [checked, setChecked] = useState<string[]>([]);
  const [savedAt, setSavedAt] = useState("");
  const [tab, setTab] = useState<"info" | "isi">("info");
  const [videoDialog, setVideoDialog] = useState<{ index: number | null } | null>(null);
  const [imageOpen, setImageOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const wordCount = body.trim() ? body.trim().split(/\s+/).length : 0;
  const readingMinutes = Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
  const isComplete = Boolean(title.trim() && excerpt.trim() && category && cover.trim() && body.trim());
  const canSubmit = isComplete && checked.length === CHECKLIST.length;

  const save = () => {
    const savedId = creatorStudioActions.saveDraft(id, {
      title: title.trim() || "Tanpa judul",
      category,
      article: { excerpt, cover, cta, sources, body, videos },
    });
    setId(savedId);
    setSavedAt(new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }));
    return savedId;
  };

  const insert = (before: string, after: string, fallback: string) => {
    const element = bodyRef.current;
    const start = element?.selectionStart ?? body.length;
    const end = element?.selectionEnd ?? body.length;
    const selected = body.slice(start, end) || fallback;
    setBody(`${body.slice(0, start)}${before}${selected}${after}${body.slice(end)}`.replace(/^\n+/, ""));
    element?.focus();
  };

  const insertImage = ({ fileName, alt, caption }: DraftImage) => {
    insert(`\n\n![${alt}${caption ? ` - ${caption}` : ""}](`, ")\n\n", fileName);
    setImageOpen(false);
  };

  const saveVideo = (video: DraftVideo) => {
    const index = videoDialog?.index ?? null;
    setVideos(index === null ? [...videos, video] : videos.map((item, position) => (position === index ? video : item)));
    setVideoDialog(null);
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5">
      <PrototypeNotice />

      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{existing ? "Edit Konten" : "Buat Artikel"}</h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <span aria-live="polite">{savedAt ? `Tersimpan pukul ${savedAt}` : "Belum disimpan"}</span>
          <span>{wordCount} kata</span>
          <span>≈ {readingMinutes} menit baca</span>
          <button type="button" onClick={() => setPreviewOpen(true)} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-border px-4 font-semibold text-foreground transition-colors hover:bg-accent">
            <Eye className="h-4 w-4" aria-hidden="true" />
            Pratinjau
          </button>
        </div>
      </header>

      {/* Di layar sempit, panel info dan isi dipisah menjadi dua tab. */}
      <div role="group" aria-label="Bagian editor" className="grid grid-cols-2 gap-2 lg:hidden">
        {(["info", "isi"] as const).map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={tab === value}
            onClick={() => setTab(value)}
            className={`min-h-10 rounded-xl border text-sm font-semibold ${tab === value ? "border-primary bg-primary/10 text-primary-accent" : "border-border"}`}
          >
            {value === "info" ? "Informasi" : "Isi Artikel"}
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[20rem_minmax(0,1fr)]">
        <section aria-labelledby="info-artikel" className={`space-y-3 rounded-2xl border border-border bg-card p-4 ${tab === "info" ? "" : "hidden lg:block"}`}>
          <h2 id="info-artikel" className="font-bold">Informasi Artikel</h2>
          <div>
            <label htmlFor="article-title" className="text-sm font-medium">Judul</label>
            <input id="article-title" value={title} onChange={(event) => setTitle(event.target.value)} className={fieldClass} />
          </div>
          <div>
            <label htmlFor="article-excerpt" className="text-sm font-medium">Ringkasan</label>
            <textarea id="article-excerpt" rows={3} value={excerpt} onChange={(event) => setExcerpt(event.target.value)} className={fieldClass} />
          </div>
          <div>
            <label htmlFor="article-category" className="text-sm font-medium">Kategori</label>
            <select id="article-category" value={category} onChange={(event) => setCategory(event.target.value)} className={fieldClass}>
              <option value="">Pilih kategori</option>
              {ARTICLE_CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="article-cover" className="text-sm font-medium">Sampul</label>
            <input id="article-cover" value={cover} onChange={(event) => setCover(event.target.value)} placeholder="Nama file sampul" className={fieldClass} />
          </div>
          <div>
            <label htmlFor="article-cta" className="text-sm font-medium">Ajakan (opsional)</label>
            <input id="article-cta" value={cta} onChange={(event) => setCta(event.target.value)} placeholder="Course atau latihan tujuan" className={fieldClass} />
          </div>
          <div>
            <label htmlFor="article-sources" className="text-sm font-medium">Sumber (opsional)</label>
            <textarea id="article-sources" rows={2} value={sources} onChange={(event) => setSources(event.target.value)} className={fieldClass} />
          </div>
        </section>

        <div className={`min-w-0 space-y-5 ${tab === "isi" ? "" : "hidden lg:block"}`}>
          <section aria-labelledby="isi-artikel" className="rounded-2xl border border-border bg-card p-4">
            <h2 id="isi-artikel" className="font-bold">Isi Artikel</h2>
            <div role="toolbar" aria-label="Format isi" className="mt-3 flex flex-wrap gap-1 border-b border-border pb-2">
              {TOOLBAR.map(({ label, icon: Icon, before, after, fallback }) => (
                <button key={label} type="button" aria-label={label} title={label} onClick={() => insert(before, after, fallback)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-accent">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </button>
              ))}
              <button type="button" aria-label="Upload gambar" title="Upload gambar" onClick={() => setImageOpen(true)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-accent">
                <ImagePlus className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Sisipkan video"
                title={videos.length >= MAX_VIDEOS ? "Maksimal 3 video" : "Sisipkan video"}
                disabled={videos.length >= MAX_VIDEOS}
                onClick={() => setVideoDialog({ index: null })}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors enabled:hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Video className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <textarea
              ref={bodyRef}
              aria-label="Isi artikel"
              rows={16}
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="Mulai menulis di sini..."
              className="mt-3 w-full resize-y rounded-lg border border-input bg-background p-3 font-mono text-sm leading-6 dark:bg-card"
            />

            {videos.length > 0 && (
              <ul aria-label="Referensi video" className="mt-3 space-y-2">
                {videos.map((video, index) => (
                  <li key={video.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border p-3 text-sm">
                    <span className="min-w-0">
                      <span className="block font-semibold">{video.title}</span>
                      <span className="block text-muted-foreground">{video.channel} · {video.duration} · Bahasa {video.language}</span>
                    </span>
                    <span className="flex gap-2">
                      <button type="button" aria-label={`Edit video ${video.title}`} onClick={() => setVideoDialog({ index })} className="min-h-9 rounded-lg border border-border px-3 font-medium transition-colors hover:bg-accent">Edit</button>
                      <button type="button" aria-label={`Hapus video ${video.title}`} onClick={() => setVideos(videos.filter((_, position) => position !== index))} className="min-h-9 rounded-lg border border-destructive/40 px-3 font-medium text-destructive transition-colors hover:bg-destructive/10">Hapus</button>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section aria-labelledby="checklist-kirim" className="rounded-2xl border border-border bg-card p-4">
            <h2 id="checklist-kirim" className="font-bold">Checklist sebelum kirim</h2>
            <div className="mt-3 space-y-2">
              {CHECKLIST.map((item) => (
                <label key={item} className="flex items-start gap-2.5 text-sm">
                  <input
                    type="checkbox"
                    checked={checked.includes(item)}
                    onChange={(event) => setChecked(event.target.checked ? [...checked, item] : checked.filter((value) => value !== item))}
                    className="mt-1 h-4 w-4 accent-primary"
                  />
                  {item}
                </label>
              ))}
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <button type="button" onClick={save} className="min-h-11 rounded-xl border border-border text-sm font-semibold transition-colors hover:bg-accent">Simpan Draf</button>
              <button
                type="button"
                disabled={!canSubmit}
                onClick={() => {
                  creatorStudioActions.submit(save());
                  router.push("/creator/konten");
                }}
                className="min-h-11 rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-colors enabled:hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
              >
                Kirim untuk Review
              </button>
            </div>
            {!canSubmit && <p className="mt-2 text-xs text-muted-foreground">Lengkapi kolom judul, ringkasan, kategori, sampul, dan isi, lalu centang seluruh checklist.</p>}
          </section>
        </div>
      </div>

      {videoDialog && (
        <VideoDialog
          initial={videoDialog.index === null ? null : videos[videoDialog.index]}
          count={videos.length}
          onSave={saveVideo}
          onClose={() => setVideoDialog(null)}
        />
      )}
      {imageOpen && <ImageDialog onSave={insertImage} onClose={() => setImageOpen(false)} />}

      <Dialog.Root open={previewOpen} onOpenChange={setPreviewOpen}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/70" />
          <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-border bg-card p-5 text-foreground shadow-xl">
            <div className="mb-3 flex items-center justify-between gap-3">
              <Dialog.Title className="text-sm font-semibold text-muted-foreground">Pratinjau</Dialog.Title>
              <Dialog.Close aria-label="Tutup" className="inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-accent">
                <X className="h-4 w-4" aria-hidden="true" />
              </Dialog.Close>
            </div>
            <ArticlePreview title={title} body={body} videos={videos} />
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
