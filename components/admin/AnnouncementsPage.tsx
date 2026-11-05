"use client";

import { useState } from "react";

import ConfirmDialog from "@/components/common/ConfirmDialog";
import PrototypeNotice from "@/components/creator/studio/PrototypeNotice";
import { userName } from "@/components/creator/studio/useCreatorData";
import { NotificationPreviewRow } from "@/components/notifications/NotificationItem";
import { ROLE_LABELS } from "@/data/navigation";
import { NOTIFICATION_GROUPS } from "@/data/notificationGroups";
import { runContentAction } from "@/lib/content";
import { announcementMatches } from "@/lib/content/announcements";
import { useUrlFilters } from "@/lib/useUrlFilters";
import { Announcement, AnnouncementGroup, AnnouncementInput, AnnouncementStatus, AnnouncementTarget } from "@/types/Announcement";
import { MembershipTier } from "@/types/Membership";
import { UserRole } from "@/types/Role";

import AdminList, { AdminColumn } from "./AdminList";
import { formatDateTime, MEMBERSHIP_LABELS, useAdminData } from "./useAdminData";

const FILTER_KEYS = ["status"] as const;
const fieldClass = "mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-normal dark:bg-card";
const selectClass = "h-11 w-full rounded-lg border border-input bg-background px-3 text-sm font-medium dark:bg-card";
const actionClass = "whitespace-nowrap font-medium text-primary-accent underline-offset-2 hover:underline";

const STATUS_LABELS: Record<AnnouncementStatus, string> = { draf: "Draf", terjadwal: "Terjadwal", terkirim: "Terkirim", dibatalkan: "Dibatalkan" };
const ROLES: UserRole[] = ["user", "creator", "reviewer", "admin"];
const TIERS: MembershipTier[] = ["basic", "pro", "premium"];
const EMPTY_FORM: AnnouncementInput = { title: "", body: "", href: "", group: "content", target: { type: "semua" }, scheduledAt: "" };

export function targetLabel(target: AnnouncementTarget) {
  if (target.type === "semua") return "Semua pengguna";
  if (target.type === "membership") return `Membership ${MEMBERSHIP_LABELS[target.tier]}`;
  return `Peran ${ROLE_LABELS[target.role]}`;
}

// Pengumuman (PRD FR-16 H).
export default function AnnouncementsPage() {
  const { userId, data } = useAdminData();
  const { values, setFilters } = useUrlFilters(FILTER_KEYS);
  const [form, setForm] = useState(EMPTY_FORM);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [isSchedule, setIsSchedule] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [cancelling, setCancelling] = useState<Announcement | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  if (!data) return <p className="py-10 text-center text-sm text-muted-foreground">Memuat pengumuman...</p>;

  const { announcements, users, loadedAt } = data;
  const recipients = users.filter((user) => user.status === "aktif" && announcementMatches(form.target, user)).length;
  const history = [...announcements].reverse().filter((item) => !values.status || item.status === values.status);
  const update = <K extends keyof AnnouncementInput>(key: K, value: AnnouncementInput[K]) => setForm((current) => ({ ...current, [key]: value }));

  const changeTargetType = (type: AnnouncementTarget["type"]) => {
    if (type === "semua") update("target", { type });
    if (type === "membership") update("target", { type, tier: "pro" });
    if (type === "peran") update("target", { type, role: "creator" });
  };

  const save = async (mode: "draf" | "kirim" | "jadwal") => {
    const result = await runContentAction((repository) => repository.saveAnnouncement(userId, draftId, form, mode));
    setIsConfirming(false);
    if (!result.ok) {
      setError(result.message);
      setMessage("");
      return;
    }
    setError("");
    setMessage(mode === "draf" ? "Draf tersimpan." : mode === "kirim" ? "Pengumuman terkirim." : "Pengumuman dijadwalkan.");
    setForm(EMPTY_FORM);
    setDraftId(null);
    setIsSchedule(false);
  };

  const edit = (item: Announcement) => {
    setForm({ title: item.title, body: item.body, href: item.href, group: item.group, target: item.target, scheduledAt: "" });
    setDraftId(item.id);
    setError("");
    setMessage("");
  };

  const cancel = async () => {
    if (!cancelling) return;
    const result = await runContentAction((repository) => repository.cancelAnnouncement(userId, cancelling.id));
    setError(result.ok ? "" : result.message);
    setCancelling(null);
  };

  const processSchedule = async () => {
    const result = await runContentAction((repository) => repository.processScheduledAnnouncements());
    if (result.ok) setMessage(`${result.data} pengumuman terjadwal terkirim.`);
  };

  const columns: AdminColumn<Announcement>[] = [
    { header: "Judul", cell: (item) => item.title },
    { header: "Target", cell: (item) => targetLabel(item.target) },
    { header: "Grup", cell: (item) => NOTIFICATION_GROUPS[item.group].label },
    { header: "Status", cell: (item) => STATUS_LABELS[item.status] },
    { header: "Waktu", cell: (item) => <span className="whitespace-nowrap">{formatDateTime(item.sentAt ?? item.scheduledAt ?? item.createdAt)}</span> },
    { header: "Pembuat", cell: (item) => userName(users, item.createdBy) },
    {
      header: "Aksi",
      cell: (item) => (
        <span className="flex flex-wrap gap-x-3 gap-y-1">
          {item.status === "draf" && <button type="button" aria-label={`Ubah ${item.title}`} onClick={() => edit(item)} className={actionClass}>Ubah</button>}
          {item.status === "terjadwal" && <button type="button" aria-label={`Batalkan ${item.title}`} onClick={() => setCancelling(item)} className="whitespace-nowrap font-medium text-destructive underline-offset-2 hover:underline">Batalkan</button>}
          {item.status !== "draf" && item.status !== "terjadwal" && "-"}
        </span>
      ),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <PrototypeNotice />

      <header>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Pengumuman</h1>
        <p className="mt-1 text-muted-foreground">Kirim notifikasi ke pengguna, mengikuti preferensi notifikasi mereka.</p>
      </header>

      {error && <p role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
      {message && <p role="status" className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-300">{message}</p>}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section aria-labelledby="buat-pengumuman" className="space-y-3 rounded-2xl border border-border bg-card p-5">
          <h2 id="buat-pengumuman" className="font-bold">{draftId ? "Ubah Draf" : "Buat Pengumuman"}</h2>
          <label className="block text-sm font-medium">
            Judul
            <input value={form.title} onChange={(event) => update("title", event.target.value)} className={fieldClass} />
          </label>
          <label className="block text-sm font-medium">
            Isi
            <textarea rows={3} value={form.body} onChange={(event) => update("body", event.target.value)} className={fieldClass} />
          </label>
          <label className="block text-sm font-medium">
            Tautan tujuan (opsional)
            <input value={form.href} onChange={(event) => update("href", event.target.value)} placeholder="/learn" className={fieldClass} />
            <span className="mt-1 block text-xs font-normal text-muted-foreground">Hanya tautan internal, diawali garis miring.</span>
          </label>
          <label className="block text-sm font-medium">
            Grup notifikasi
            <select value={form.group} onChange={(event) => update("group", event.target.value as AnnouncementGroup)} className={fieldClass}>
              <option value="content">Konten baru</option>
              <option value="system">Akun dan sistem</option>
            </select>
          </label>
          <label className="block text-sm font-medium">
            Target
            <select value={form.target.type} onChange={(event) => changeTargetType(event.target.value as AnnouncementTarget["type"])} className={fieldClass}>
              <option value="semua">Semua pengguna</option>
              <option value="membership">Membership tertentu</option>
              <option value="peran">Peran tertentu</option>
            </select>
          </label>
          {form.target.type === "membership" && (
            <label className="block text-sm font-medium">
              Membership
              <select value={form.target.tier} onChange={(event) => update("target", { type: "membership", tier: event.target.value as MembershipTier })} className={fieldClass}>
                {TIERS.map((tier) => <option key={tier} value={tier}>{MEMBERSHIP_LABELS[tier]}</option>)}
              </select>
            </label>
          )}
          {form.target.type === "peran" && (
            <label className="block text-sm font-medium">
              Peran
              <select value={form.target.role} onChange={(event) => update("target", { type: "peran", role: event.target.value as UserRole })} className={fieldClass}>
                {ROLES.map((role) => <option key={role} value={role}>{ROLE_LABELS[role]}</option>)}
              </select>
            </label>
          )}
          <p className="text-sm text-muted-foreground">Sekitar {recipients} akun aktif sesuai target.</p>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" checked={isSchedule} onChange={(event) => setIsSchedule(event.target.checked)} className="h-4 w-4 accent-primary" />
            Jadwalkan
          </label>
          {isSchedule && (
            <label className="block text-sm font-medium">
              Waktu kirim
              <input type="datetime-local" value={form.scheduledAt} onChange={(event) => update("scheduledAt", event.target.value)} className={fieldClass} />
            </label>
          )}
          <div className="flex flex-wrap gap-2 pt-1">
            <button type="button" onClick={() => void save("draf")} className="min-h-10 rounded-xl border border-border px-4 text-sm font-semibold transition-colors hover:bg-accent">Simpan Draf</button>
            {isSchedule ? (
              <button type="button" onClick={() => void save("jadwal")} className="min-h-10 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover">Jadwalkan Pengumuman</button>
            ) : (
              <button type="button" onClick={() => setIsConfirming(true)} className="min-h-10 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover">Kirim Sekarang</button>
            )}
          </div>
        </section>

        <section aria-labelledby="pratinjau-notifikasi" className="self-start rounded-2xl border border-border bg-card p-5">
          <h2 id="pratinjau-notifikasi" className="font-bold">Pratinjau Notifikasi</h2>
          <div className="mt-3 overflow-hidden rounded-xl border border-border">
            <NotificationPreviewRow group={form.group} title={form.title || "Judul pengumuman"} body={form.body || "Isi pengumuman"} createdAt={new Date(loadedAt).toISOString()} />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Grup {NOTIFICATION_GROUPS[form.group].label} · {targetLabel(form.target)}</p>
        </section>
      </div>

      <section aria-labelledby="riwayat-pengumuman" className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="riwayat-pengumuman" className="text-lg font-bold">Riwayat Pengumuman</h2>
          <button type="button" onClick={() => void processSchedule()} className="min-h-10 rounded-xl border border-dashed border-amber-500/60 px-4 text-sm font-semibold transition-colors hover:bg-accent">
            Simulasi: Proses jadwal sekarang
          </button>
        </div>
        <select aria-label="Filter status" value={values.status} onChange={(event) => setFilters({ status: event.target.value })} className={`${selectClass} sm:max-w-xs`}>
          <option value="">Semua status</option>
          {(Object.keys(STATUS_LABELS) as AnnouncementStatus[]).map((status) => <option key={status} value={status}>{STATUS_LABELS[status]}</option>)}
        </select>
        {history.length > 0 ? (
          <AdminList label="pengumuman" rows={history} columns={columns} rowKey={(item) => item.id} />
        ) : (
          <p className="rounded-2xl border border-dashed border-border bg-card px-6 py-10 text-center text-sm text-muted-foreground">Belum ada pengumuman.</p>
        )}
      </section>

      {isConfirming && (
        <ConfirmDialog
          title="Kirim pengumuman ini?"
          description={`Dikirim ke ${targetLabel(form.target)}, sekitar ${recipients} akun aktif. Pengumuman yang terkirim tidak bisa ditarik.`}
          confirmLabel="Kirim"
          onConfirm={() => void save("kirim")}
          onClose={() => setIsConfirming(false)}
        />
      )}
      {cancelling && (
        <ConfirmDialog
          title="Batalkan pengumuman ini?"
          description={`"${cancelling.title}" tidak akan terkirim. Catatannya tetap ada di riwayat.`}
          confirmLabel="Batalkan pengumuman"
          isDestructive
          onConfirm={() => void cancel()}
          onClose={() => setCancelling(null)}
        />
      )}
    </div>
  );
}
