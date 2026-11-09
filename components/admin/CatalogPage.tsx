"use client";

import { useState } from "react";

import { Info, Pencil, Power, PowerOff } from "lucide-react";

import IconAction from "@/components/common/IconAction";
import PrototypeNotice from "@/components/creator/studio/PrototypeNotice";
import SearchField from "@/components/filters/SearchField";
import { CHALLENGES } from "@/data/challenges";
import { COURSES } from "@/data/courses";
import { ROADMAPS } from "@/data/roadmap";
import { runContentAction } from "@/lib/content";
import { courseCatalogState, freeXpTotal, MASTER_XP } from "@/lib/content/catalogRules";
import { matchesKeyword } from "@/lib/filters";
import { formatNumber } from "@/lib/format";
import { useCatalogFilters } from "@/lib/useUrlFilters";
import { CatalogItemKind, CatalogItemStatus, CourseCatalogState } from "@/types/AdminPlatform";
import { Course } from "@/types/Course";

import AdminList, { AdminColumn } from "./AdminList";
import ReasonDialog from "./ReasonDialog";
import { useAdminData } from "./useAdminData";

const FILTER_KEYS = ["q", "akses", "katalog"] as const;
const selectClass = "h-11 w-full rounded-lg border border-input bg-background px-3 text-sm font-medium dark:bg-card";
const fieldClass = "mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-normal dark:bg-card";

const AVAILABILITY_LABELS = { available: "Tersedia", "coming-soon": "Segera hadir" };
const CONTENT_LABELS = { ready: "Siap", draft: "Draf" };
const ACCESS_LABELS = { free: "Gratis", premium: "Premium" };

type ItemRow = { kind: CatalogItemKind; id: string; title: string; detail: string; status: CatalogItemStatus };

function CourseDialog({ course, state, userId, onClose }: { course: Course; state: CourseCatalogState; userId: string; onClose: () => void }) {
  const [form, setForm] = useState(state);
  const [error, setError] = useState("");

  const save = async (alasan: string) => {
    const result = await runContentAction((repository) => repository.updateCourseCatalog(userId, course.slug, form, alasan));
    if (result.ok) onClose();
    else setError(result.message);
  };

  return (
    <ReasonDialog
      title={`Ubah ${course.title}`}
      description="Simulasi: perubahan hanya terlihat di Panel Admin DEV."
      confirmLabel="Simpan"
      error={error}
      onConfirm={(alasan) => void save(alasan)}
      onClose={onClose}
    >
      <label className="mt-3 block text-sm font-medium">
        Status katalog
        <select value={form.availability} onChange={(event) => setForm({ ...form, availability: event.target.value as CourseCatalogState["availability"] })} className={fieldClass}>
          <option value="available">Tersedia</option>
          <option value="coming-soon">Segera hadir</option>
        </select>
      </label>
      <label className="mt-3 block text-sm font-medium">
        Status konten
        <select value={form.contentStatus} onChange={(event) => setForm({ ...form, contentStatus: event.target.value as CourseCatalogState["contentStatus"] })} className={fieldClass}>
          <option value="ready">Siap</option>
          <option value="draft">Draf</option>
        </select>
      </label>
      <label className="mt-3 block text-sm font-medium">
        Tingkat akses
        <select value={form.access} onChange={(event) => setForm({ ...form, access: event.target.value as CourseCatalogState["access"] })} className={fieldClass}>
          <option value="free">Gratis</option>
          <option value="premium">Premium</option>
        </select>
      </label>
    </ReasonDialog>
  );
}

// Katalog Belajar (PRD FR-16 G). Sumber kebenaran tetap file data dan docs/CURRICULUM.md.
export default function CatalogPage() {
  const { userId, data } = useAdminData();
  const { values, search, setSearch, setFilters } = useCatalogFilters(FILTER_KEYS);
  const [editing, setEditing] = useState<Course | null>(null);
  const [editingItem, setEditingItem] = useState<ItemRow | null>(null);
  const [itemError, setItemError] = useState("");

  if (!data) return <p className="py-10 text-center text-sm text-muted-foreground">Memuat katalog...</p>;

  const { overrides } = data;
  const stateOf = (course: Course) => courseCatalogState(course.slug, overrides.courses) as CourseCatalogState;
  const freeXp = freeXpTotal(overrides.courses);
  const isEnough = freeXp >= MASTER_XP;

  const courses = COURSES.filter((course) => {
    const state = stateOf(course);
    return (!values.akses || state.access === values.akses) && (!values.katalog || state.availability === values.katalog) && matchesKeyword(values.q, course.title, course.slug);
  });

  const items: ItemRow[] = [
    ...ROADMAPS.map((roadmap): ItemRow => ({ kind: "roadmap", id: roadmap.id, title: roadmap.title, detail: "Roadmap", status: overrides.items[`roadmap:${roadmap.id}`] ?? (roadmap.status === "active" ? "aktif" : "nonaktif") })),
    ...CHALLENGES.map((challenge): ItemRow => ({ kind: "latihan", id: challenge.slug, title: challenge.title, detail: "Latihan Playground", status: overrides.items[`latihan:${challenge.slug}`] ?? "aktif" })),
  ];

  const saveItem = async (alasan: string) => {
    if (!editingItem) return;
    const next = editingItem.status === "aktif" ? "nonaktif" : "aktif";
    const result = await runContentAction((repository) => repository.setCatalogItemStatus(userId, editingItem.kind, editingItem.id, next, alasan));
    if (result.ok) setEditingItem(null);
    else setItemError(result.message);
  };

  const courseColumns: AdminColumn<Course>[] = [
    { header: "Course", cell: (course) => course.title },
    { header: "Status katalog", cell: (course) => AVAILABILITY_LABELS[stateOf(course).availability] },
    { header: "Status konten", cell: (course) => CONTENT_LABELS[stateOf(course).contentStatus] },
    { header: "Akses", cell: (course) => ACCESS_LABELS[stateOf(course).access] },
    {
      header: "Aksi",
      cell: (course) => <IconAction label={`Ubah ${course.title}`} tooltip="Ubah" icon={Pencil} onClick={() => setEditing(course)} />,
    },
  ];

  const itemColumns: AdminColumn<ItemRow>[] = [
    { header: "Nama", cell: (item) => item.title },
    { header: "Jenis", cell: (item) => item.detail },
    { header: "Status", cell: (item) => (item.status === "aktif" ? "Aktif" : "Nonaktif") },
    {
      header: "Aksi",
      cell: (item) => (
        <IconAction
          label={`${item.status === "aktif" ? "Nonaktifkan" : "Aktifkan"} ${item.title}`}
          tooltip={item.status === "aktif" ? "Nonaktifkan" : "Aktifkan"}
          icon={item.status === "aktif" ? PowerOff : Power}
          tone={item.status === "aktif" ? "destructive" : "default"}
          onClick={() => {
            setItemError("");
            setEditingItem(item);
          }}
        />
      ),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5">
      <PrototypeNotice />

      <header>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Katalog Belajar</h1>
        <p className="mt-1 text-muted-foreground">Status katalog, status konten, dan tingkat akses course.</p>
      </header>

      <p role="note" className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-800 dark:text-amber-200">
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        Simulasi — perubahan katalog sungguhan dilakukan lewat PR. Halaman Belajar tidak ikut berubah.
      </p>

      <section aria-labelledby="xp-gratis" className="rounded-2xl border border-border bg-card p-5">
        <h2 id="xp-gratis" className="font-bold">XP dari materi gratis</h2>
        <p className="mt-1 text-2xl font-bold">{formatNumber(freeXp)} / {formatNumber(MASTER_XP)}</p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, (freeXp / MASTER_XP) * 100)}%` }} />
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {isEnough ? "Rank Master bisa dicapai dari materi gratis." : "Masih di bawah batas rank Master, jadi course gratis tidak bisa dijadikan premium."} Dihitung dari target lesson kurikulum dan latihan yang sudah ada.
        </p>
      </section>

      <p className="text-sm text-muted-foreground">
        Course hanya bisa dijadikan Tersedia setelah kontennya Siap. Aturan ini wajib untuk UAT dan Production; course yang sudah Tersedia dengan konten Draf hanya untuk tahap DEV.
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        <SearchField label="Cari course" value={search} placeholder="Cari judul course..." onChange={setSearch} />
        <select aria-label="Filter akses" value={values.akses} onChange={(event) => setFilters({ akses: event.target.value })} className={selectClass}>
          <option value="">Semua akses</option>
          <option value="free">Gratis</option>
          <option value="premium">Premium</option>
        </select>
        <select aria-label="Filter status katalog" value={values.katalog} onChange={(event) => setFilters({ katalog: event.target.value })} className={selectClass}>
          <option value="">Semua status katalog</option>
          <option value="available">Tersedia</option>
          <option value="coming-soon">Segera hadir</option>
        </select>
      </div>

      {courses.length > 0 ? (
        <AdminList label="course" rows={courses} columns={courseColumns} rowKey={(course) => course.slug} />
      ) : (
        <p className="rounded-2xl border border-dashed border-border bg-card px-6 py-10 text-center text-sm text-muted-foreground">Tidak ada course yang cocok.</p>
      )}

      <section aria-labelledby="roadmap-latihan" className="space-y-3">
        <h2 id="roadmap-latihan" className="text-lg font-bold">Roadmap dan Latihan</h2>
        <AdminList label="roadmap dan latihan" rows={items} columns={itemColumns} rowKey={(item) => `${item.kind}:${item.id}`} />
      </section>

      {editing && <CourseDialog course={editing} state={stateOf(editing)} userId={userId} onClose={() => setEditing(null)} />}
      {editingItem && (
        <ReasonDialog
          title={`${editingItem.status === "aktif" ? "Nonaktifkan" : "Aktifkan"} ${editingItem.title}?`}
          description="Simulasi: perubahan hanya terlihat di Panel Admin DEV."
          confirmLabel="Simpan"
          error={itemError}
          onConfirm={(alasan) => void saveItem(alasan)}
          onClose={() => setEditingItem(null)}
        />
      )}
    </div>
  );
}
