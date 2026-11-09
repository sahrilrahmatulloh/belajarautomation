"use client";

import { useState } from "react";
import { Eye } from "lucide-react";

import IconAction from "@/components/common/IconAction";
import ListPagination, { pageSlice } from "@/components/common/ListPagination";
import { EditorDialog } from "@/components/creator/studio/EditorDialogs";
import PrototypeNotice from "@/components/creator/studio/PrototypeNotice";
import { userName } from "@/components/creator/studio/useCreatorData";
import SearchField from "@/components/filters/SearchField";
import { matchesKeyword } from "@/lib/filters";
import { useCatalogFilters } from "@/lib/useUrlFilters";
import { AdminAction, AdminAuditLog } from "@/types/ContentWorkflow";

import AdminList, { AdminColumn } from "./AdminList";
import { formatDateTime, useAdminData } from "./useAdminData";

const PAGE_SIZE = 20;
const FILTER_KEYS = ["q", "admin", "aksi", "dari", "sampai"] as const;
const selectClass = "h-11 w-full rounded-lg border border-input bg-background px-3 text-sm font-medium dark:bg-card";

const ACTION_LABELS: Record<AdminAction, string> = {
  "tugaskan-reviewer": "Tugaskan Reviewer",
  terbitkan: "Terbitkan",
  "tarik-website": "Tarik dari website",
  "tambah-peran": "Tambah peran",
  "cabut-peran": "Cabut peran",
  "nonaktifkan-akun": "Nonaktifkan akun",
  "aktifkan-akun": "Aktifkan akun",
  "catat-kesepakatan": "Catat kesepakatan",
  refund: "Refund",
  "berikan-akses": "Berikan hak akses",
  "cabut-akses": "Cabut hak akses",
  "tambah-produk": "Tambah produk",
  "ubah-produk": "Ubah produk",
  "ubah-katalog": "Ubah katalog",
  "abaikan-moderasi": "Abaikan moderasi",
  "koreksi-xp": "Koreksi XP",
  "sembunyikan-leaderboard": "Sembunyikan dari leaderboard",
  "tampilkan-leaderboard": "Tampilkan di leaderboard",
  "simpan-pengumuman": "Simpan draf pengumuman",
  "kirim-pengumuman": "Kirim pengumuman",
  "jadwalkan-pengumuman": "Jadwalkan pengumuman",
  "batalkan-pengumuman": "Batalkan pengumuman",
  "jadwalkan-maintenance": "Jadwalkan maintenance",
  "ubah-maintenance": "Ubah jadwal maintenance",
  "batalkan-maintenance": "Batalkan maintenance",
  "akhiri-maintenance": "Akhiri maintenance",
};

function Snapshot({ title, value }: { title: string; value: Record<string, unknown> | null }) {
  return (
    <div className="min-w-0">
      <h3 className="text-sm font-semibold">{title}</h3>
      <pre tabIndex={0} className="mt-1 overflow-x-auto rounded-lg bg-muted p-3 text-xs">{value ? JSON.stringify(value, null, 2) : "-"}</pre>
    </div>
  );
}

// Log Aktivitas Admin (PRD FR-16 J). Hanya bisa dibaca: tidak ada aksi ubah atau hapus.
export default function AuditLogPage() {
  const { data } = useAdminData();
  const { values, search, setSearch, setFilters } = useCatalogFilters(FILTER_KEYS);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<AdminAuditLog | null>(null);

  if (!data) return <p className="py-10 text-center text-sm text-muted-foreground">Memuat log...</p>;

  const { auditLog, users } = data;
  const admins = users.filter((user) => auditLog.some((entry) => entry.adminId === user.id));
  const filtered = [...auditLog]
    .reverse()
    .filter(
      (entry) =>
        (!values.admin || entry.adminId === values.admin) &&
        (!values.aksi || entry.action === values.aksi) &&
        (!values.dari || entry.at.slice(0, 10) >= values.dari) &&
        (!values.sampai || entry.at.slice(0, 10) <= values.sampai) &&
        matchesKeyword(values.q, entry.targetLabel, entry.alasan ?? "", ACTION_LABELS[entry.action], userName(users, entry.adminId))
    );
  const currentPage = Math.min(page, Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)));

  const updateFilter = (key: (typeof FILTER_KEYS)[number], value: string) => {
    setFilters({ [key]: value });
    setPage(1);
  };

  const columns: AdminColumn<AdminAuditLog>[] = [
    { header: "Aksi Admin", cell: (entry) => ACTION_LABELS[entry.action] },
    { header: "Waktu", cell: (entry) => <span className="whitespace-nowrap">{formatDateTime(entry.at)}</span> },
    { header: "Admin", cell: (entry) => userName(users, entry.adminId) },
    { header: "Target", cell: (entry) => entry.targetLabel },
    { header: "Alasan", cell: (entry) => entry.alasan ?? "-" },
    {
      header: "Aksi",
      cell: (entry) => (
        <IconAction label={`Lihat perubahan ${ACTION_LABELS[entry.action]}: ${entry.targetLabel}`} tooltip="Lihat perubahan" icon={Eye} onClick={() => setSelected(entry)} />
      ),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5">
      <PrototypeNotice />

      <header>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Log Aktivitas Admin</h1>
        <p className="mt-1 text-muted-foreground">Seluruh aksi Admin. Log tidak dapat diubah atau dihapus.</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <div className="sm:col-span-2 xl:col-span-5">
          <SearchField
            label="Cari log"
            value={search}
            placeholder="Cari target, alasan, atau aksi..."
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
          />
        </div>
        <select aria-label="Filter Admin" value={values.admin} onChange={(event) => updateFilter("admin", event.target.value)} className={selectClass}>
          <option value="">Semua Admin</option>
          {admins.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
        </select>
        <select aria-label="Filter jenis aksi" value={values.aksi} onChange={(event) => updateFilter("aksi", event.target.value)} className={selectClass}>
          <option value="">Semua aksi</option>
          {Object.entries(ACTION_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <label className="text-sm font-medium">
          Dari tanggal
          <input type="date" value={values.dari} onChange={(event) => updateFilter("dari", event.target.value)} className={`${selectClass} mt-1`} />
        </label>
        <label className="text-sm font-medium">
          Sampai tanggal
          <input type="date" value={values.sampai} onChange={(event) => updateFilter("sampai", event.target.value)} className={`${selectClass} mt-1`} />
        </label>
      </div>

      {filtered.length > 0 ? (
        <>
          <AdminList label="log aktivitas" rows={pageSlice(filtered, currentPage, PAGE_SIZE)} columns={columns} rowKey={(entry) => entry.id} />
          <ListPagination total={filtered.length} page={currentPage} pageSize={PAGE_SIZE} itemLabel="log" onChange={setPage} />
        </>
      ) : (
        <p className="rounded-2xl border border-dashed border-border bg-card px-6 py-10 text-center text-sm text-muted-foreground">
          {auditLog.length === 0 ? "Belum ada aktivitas Admin." : "Tidak ada log yang cocok."}
        </p>
      )}

      {selected && (
        <EditorDialog title={`${ACTION_LABELS[selected.action]}: ${selected.targetLabel}`} onClose={() => setSelected(null)}>
          <div className="mt-4 space-y-3">
            <Snapshot title="Sebelum" value={selected.before} />
            <Snapshot title="Sesudah" value={selected.after} />
          </div>
        </EditorDialog>
      )}
    </div>
  );
}
