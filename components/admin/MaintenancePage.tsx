"use client";

import { useState } from "react";

import PrototypeNotice from "@/components/creator/studio/PrototypeNotice";
import { userName } from "@/components/creator/studio/useCreatorData";
import { useMaintenance } from "@/components/maintenance/useMaintenance";
import { runContentAction } from "@/lib/content";
import { DEFAULT_PREP_MINUTES, earliestStartTime, formatMaintenanceTime, maintenancePhase, PREP_OPTIONS, prepStartTime } from "@/lib/maintenanceRules";
import { MaintenanceInput, MaintenancePhase, MaintenanceSimulation, MaintenanceWindow } from "@/types/Maintenance";

import AdminList, { AdminColumn } from "./AdminList";
import ReasonDialog from "./ReasonDialog";
import { useAdminData } from "./useAdminData";

const fieldClass = "mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-normal dark:bg-card";
const secondaryButton = "min-h-10 rounded-xl border border-border px-4 text-sm font-semibold transition-colors hover:bg-accent";
const primaryButton = "min-h-10 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover";
const simulationButton = "min-h-10 rounded-xl border border-dashed border-amber-500/60 px-4 text-sm font-semibold transition-colors hover:bg-accent";

const PHASE_LABELS: Record<MaintenancePhase, string> = { terjadwal: "Terjadwal", persiapan: "Persiapan", aktif: "Aktif" };
const EMPTY_FORM: MaintenanceInput = { startAt: "", estimatedEndAt: "", prepMinutes: DEFAULT_PREP_MINUTES, message: "" };
const HOUR_MS = 3_600_000;

// Nilai untuk input datetime-local, dalam zona waktu browser.
function toLocalInput(time: number) {
  const date = new Date(time);
  return new Date(time - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}

function statusLabel(item: MaintenanceWindow, now: number) {
  if (item.status === "selesai") return "Selesai";
  if (item.status === "dibatalkan") return "Dibatalkan";
  return PHASE_LABELS[maintenancePhase(item, now) ?? "terjadwal"];
}

type PendingAction = { kind: "simpan" } | { kind: "batalkan" | "akhiri"; window: MaintenanceWindow };

// Mode Maintenance (PRD FR-16 K).
export default function MaintenancePage() {
  const { userId, data } = useAdminData();
  const { current, phase, now } = useMaintenance();
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [pending, setPending] = useState<PendingAction | null>(null);
  const [dialogError, setDialogError] = useState("");
  const [message, setMessage] = useState("");

  if (!data) return <p className="py-10 text-center text-sm text-muted-foreground">Memuat maintenance...</p>;

  const history = [...data.maintenanceWindows].reverse();
  const showForm = !current || isFormOpen;
  const update = <K extends keyof MaintenanceInput>(key: K, value: MaintenanceInput[K]) => setForm((previous) => ({ ...previous, [key]: value }));

  const fillEarliest = () => {
    const start = earliestStartTime(Date.now(), form.prepMinutes);
    setForm((value) => ({ ...value, startAt: toLocalInput(start), estimatedEndAt: value.estimatedEndAt || toLocalInput(start + HOUR_MS) }));
  };

  const edit = (item: MaintenanceWindow) => {
    setForm({ startAt: toLocalInput(Date.parse(item.startAt)), estimatedEndAt: toLocalInput(Date.parse(item.estimatedEndAt)), prepMinutes: item.prepMinutes, message: item.message });
    setEditingId(item.id);
    setIsFormOpen(true);
    setMessage("");
  };

  const closeForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setIsFormOpen(false);
  };

  const confirm = async (alasan: string) => {
    if (!pending) return;
    const result = await runContentAction((repository) => {
      if (pending.kind === "simpan") return repository.saveMaintenance(userId, editingId, form, alasan);
      if (pending.kind === "batalkan") return repository.cancelMaintenance(userId, pending.window.id, alasan);
      return repository.endMaintenance(userId, pending.window.id, alasan);
    });
    if (!result.ok) {
      setDialogError(result.message);
      return;
    }
    setMessage(
      pending.kind === "simpan"
        ? editingId
          ? "Jadwal maintenance diubah. Pengumuman perubahan terkirim ke semua pengguna."
          : "Maintenance dijadwalkan. Pengumuman terkirim ke semua pengguna."
        : pending.kind === "batalkan"
          ? "Maintenance dibatalkan. Pengumuman pembatalan terkirim ke semua pengguna."
          : "Maintenance diakhiri. Situs kembali terbuka untuk semua pengguna."
    );
    if (pending.kind === "simpan") closeForm();
    setPending(null);
    setDialogError("");
  };

  const simulate = async (target: MaintenanceSimulation) => {
    if (!current) return;
    await runContentAction((repository) => repository.simulateMaintenance(current.id, target));
  };

  const columns: AdminColumn<MaintenanceWindow>[] = [
    { header: "Mulai", cell: (item) => <span className="whitespace-nowrap">{formatMaintenanceTime(item.startAt)}</span> },
    { header: "Perkiraan selesai", cell: (item) => <span className="whitespace-nowrap">{formatMaintenanceTime(item.estimatedEndAt)}</span> },
    { header: "Persiapan", cell: (item) => `${item.prepMinutes} menit` },
    { header: "Status", cell: (item) => statusLabel(item, now) },
    { header: "Pembuat", cell: (item) => userName(data.users, item.createdBy) },
    { header: "Diakhiri", cell: (item) => (item.endedAt ? <span className="whitespace-nowrap">{formatMaintenanceTime(item.endedAt)}</span> : "-") },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <PrototypeNotice />

      <header>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Mode Maintenance</h1>
        <p className="mt-1 text-muted-foreground">Tutup situs sementara untuk perbaikan. Selama Aktif, hanya Admin yang dapat masuk.</p>
      </header>

      {message && <p role="status" className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-300">{message}</p>}

      {current && phase && (
        <section aria-labelledby="jadwal-berjalan" className="space-y-4 rounded-2xl border border-border bg-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="jadwal-berjalan" className="font-bold">Jadwal Berjalan</h2>
            <span className="rounded-full border border-amber-500/50 bg-amber-500/10 px-2.5 py-0.5 text-sm font-semibold">Tahap: {PHASE_LABELS[phase]}</span>
          </div>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Mulai</dt>
              <dd className="font-medium">{formatMaintenanceTime(current.startAt)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Perkiraan selesai</dt>
              <dd className="font-medium">{formatMaintenanceTime(current.estimatedEndAt)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Persiapan</dt>
              <dd className="font-medium">
                {current.prepMinutes} menit, mulai {formatMaintenanceTime(new Date(prepStartTime(current)).toISOString())}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Pesan untuk pengguna</dt>
              <dd className="font-medium">{current.message}</dd>
            </div>
          </dl>
          <div className="flex flex-wrap gap-2">
            {phase === "aktif" ? (
              <button type="button" onClick={() => setPending({ kind: "akhiri", window: current })} className={primaryButton}>Akhiri Maintenance</button>
            ) : (
              <>
                <button type="button" onClick={() => edit(current)} className={secondaryButton}>Ubah Jadwal</button>
                <button type="button" onClick={() => setPending({ kind: "batalkan", window: current })} className="min-h-10 rounded-xl border border-destructive/40 px-4 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10">Batalkan Maintenance</button>
              </>
            )}
          </div>
          {phase !== "aktif" && (
            <div className="space-y-2 border-t border-border pt-4">
              <p className="text-xs text-muted-foreground">Simulasi DEV: memajukan waktu agar tahap berikutnya bisa dicoba tanpa menunggu. Tidak tercatat di log.</p>
              <div className="flex flex-wrap gap-2">
                {phase === "terjadwal" && <button type="button" onClick={() => void simulate("persiapan")} className={simulationButton}>Simulasi: masuk Persiapan</button>}
                <button type="button" onClick={() => void simulate("menit-terakhir")} className={simulationButton}>Simulasi: menit terakhir</button>
                <button type="button" onClick={() => void simulate("aktif")} className={simulationButton}>Simulasi: mulai Aktif</button>
              </div>
            </div>
          )}
        </section>
      )}

      {showForm && (
        <section aria-labelledby="form-maintenance" className="space-y-3 rounded-2xl border border-border bg-card p-5">
          <h2 id="form-maintenance" className="font-bold">{editingId ? "Ubah Jadwal Maintenance" : "Jadwalkan Maintenance"}</h2>
          <label className="block text-sm font-medium">
            Lama Persiapan
            <select value={form.prepMinutes} onChange={(event) => update("prepMinutes", Number(event.target.value))} className={fieldClass}>
              {PREP_OPTIONS.map((minutes) => <option key={minutes} value={minutes}>{minutes} menit</option>)}
            </select>
            <span className="mt-1 block text-xs font-normal text-muted-foreground">Selama Persiapan, pengguna melihat hitung mundur dan tidak dapat memulai kuis atau latihan baru.</span>
          </label>
          <div>
            <label className="block text-sm font-medium">
              Waktu mulai
              <input type="datetime-local" value={form.startAt} onChange={(event) => update("startAt", event.target.value)} className={fieldClass} />
            </label>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span>Paling cepat saat ini ditambah Persiapan {form.prepMinutes} menit.</span>
              <button type="button" onClick={fillEarliest} className="font-semibold text-primary-accent underline-offset-2 hover:underline">Isi waktu paling cepat</button>
            </div>
          </div>
          <label className="block text-sm font-medium">
            Perkiraan selesai
            <input type="datetime-local" value={form.estimatedEndAt} onChange={(event) => update("estimatedEndAt", event.target.value)} className={fieldClass} />
            <span className="mt-1 block text-xs font-normal text-muted-foreground">Hanya informasi untuk pengguna. Maintenance berakhir saat Admin mengakhirinya.</span>
          </label>
          <label className="block text-sm font-medium">
            Pesan untuk pengguna
            <textarea rows={3} value={form.message} onChange={(event) => update("message", event.target.value)} placeholder="Kami sedang memperbaiki fitur blog." className={fieldClass} />
          </label>
          <div className="flex flex-wrap gap-2 pt-1">
            <button type="button" onClick={() => setPending({ kind: "simpan" })} className={primaryButton}>{editingId ? "Simpan Perubahan" : "Jadwalkan Maintenance"}</button>
            {isFormOpen && <button type="button" onClick={closeForm} className={secondaryButton}>Batal</button>}
          </div>
        </section>
      )}

      <section aria-labelledby="riwayat-maintenance" className="space-y-3">
        <h2 id="riwayat-maintenance" className="text-lg font-bold">Riwayat Maintenance</h2>
        {history.length > 0 ? (
          <AdminList label="maintenance" rows={history} columns={columns} rowKey={(item) => item.id} />
        ) : (
          <p className="rounded-2xl border border-dashed border-border bg-card px-6 py-10 text-center text-sm text-muted-foreground">Belum ada maintenance.</p>
        )}
      </section>

      {pending && (
        <ReasonDialog
          title={pending.kind === "simpan" ? (editingId ? "Simpan perubahan jadwal?" : "Jadwalkan maintenance?") : pending.kind === "batalkan" ? "Batalkan maintenance?" : "Akhiri maintenance?"}
          description={
            pending.kind === "simpan"
              ? "Pengumuman jadwal terkirim ke semua pengguna. Selama Aktif, hanya Admin yang dapat masuk."
              : pending.kind === "batalkan"
                ? "Pengumuman pembatalan terkirim ke semua pengguna. Catatannya tetap ada di riwayat."
                : "Situs kembali terbuka untuk semua pengguna. Pastikan perbaikan sudah selesai diperiksa."
          }
          confirmLabel={pending.kind === "simpan" ? (editingId ? "Simpan" : "Jadwalkan") : pending.kind === "batalkan" ? "Batalkan maintenance" : "Akhiri maintenance"}
          isDestructive={pending.kind === "batalkan"}
          error={dialogError}
          onConfirm={(alasan) => void confirm(alasan)}
          onClose={() => {
            setPending(null);
            setDialogError("");
          }}
        />
      )}
    </div>
  );
}
