"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Dialog } from "@base-ui/react/dialog";
import { Eye, Plus, Trash2, X } from "lucide-react";

import ContentArticleView from "@/components/content/ContentArticleView";
import { CHALLENGES } from "@/data/challenges";
import { COURSES } from "@/data/courses";
import { getContentRepository, runContentAction } from "@/lib/content";
import { collectVideos, countWords, readingMinutes } from "@/lib/content/document";
import { prepareImage, validateImage } from "@/lib/content/imageUpload";
import { CREATOR_CHECKLIST, missingRequiredFields } from "@/lib/content/rules";
import { useSession } from "@/lib/session";
import { ARTICLE_CATEGORIES } from "@/types/Article";
import { ContentCta, ContentItem, ContentNode, ContentSource } from "@/types/ContentWorkflow";

import PrototypeNotice from "./PrototypeNotice";
import RichTextEditor from "./RichTextEditor";

const AUTOSAVE_DELAY = 1500;
const fieldClass = "mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm dark:bg-card";
const EMPTY_BODY: ContentNode = { type: "doc", content: [{ type: "paragraph" }] };

const CTA_OPTIONS = {
  course: COURSES.filter((course) => course.availability === "available").map((course) => ({ slug: course.slug, title: course.title })),
  practice: CHALLENGES.map((challenge) => ({ slug: challenge.slug, title: challenge.title })),
};

function SavedStatus({ savedAt, error }: { savedAt: number | null; error: string }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  if (error) return <span role="alert" className="font-medium text-destructive">{error}</span>;
  if (savedAt === null) return <span>Belum disimpan</span>;
  const seconds = Math.max(0, Math.floor((now - savedAt) / 1000));
  const label = seconds < 5 ? "baru saja" : seconds < 60 ? `${seconds} detik lalu` : `${Math.floor(seconds / 60)} menit lalu`;
  return <span>Tersimpan {label}</span>;
}

function CoverField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [error, setError] = useState("");

  const pickFile = async (file: File | undefined) => {
    if (!file) return;
    const problem = validateImage(file);
    setError(problem ?? "");
    if (problem) return;
    try {
      onChange(await prepareImage(file));
    } catch (reason) {
      setError((reason as Error).message);
    }
  };

  return (
    <div>
      <label htmlFor="article-cover" className="text-sm font-medium">Sampul</label>
      {value && (
        <div className="mt-1.5 flex items-center gap-2">
          {/* Bisa berupa data URL hasil simulasi upload. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Pratinjau sampul" className="aspect-video w-28 rounded-lg border border-border object-cover" />
          <button type="button" aria-label="Hapus sampul" onClick={() => onChange("")} className="inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-accent">
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
      <input
        id="article-cover"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(event) => void pickFile(event.target.files?.[0])}
        className="mt-1.5 block w-full text-sm file:mr-3 file:min-h-9 file:rounded-lg file:border file:border-border file:bg-transparent file:px-3 file:font-medium"
      />
      <p className="mt-1 text-xs text-muted-foreground">Simulasi. JPG, PNG, WebP, maksimal 2 MB.</p>
      {error && <p role="alert" className="mt-1 text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}

function SourcesField({ value, onChange }: { value: ContentSource[]; onChange: (value: ContentSource[]) => void }) {
  const update = (index: number, field: keyof ContentSource, text: string) =>
    onChange(value.map((source, position) => (position === index ? { ...source, [field]: text } : source)));

  return (
    <fieldset>
      <legend className="text-sm font-medium">Sumber (opsional)</legend>
      <div className="mt-1.5 space-y-2">
        {value.map((source, index) => (
          <div key={index} className="space-y-1.5 rounded-lg border border-border p-2">
            <input aria-label={`Judul sumber ${index + 1}`} value={source.title} onChange={(event) => update(index, "title", event.target.value)} placeholder="Judul sumber" className={fieldClass} />
            <input aria-label={`Tautan sumber ${index + 1}`} type="url" value={source.url} onChange={(event) => update(index, "url", event.target.value)} placeholder="https://..." className={fieldClass} />
            <button type="button" onClick={() => onChange(value.filter((_, position) => position !== index))} className="text-xs font-medium text-destructive hover:underline">
              Hapus sumber {index + 1}
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onChange([...value, { title: "", url: "" }])} className="mt-2 inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm font-medium transition-colors hover:bg-accent">
        <Plus className="h-4 w-4" aria-hidden="true" />
        Tambah sumber
      </button>
    </fieldset>
  );
}

function EditorForm({ existing, userId, userName, focusAnchor }: { existing: ContentItem | null; userId: string; userName: string; focusAnchor: string | null }) {
  const router = useRouter();
  const [judul, setJudul] = useState(existing?.judul ?? "");
  const [ringkasan, setRingkasan] = useState(existing?.ringkasan ?? "");
  const [kategori, setKategori] = useState(existing?.kategori ?? "");
  const [sampul, setSampul] = useState(existing?.sampul ?? "");
  const [ajakan, setAjakan] = useState<ContentCta | null>(existing?.ajakan ?? null);
  const [sumber, setSumber] = useState<ContentSource[]>(existing?.sumber ?? []);
  const [body, setBody] = useState<ContentNode>(existing?.body ?? EMPTY_BODY);
  const [checked, setChecked] = useState<string[]>([]);
  const [savedAt, setSavedAt] = useState<number | null>(existing ? Date.parse(existing.updatedAt) : null);
  const [saveError, setSaveError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [tab, setTab] = useState<"info" | "isi">(focusAnchor ? "isi" : "info");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  // Tetap terisi setelah ditutup, karena dialog masih tampil selama animasi keluar.
  const [previewAt, setPreviewAt] = useState("");

  // Simpan otomatis berjalan berurutan agar draf baru tidak terbuat dua kali.
  const contentId = useRef(existing?.id ?? null);
  const saveQueue = useRef<Promise<unknown>>(Promise.resolve());
  const savedSnapshot = useRef<string | null>(null);
  const isRevision = existing?.status === "perlu-revisi";

  const input = { judul, ringkasan, kategori, sampul, ajakan, sumber, body, videos: collectVideos(body) };

  const save = () => {
    savedSnapshot.current = JSON.stringify(input);
    const task = saveQueue.current.then(async () => {
      const id = contentId.current;
      const result = await runContentAction((repository) => (id ? repository.updateDraft(userId, id, input) : repository.createDraft(userId, input)));
      if (!result.ok) {
        setSaveError(result.message);
        return false;
      }
      setSaveError("");
      setSavedAt(Date.now());
      if (!id) {
        contentId.current = result.data.id;
        window.history.replaceState(null, "", `/creator/buat/artikel?konten=${result.data.id}`);
      }
      return true;
    });
    saveQueue.current = task;
    return task;
  };

  // Hanya menyimpan bila isian berubah, agar membuka editor tidak membuat draf kosong.
  const saveIfChanged = () => {
    if (savedSnapshot.current !== null && savedSnapshot.current !== JSON.stringify(input)) void save();
  };
  const latestSaveIfChanged = useRef(saveIfChanged);
  useEffect(() => {
    latestSaveIfChanged.current = saveIfChanged;
    savedSnapshot.current ??= JSON.stringify(input);
  });

  useEffect(() => {
    const timer = window.setTimeout(() => latestSaveIfChanged.current(), AUTOSAVE_DELAY);
    return () => window.clearTimeout(timer);
  }, [judul, ringkasan, kategori, sampul, ajakan, sumber, body]);

  // Perubahan terakhir tetap tersimpan saat Creator meninggalkan editor sebelum jeda selesai.
  useEffect(() => () => latestSaveIfChanged.current(), []);

  const words = countWords(body);
  const missing = missingRequiredFields({ judul, ringkasan, kategori, sampul, body });
  const isChecklistDone = checked.length === CREATOR_CHECKLIST.length;
  const canSubmit = missing.length === 0 && isChecklistDone;

  const submit = async () => {
    if (!(await save())) return;
    const id = contentId.current;
    if (!id) return;
    const result = await runContentAction((repository) => repository.submitForReview(userId, id, checked));
    if (!result.ok) {
      setSubmitError(result.message);
      return;
    }
    router.push("/creator/konten");
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5">
      <PrototypeNotice />

      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-primary-accent">
            <Link href="/creator/konten" className="hover:underline">Konten Saya</Link> › Artikel
          </p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{existing ? "Edit Artikel" : "Buat Artikel"}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <span aria-live="polite"><SavedStatus savedAt={savedAt} error={saveError} /></span>
          <span>{words} kata</span>
          <span>≈ {readingMinutes(words)} menit baca</span>
          <button type="button" onClick={() => {
              setPreviewAt(new Date().toISOString());
              setIsPreviewOpen(true);
            }} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-border px-4 font-semibold text-foreground transition-colors hover:bg-accent">
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
        <section aria-labelledby="info-artikel" className={`space-y-3 self-start rounded-2xl border border-border bg-card p-4 ${tab === "info" ? "" : "hidden lg:block"}`}>
          <h2 id="info-artikel" className="font-bold">Informasi Artikel</h2>
          <div>
            <label htmlFor="article-title" className="text-sm font-medium">Judul</label>
            <input id="article-title" value={judul} onChange={(event) => setJudul(event.target.value)} className={fieldClass} />
          </div>
          <div>
            <label htmlFor="article-excerpt" className="text-sm font-medium">Ringkasan</label>
            <textarea id="article-excerpt" rows={3} value={ringkasan} onChange={(event) => setRingkasan(event.target.value)} className={fieldClass} />
          </div>
          <div>
            <label htmlFor="article-category" className="text-sm font-medium">Kategori</label>
            <select id="article-category" value={kategori} onChange={(event) => setKategori(event.target.value)} className={fieldClass}>
              <option value="">Pilih kategori</option>
              {ARTICLE_CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
          <CoverField value={sampul} onChange={setSampul} />
          <div>
            <label htmlFor="article-cta-type" className="text-sm font-medium">Ajakan (opsional)</label>
            <select
              id="article-cta-type"
              value={ajakan?.type ?? ""}
              onChange={(event) => {
                const type = event.target.value as ContentCta["type"] | "";
                setAjakan(type ? { type, slug: CTA_OPTIONS[type][0]?.slug ?? "" } : null);
              }}
              className={fieldClass}
            >
              <option value="">Tanpa ajakan</option>
              <option value="course">Arahkan ke Course</option>
              <option value="practice">Arahkan ke Latihan</option>
            </select>
            {ajakan && (
              <select aria-label="Tujuan ajakan" value={ajakan.slug} onChange={(event) => setAjakan({ ...ajakan, slug: event.target.value })} className={fieldClass}>
                {CTA_OPTIONS[ajakan.type].map((option) => <option key={option.slug} value={option.slug}>{option.title}</option>)}
              </select>
            )}
          </div>
          <SourcesField value={sumber} onChange={setSumber} />
        </section>

        <div className={`min-w-0 space-y-5 ${tab === "isi" ? "" : "hidden lg:block"}`}>
          <section aria-labelledby="isi-artikel" className="rounded-2xl border border-border bg-card p-4">
            <h2 id="isi-artikel" className="font-bold">Isi Artikel</h2>
            <RichTextEditor initial={existing?.body ?? EMPTY_BODY} focusAnchor={focusAnchor} onChange={setBody} />
          </section>

          {isRevision ? (
            <section aria-labelledby="aksi-revisi" className="rounded-2xl border border-border bg-card p-4">
              <h2 id="aksi-revisi" className="font-bold">Perbaikan revisi</h2>
              <p className="mt-1 text-sm text-muted-foreground">Setelah selesai, tandai catatan dan kirim ulang dari halaman Catatan Revisi.</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <button type="button" onClick={() => void save()} className="min-h-11 rounded-xl border border-border text-sm font-semibold transition-colors hover:bg-accent">Simpan Draf</button>
                <Link href={`/creator/revisi/${existing?.id}`} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover">
                  Kembali ke Catatan Revisi
                </Link>
              </div>
            </section>
          ) : (
            <section aria-labelledby="checklist-kirim" className="rounded-2xl border border-border bg-card p-4">
              <h2 id="checklist-kirim" className="font-bold">Checklist sebelum kirim</h2>
              <div className="mt-3 space-y-2">
                {CREATOR_CHECKLIST.map((item) => (
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
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <button type="button" onClick={() => void save()} className="min-h-11 rounded-xl border border-border text-sm font-semibold transition-colors hover:bg-accent">Simpan Draf</button>
                <button
                  type="button"
                  disabled={!canSubmit}
                  onClick={() => void submit()}
                  className="min-h-11 rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-colors enabled:hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
                >
                  Kirim untuk Review
                </button>
              </div>
              {!canSubmit && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {missing.length > 0 ? `Lengkapi kolom wajib: ${missing.join(", ")}. ` : ""}
                  {isChecklistDone ? "" : "Centang seluruh checklist untuk mengirim."}
                </p>
              )}
              {submitError && <p role="alert" className="mt-2 text-sm font-medium text-destructive">{submitError}</p>}
            </section>
          )}
        </div>
      </div>

      <Dialog.Root open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/70" />
          <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-border bg-background p-5 text-foreground shadow-xl">
            <div className="mb-3 flex items-center justify-between gap-3">
              <Dialog.Title className="text-sm font-semibold text-muted-foreground">Pratinjau</Dialog.Title>
              <Dialog.Close aria-label="Tutup" className="inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-accent">
                <X className="h-4 w-4" aria-hidden="true" />
              </Dialog.Close>
            </div>
            {previewAt && <ContentArticleView content={{ judul, ringkasan, kategori, sampul, ajakan, sumber, body, updatedAt: previewAt }} authorName={userName} />}
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

// Editor artikel (PRD FR-15). Id awal dibaca sekali, karena alamat berubah saat draf baru tersimpan.
export default function ArticleEditor() {
  const session = useSession();
  const searchParams = useSearchParams();
  const [contentId] = useState(searchParams.get("konten"));
  const [focusAnchor] = useState(searchParams.get("bagian"));
  // Data awal dibaca sekali: simpan otomatis tidak boleh menimpa yang sedang diketik.
  const [result, setResult] = useState<{ content: ContentItem | null } | null>(null);

  useEffect(() => {
    void (contentId ? getContentRepository().getContent(contentId) : Promise.resolve(null)).then((content) => setResult({ content }));
  }, [contentId]);

  if (!result || !session?.userId) return <p className="py-10 text-center text-sm text-muted-foreground">Memuat editor...</p>;

  const { content } = result;
  const isMissing = Boolean(contentId) && (!content || content.authorId !== session.userId);
  if (isMissing || (content && !["draf", "perlu-revisi"].includes(content.status))) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h1 className="text-2xl font-bold tracking-tight">{isMissing ? "Konten tidak ditemukan" : "Konten ini tidak bisa diubah"}</h1>
        {!isMissing && <p className="mt-2 text-sm text-muted-foreground">Konten hanya dapat diubah saat berstatus Draf atau Perlu Revisi.</p>}
        <Link href="/creator/konten" className="mt-4 inline-block font-semibold text-primary-accent hover:underline">Kembali ke Konten Saya</Link>
      </div>
    );
  }

  return <EditorForm existing={content} userId={session.userId} userName={session.name} focusAnchor={focusAnchor} />;
}
