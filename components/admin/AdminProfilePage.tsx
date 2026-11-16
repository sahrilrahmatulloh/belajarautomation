"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ScrollText, Settings, ShieldAlert, ShieldCheck } from "lucide-react";

import { ROLE_LABELS } from "@/data/navigation";
import { formatContentDate } from "@/lib/content/document";
import { formatNumber } from "@/lib/format";
import { useSession } from "@/lib/session";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

import { initialsOf, MfaStatus, useMfaStatus } from "./useMfaStatus";
import { useAdminData } from "./useAdminData";

const panelClass = "rounded-2xl border border-border bg-card p-5";
const WORK_DAYS = 30;

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap justify-between gap-x-3 gap-y-1 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="min-w-0 text-right font-medium [overflow-wrap:anywhere]">{children}</dd>
    </div>
  );
}

// Status verifikasi dua langkah, dipakai di Profil dan Pengaturan Admin.
export function MfaStatusLine({ mfa }: { mfa: MfaStatus }) {
  if (mfa.status === "loading") return <p role="status" className="text-sm text-muted-foreground">Memeriksa verifikasi dua langkah...</p>;
  if (mfa.status === "demo") {
    return (
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <ShieldAlert className="h-4 w-4 shrink-0" aria-hidden="true" />
        Akun demo DEV tidak memakai verifikasi dua langkah.
      </p>
    );
  }
  if (mfa.status === "belum") {
    return (
      <p className="flex items-center gap-2 text-sm font-medium text-destructive">
        <ShieldAlert className="h-4 w-4 shrink-0" aria-hidden="true" />
        Belum aktif. Pindai kode QR saat membuka halaman Admin.
      </p>
    );
  }
  return (
    <p className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
      <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
      Aktif sejak {formatContentDate(mfa.since)}
    </p>
  );
}

// Profil Admin (PRD FR-16 L): identitas tanpa foto, status keamanan, dan ringkasan kerja. XP, rank,
// dan kustomisasi tetap di profil Mode Belajar.
export default function AdminProfilePage() {
  const session = useSession();
  const { data } = useAdminData();
  const { mfa } = useMfaStatus();
  const isReal = session?.source === "supabase";
  const [realJoinedAt, setRealJoinedAt] = useState<string | null>(null);

  useEffect(() => {
    const client = getSupabaseBrowserClient();
    if (!isReal || !client) return;
    void client.auth.getUser().then(({ data: result }) => setRealJoinedAt(result.user?.created_at ?? null));
  }, [isReal]);

  if (!session) return null;

  const demoUser = data?.users.find((user) => user.id === session.userId);
  const joinedAt = isReal ? realJoinedAt : (demoUser?.joinedAt ?? null);
  const since = (data?.loadedAt ?? 0) - WORK_DAYS * 86_400_000;
  // Akun sungguhan: Log Aktivitas Admin di database dibuka dari tautan; akun demo dihitung di sini.
  const actionCount = isReal ? null : (data?.auditLog ?? []).filter((entry) => entry.adminId === session.userId && Date.parse(entry.at) >= since).length;
  const roles = session.roles.filter((role) => role !== "user");

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="flex items-center gap-4">
        <span aria-hidden="true" className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
          {initialsOf(session.name)}
        </span>
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">{session.name}</h1>
          <p className="text-sm text-muted-foreground">Profil Admin</p>
        </div>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        <section aria-labelledby="admin-info-akun" className={panelClass}>
          <h2 id="admin-info-akun" className="font-bold">Info Akun</h2>
          <dl className="mt-3 space-y-2">
            <Field label="Email">{session.email}</Field>
            <Field label="Bergabung">{joinedAt ? formatContentDate(joinedAt) : "–"}</Field>
            <Field label="Peran">
              <span className="inline-flex flex-wrap justify-end gap-1.5">
                {roles.map((role) => (
                  <span key={role} className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary-accent">{ROLE_LABELS[role]}</span>
                ))}
              </span>
            </Field>
          </dl>
        </section>

        <section aria-labelledby="admin-keamanan" className={panelClass}>
          <h2 id="admin-keamanan" className="font-bold">Verifikasi Dua Langkah</h2>
          <div className="mt-3">
            <MfaStatusLine mfa={mfa} />
          </div>
          <Link href="/admin/pengaturan#keamanan" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary-accent hover:underline">
            <Settings className="h-4 w-4" aria-hidden="true" />
            Kelola keamanan akun
          </Link>
        </section>

        <section aria-labelledby="admin-ringkasan-kerja" className={`${panelClass} md:col-span-2`}>
          <h2 id="admin-ringkasan-kerja" className="font-bold">Ringkasan Kerja</h2>
          {actionCount !== null ? (
            <p className="mt-3 text-sm">
              <span className="text-2xl font-bold tabular-nums">{formatNumber(actionCount)}</span>{" "}
              <span className="text-muted-foreground">aksi Admin dalam {WORK_DAYS} hari terakhir</span>
            </p>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">Seluruh aksi Admin tercatat di Log Aktivitas Admin.</p>
          )}
          <Link
            href={`/admin/log${session.userId ? `?admin=${encodeURIComponent(session.userId)}` : ""}`}
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary-accent hover:underline"
          >
            <ScrollText className="h-4 w-4" aria-hidden="true" />
            Lihat aksi saya di Log Aktivitas Admin
          </Link>
        </section>
      </div>
    </div>
  );
}
