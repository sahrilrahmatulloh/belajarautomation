"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import PrototypeNotice from "@/components/creator/studio/PrototypeNotice";
import { userName } from "@/components/creator/studio/useCreatorData";
import { ROLE_LABELS } from "@/data/navigation";
import { getRank } from "@/data/ranks";
import { runContentAction } from "@/lib/content";
import { formatContentDate } from "@/lib/content/document";
import { formatNumber } from "@/lib/format";
import { AccountStatus, RoleChangeAction } from "@/types/ContentWorkflow";
import { UserRole } from "@/types/Role";

import AccountStatusBadge from "./AccountStatusBadge";
import ReasonDialog from "./ReasonDialog";
import UserAccessSections from "./UserAccessSections";
import { formatDateTime, useAdminData } from "./useAdminData";

const MANAGED_ROLES: UserRole[] = ["creator", "reviewer", "admin"];
const panelClass = "rounded-2xl border border-border bg-card p-5";
const fieldClass = "mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-normal dark:bg-card";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap justify-between gap-x-3 gap-y-1">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="min-w-0 text-right [overflow-wrap:anywhere]">{children}</dd>
    </div>
  );
}

type Pending = { kind: "peran"; role: UserRole; action: RoleChangeAction } | { kind: "status"; status: AccountStatus } | null;

// Detail pengguna (PRD FR-16 C).
export default function UserDetailPage({ userId }: { userId: string }) {
  const { userId: adminId, data } = useAdminData();
  const [pending, setPending] = useState<Pending>(null);
  const [dialogError, setDialogError] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [dokumen, setDokumen] = useState("");
  const [agreementMessage, setAgreementMessage] = useState({ text: "", isError: false });

  if (!data) return <p className="py-10 text-center text-sm text-muted-foreground">Memuat pengguna...</p>;

  const user = data.users.find((item) => item.id === userId);
  if (!user) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Pengguna tidak ditemukan</h1>
        <Link href="/admin/pengguna" className="mt-4 inline-block font-semibold text-primary-accent hover:underline">Kembali ke Pengguna dan Peran</Link>
      </div>
    );
  }

  const agreements = data.agreements.filter((item) => item.userId === userId).reverse();
  const roleEvents = data.roleEvents.filter((event) => event.userId === userId).reverse();

  const open = (next: Pending) => {
    setDialogError("");
    setPending(next);
  };

  const confirm = async (alasan: string) => {
    if (!pending) return;
    const result = await runContentAction((repository) =>
      pending.kind === "peran"
        ? repository.setRole(adminId, userId, pending.role, pending.action, alasan)
        : repository.setAccountStatus(adminId, userId, pending.status, alasan)
    );
    if (result.ok) setPending(null);
    else setDialogError(result.message);
  };

  const saveAgreement = async () => {
    const result = await runContentAction((repository) => repository.recordAgreement(adminId, userId, { tanggal, dokumen }));
    setAgreementMessage(result.ok ? { text: "Kesepakatan tercatat.", isError: false } : { text: result.message, isError: true });
    if (result.ok) {
      setTanggal("");
      setDokumen("");
    }
  };

  const rank = getRank(user.xp);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5">
      <PrototypeNotice />

      <Link href="/admin/pengguna" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-accent hover:underline">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Kembali ke Pengguna dan Peran
      </Link>

      <header className="flex flex-wrap items-center gap-3">
        <h1 className="min-w-0 text-2xl font-bold tracking-tight sm:text-3xl">{user.name}</h1>
        <AccountStatusBadge status={user.status} />
      </header>

      <div className="grid gap-5 lg:grid-cols-2">
        <section aria-labelledby="info-akun" className={`${panelClass} text-sm`}>
          <h2 id="info-akun" className="font-bold">Info Akun</h2>
          <dl className="mt-3 space-y-2">
            <Field label="Username">{user.username}</Field>
            <Field label="Email">{user.email}</Field>
            <Field label="Tanggal daftar">{formatContentDate(user.joinedAt)}</Field>
            <Field label="Terakhir aktif">{formatContentDate(user.lastActiveAt)}</Field>
          </dl>
        </section>

        <section aria-labelledby="ringkasan-belajar" className={`${panelClass} text-sm`}>
          <h2 id="ringkasan-belajar" className="font-bold">Ringkasan Belajar</h2>
          <dl className="mt-3 space-y-2">
            <Field label="XP">{formatNumber(user.xp)}</Field>
            <Field label="Rank">{rank.name}</Field>
            <Field label="Course dipelajari">{user.coursesStudied}</Field>
          </dl>
        </section>

        <section aria-labelledby="peran-pengguna" className={panelClass}>
          <h2 id="peran-pengguna" className="font-bold">Peran</h2>
          <ul className="mt-3 divide-y divide-border text-sm">
            {MANAGED_ROLES.map((role) => {
              const owned = user.roles.includes(role);
              return (
                <li key={role} className="flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0">
                  <span className="font-medium">{ROLE_LABELS[role]}</span>
                  <button
                    type="button"
                    onClick={() => open({ kind: "peran", role, action: owned ? "cabut" : "tambah" })}
                    className={`min-h-9 rounded-lg border px-3 font-medium transition-colors ${owned ? "border-destructive/40 text-destructive hover:bg-destructive/10" : "border-border hover:bg-accent"}`}
                  >
                    {owned ? "Cabut" : "Tambah"} {ROLE_LABELS[role]}
                  </button>
                </li>
              );
            })}
          </ul>
          <h3 className="mt-4 text-sm font-semibold">Riwayat Peran</h3>
          {roleEvents.length > 0 ? (
            <ul aria-label="Riwayat peran" className="mt-1 space-y-1 text-sm text-muted-foreground">
              {roleEvents.map((event) => (
                <li key={event.id}>
                  {userName(data.users, event.actorId)} {event.action === "tambah" ? "menambah" : "mencabut"} peran {ROLE_LABELS[event.role]} · {formatDateTime(event.at)}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">Belum ada perubahan peran.</p>
          )}
          <p className="mt-3 text-xs text-muted-foreground">Perubahan berlaku saat pengguna masuk kembali.</p>
        </section>

        <section aria-labelledby="status-akun" className={panelClass}>
          <h2 id="status-akun" className="font-bold">Status Akun</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Akun nonaktif tidak bisa login dan tidak tampil di leaderboard maupun profil publik. Datanya tidak dihapus.
          </p>
          <button
            type="button"
            onClick={() => open({ kind: "status", status: user.status === "aktif" ? "nonaktif" : "aktif" })}
            className={`mt-3 min-h-10 rounded-xl border px-4 text-sm font-semibold transition-colors ${user.status === "aktif" ? "border-destructive/40 text-destructive hover:bg-destructive/10" : "border-border hover:bg-accent"}`}
          >
            {user.status === "aktif" ? "Nonaktifkan akun" : "Aktifkan akun"}
          </button>
        </section>

        <UserAccessSections
          user={user}
          adminId={adminId}
          entitlements={data.entitlements.filter((item) => item.userId === userId)}
          claims={data.claims.filter((item) => item.userId === userId)}
          transactions={data.transactions.filter((item) => item.userId === userId)}
          products={data.products}
        />

        {user.roles.includes("creator") && (
          <section aria-labelledby="kesepakatan-creator" className={`${panelClass} lg:col-span-2`}>
            <h2 id="kesepakatan-creator" className="font-bold">Kesepakatan Creator</h2>
            <p className="mt-1 text-sm text-muted-foreground">Konten Creator baru bisa diterbitkan setelah kesepakatan tertulis tercatat.</p>
            {agreements.length > 0 ? (
              <ul aria-label="Riwayat kesepakatan" className="mt-3 space-y-2 text-sm">
                {agreements.map((item) => (
                  <li key={item.id} className="rounded-xl border border-border p-3">
                    <p className="font-medium">{item.dokumen}</p>
                    <p className="text-muted-foreground">Tanggal {formatContentDate(item.tanggal)} · Dicatat {userName(data.users, item.recordedBy)}, {formatDateTime(item.recordedAt)}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm font-medium text-destructive">Belum ada kesepakatan tercatat.</p>
            )}
            <div className="mt-4 grid gap-3 sm:grid-cols-[12rem_minmax(0,1fr)]">
              <label className="block text-sm font-medium">
                Tanggal kesepakatan
                <input type="date" value={tanggal} onChange={(event) => setTanggal(event.target.value)} className={fieldClass} />
              </label>
              <label className="block text-sm font-medium">
                Tautan atau keterangan dokumen
                <input value={dokumen} onChange={(event) => setDokumen(event.target.value)} className={fieldClass} />
              </label>
            </div>
            <button type="button" disabled={!tanggal || !dokumen.trim()} onClick={() => void saveAgreement()} className="mt-3 min-h-10 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors enabled:hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground">
              {agreements.length > 0 ? "Perbarui kesepakatan" : "Catat kesepakatan"}
            </button>
            {agreementMessage.text && (
              <p role={agreementMessage.isError ? "alert" : "status"} className={`mt-2 text-sm ${agreementMessage.isError ? "font-medium text-destructive" : "text-muted-foreground"}`}>{agreementMessage.text}</p>
            )}
          </section>
        )}
      </div>

      {pending?.kind === "peran" && (
        <ReasonDialog
          title={`${pending.action === "cabut" ? "Cabut" : "Tambah"} peran ${ROLE_LABELS[pending.role]}?`}
          description={pending.action === "cabut" ? `${user.name} tidak lagi memiliki peran ${ROLE_LABELS[pending.role]}.` : `${user.name} akan memiliki peran ${ROLE_LABELS[pending.role]}.`}
          confirmLabel={pending.action === "cabut" ? "Cabut peran" : "Tambah peran"}
          isDestructive={pending.action === "cabut"}
          error={dialogError}
          onConfirm={(alasan) => void confirm(alasan)}
          onClose={() => setPending(null)}
        />
      )}
      {pending?.kind === "status" && (
        <ReasonDialog
          title={pending.status === "nonaktif" ? "Nonaktifkan akun ini?" : "Aktifkan akun ini?"}
          description={pending.status === "nonaktif" ? `${user.name} tidak bisa login dan tidak tampil di leaderboard maupun profil publik. Datanya tidak dihapus.` : `${user.name} bisa login dan tampil kembali.`}
          confirmLabel={pending.status === "nonaktif" ? "Nonaktifkan" : "Aktifkan"}
          isDestructive={pending.status === "nonaktif"}
          error={dialogError}
          onConfirm={(alasan) => void confirm(alasan)}
          onClose={() => setPending(null)}
        />
      )}
    </div>
  );
}
