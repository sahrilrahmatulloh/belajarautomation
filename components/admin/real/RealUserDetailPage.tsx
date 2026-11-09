"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Crown, Sparkles } from "lucide-react";

import { getRank } from "@/data/ranks";
import { adminApi, AdminMembershipGrant, AdminUserDetail, TIER_LABEL } from "@/lib/adminApi";
import { formatNumber } from "@/lib/format";
import { notify } from "@/lib/notify";

// Detail pengguna untuk akun sungguhan: koreksi XP (PRD FR-16 D) dan membership manual
// (PRD FR-16 E). Setiap aksi wajib beralasan dan tercatat sebagai catatan baru.

const DURATIONS = [
  { value: "30", label: "30 hari" },
  { value: "90", label: "90 hari" },
  { value: "365", label: "1 tahun" },
  { value: "", label: "Tanpa batas" },
];

const fieldClass =
  "w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 dark:bg-input/30";
const buttonClass =
  "inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60";
const cardClass = "rounded-2xl border border-border bg-card p-5";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

function isActive(grant: AdminMembershipGrant) {
  return !grant.revoked_at && (!grant.ends_at || new Date(grant.ends_at) > new Date());
}

function XpCorrectionForm({ userId, onSaved }: { userId: string; onSaved: () => void }) {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [isPending, setIsPending] = useState(false);
  const value = Number(amount);
  const isValid = Number.isInteger(value) && value !== 0 && reason.trim().length >= 5;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsPending(true);
    const result = await adminApi.adjustXp(userId, value, reason.trim());
    setIsPending(false);
    if (!result.ok) return notify.error(result.message);
    notify.success(`XP dikoreksi. Total sekarang ${formatNumber(result.data)} XP.`);
    setAmount("");
    setReason("");
    onSaved();
  };

  return (
    <form onSubmit={submit} aria-label="Koreksi XP" className={cardClass}>
      <h2 className="flex items-center gap-2 font-semibold">
        <Sparkles className="h-4 w-4 text-primary-accent" aria-hidden="true" />
        Koreksi XP
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">Angka positif menambah XP, angka negatif mengurangi. Tercatat di riwayat dan log Admin.</p>
      <div className="mt-4 space-y-3">
        <div className="space-y-1.5">
          <label htmlFor="xp-amount" className="text-sm font-medium">Jumlah XP</label>
          <input id="xp-amount" type="number" step={1} value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="Contoh: 100 atau -50" className={`${fieldClass} h-11`} />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="xp-reason" className="text-sm font-medium">Alasan</label>
          <textarea id="xp-reason" rows={2} maxLength={500} value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Minimal 5 karakter, mis. kompensasi bug kuis" className={`${fieldClass} py-2`} />
        </div>
        <button type="submit" disabled={!isValid || isPending} className={buttonClass}>
          {isPending ? "Menyimpan..." : "Simpan koreksi"}
        </button>
      </div>
    </form>
  );
}

function MembershipForm({ userId, active, onSaved }: { userId: string; active: AdminMembershipGrant | undefined; onSaved: () => void }) {
  const [tier, setTier] = useState<"pro" | "premium">("premium");
  const [duration, setDuration] = useState("30");
  const [reason, setReason] = useState("");
  const [revokeReason, setRevokeReason] = useState("");
  const [isPending, setIsPending] = useState(false);

  const grant = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsPending(true);
    const result = await adminApi.grantMembership(userId, tier, duration ? Number(duration) : null, reason.trim());
    setIsPending(false);
    if (!result.ok) return notify.error(result.message);
    notify.success(`Membership ${TIER_LABEL[result.data.tier]} diberikan.`);
    setReason("");
    onSaved();
  };

  const revoke = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsPending(true);
    const result = await adminApi.revokeMembership(userId, revokeReason.trim());
    setIsPending(false);
    if (!result.ok) return notify.error(result.message);
    notify.success(`Membership manual dicabut. Membership sekarang ${TIER_LABEL[result.data]}.`);
    setRevokeReason("");
    onSaved();
  };

  return (
    <section aria-label="Membership manual" className={cardClass}>
      <h2 className="flex items-center gap-2 font-semibold">
        <Crown className="h-4 w-4 text-amber-600 dark:text-amber-300" aria-hidden="true" />
        Membership manual
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">Untuk hadiah atau kompensasi, tanpa transaksi pembayaran.</p>

      {active?.source === "manual" && (
        <form onSubmit={revoke} aria-label="Cabut membership" className="mt-4 space-y-3 rounded-xl bg-muted/50 p-4">
          <p className="text-sm">
            Berlaku: <strong>{TIER_LABEL[active.tier]}</strong>
            {active.ends_at ? ` sampai ${formatDateTime(active.ends_at)}` : " tanpa batas waktu"}.
          </p>
          <div className="space-y-1.5">
            <label htmlFor="revoke-reason" className="text-sm font-medium">Alasan pencabutan</label>
            <textarea id="revoke-reason" rows={2} maxLength={500} value={revokeReason} onChange={(event) => setRevokeReason(event.target.value)} className={`${fieldClass} py-2`} />
          </div>
          <button type="submit" disabled={revokeReason.trim().length < 5 || isPending} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-destructive/50 px-4 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-60">
            Cabut membership
          </button>
        </form>
      )}

      <form onSubmit={grant} aria-label="Berikan membership" className="mt-4 space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="grant-tier" className="text-sm font-medium">Paket</label>
            <select id="grant-tier" value={tier} onChange={(event) => setTier(event.target.value as "pro" | "premium")} className={`${fieldClass} h-11`}>
              <option value="pro">Pro</option>
              <option value="premium">Premium</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="grant-duration" className="text-sm font-medium">Durasi</label>
            <select id="grant-duration" value={duration} onChange={(event) => setDuration(event.target.value)} className={`${fieldClass} h-11`}>
              {DURATIONS.map((item) => (
                <option key={item.label} value={item.value}>{item.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="grant-reason" className="text-sm font-medium">Alasan</label>
          <textarea id="grant-reason" rows={2} maxLength={500} value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Minimal 5 karakter, mis. hadiah penguji UAT" className={`${fieldClass} py-2`} />
        </div>
        <button type="submit" disabled={reason.trim().length < 5 || isPending} className={buttonClass}>
          {isPending ? "Menyimpan..." : "Berikan membership"}
        </button>
      </form>
    </section>
  );
}

export default function RealUserDetailPage({ userId }: { userId: string }) {
  const [user, setUser] = useState<AdminUserDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const reload = useCallback(() => setVersion((value) => value + 1), []);

  useEffect(() => {
    let active = true;
    adminApi.getUser(userId).then((result) => {
      if (!active) return;
      if (result.ok) setUser(result.data);
      else setError(result.message);
    });
    return () => {
      active = false;
    };
  }, [userId, version]);

  const back = (
    <Link href="/admin/pengguna" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      Kembali ke daftar pengguna
    </Link>
  );

  if (error) {
    return (
      <div className="mx-auto max-w-4xl space-y-4">
        {back}
        <p role="alert" className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm font-medium text-destructive">{error}</p>
      </div>
    );
  }
  if (!user) return <p role="status" className="py-10 text-center text-sm text-muted-foreground">Memuat pengguna...</p>;

  const activeGrant = user.memberships.find(isActive);

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      {back}
      <header className={cardClass}>
        <h1 className="text-2xl font-bold tracking-tight">{user.display_name || user.email}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {user.username ? `@${user.username} · ` : ""}
          {user.email}
        </p>
        <dl aria-label="Ringkasan pengguna" className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Total XP", value: formatNumber(user.total_xp) },
            { label: "Rank", value: getRank(user.total_xp).name },
            { label: "Membership", value: TIER_LABEL[user.tier] },
            { label: "Materi selesai", value: formatNumber(user.lessons_completed) },
          ].map((item) => (
            <div key={item.label} className="rounded-xl bg-muted/50 p-3">
              <dt className="text-xs text-muted-foreground">{item.label}</dt>
              <dd className="mt-0.5 font-semibold">{item.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <div className="grid gap-5 lg:grid-cols-2">
        <XpCorrectionForm userId={user.user_id} onSaved={reload} />
        <MembershipForm userId={user.user_id} active={activeGrant} onSaved={reload} />
      </div>

      <section aria-label="Riwayat koreksi XP" className={cardClass}>
        <h2 className="font-semibold">Riwayat koreksi XP</h2>
        {user.xp_corrections.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">Belum ada koreksi XP.</p>
        ) : (
          <ul className="mt-3 divide-y divide-border">
            {user.xp_corrections.map((item) => (
              <li key={item.created_at} className="flex flex-wrap items-baseline justify-between gap-2 py-2 text-sm">
                <span className={`font-semibold ${item.amount > 0 ? "text-emerald-700 dark:text-emerald-300" : "text-destructive"}`}>
                  {item.amount > 0 ? "+" : ""}
                  {formatNumber(item.amount)} XP
                </span>
                <span className="min-w-0 flex-1 text-muted-foreground">{item.reason}</span>
                <span className="text-xs text-muted-foreground">{formatDateTime(item.created_at)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-label="Riwayat membership" className={cardClass}>
        <h2 className="font-semibold">Riwayat membership</h2>
        {user.memberships.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">Belum ada membership.</p>
        ) : (
          <ul className="mt-3 divide-y divide-border">
            {user.memberships.map((grant) => (
              <li key={grant.id} className="flex flex-wrap items-baseline justify-between gap-2 py-2 text-sm">
                <span className="font-semibold">
                  {TIER_LABEL[grant.tier]} · {grant.source === "manual" ? "Pemberian manual" : "Pembayaran"}
                </span>
                <span className="min-w-0 flex-1 text-muted-foreground">{grant.revoked_at ? `Dicabut: ${grant.revoke_reason ?? "-"}` : grant.reason}</span>
                <span className="text-xs text-muted-foreground">
                  {isActive(grant) ? "Berlaku" : grant.revoked_at ? "Dicabut" : "Berakhir"} · {formatDateTime(grant.starts_at)}
                  {grant.ends_at ? ` s.d. ${formatDateTime(grant.ends_at)}` : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
